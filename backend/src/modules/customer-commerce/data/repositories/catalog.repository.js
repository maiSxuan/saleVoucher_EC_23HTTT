/**
 * Purpose: Repository truy vấn voucher đang bán cho khách hàng (catalog).
 */
const supabase = require("../../../../config/supabase");

class CatalogRepository {
  // Chỉ lấy voucher đang được phép bán
  async findSellingVouchers() {
    const { data, error } = await supabase
      .from("voucher")
      .select(
        `
        ma_voucher,
        ten_voucher,
        mo_ta,
        gia_goc,
        gia_tri_giam,
        so_luong_phat_hanh,
        so_luong_da_ban,
        tg_bat_dau_ban,
        tg_ket_thuc_ban,
        trang_thai,
        hinh_anh_url,
        danh_muc:danh_muc ( ten_danh_muc ),
        voucher_cn (
          chinhanh (
            ten_chi_nhanh,
            hosodn ( ten_dn )
          )
        )
        `,
      )
      .eq("trang_thai", "Dang ban")
      .order("tg_bat_dau_ban", { ascending: false });

    if (error) {
      // E1: Không thể truy xuất dữ liệu voucher
      const err = new Error("Không thể truy xuất dữ liệu voucher");
      err.status = 500;
      throw err;
    }

    return data || [];
  }

  async findAllCategories() {
    const { data, error } = await supabase
      .from("danh_muc")
      .select("ma_danh_muc, ten_danh_muc")
      .order("ten_danh_muc", { ascending: true });

    if (error) {
      const err = new Error("Không thể truy xuất danh mục");
      err.status = 500;
      throw err;
    }

    return data || [];
  }
}

module.exports = new CatalogRepository();
