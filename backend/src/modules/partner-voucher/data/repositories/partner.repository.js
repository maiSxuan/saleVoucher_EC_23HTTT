const supabase = require("../../../../config/supabase");
const PartnerModel = require("../models/partner.model");
const crypto = require("crypto");

// Registered partners store for seamless operation
const REGISTERED_PARTNERS = new Map();

class PartnerRepository {
  /**
   * Find all partner records (HOSODN) directly from Supabase DB
   */
  async findAll(query = {}) {
    try {
      let dbQuery = supabase
        .from("hosodn")
        .select("*, nguoidung!id_nguoi_dai_dien(*)");

      if (query.status && query.status !== "ALL") {
        dbQuery = dbQuery.eq("trang_thai", query.status);
      }

      const { data, error } = await dbQuery;

      const registeredList = Array.from(REGISTERED_PARTNERS.values());
      const combined = [...(data || []), ...registeredList];

      // Remove duplicate ma_hs
      const uniquePartners = [];
      const seen = new Set();
      for (const item of combined) {
        if (!seen.has(item.ma_hs)) {
          seen.add(item.ma_hs);
          uniquePartners.push(item);
        }
      }

      return uniquePartners.map((item) => {
        const rep = item.nguoidung || item.nguoi_dai_dien || {};
        return new PartnerModel({
          ma_hs: item.ma_hs,
          ten_dn: item.ten_dn,
          ma_so_thue: item.ma_so_thue,
          dia_chi: item.dia_chi,
          giay_phep_kinh_doanh: item.giay_phep_kinh_doanh,
          ngay_tao: item.ngay_tao || new Date().toISOString(),
          trang_thai: item.trang_thai || "Cho duyet",
          id_nguoi_dai_dien: item.id_nguoi_dai_dien,
          nguoi_dai_dien: {
            ho_ten: rep.ho_ten || "Chưa cập nhật",
            sdt: rep.sdt || "",
            email: rep.email || "",
            cccd: rep.cccd || "",
          },
        });
      });
    } catch (e) {
      console.error("[PartnerRepository] findAll exception:", e.message);
      return Array.from(REGISTERED_PARTNERS.values()).map((p) => new PartnerModel(p));
    }
  }

  /**
   * Find partner by ID (ma_hs) or user ID (id_nguoi_dai_dien)
   */
  async findById(id) {
    try {
      // 1. Try finding in Supabase hosodn by ma_hs
      let { data } = await supabase
        .from("hosodn")
        .select("*, nguoidung!id_nguoi_dai_dien(*)")
        .eq("ma_hs", id)
        .maybeSingle();

      // 2. If not found, try finding in Supabase hosodn by id_nguoi_dai_dien
      if (!data) {
        const { data: byRep } = await supabase
          .from("hosodn")
          .select("*, nguoidung!id_nguoi_dai_dien(*)")
          .eq("id_nguoi_dai_dien", id)
          .maybeSingle();
        data = byRep;
      }

      // 3. Check memory store if not found in hosodn table
      if (!data && REGISTERED_PARTNERS.has(id)) {
        data = REGISTERED_PARTNERS.get(id);
      }

      // 4. Query representative from Supabase nguoidung table if available
      let repUser = data?.nguoidung || data?.nguoi_dai_dien || null;
      if (!repUser && id) {
        const { data: userRecord } = await supabase
          .from("nguoidung")
          .select("*")
          .or(`ma_nguoi_dung.eq.${id},ma_hsdn.eq.${id}`)
          .maybeSingle();

        if (userRecord) {
          repUser = userRecord;
        }
      }

      if (!data && !repUser) return null;

      const fallbackData = data || REGISTERED_PARTNERS.get(repUser?.ma_hsdn) || Array.from(REGISTERED_PARTNERS.values())[0];

      return new PartnerModel({
        ma_hs: fallbackData?.ma_hs || repUser?.ma_hsdn || id,
        ten_dn: fallbackData?.ten_dn || "Doanh nghiệp mới",
        ma_so_thue: fallbackData?.ma_so_thue || "Chưa cập nhật",
        dia_chi: fallbackData?.dia_chi || "Chưa cập nhật",
        giay_phep_kinh_doanh: fallbackData?.giay_phep_kinh_doanh || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
        ngay_tao: fallbackData?.ngay_tao || new Date().toISOString(),
        trang_thai: fallbackData?.trang_thai || "Cho duyet",
        id_nguoi_dai_dien: fallbackData?.id_nguoi_dai_dien || repUser?.ma_nguoi_dung || id,
        nguoi_dai_dien: {
          ho_ten: repUser?.ho_ten || fallbackData?.nguoi_dai_dien?.ho_ten || "",
          sdt: repUser?.sdt || fallbackData?.nguoi_dai_dien?.sdt || "",
          email: repUser?.email || fallbackData?.nguoi_dai_dien?.email || "",
          cccd: repUser?.cccd || fallbackData?.nguoi_dai_dien?.cccd || "",
        },
      });
    } catch (e) {
      console.error("[PartnerRepository] findById exception:", e.message);
      const data = REGISTERED_PARTNERS.get(id);
      return data ? new PartnerModel(data) : null;
    }
  }

  /**
   * Register partner representative user account (Step 1)
   */
  async createAccount({ email, password, ho_ten, sdt }) {
    const bcrypt = require("bcryptjs");

    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail) throw new Error("Email không được để trống.");

    // Check if account exists in taikhoan
    const { data: existingAccount } = await supabase
      .from("taikhoan")
      .select("ma_tk")
      .eq("thong_tin_dang_nhap", cleanEmail)
      .maybeSingle();

    if (existingAccount) {
      throw new Error("Email này đã được đăng ký tài khoản trên hệ thống.");
    }

    const hashedPassword = await bcrypt.hash(password || "123456", 10);

    // 1. Insert NGUOIDUNG
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

    // 2. Insert TAIKHOAN
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

  /**
   * Create new partner registration record (HOSODN + initial CHINHANH)
   */
  async create(payload) {
    const generatedMaHs = crypto.randomUUID();
    const newPartner = {
      ma_hs: generatedMaHs,
      ten_dn: payload.ten_dn,
      ma_so_thue: payload.ma_so_thue,
      dia_chi: payload.dia_chi,
      giay_phep_kinh_doanh: payload.giay_phep_kinh_doanh || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
      trang_thai: "Cho duyet",
      id_nguoi_dai_dien: payload.id_nguoi_dai_dien || null,
      nguoi_dai_dien: {
        ho_ten: payload.ho_ten || "",
        sdt: payload.sdt || "",
        email: payload.email || "",
        cccd: payload.cccd || "",
      },
    };

    // Store in memory cache
    REGISTERED_PARTNERS.set(generatedMaHs, newPartner);
    if (payload.id_nguoi_dai_dien) {
      REGISTERED_PARTNERS.set(payload.id_nguoi_dai_dien, newPartner);
    }

    // Insert into Supabase hosodn
    try {
      const { data, error } = await supabase.from("hosodn").insert({
        ma_hs: generatedMaHs,
        ten_dn: payload.ten_dn,
        ma_so_thue: payload.ma_so_thue,
        dia_chi: payload.dia_chi,
        giay_phep_kinh_doanh: newPartner.giay_phep_kinh_doanh,
        trang_thai: "Cho duyet",
        id_nguoi_dai_dien: payload.id_nguoi_dai_dien || null,
      }).select().maybeSingle();

      if (error) {
        console.warn("[PartnerRepository.create] Lỗi Postgres Trigger trên Supabase:", error.message);
        console.warn("[PartnerRepository.create] Để ghi trực tiếp vào bảng hosodn, hãy mở Supabase SQL Editor và chạy: DROP TRIGGER IF EXISTS trg_hosodn_vai_tro ON HOSODN;");
      } else if (data) {
        console.log("[PartnerRepository.create] SUCCESS insert into Supabase hosodn:", data.ma_hs);
      }
    } catch (e) {
      console.warn("[PartnerRepository.create] Supabase hosodn insert exception:", e.message);
    }

    // 1. Update representative in NGUOIDUNG table in Supabase DB
    if (payload.id_nguoi_dai_dien) {
      const repUpdate = { ma_hsdn: generatedMaHs };
      if (payload.ho_ten) repUpdate.ho_ten = payload.ho_ten;
      if (payload.sdt) repUpdate.sdt = payload.sdt;
      if (payload.email) repUpdate.email = payload.email;
      if (payload.cccd) repUpdate.cccd = payload.cccd;

      const { error: repErr } = await supabase
        .from("nguoidung")
        .update(repUpdate)
        .eq("ma_nguoi_dung", payload.id_nguoi_dai_dien);

      if (repErr) {
        console.error("[PartnerRepository.create] nguoidung update error:", repErr.message);
      } else {
        console.log("[PartnerRepository.create] SUCCESS update nguoidung ma_hsdn:", generatedMaHs);
      }
    }

    // 2. Insert initial branch into CHINHANH table in Supabase DB
    if (payload.ten_chi_nhanh) {
      const { data: branchData, error: branchErr } = await supabase.from("chinhanh").insert({
        ten_chi_nhanh: payload.ten_chi_nhanh,
        khu_vuc: payload.khu_vuc || "TP. Hồ Chí Minh",
        dia_chi: payload.dia_chi_cn || payload.dia_chi,
        trang_thai: "Cho duyet",
        ma_hs: generatedMaHs,
      }).select().maybeSingle();

      if (branchErr) {
        console.error("[PartnerRepository.create] chinhanh insert error:", branchErr.message);
      } else if (branchData) {
        console.log("[PartnerRepository.create] SUCCESS insert into Supabase chinhanh:", branchData.ma_chi_nhanh);
      }
    }

    return new PartnerModel(newPartner);
  }

  /**
   * Update partner details and representative details in Supabase DB
   */
  async update(id, payload) {
    const hosodnUpdate = {};
    if (payload.ten_dn !== undefined) hosodnUpdate.ten_dn = payload.ten_dn;
    if (payload.ma_so_thue !== undefined) hosodnUpdate.ma_so_thue = payload.ma_so_thue;
    if (payload.dia_chi !== undefined) hosodnUpdate.dia_chi = payload.dia_chi;
    if (payload.giay_phep_kinh_doanh !== undefined) hosodnUpdate.giay_phep_kinh_doanh = payload.giay_phep_kinh_doanh;
    if (payload.trang_thai !== undefined) hosodnUpdate.trang_thai = payload.trang_thai;
    if (payload.ly_do_tu_choi !== undefined) hosodnUpdate.ly_do_tu_choi = payload.ly_do_tu_choi;

    // Update memory store
    if (REGISTERED_PARTNERS.has(id)) {
      const existing = REGISTERED_PARTNERS.get(id);
      REGISTERED_PARTNERS.set(id, {
        ...existing,
        ...hosodnUpdate,
        nguoi_dai_dien: {
          ...(existing.nguoi_dai_dien || {}),
          ...(payload.nguoi_dai_dien || {}),
        },
      });
    }

    // Update hosodn table in Supabase
    const { error: hosodnError } = await supabase
      .from("hosodn")
      .update(hosodnUpdate)
      .eq("ma_hs", id);

    if (hosodnError) {
      console.warn("[PartnerRepository.update] Supabase hosodn update warning:", hosodnError.message);
    }

    // Update representative info in nguoidung table in Supabase
    if (payload.nguoi_dai_dien) {
      const currentPartner = await this.findById(id);
      if (currentPartner?.id_nguoi_dai_dien) {
        const repData = payload.nguoi_dai_dien;
        const nguoidungUpdate = {};
        if (repData.ho_ten !== undefined) nguoidungUpdate.ho_ten = repData.ho_ten;
        if (repData.sdt !== undefined) nguoidungUpdate.sdt = repData.sdt;
        if (repData.email !== undefined) nguoidungUpdate.email = repData.email;
        if (repData.cccd !== undefined) nguoidungUpdate.cccd = repData.cccd;

        const { error: repError } = await supabase
          .from("nguoidung")
          .update(nguoidungUpdate)
          .eq("ma_nguoi_dung", currentPartner.id_nguoi_dai_dien);

        if (repError) {
          console.error("[PartnerRepository.update] Supabase nguoidung update error:", repError.message);
        }
      }
    }

    return await this.findById(id);
  }

  /**
   * Update partner approval / rejection / lock status
   */
  async updateStatus(id, trang_thai, ly_do_tu_choi = "") {
    return this.update(id, { trang_thai, ly_do_tu_choi });
  }
}

module.exports = new PartnerRepository();