const supabase = require("../../../../config/supabase");
const VoucherModel = require("../models/voucher.model");

const CATEGORY_UUID_MAP = {
  "cat-1": "40000000-0000-0000-0000-000000000001",
  "cat-2": "40000000-0000-0000-0000-000000000002",
  "cat-3": "40000000-0000-0000-0000-000000000003",
  "cat-4": "40000000-0000-0000-0000-000000000004",
  "cat-5": "40000000-0000-0000-0000-000000000005",
};

// Memory cache for newly created vouchers during the session
const VOUCHERS_MEMORY_STORE = new Map();

class VoucherRepository {
  /**
   * Fetch all voucher categories directly from DB
   */
  async getVoucherCategories() {
    try {
      const { data, error } = await supabase
        .from("danh_muc")
        .select("ma_danh_muc, ten_danh_muc, mo_ta");

      if (error) {
        console.error("[VoucherRepository] getVoucherCategories error:", error.message);
        return [];
      }

      return data || [];
    } catch (e) {
      console.error("[VoucherRepository] getVoucherCategories exception:", e.message);
      return [];
    }
  }

  normalizeCategoryUuid(catId) {
    if (CATEGORY_UUID_MAP[catId]) return CATEGORY_UUID_MAP[catId];
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (catId && uuidRegex.test(catId)) return catId;
    return "40000000-0000-0000-0000-000000000001";
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

      const memoryList = Array.from(VOUCHERS_MEMORY_STORE.values());
      const combined = [...(data || []), ...memoryList];

      const unique = [];
      const seen = new Set();
      for (const item of combined) {
        if (!seen.has(item.ma_voucher)) {
          seen.add(item.ma_voucher);
          unique.push(
            new VoucherModel({
              ...item,
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
              gia_ban: v.gia_goc - (v.gia_tri_giam || 0),
              ten_danh_muc: v.danh_muc?.ten_danh_muc || "",
            })
        ),
        ...memoryVouchers,
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
    // 1. Check memory store first
    if (VOUCHERS_MEMORY_STORE.has(id)) {
      return VOUCHERS_MEMORY_STORE.get(id);
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

      return new VoucherModel({
        ...data,
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
    if (maHs) {
      const partnerRepository = require("./partner.repository");
      const partner = await partnerRepository.findById(maHs);
      if (partner?.ma_hs) {
        maHs = partner.ma_hs;
      }
    }

    const dbPayload = {
      ten_voucher: payload.ten_voucher,
      mo_ta: payload.mo_ta || "",
      gia_goc: giaGoc,
      gia_tri_giam: giaTriGiam,
      dieu_kien_ap_dung: payload.dieu_kien_ap_dung || "",
      so_luong_phat_hanh: Number(payload.so_luong_phat_hanh) || 0,
      tg_bat_dau_ban: payload.tg_bat_dau_ban ? new Date(payload.tg_bat_dau_ban).toISOString() : new Date().toISOString(),
      tg_ket_thuc_ban: payload.tg_ket_thuc_ban
        ? new Date(payload.tg_ket_thuc_ban).toISOString()
        : new Date(Date.now() + 86400000 * 30).toISOString(),
      trang_thai: payload.trang_thai || "Cho duyet",
      chinh_sach_hoan_huy: payload.chinh_sach_hoan_huy || "",
      hinh_anh_url: payload.hinh_anh_url || "https://placehold.co/600x400",
      ma_danh_muc: this.normalizeCategoryUuid(payload.ma_danh_muc),
    };

    const { data, error } = await supabase.from("voucher").insert(dbPayload).select().single();

    if (error) {
      console.error("[VoucherRepository] create error:", error.message);
      throw new Error(`Tạo voucher thất bại: ${error.message}`);
    }

    // Link created voucher to partner's branches in voucher_cn table
    if (maHs) {
      const { data: branches } = await supabase
        .from("chinhanh")
        .select("ma_chi_nhanh")
        .eq("ma_hs", maHs);

      if (branches && branches.length > 0) {
        const links = branches.map((b) => ({
          ma_voucher: data.ma_voucher,
          ma_chi_nhanh: b.ma_chi_nhanh,
        }));
        await supabase.from("voucher_cn").insert(links);
      }
    }

    const createdModel = new VoucherModel({
      ...data,
      ma_hs: maHs,
      gia_ban: giaBan,
    });

    VOUCHERS_MEMORY_STORE.set(data.ma_voucher, createdModel);
    return createdModel;
  }

  async update(id, payload) {
    const updateData = {};
    if (payload.ten_voucher !== undefined) updateData.ten_voucher = payload.ten_voucher;
    if (payload.mo_ta !== undefined) updateData.mo_ta = payload.mo_ta;
    if (payload.dieu_kien_ap_dung !== undefined) updateData.dieu_kien_ap_dung = payload.dieu_kien_ap_dung;
    if (payload.chinh_sach_hoan_huy !== undefined) updateData.chinh_sach_hoan_huy = payload.chinh_sach_hoan_huy;
    if (payload.hinh_anh_url !== undefined) updateData.hinh_anh_url = payload.hinh_anh_url;
    if (payload.trang_thai !== undefined) updateData.trang_thai = payload.trang_thai;

    if (payload.ma_danh_muc) {
      updateData.ma_danh_muc = this.normalizeCategoryUuid(payload.ma_danh_muc);
    }
    if (payload.so_luong_phat_hanh !== undefined) {
      updateData.so_luong_phat_hanh = Number(payload.so_luong_phat_hanh) || 0;
    }
    if (payload.gia_goc !== undefined) {
      const giaGoc = Number(payload.gia_goc) || 0;
      updateData.gia_goc = giaGoc;
      if (payload.gia_ban !== undefined) {
        const giaBan = Number(payload.gia_ban) || giaGoc;
        updateData.gia_tri_giam = Math.max(0, giaGoc - giaBan);
      }
    }

    const { data, error } = await supabase
      .from("voucher")
      .update(updateData)
      .eq("ma_voucher", id)
      .select()
      .single();

    if (error) {
      console.error("[VoucherRepository] update error:", error.message);
      throw new Error(`Cập nhật voucher thất bại: ${error.message}`);
    }

    const updatedModel = new VoucherModel({
      ...data,
      gia_ban: data.gia_goc - (data.gia_tri_giam || 0),
    });

    if (VOUCHERS_MEMORY_STORE.has(id)) {
      VOUCHERS_MEMORY_STORE.set(id, updatedModel);
    }

    return updatedModel;
  }

  async updateStatus(id, trang_thai, ly_do_tu_choi = "") {
    return this.update(id, { trang_thai, ly_do_tu_choi });
  }
}

module.exports = new VoucherRepository();
