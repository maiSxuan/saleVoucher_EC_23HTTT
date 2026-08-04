// Model cho các nội dung do Admin quản lý (bảng public.noidung)
class ContentModel {
  constructor({ ma_nd, loai, tieu_de, noi_dung, trang_thai, bat_dau_hien_thi, ket_thuc_hien_thi, ngay_tao, ngay_cap_nhat, matk_admin }) {
    this.id = ma_nd;
    this.type = loai;
    this.title = tieu_de;
    this.content = noi_dung;
    this.status = trang_thai;
    this.startDate = bat_dau_hien_thi;
    this.endDate = ket_thuc_hien_thi;
    this.createdAt = ngay_tao;
    this.updatedAt = ngay_cap_nhat;
    this.adminId = matk_admin;
  }
}

module.exports = ContentModel;
