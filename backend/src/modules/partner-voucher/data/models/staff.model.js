/**
 * Model cho người dùng / nhân viên thuộc bảng NGUOIDUNG
 * Khớp 1-1 với schema database PostgreSQL trong database/create_tables.sql
 */
class StaffModel {
  constructor({
    ma_nguoi_dung,
    ho_ten,
    email = "",
    sdt = "",
    ngay_sinh = null,
    gioi_tinh = "Khac",
    cccd = "",
    vai_tro = "Nhan vien ban hang", // 'Khach hang', 'Nguoi dai dien', 'Nhan vien ban hang', 'Nhan vien quan ly voucher', 'Admin'
    trang_thai = "Dang hoat dong", // 'Dang hoat dong', 'Tam khoa'
    created_at,
    ma_chi_nhanh = null,
    ma_hosodn = null,
    // Alias attributes for UI presentation
    ma_nv,
    chi_nhanh_phu_trach = [],
    avatar = "",
  }) {
    this.ma_nguoi_dung = ma_nguoi_dung || ma_nv;
    this.ma_nv = ma_nv || ma_nguoi_dung;
    this.ho_ten = ho_ten;
    this.email = email;
    this.sdt = sdt;
    this.ngay_sinh = ngay_sinh;
    this.gioi_tinh = gioi_tinh;
    this.cccd = cccd;
    this.vai_tro = vai_tro;
    this.trang_thai = trang_thai;
    this.created_at = created_at || new Date().toISOString();
    this.ma_chi_nhanh = ma_chi_nhanh;
    this.ma_hosodn = ma_hosodn;
    this.chi_nhanh_phu_trach = Array.isArray(chi_nhanh_phu_trach) ? chi_nhanh_phu_trach : [];
    this.avatar = avatar;
  }
}

module.exports = StaffModel;
