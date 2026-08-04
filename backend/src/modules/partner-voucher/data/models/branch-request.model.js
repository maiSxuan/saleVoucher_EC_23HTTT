/**
 * Model cho yêu cầu thêm / sửa / xóa chi nhánh (BranchChangeRequest)
 */
class BranchRequestModel {
  constructor({
    ma_yeu_cau,
    ma_hs,
    ten_dn = "",
    loai_yeu_cau = "Them moi", // Them moi, Chinh sua, Xoa
    ten_chi_nhanh,
    khu_vuc = "TP. Hồ Chí Minh",
    dia_chi,
    ly_do = "",
    trang_thai = "Cho duyet", // Cho duyet, Da duyet, Tu choi, Yeu cau bo sung
    ghi_chu_admin = "",
    ngay_tao,
  }) {
    this.ma_yeu_cau = ma_yeu_cau;
    this.ma_hs = ma_hs;
    this.ten_dn = ten_dn;
    this.loai_yeu_cau = loai_yeu_cau;
    this.ten_chi_nhanh = ten_chi_nhanh;
    this.khu_vuc = khu_vuc;
    this.dia_chi = dia_chi;
    this.ly_do = ly_do;
    this.trang_thai = trang_thai;
    this.ghi_chu_admin = ghi_chu_admin;
    this.ngay_tao = ngay_tao || new Date().toISOString();
  }
}

module.exports = BranchRequestModel;
