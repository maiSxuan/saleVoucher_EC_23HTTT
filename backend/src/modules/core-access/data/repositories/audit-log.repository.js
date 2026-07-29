/**
 * Purpose: Repository cho bảng LOG_HT — ghi và đọc nhật ký hệ thống từ Supabase.
 * Chỉ thực hiện thao tác DB, không chứa business rule.
 */
const supabase = require('../../../../config/supabase');

class AuditLogRepository {
  /**
   * Ghi một bản ghi log vào bảng LOG_HT.
   * @param {object} logData
   *  - vai_tro_thuc_hien: string (JWT role)
   *  - hanh_dong: string (mô tả hành động, ví dụ: 'LOGIN', 'UPDATE_USER')
   *  - du_lieu_truoc: object|null (JSONB)
   *  - du_lieu_sau: object|null (JSONB)
   *  - ket_qua: 'Thanh cong' | 'That bai'
   *  - ly_do_thuc_hien: string|null
   *  - ma_tk_thuc_hien: uuid|null (FK TAIKHOAN)
   *  - doi_tuong: string|null (tên bảng/entity, ví dụ: 'NGUOIDUNG', 'VOUCHER')
   *  - ma_doi_tuong: uuid|null
   */
  async create(logData) {
    const { data, error } = await supabase
      .from('log_ht')
      .insert([
        {
          vai_tro_thuc_hien: logData.vai_tro_thuc_hien ?? null,
          hanh_dong: logData.hanh_dong,
          du_lieu_truoc: logData.du_lieu_truoc ?? null,
          du_lieu_sau: logData.du_lieu_sau ?? null,
          ket_qua: logData.ket_qua ?? null,
          ly_do_thuc_hien: logData.ly_do_thuc_hien ?? null,
          ma_tk_thuc_hien: logData.ma_tk_thuc_hien ?? null,
          doi_tuong: logData.doi_tuong ?? null,
          ma_doi_tuong: logData.ma_doi_tuong ?? null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('[AuditLogRepository] Ghi log thất bại:', error.message);
      throw new Error(`Ghi audit log thất bại: ${error.message}`);
    }

    return data;
  }

  /**
   * Lấy danh sách log với bộ lọc và phân trang.
   * @param {object} query
   *  - page: số trang (bắt đầu từ 1)
   *  - limit: số bản ghi mỗi trang
   *  - maTkThucHien: uuid|null — lọc theo tài khoản thực hiện
   *  - doiTuong: string|null — lọc theo loại đối tượng
   *  - hanhDong: string|null — lọc theo hành động
   *  - ketQua: string|null — lọc theo kết quả
   */
  async list({ page = 1, limit = 20, maTkThucHien, doiTuong, hanhDong, ketQua } = {}) {
    const offset = (page - 1) * limit;

    let query = supabase
      .from('log_ht')
      .select('*', { count: 'exact' })
      .order('thoi_diem_thuc_hien', { ascending: false })
      .range(offset, offset + limit - 1);

    if (maTkThucHien) query = query.eq('ma_tk_thuc_hien', maTkThucHien);
    if (doiTuong) query = query.eq('doi_tuong', doiTuong);
    if (hanhDong) query = query.ilike('hanh_dong', `%${hanhDong}%`);
    if (ketQua) query = query.eq('ket_qua', ketQua);

    const { data, error, count } = await query;

    if (error) {
      console.error('[AuditLogRepository] Đọc log thất bại:', error.message);
      throw new Error(`Đọc audit log thất bại: ${error.message}`);
    }

    return { logs: data, total: count };
  }
}

module.exports = new AuditLogRepository();
