const supabase = require("../../../../config/supabase");
const VoucherModel = require("../models/voucher.model");

const CATEGORY_UUID_MAP = {
  "cat-1": "40000000-0000-0000-0000-000000000001",
  "cat-2": "40000000-0000-0000-0000-000000000002",
  "cat-3": "40000000-0000-0000-0000-000000000003",
  "cat-4": "40000000-0000-0000-0000-000000000004",
  "cat-5": "40000000-0000-0000-0000-000000000005",
};

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

      if (!data || data.length === 0) return [];

      return data.map(
        (v) =>
          new VoucherModel({
            ...v,
            gia_ban: v.gia_goc - (v.gia_tri_giam || 0),
            ten_danh_muc: v.danh_muc?.ten_danh_muc || "",
          })
      );
    } catch (e) {
      console.error("[VoucherRepository] findAll exception:", e.message);
      return [];
    }
  }

  async findByPartnerId(partnerId, query = {}) {
    const all = await this.findAll(query);
    return all.filter((v) => v.ma_hs === partnerId || !v.ma_hs);
  }

  async findById(id) {
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

    return new VoucherModel(data);
  }

  async update(id, payload) {
    const updateData = {};
    if (payload.ten_voucher !== undefined) updateData.ten_voucher = payload.ten_voucher;
    if (payload.mo_ta !== undefined) updateData.mo_ta = payload.mo_ta;
    if (payload.dieu_kien_ap_dung !== undefined) updateData.dieu_kien_ap_dung = payload.dieu_kien_ap_dung;
    if (payload.chinh_sach_hoan_huy !== undefined) updateData.chinh_sach_hoan_huy = payload.chinh_sach_hoan_huy;
    if (payload.hinh_anh_url !== undefined) updateData.hinh_anh_url = payload.hinh_anh_url;
    if (payload.trang_thai !== undefined) updateData.trang_thai = payload.trang_thai;
    if (payload.ly_do_tu_choi !== undefined) updateData.ly_do_tu_choi = payload.ly_do_tu_choi;

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

    if (payload.tg_bat_dau_ban) {
      updateData.tg_bat_dau_ban = new Date(payload.tg_bat_dau_ban).toISOString();
    }
    if (payload.tg_ket_thuc_ban) {
      updateData.tg_ket_thuc_ban = new Date(payload.tg_ket_thuc_ban).toISOString();
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

    return new VoucherModel({
      ...data,
      gia_ban: data.gia_goc - (data.gia_tri_giam || 0),
    });
  }

  async updateStatus(id, trang_thai, trang_thai_kiem_duyet, ly_do_tu_choi = "") {
    return this.update(id, {
      trang_thai,
      ly_do_tu_choi,
    });
  }
}

module.exports = new VoucherRepository();
