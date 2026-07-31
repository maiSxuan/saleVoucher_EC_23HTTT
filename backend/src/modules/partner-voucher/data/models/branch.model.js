/**
 * Model cho bảng CHINHANH (Chi nhánh đối tác)
 * Khớp 1-1 với schema database PostgreSQL trong database/create_tables.sql
 */
class BranchModel {
  constructor({
    ma_chi_nhanh,
    ten_chi_nhanh,
    khu_vuc = "TP. Hồ Chí Minh",
    dia_chi,
    trang_thai = "Cho duyet", // 'Cho duyet', 'Dang hoat dong', 'Tu choi', 'Tam ngung hoat dong'
    ma_hs,
    sdt = "",
    gio_mo_cua = "08:00 - 22:00",
  }) {
    this.ma_chi_nhanh = ma_chi_nhanh;
    this.ten_chi_nhanh = ten_chi_nhanh;
    this.khu_vuc = khu_vuc;
    this.dia_chi = dia_chi;
    this.trang_thai = trang_thai;
    this.ma_hs = ma_hs;
    this.sdt = sdt;
    this.gio_mo_cua = gio_mo_cua;
  }
}

module.exports = BranchModel;
