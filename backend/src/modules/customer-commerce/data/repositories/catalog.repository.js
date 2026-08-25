/**
 * Purpose: Repository truy vấn voucher đang bán cho khách hàng (catalog).
 */
const supabase = require("../../../../config/supabase");
const NotFoundError = require("../../../../common/errors/NotFoundError");

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
        ma_danh_muc,
        danh_muc:danh_muc ( ma_danh_muc, ten_danh_muc ),
        voucher_cn (
          chinhanh (
            ma_chi_nhanh,
            ten_chi_nhanh,
            dia_chi,
            khu_vuc,
            trang_thai,
            hosodn ( ma_hs, ten_dn, logo )
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
      .select("ma_danh_muc, ten_danh_muc, hinh_anh_url")
      .order("ten_danh_muc", { ascending: true });

    if (error) {
      const err = new Error("Không thể truy xuất danh mục");
      err.status = 500;
      throw err;
    }

    return data || [];
  }

  async findVoucherById(id) {
    const { data, error } = await supabase
      .from("voucher")
      .select(
        `
        ma_voucher,
        ten_voucher,
        mo_ta,
        gia_goc,
        gia_tri_giam,
        dieu_kien_ap_dung,
        chinh_sach_hoan_huy,
        so_luong_phat_hanh,
        so_luong_da_ban,
        tg_bat_dau_ban,
        tg_ket_thuc_ban,
        trang_thai,
        hinh_anh_url,
        danh_muc:danh_muc ( ten_danh_muc ),
        voucher_cn (
          chinhanh (
            ma_chi_nhanh,
            ten_chi_nhanh,
            dia_chi,
            khu_vuc,
            trang_thai,
            hosodn ( ma_hs, ten_dn, ma_so_thue, dia_chi )
          )
        )
        `,
      )
      .eq("ma_voucher", id)
      .maybeSingle(); // trả null nếu không có

    if (error) {
      if (error.code === "22P02") return null;

      throw new NotFoundError(
        "Không thể truy xuất thông tin voucher",
        500,
        "DATABASE_ERROR",
      );
    }
    return data;
  }

  // nếu 2 đơn hàng trùng thời điểm cho cùng 1 voucher -> ko an toàn tuyệt đối
  async incrementSoldQuantity(voucherId, qty) {
    const { data: current, error: readErr } = await supabase
      .from("voucher")
      .select("so_luong_da_ban")
      .eq("ma_voucher", voucherId)
      .single();
    if (readErr) {
      const err = new Error("Không thể cập nhật số lượng voucher đã bán");
      err.status = 500;
      throw err;
    }
    const { error: updateErr } = await supabase
      .from("voucher")
      .update({ so_luong_da_ban: current.so_luong_da_ban + qty })
      .eq("ma_voucher", voucherId);
    if (updateErr) {
      const err = new Error("Không thể cập nhật số lượng voucher đã bán");
      err.status = 500;
      throw err;
    }
  }
}

module.exports = new CatalogRepository();
