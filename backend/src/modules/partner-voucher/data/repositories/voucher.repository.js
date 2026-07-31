const supabase = require("../../../../config/supabase");
const VoucherModel = require("../models/voucher.model");

const SEED_VOUCHERS = [
  {
    ma_voucher: "50000000-0000-0000-0000-000000000001",
    ma_hs: "20000000-0000-0000-0000-000000000001",
    ten_dn: "Cong ty TNHH Am Thuc Sai Gon",
    ten_voucher: "Buffet lau hai san gia 299.000d",
    mo_ta: "Buffet lau hai san danh cho mot nguoi.",
    gia_goc: 500000,
    gia_tri_giam: 201000,
    gia_ban: 299000,
    ma_danh_muc: "40000000-0000-0000-0000-000000000001",
    ten_danh_muc: "An uong",
    dieu_kien_ap_dung: "Ap dung tu thu Hai den thu Sau; dat ban truoc it nhat 2 gio.",
    chinh_sach_hoan_huy: "Duoc hoan tien truoc ngay su dung it nhat 24 gio.",
    so_luong_phat_hanh: 100,
    so_luong_da_ban: 3,
    tg_bat_dau_ban: "2026-07-01T00:00:00Z",
    tg_ket_thuc_ban: "2026-11-30T23:59:59Z",
    trang_thai: "Dang ban",
    trang_thai_kiem_duyet: "Da duyet",
    trang_thai_cong_bo: "Dang ban",
    hinh_anh_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    ma_chi_nhanh: ["30000000-0000-0000-0000-000000000001", "30000000-0000-0000-0000-000000000002"],
    ly_do_tu_choi: "",
    ngay_tao: "2026-07-01T08:00:00Z",
  },
];

const CATEGORY_UUID_MAP = {
  "cat-1": "40000000-0000-0000-0000-000000000001",
  "cat-2": "40000000-0000-0000-0000-000000000002",
  "cat-3": "40000000-0000-0000-0000-000000000003",
  "cat-4": "40000000-0000-0000-0000-000000000004",
  "cat-5": "40000000-0000-0000-0000-000000000005",
};

class VoucherRepository {
  /**
   * Helper to normalize category UUID
   */
  normalizeCategoryUuid(catId) {
    if (CATEGORY_UUID_MAP[catId]) return CATEGORY_UUID_MAP[catId];
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (catId && uuidRegex.test(catId)) return catId;
    return "40000000-0000-0000-0000-000000000001"; // Fallback to 'An uong'
  }

  /**
   * Find all vouchers
   */
  async findAll(query = {}) {
    try {
      let dbQuery = supabase.from("voucher").select("*, danh_muc(ten_danh_muc)");

      if (query.status && query.status !== "ALL") {
        dbQuery = dbQuery.eq("trang_thai", query.status);
      }

      const { data, error } = await dbQuery;

      if (error || !data || data.length === 0) {
        return SEED_VOUCHERS.map((v) => new VoucherModel(v));
      }

      return data.map(
        (v) =>
          new VoucherModel({
            ...v,
            gia_ban: v.gia_goc - (v.gia_tri_giam || 0),
            ten_danh_muc: v.danh_muc?.ten_danh_muc || "",
          })
      );
    } catch (e) {
      return SEED_VOUCHERS.map((v) => new VoucherModel(v));
    }
  }

  /**
   * Find vouchers by partner ID
   */
  async findByPartnerId(partnerId, query = {}) {
    const all = await this.findAll(query);
    return all.filter((v) => v.ma_hs === partnerId || !v.ma_hs);
  }

  /**
   * Find voucher by ID
   */
  async findById(id) {
    try {
      const { data, error } = await supabase
        .from("voucher")
        .select("*, danh_muc(ten_danh_muc)")
        .eq("ma_voucher", id)
        .single();

      if (error || !data) {
        const seed = SEED_VOUCHERS.find((v) => v.ma_voucher === id);
        return seed ? new VoucherModel(seed) : null;
      }

      // Fetch applicable branch IDs from voucher_cn
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
      const seed = SEED_VOUCHERS.find((v) => v.ma_voucher === id);
      return seed ? new VoucherModel(seed) : null;
    }
  }

  /**
   * Create new voucher directly in Supabase VOUCHER table
   */
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

    try {
      const { data, error } = await supabase.from("voucher").insert(dbPayload).select().single();

      if (error || !data) {
        console.error("Supabase voucher insert error:", error);
        const newVoucher = new VoucherModel({
          ...payload,
          ma_voucher: `50000000-0000-0000-0000-${Date.now()}`,
        });
        SEED_VOUCHERS.unshift(newVoucher);
        return newVoucher;
      }

      return new VoucherModel(data);
    } catch (e) {
      console.error("Supabase voucher insert exception:", e.message);
      const newVoucher = new VoucherModel({
        ...payload,
        ma_voucher: `50000000-0000-0000-0000-${Date.now()}`,
      });
      SEED_VOUCHERS.unshift(newVoucher);
      return newVoucher;
    }
  }

  /**
   * Update existing voucher
   */
  async update(id, payload) {
    try {
      const updateData = { ...payload };
      if (updateData.ma_danh_muc) {
        updateData.ma_danh_muc = this.normalizeCategoryUuid(updateData.ma_danh_muc);
      }

      const { data, error } = await supabase
        .from("voucher")
        .update(updateData)
        .eq("ma_voucher", id)
        .select()
        .single();

      if (error || !data) {
        const idx = SEED_VOUCHERS.findIndex((v) => v.ma_voucher === id);
        if (idx !== -1) {
          SEED_VOUCHERS[idx] = { ...SEED_VOUCHERS[idx], ...payload };
          return new VoucherModel(SEED_VOUCHERS[idx]);
        }
        return new VoucherModel({ ma_voucher: id, ...payload });
      }

      return new VoucherModel(data);
    } catch (e) {
      const idx = SEED_VOUCHERS.findIndex((v) => v.ma_voucher === id);
      if (idx !== -1) {
        SEED_VOUCHERS[idx] = { ...SEED_VOUCHERS[idx], ...payload };
        return new VoucherModel(SEED_VOUCHERS[idx]);
      }
      return new VoucherModel({ ma_voucher: id, ...payload });
    }
  }

  /**
   * Update voucher approval status
   */
  async updateStatus(id, trang_thai, trang_thai_kiem_duyet, ly_do_tu_choi = "") {
    return this.update(id, {
      trang_thai,
      ly_do_tu_choi,
    });
  }
}

module.exports = new VoucherRepository();
