/**
 * Purpose: Model đại diện cho bản ghi nhật ký hệ thống (LOG_HT).
 * Sync với schema: log_id, vai_tro_thuc_hien, hanh_dong, du_lieu_truoc,
 * du_lieu_sau, ket_qua, ly_do_thuc_hien, thoi_diem_thuc_hien,
 * ma_tk_thuc_hien, doi_tuong, ma_doi_tuong.
 */
class AuditLogModel {
  constructor({
    log_id,
    vai_tro_thuc_hien,
    hanh_dong,
    du_lieu_truoc,
    du_lieu_sau,
    ket_qua,
    ly_do_thuc_hien,
    thoi_diem_thuc_hien,
    ma_tk_thuc_hien,
    doi_tuong,
    ma_doi_tuong,
  }) {
    this.logId = log_id;
    this.vaiTroThucHien = vai_tro_thuc_hien;
    this.hanhDong = hanh_dong;
    this.duLieuTruoc = du_lieu_truoc;
    this.duLieuSau = du_lieu_sau;
    this.ketQua = ket_qua;
    this.lyDoThucHien = ly_do_thuc_hien;
    this.thoiDiemThucHien = thoi_diem_thuc_hien;
    this.maTkThucHien = ma_tk_thuc_hien;
    this.doiTuong = doi_tuong;
    this.maDoiTuong = ma_doi_tuong;
  }
}

module.exports = AuditLogModel;
