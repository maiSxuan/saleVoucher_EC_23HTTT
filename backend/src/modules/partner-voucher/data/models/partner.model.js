/**
 * Model cho bảng HOSODN (Hồ sơ doanh nghiệp đối tác)
 * Khớp 1-1 với schema database PostgreSQL trong database/create_tables.sql
 */
class PartnerModel {
  constructor({
    ma_hs,
    ten_dn,
    ma_so_thue,
    dia_chi,
    giay_phep_kinh_doanh,
    ngay_tao,
    trang_thai = "Cho duyet", // 'Cho duyet', 'Dang hoat dong', 'Tu choi', 'Tam khoa'
    id_nguoi_dai_dien,
    ly_do_tu_choi = "",
    nguoi_dai_dien = null,
    branches = [],
  }) {
    this.ma_hs = ma_hs;
    this.ten_dn = ten_dn;
    this.ma_so_thue = ma_so_thue;
    this.dia_chi = dia_chi;
    this.giay_phep_kinh_doanh = giay_phep_kinh_doanh;
    this.ngay_tao = ngay_tao || new Date().toISOString();
    this.trang_thai = trang_thai;
    this.id_nguoi_dai_dien = id_nguoi_dai_dien;
    this.ly_do_tu_choi = ly_do_tu_choi;
    this.nguoi_dai_dien = nguoi_dai_dien;
    this.branches = branches;
  }
}

module.exports = PartnerModel;
