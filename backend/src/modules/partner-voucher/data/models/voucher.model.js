/**
 * Model cho bảng VOUCHER
 * Khớp 1-1 với schema database PostgreSQL trong database/create_tables.sql
 */
class VoucherModel {
  constructor({
    ma_voucher,
    ten_voucher,
    mo_ta = "",
    gia_goc,
    gia_tri_giam = 0,
    dieu_kien_ap_dung = "",
    so_luong_phat_hanh = 0,
    tg_bat_dau_ban,
    tg_ket_thuc_ban,
    trang_thai = "Nhap", // 'Nhap', 'Cho duyet', 'Dang ban', 'Tu choi', 'Tam ngung'
    chinh_sach_hoan_huy = "",
    hinh_anh_url = "",
    so_luong_da_ban = 0,
    ma_danh_muc,
    // Foreign/Joined attributes for UI presentation
    gia_ban = null,
    ten_danh_muc = "",
    ma_hs = "",
    ten_dn = "",
    ma_chi_nhanh = [],
    ly_do_tu_choi = "",
    trang_thai_kiem_duyet,
    trang_thai_cong_bo,
    ngay_tao,
    lich_su_duyet = [],
  }) {
    this.ma_voucher = ma_voucher;
    this.ten_voucher = ten_voucher;
    this.mo_ta = mo_ta;
    this.gia_goc = Number(gia_goc);
    this.gia_tri_giam = Number(gia_tri_giam);
    this.dieu_kien_ap_dung = dieu_kien_ap_dung;
    this.so_luong_phat_hanh = Number(so_luong_phat_hanh);
    this.tg_bat_dau_ban = tg_bat_dau_ban;
    this.tg_ket_thuc_ban = tg_ket_thuc_ban;
    this.trang_thai = trang_thai;
    this.chinh_sach_hoan_huy = chinh_sach_hoan_huy;
    this.hinh_anh_url = hinh_anh_url;
    this.so_luong_da_ban = Number(so_luong_da_ban);
    this.ma_danh_muc = ma_danh_muc;

    // Joined & calculated attributes
    this.gia_ban = gia_ban !== null ? Number(gia_ban) : Number(gia_goc) - Number(gia_tri_giam);
    this.ten_danh_muc = ten_danh_muc;
    this.ma_hs = ma_hs;
    this.ten_dn = ten_dn;
    this.ma_chi_nhanh = Array.isArray(ma_chi_nhanh) ? ma_chi_nhanh : [];
    this.ly_do_tu_choi = ly_do_tu_choi;
    this.ngay_tao = ngay_tao || new Date().toISOString();
    this.lich_su_duyet = lich_su_duyet;

    // Derived review and publication status for UI presentation
    this.trang_thai_kiem_duyet =
      trang_thai_kiem_duyet ||
      (trang_thai === "Dang ban" || trang_thai === "Tam ngung" || trang_thai === "Ngung ban"
        ? "Da duyet"
        : trang_thai === "Cho duyet"
        ? "Cho duyet"
        : trang_thai === "Tu choi"
        ? "Tu choi"
        : "Nhap");

    this.trang_thai_cong_bo =
      trang_thai_cong_bo ||
      (trang_thai === "Dang ban" ? "Hien thi" : trang_thai === "Tam ngung" ? "Bao luu" : "Bao luu");
  }
}

module.exports = VoucherModel;
