const supabase = require("../../../../config/supabase");
const PartnerModel = require("../models/partner.model");
const crypto = require("crypto");

// Registered partners store for seamless operation
const REGISTERED_PARTNERS = new Map();

class PartnerRepository {
  /**
   * Find all partner records (HOSODN) directly from Supabase DB with parallel query optimization
   */
  async findAll(query = {}) {
    try {
      let dbQuery = supabase.from("hosodn").select("*");

      if (query.status && query.status !== "ALL") {
        dbQuery = dbQuery.eq("trang_thai", query.status);
      }

      // Execute queries in parallel for maximum performance
      const [hosodnRes, chinhanhRes, representativesRes] = await Promise.all([
        dbQuery,
        supabase.from("chinhanh").select("ma_chi_nhanh, ma_hs, trang_thai, ten_chi_nhanh, dia_chi, khu_vuc"),
        supabase.from("nguoidung").select("*").eq("vai_tro", "Nguoi dai dien"),
      ]);

      const data = hosodnRes.data || [];
      const branchesData = chinhanhRes.data || [];
      const representativesByPartner = new Map(
        (representativesRes.data || [])
          .filter((representative) => representative.ma_hsdn)
          .map((representative) => [representative.ma_hsdn, representative]),
      );

      // Fetch pending branch change requests and profile update requests
      const branchRequestRepo = require("./branch-request.repository");
      const partnerProfileRequestRepo = require("./partner-profile-request.repository");

      const [pendingBranchReqsMap, pendingProfileReqsMap] = await Promise.all([
        branchRequestRepo.getAllPendingRequestsMap(),
        partnerProfileRequestRepo.getAllPendingRequestsMap(),
      ]);

      // Group branches and count pending requests (Branch + Profile)
      const branchesByPartner = new Map();
      const pendingReqsByPartner = new Map();

      // 1. Fill count from branch store requests
      for (const [hsId, count] of pendingBranchReqsMap.entries()) {
        pendingReqsByPartner.set(hsId, (pendingReqsByPartner.get(hsId) || 0) + count);
      }

      // 2. Fill count from profile update requests (SUC-PAR-04)
      for (const [hsId, count] of pendingProfileReqsMap.entries()) {
        pendingReqsByPartner.set(hsId, (pendingReqsByPartner.get(hsId) || 0) + count);
      }

      // 3. Add count from chinhanh table status if any
      for (const b of branchesData) {
        if (b.ma_hs) {
          if (!branchesByPartner.has(b.ma_hs)) branchesByPartner.set(b.ma_hs, []);
          branchesByPartner.get(b.ma_hs).push(b);

          if (
            b.trang_thai === "Cho duyet" ||
            b.trang_thai === "Cho xu ly" ||
            b.trang_thai === "Chờ xử lý" ||
            b.trang_thai === "Cho duyet cap nhat" ||
            b.trang_thai === "Cho duyet huy"
          ) {
            if (!pendingBranchReqsMap.has(b.ma_hs)) {
              pendingReqsByPartner.set(b.ma_hs, (pendingReqsByPartner.get(b.ma_hs) || 0) + 1);
            }
          }
        }
      }

      const registeredList = Array.from(REGISTERED_PARTNERS.values());
      const combined = [...data, ...registeredList];

      // Remove duplicate ma_hs
      const uniquePartners = [];
      const seen = new Set();
      for (const item of combined) {
        if (item?.ma_hs && !seen.has(item.ma_hs)) {
          seen.add(item.ma_hs);
          uniquePartners.push(item);
        }
      }

      return uniquePartners.map((item) => {
        const rep = representativesByPartner.get(item.ma_hs) || item.nguoi_dai_dien || {};
        const pBranches = branchesByPartner.get(item.ma_hs) || item.branches || [];
        
        // Active partner OR pending partner: Count all pending branch requests
        const branchPendingCount = pendingReqsByPartner.get(item.ma_hs) || 0;
        const registrationPendingCount = item.trang_thai === "Cho duyet" ? 1 : 0;
        const totalPendingReqs = branchPendingCount + registrationPendingCount;

        return new PartnerModel({
          ma_hs: item.ma_hs,
          ten_dn: item.ten_dn,
          ma_so_thue: item.ma_so_thue,
          dia_chi: item.dia_chi,
          giay_phep_kinh_doanh: item.giay_phep_kinh_doanh,
          logo: item.logo || "",
          ngay_tao: item.ngay_tao || new Date().toISOString(),
          trang_thai: item.trang_thai || "Cho duyet",
          ly_do_tu_choi: item.ly_do_tu_choi || "",
          branches: pBranches,
          pending_branch_requests: totalPendingReqs,
          nguoi_dai_dien: {
            ma_nguoi_dung: rep.ma_nguoi_dung || null,
            ho_ten: rep.ho_ten || "Chưa cập nhật",
            sdt: rep.sdt || "",
            email: rep.email || "",
            cccd: rep.cccd || "",
            ngay_sinh: rep.ngay_sinh || "",
            gioi_tinh: rep.gioi_tinh || "Nam",
          },
        });
      });
    } catch (e) {
      console.error("[PartnerRepository] findAll exception:", e.message);
      return Array.from(REGISTERED_PARTNERS.values()).map((p) => new PartnerModel(p));
    }
  }

  /**
   * Find partner by ID (ma_hs) or its representative's ma_nguoi_dung.
   */
  async findById(id) {
    if (!id) return null;
    try {
      let { data } = await supabase
        .from("hosodn")
        .select("*")
        .eq("ma_hs", id)
        .maybeSingle();

      let repUser = null;
      if (!data) {
        const { data: representative } = await supabase
          .from("nguoidung")
          .select("*")
          .eq("ma_nguoi_dung", id)
          .eq("vai_tro", "Nguoi dai dien")
          .maybeSingle();

        if (representative?.ma_hsdn) {
          const { data: byRep } = await supabase
            .from("hosodn")
            .select("*")
            .eq("ma_hs", representative.ma_hsdn)
            .maybeSingle();
          data = byRep;
          repUser = representative;
        }
      }

      if (!data && REGISTERED_PARTNERS.has(id)) {
        data = REGISTERED_PARTNERS.get(id);
      }

      repUser = repUser || data?.nguoi_dai_dien || null;
      if (!repUser && data?.ma_hs) {
        const { data: userRecord } = await supabase
          .from("nguoidung")
          .select("*")
          .eq("ma_hsdn", data.ma_hs)
          .eq("vai_tro", "Nguoi dai dien")
          .maybeSingle();

        if (userRecord) {
          repUser = userRecord;
        }
      }

      if (!data && !repUser) return null;

      const fallbackData = data || REGISTERED_PARTNERS.get(repUser?.ma_hsdn) || Array.from(REGISTERED_PARTNERS.values())[0];
      const maHs = fallbackData?.ma_hs || repUser?.ma_hsdn || id;

      // Fetch branches for this partner
      const { data: branches } = await supabase
        .from("chinhanh")
        .select("*")
        .eq("ma_hs", maHs);

      let lyDoTuChoi = fallbackData?.ly_do_tu_choi;
      const status = fallbackData?.trang_thai || "Cho duyet";
      if (!lyDoTuChoi && status === "Tu choi") {
        const auditLogRepository = require("../../../core-access/data/repositories/audit-log.repository");
        lyDoTuChoi = await auditLogRepository.getLatestRejectionReason("HOSODN", maHs);
      }

      return new PartnerModel({
        ma_hs: maHs,
        ten_dn: fallbackData?.ten_dn || "Doanh nghiệp mới",
        ma_so_thue: fallbackData?.ma_so_thue || "Chưa cập nhật",
        dia_chi: fallbackData?.dia_chi || "Chưa cập nhật",
        giay_phep_kinh_doanh: fallbackData?.giay_phep_kinh_doanh || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
        logo: fallbackData?.logo || "",
        ngay_tao: fallbackData?.ngay_tao || new Date().toISOString(),
        trang_thai: status,
        ly_do_tu_choi: lyDoTuChoi || "",
        branches: branches || fallbackData?.branches || [],
        nguoi_dai_dien: {
          ma_nguoi_dung: repUser?.ma_nguoi_dung || null,
          ho_ten: repUser?.ho_ten || fallbackData?.nguoi_dai_dien?.ho_ten || "",
          sdt: repUser?.sdt || fallbackData?.nguoi_dai_dien?.sdt || "",
          email: repUser?.email || fallbackData?.nguoi_dai_dien?.email || "",
          cccd: repUser?.cccd || fallbackData?.nguoi_dai_dien?.cccd || "",
          ngay_sinh: repUser?.ngay_sinh || fallbackData?.nguoi_dai_dien?.ngay_sinh || "",
          gioi_tinh: repUser?.gioi_tinh || fallbackData?.nguoi_dai_dien?.gioi_tinh || "Nam",
        },
      });
    } catch (e) {
      console.error("[PartnerRepository] findById exception:", e.message);
      const data = REGISTERED_PARTNERS.get(id);
      return data ? new PartnerModel(data) : null;
    }
  }

  async checkAccountExists(email) {
    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail) return false;
    const { data } = await supabase
      .from("taikhoan")
      .select("ma_tk")
      .eq("thong_tin_dang_nhap", cleanEmail)
      .maybeSingle();
    return !!data;
  }

  async createAccount({ email, password, ho_ten, sdt }) {
    const bcrypt = require("bcryptjs");
    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail) throw new Error("Email không được để trống.");

    const { data: existingAccount } = await supabase
      .from("taikhoan")
      .select("ma_tk")
      .eq("thong_tin_dang_nhap", cleanEmail)
      .maybeSingle();

    if (existingAccount) {
      throw new Error("Email này đã được đăng ký tài khoản trên hệ thống.");
    }

    const hashedPassword = await bcrypt.hash(password || "123456", 10);

    const { data: user, error: userErr } = await supabase
      .from("nguoidung")
      .insert({
        ho_ten: ho_ten || cleanEmail.split("@")[0],
        email: cleanEmail,
        sdt: sdt || null,
        vai_tro: "Nguoi dai dien",
        trang_thai: "Dang hoat dong",
      })
      .select()
      .single();

    if (userErr) {
      console.error("[PartnerRepository] createAccount user error:", userErr.message);
      throw new Error(`Đăng ký tài khoản thất bại: ${userErr.message}`);
    }

    const { data: account, error: accErr } = await supabase
      .from("taikhoan")
      .insert({
        thong_tin_dang_nhap: cleanEmail,
        mat_khau: hashedPassword,
        ma_nguoi_dung: user.ma_nguoi_dung,
      })
      .select()
      .single();

    if (accErr) {
      await supabase.from("nguoidung").delete().eq("ma_nguoi_dung", user.ma_nguoi_dung);
      console.error("[PartnerRepository] createAccount account error:", accErr.message);
      throw new Error(`Đăng ký tài khoản thất bại: ${accErr.message}`);
    }

    return {
      ma_nguoi_dung: user.ma_nguoi_dung,
      id: user.ma_nguoi_dung,
      ho_ten: user.ho_ten,
      email: user.email,
      sdt: user.sdt,
      vai_tro: "PARTNER_OWNER",
    };
  }

  async checkTaxCodeUniqueness(mst) {
    const cleanMst = (mst || "").trim();
    if (!cleanMst) return true;

    for (const partner of REGISTERED_PARTNERS.values()) {
      if (partner?.ma_so_thue && partner.ma_so_thue.trim() === cleanMst) {
        throw new Error("Mã số thuế này đã được đăng ký trên hệ thống.");
      }
    }

    const { data: existingMst } = await supabase
      .from("hosodn")
      .select("ma_hs")
      .eq("ma_so_thue", cleanMst)
      .maybeSingle();

    if (existingMst) {
      throw new Error("Mã số thuế này đã được đăng ký trên hệ thống.");
    }
    return true;
  }

  async changePassword(partnerId, oldPassword, newPassword) {
    const bcrypt = require("bcryptjs");
    const partner = await this.findById(partnerId);
    if (!partner) {
      throw new Error("Không tìm thấy thông tin đối tác.");
    }
    const repUserId = partner.nguoi_dai_dien?.ma_nguoi_dung;
    let account = null;

    if (repUserId) {
      const { data } = await supabase
        .from("taikhoan")
        .select("*")
        .eq("ma_nguoi_dung", repUserId)
        .maybeSingle();
      account = data;
    }

    if (!account && partner.nguoi_dai_dien?.email) {
      const { data } = await supabase
        .from("taikhoan")
        .select("*")
        .eq("thong_tin_dang_nhap", partner.nguoi_dai_dien.email.trim().toLowerCase())
        .maybeSingle();
      account = data;
    }

    if (!account) {
      throw new Error("Không tìm thấy tài khoản đăng nhập của đối tác.");
    }

    const isMatch = await bcrypt.compare(oldPassword, account.mat_khau);
    if (!isMatch && account.mat_khau !== oldPassword) {
      throw new Error("Mật khẩu hiện tại không chính xác.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const { error } = await supabase
      .from("taikhoan")
      .update({ mat_khau: hashedPassword })
      .eq("ma_tk", account.ma_tk);

    if (error) {
      throw new Error("Cập nhật mật khẩu thất bại: " + error.message);
    }
    return { success: true, message: "Đổi mật khẩu thành công!" };
  }

  async create(payload) {
    await this.checkTaxCodeUniqueness(payload.ma_so_thue);

    const representativeId = payload.ma_nguoi_dung;
    if (!representativeId) {
      throw new Error("Thiếu ma_nguoi_dung của người đại diện.");
    }

    const { data: representative, error: representativeError } = await supabase
      .from("nguoidung")
      .select("ma_nguoi_dung")
      .eq("ma_nguoi_dung", representativeId)
      .eq("vai_tro", "Nguoi dai dien")
      .maybeSingle();
    if (representativeError || !representative) {
      throw new Error("ma_nguoi_dung phải thuộc người dùng có vai trò Người đại diện.");
    }

    const generatedMaHs = crypto.randomUUID();
    const logoVal = payload.logo || null;
    const newPartner = {
      ma_hs: generatedMaHs,
      ten_dn: payload.ten_dn,
      ma_so_thue: payload.ma_so_thue,
      dia_chi: payload.dia_chi,
      giay_phep_kinh_doanh: payload.giay_phep_kinh_doanh || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
      logo: logoVal,
      trang_thai: "Cho duyet",
      nguoi_dai_dien: {
        ma_nguoi_dung: representativeId,
        ho_ten: payload.ho_ten || "",
        sdt: payload.sdt || "",
        email: payload.email || "",
        cccd: payload.cccd || "",
        ngay_sinh: payload.ngay_sinh || "",
        gioi_tinh: payload.gioi_tinh || "Nam",
      },
    };

    REGISTERED_PARTNERS.set(generatedMaHs, newPartner);

    try {
      const { data, error } = await supabase.from("hosodn").insert({
        ma_hs: generatedMaHs,
        ten_dn: payload.ten_dn,
        ma_so_thue: payload.ma_so_thue,
        dia_chi: payload.dia_chi,
        giay_phep_kinh_doanh: newPartner.giay_phep_kinh_doanh,
        logo: logoVal,
        trang_thai: "Cho duyet",
      }).select().maybeSingle();

      if (error) {
        console.warn("[PartnerRepository.create] Lỗi Postgres Trigger trên Supabase:", error.message);
      } else if (data) {
        console.log("[PartnerRepository.create] SUCCESS insert into Supabase hosodn:", data.ma_hs);
      }
    } catch (e) {
      console.warn("[PartnerRepository.create] Supabase hosodn insert exception:", e.message);
    }

    if (representativeId) {
      const repUpdate = { ma_hsdn: generatedMaHs };
      if (payload.ho_ten) repUpdate.ho_ten = payload.ho_ten;
      if (payload.sdt) repUpdate.sdt = payload.sdt;
      if (payload.email) repUpdate.email = payload.email;
      if (payload.cccd !== undefined) repUpdate.cccd = payload.cccd || null;
      if (payload.ngay_sinh !== undefined) repUpdate.ngay_sinh = payload.ngay_sinh || null;
      if (payload.gioi_tinh !== undefined) repUpdate.gioi_tinh = payload.gioi_tinh || "Khac";

      const { error: repErr } = await supabase
        .from("nguoidung")
        .update(repUpdate)
        .eq("ma_nguoi_dung", representativeId);

      if (repErr) {
        console.error("[PartnerRepository.create] nguoidung update error:", repErr.message);
      }
    }

    if (payload.ten_chi_nhanh) {
      const { data: branchData, error: branchErr } = await supabase.from("chinhanh").insert({
        ten_chi_nhanh: payload.ten_chi_nhanh,
        khu_vuc: payload.khu_vuc || "TP. Hồ Chí Minh",
        dia_chi: payload.dia_chi_cn || payload.dia_chi,
        trang_thai: "Cho duyet",
        ma_hs: generatedMaHs,
      }).select().single();

      if (!branchErr && branchData) {
        newPartner.branches = [{ ...branchData, ma_chi_nhanh: branchData.ma_chi_nhanh }];
      }
    }

    return new PartnerModel(newPartner);
  }

  async update(id, payload) {
    const currentPartner = await this.findById(id);
    const targetMaHs = currentPartner?.ma_hs || id;
    const repUserId = currentPartner?.nguoi_dai_dien?.ma_nguoi_dung || null;

    const hosodnUpdate = {};
    if (payload.ten_dn !== undefined) hosodnUpdate.ten_dn = payload.ten_dn;
    if (payload.ma_so_thue !== undefined) hosodnUpdate.ma_so_thue = payload.ma_so_thue;
    if (payload.dia_chi !== undefined) hosodnUpdate.dia_chi = payload.dia_chi;
    if (payload.giay_phep_kinh_doanh !== undefined) hosodnUpdate.giay_phep_kinh_doanh = payload.giay_phep_kinh_doanh;
    if (payload.logo !== undefined) hosodnUpdate.logo = payload.logo;
    if (payload.trang_thai !== undefined) hosodnUpdate.trang_thai = payload.trang_thai;

    const updateMemory = (key) => {
      if (key && REGISTERED_PARTNERS.has(key)) {
        const existing = REGISTERED_PARTNERS.get(key);
        REGISTERED_PARTNERS.set(key, {
          ...existing,
          ...hosodnUpdate,
          nguoi_dai_dien: {
            ...(existing.nguoi_dai_dien || {}),
            ...(payload.nguoi_dai_dien || {}),
          },
        });
      }
    };
    updateMemory(targetMaHs);
    updateMemory(id);

    if (Object.keys(hosodnUpdate).length > 0) {
      const query = supabase
        .from("hosodn")
        .update(hosodnUpdate)
        .eq("ma_hs", targetMaHs);
      const { error: hosodnError } = await query;
      if (hosodnError) {
        console.warn("[PartnerRepository.update] Supabase hosodn update warning:", hosodnError.message);
      } else {
        const updatedFields = Object.keys(hosodnUpdate).join(", ");
        const effectiveStatus = hosodnUpdate.trang_thai ?? currentPartner?.trang_thai ?? "unknown";
        console.log(
          `[PartnerRepository.update] SUCCESS updated hosodn ${targetMaHs} -> fields: ${updatedFields}; status: ${effectiveStatus}`,
        );
      }
    }

    if (repUserId || payload.nguoi_dai_dien) {
      const targetRepId = repUserId;
      if (targetRepId) {
        const repData = payload.nguoi_dai_dien || {};
        const nguoidungUpdate = {};
        if (repData.ho_ten !== undefined) nguoidungUpdate.ho_ten = repData.ho_ten;
        if (repData.sdt !== undefined) nguoidungUpdate.sdt = repData.sdt;
        if (repData.email !== undefined) nguoidungUpdate.email = repData.email;
        if (repData.cccd !== undefined) nguoidungUpdate.cccd = repData.cccd || null;
        if (repData.ngay_sinh !== undefined) nguoidungUpdate.ngay_sinh = repData.ngay_sinh || null;
        if (repData.gioi_tinh !== undefined) {
          const rawG = String(repData.gioi_tinh || "").trim();
          nguoidungUpdate.gioi_tinh = (rawG === "Nữ" || rawG === "Nu" || rawG === "NU") ? "Nu" : (rawG === "Nam" || rawG === "NAM" ? "Nam" : "Khac");
        }

        if (Object.keys(nguoidungUpdate).length > 0) {
          const { error: repError } = await supabase
            .from("nguoidung")
            .update(nguoidungUpdate)
            .eq("ma_nguoi_dung", targetRepId);

          if (repError) {
            console.error("[PartnerRepository.update] Supabase nguoidung update error:", repError.message);
          }
        }
      }
    }

    return await this.findById(targetMaHs);
  }

  async updateStatus(id, trang_thai, ly_do_tu_choi = "") {
    return this.update(id, { trang_thai, ly_do_tu_choi });
  }
}

module.exports = new PartnerRepository();
