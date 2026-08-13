const supabase = require("../../../../config/supabase");
const VoucherModel = require("../models/voucher.model");

const VOUCHERS_MEMORY_STORE = new Map();

class VoucherRepository {
  normalizeCategoryUuid(catId) {
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (catId && uuidRegex.test(catId)) return catId;
    return "40000000-0000-0000-0000-000000000001";
  }

  async resolvePartnerNamesMap() {
    try {
      const { data: partnersData } = await supabase.from("hosodn").select("ma_hs, ten_dn, id_nguoi_dai_dien");
      const { data: branchesData } = await supabase.from("chinhanh").select("ma_chi_nhanh, ma_hs");
      const { data: linksData } = await supabase.from("voucher_cn").select("ma_voucher, ma_chi_nhanh");

      const partnerMap = new Map();
      (partnersData || []).forEach((p) => {
        if (p.ma_hs) partnerMap.set(p.ma_hs, p.ten_dn);
        if (p.id_nguoi_dai_dien) partnerMap.set(p.id_nguoi_dai_dien, p.ten_dn);
      });

      const branchToHsMap = new Map();
      (branchesData || []).forEach((b) => {
        if (b.ma_chi_nhanh) branchToHsMap.set(b.ma_chi_nhanh, b.ma_hs);
      });

      const voucherToHsMap = new Map();
      (linksData || []).forEach((l) => {
        const hs = branchToHsMap.get(l.ma_chi_nhanh);
        if (hs) voucherToHsMap.set(l.ma_voucher, hs);
      });

      return { partnerMap, voucherToHsMap };
    } catch (e) {
      console.error("[VoucherRepository] resolvePartnerNamesMap error:", e.message);
      return { partnerMap: new Map(), voucherToHsMap: new Map() };
    }
  }

  async findAll(query = {}) {
    try {
      let dbQuery = supabase.from("voucher").select("*, danh_muc(ten_danh_muc)");

      if (query.status && query.status !== "ALL") {
        dbQuery = dbQuery.eq("trang_thai", query.status);
      }

      const { data, error } = await dbQuery;

      if (error) {
        console.error("[VoucherRepository] findAll error:", error.message);
        return [];
      }

      const { partnerMap, voucherToHsMap } = await this.resolvePartnerNamesMap();
      const memoryList = Array.from(VOUCHERS_MEMORY_STORE.values());
      const combined = [...(data || []), ...memoryList];

      const unique = [];
      const seen = new Set();
      for (const item of combined) {
        if (!seen.has(item.ma_voucher)) {
          seen.add(item.ma_voucher);
          const targetHs = item.ma_hs || voucherToHsMap.get(item.ma_voucher);
          const resolvedTenDn = item.ten_dn || partnerMap.get(targetHs) || partnerMap.get(item.partnerId) || "";
          unique.push(
            new VoucherModel({
              ...item,
              ten_dn: resolvedTenDn,
              gia_ban: item.gia_goc - (item.gia_tri_giam || 0),
              ten_danh_muc: item.danh_muc?.ten_danh_muc || item.ten_danh_muc || "",
            })
          );
        }
      }

      return unique;
    } catch (e) {
      console.error("[VoucherRepository] findAll exception:", e.message);
      return Array.from(VOUCHERS_MEMORY_STORE.values());
    }
  }

  /**
   * Strictly fetch vouchers that belong ONLY to the specific partner (via chinhanh -> voucher_cn)
   */
  async findByPartnerId(partnerId, query = {}) {
    try {
      const partnerRepository = require("./partner.repository");
      const partner = await partnerRepository.findById(partnerId);
      const targetMaHs = partner?.ma_hs || partnerId;
      const partnerTenDn = partner?.ten_dn || "";

      // 1. Get branches belonging to this partner
      const { data: branches } = await supabase
        .from("chinhanh")
        .select("ma_chi_nhanh")
        .eq("ma_hs", targetMaHs);

      const branchIds = (branches || []).map((b) => b.ma_chi_nhanh);

      // 2. Get voucher IDs linked to these branches in voucher_cn table
      let voucherIds = [];
      if (branchIds.length > 0) {
        const { data: voucherLinks } = await supabase
          .from("voucher_cn")
          .select("ma_voucher")
          .in("ma_chi_nhanh", branchIds);

        voucherIds = [...new Set((voucherLinks || []).map((v) => v.ma_voucher))];
      }

      // 3. Filter memory store for vouchers created for this partner
      const memoryVouchers = Array.from(VOUCHERS_MEMORY_STORE.values()).filter(
        (v) => v.ma_hs === targetMaHs || (partner?.id_nguoi_dai_dien && v.ma_hs === partner.id_nguoi_dai_dien)
      );

      // 4. Query vouchers from Supabase DB matching the voucherIds
      let dbVouchers = [];
      if (voucherIds.length > 0) {
        let dbQuery = supabase
          .from("voucher")
          .select("*, danh_muc(ten_danh_muc)")
          .in("ma_voucher", voucherIds);

        if (query.status && query.status !== "ALL") {
          dbQuery = dbQuery.eq("trang_thai", query.status);
        }

        const { data, error } = await dbQuery;
        if (!error && data) {
          dbVouchers = data;
        }
      }

      const combined = [
        ...dbVouchers.map(
          (v) =>
            new VoucherModel({
              ...v,
              ma_hs: targetMaHs,
              ten_dn: v.ten_dn || partnerTenDn,
              gia_ban: v.gia_goc - (v.gia_tri_giam || 0),
              ten_danh_muc: v.danh_muc?.ten_danh_muc || "",
            })
        ),
        ...memoryVouchers.map((v) => {
          v.ten_dn = v.ten_dn || partnerTenDn;
          return v;
        }),
      ];

      // Remove duplicates
      const unique = [];
      const seen = new Set();
      for (const item of combined) {
        if (!seen.has(item.ma_voucher)) {
          seen.add(item.ma_voucher);
          unique.push(item);
        }
      }

      return unique;
    } catch (e) {
      console.error("[VoucherRepository] findByPartnerId exception:", e.message);
      return [];
    }
  }

  async findById(id) {
    const { partnerMap, voucherToHsMap } = await this.resolvePartnerNamesMap();

    // 1. Check memory store first
    if (VOUCHERS_MEMORY_STORE.has(id)) {
      const v = VOUCHERS_MEMORY_STORE.get(id);
      const targetHs = v.ma_hs || voucherToHsMap.get(id);
      v.ten_dn = v.ten_dn || partnerMap.get(targetHs) || "";
      return v;
    }

    try {
      const { data, error } = await supabase
        .from("voucher")
        .select("*, danh_muc(ten_danh_muc)")
        .eq("ma_voucher", id)
        .single();

      if (error || !data) return null;

      const { data: branchLinks } = await supabase
        .from("voucher_cn")
        .select("ma_chi_nhanh")
        .eq("ma_voucher", id);

      const branchIds = branchLinks ? branchLinks.map((b) => b.ma_chi_nhanh) : [];
      const targetHs = data.ma_hs || voucherToHsMap.get(data.ma_voucher);
      const resolvedTenDn = data.ten_dn || partnerMap.get(targetHs) || "";

      let lyDoTuChoi = data.ly_do_tu_choi;
      if (!lyDoTuChoi && (data.trang_thai === "Tu choi" || data.trang_thai_kiem_duyet === "Tu choi")) {
        const auditLogRepository = require("../../../core-access/data/repositories/audit-log.repository");
        lyDoTuChoi = await auditLogRepository.getLatestRejectionReason("VOUCHER", data.ma_voucher);
      }

      return new VoucherModel({
        ...data,
        ma_hs: targetHs || data.ma_hs || "",
        ly_do_tu_choi: lyDoTuChoi || data.ly_do_tu_choi || "",
        ten_dn: resolvedTenDn,
        gia_ban: data.gia_goc - (data.gia_tri_giam || 0),
        ten_danh_muc: data.danh_muc?.ten_danh_muc || "",
        ma_chi_nhanh: branchIds,
      });
    } catch (e) {
      console.error("[VoucherRepository] findById exception:", e.message);
      return null;
    }
  }

  async create(payload) {
    const giaGoc = Number(payload.gia_goc) || 0;
    const giaBan = Number(payload.gia_ban) || giaGoc;
    const giaTriGiam = Math.max(0, giaGoc - giaBan);

    let maHs = payload.ma_hs || payload.id_partner || payload.partnerId || null;
    let tenDn = payload.ten_dn || "";
    if (maHs) {
      const partnerRepository = require("./partner.repository");
      const partner = await partnerRepository.findById(maHs);
      if (partner?.ma_hs) {
        maHs = partner.ma_hs;
      }
      if (!tenDn && partner?.ten_dn) {
        tenDn = partner.ten_dn;
      }
    }

    const categoryUuid = this.normalizeCategoryUuid(payload.ma_danh_muc);

    const dbPayload = {
      ten_voucher: payload.ten_voucher,
      mo_ta: payload.mo_ta || "",
      gia_goc: giaGoc,
      gia_tri_giam: giaTriGiam,
      so_luong_phat_hanh: Number(payload.so_luong_phat_hanh) || 100,
      so_luong_da_ban: Number(payload.so_luong_da_ban) || 0,
      tg_bat_dau_ban: payload.tg_bat_dau_ban || new Date().toISOString(),
      tg_ket_thuc_ban: payload.tg_ket_thuc_ban || new Date(Date.now() + 30 * 86400000).toISOString(),
      trang_thai: payload.trang_thai || "Cho duyet",
      ma_danh_muc: categoryUuid,
      hinh_anh_url: payload.hinh_anh_url || "https://images.unsplash.com/photo-1544025162-d76694265947",
      dieu_kien_ap_dung: payload.dieu_kien_ap_dung || "",
      chinh_sach_hoan_huy: payload.chinh_sach_hoan_huy || "",
    };

    const { data: voucher, error } = await supabase
      .from("voucher")
      .insert(dbPayload)
      .select()
      .single();

    if (error) {
      console.error("[VoucherRepository] create error:", error.message);
      // Memory fallback if DB insert fails
      const memVoucher = new VoucherModel({
        ma_voucher: `v-${Date.now()}`,
        ...dbPayload,
        ma_hs: maHs,
        ten_dn: tenDn,
        ma_chi_nhanh: Array.isArray(payload.ma_chi_nhanh) ? payload.ma_chi_nhanh : [],
      });
      VOUCHERS_MEMORY_STORE.set(memVoucher.ma_voucher, memVoucher);
      return memVoucher;
    }

    // Link voucher to branches in voucher_cn table
    let branchIds = Array.isArray(payload.ma_chi_nhanh)
      ? payload.ma_chi_nhanh
      : payload.ma_chi_nhanh
        ? [payload.ma_chi_nhanh]
        : [];

    if (branchIds.length === 0 && maHs) {
      const { data: partnerBranches } = await supabase
        .from("chinhanh")
        .select("ma_chi_nhanh")
        .eq("ma_hs", maHs);

      if (partnerBranches && partnerBranches.length > 0) {
        branchIds = partnerBranches.map((b) => b.ma_chi_nhanh);
      }
    }

    if (branchIds.length > 0) {
      const links = branchIds.map((bId) => ({
        ma_voucher: voucher.ma_voucher,
        ma_chi_nhanh: bId,
      }));
      await supabase.from("voucher_cn").insert(links);
    }

    const createdModel = new VoucherModel({
      ...voucher,
      ma_hs: maHs,
      ten_dn: tenDn,
      gia_ban: giaBan,
      ma_chi_nhanh: branchIds,
    });

    VOUCHERS_MEMORY_STORE.set(createdModel.ma_voucher, createdModel);
    return createdModel;
  }

  async update(id, payload) {
    const memoryVoucher = VOUCHERS_MEMORY_STORE.get(id);
    if (memoryVoucher) {
      Object.assign(memoryVoucher, payload);
      if (payload.gia_goc !== undefined || payload.gia_ban !== undefined) {
        const giaGoc = Number(payload.gia_goc ?? memoryVoucher.gia_goc);
        const giaBan = Number(payload.gia_ban ?? memoryVoucher.gia_ban);
        memoryVoucher.gia_tri_giam = Math.max(0, giaGoc - giaBan);
      }
      VOUCHERS_MEMORY_STORE.set(id, memoryVoucher);
    }

    const allowedColumns = [
      "ten_voucher",
      "mo_ta",
      "gia_goc",
      "gia_tri_giam",
      "dieu_kien_ap_dung",
      "so_luong_phat_hanh",
      "tg_bat_dau_ban",
      "tg_ket_thuc_ban",
      "trang_thai",
      "chinh_sach_hoan_huy",
      "hinh_anh_url",
      "so_luong_da_ban",
      "ma_danh_muc",
    ];

    const updatePayload = {};

    for (const key of Object.keys(payload)) {
      if (allowedColumns.includes(key)) {
        updatePayload[key] = payload[key];
      }
    }

    if (payload.gia_goc !== undefined) {
      updatePayload.gia_goc = Number(payload.gia_goc);
    }

    if (payload.so_luong_phat_hanh !== undefined) {
      updatePayload.so_luong_phat_hanh = Number(payload.so_luong_phat_hanh);
    }

    if (payload.gia_goc !== undefined && payload.gia_ban !== undefined) {
      updatePayload.gia_tri_giam = Math.max(0, Number(payload.gia_goc) - Number(payload.gia_ban));
    }

    if (Object.keys(updatePayload).length > 0) {
      const { data, error } = await supabase
        .from("voucher")
        .update(updatePayload)
        .eq("ma_voucher", id)
        .select()
        .maybeSingle();

      if (error) {
        console.error("[VoucherRepository] update error:", error.message);
      } else if (data && Array.isArray(payload.ma_chi_nhanh)) {
        try {
          await supabase.from("voucher_cn").delete().eq("ma_voucher", id);
          if (payload.ma_chi_nhanh.length > 0) {
            const links = payload.ma_chi_nhanh.map((bId) => ({
              ma_voucher: id,
              ma_chi_nhanh: bId,
            }));
            await supabase.from("voucher_cn").insert(links);
          }
        } catch (linkErr) {
          console.warn("[VoucherRepository] voucher_cn update warning:", linkErr.message);
        }
      }
    }

    const result = await this.findById(id);
    if (result && payload.ly_do_tu_choi !== undefined) {
      result.ly_do_tu_choi = payload.ly_do_tu_choi;
    }
    return result;
  }

  async updateStatus(id, trangThai, trangThaiKiemDuyet, lyDoTuChoi = "", isHidden = false) {
    const status = isHidden ? "Tam ngung" : trangThai;
    let reviewStatus = trangThaiKiemDuyet;
    if (!reviewStatus) {
      reviewStatus = ["Dang ban", "Tam ngung", "Ngung ban"].includes(status) ? "Da duyet" : status;
    }

    const payload = {
      trang_thai: status,
      trang_thai_kiem_duyet: reviewStatus,
      trang_thai_cong_bo: isHidden ? "Bao luu" : (status === "Dang ban" ? "Hien thi" : "Bao luu"),
      ly_do_tu_choi: lyDoTuChoi || "",
    };
    return this.update(id, payload);
  }
}

module.exports = new VoucherRepository();
