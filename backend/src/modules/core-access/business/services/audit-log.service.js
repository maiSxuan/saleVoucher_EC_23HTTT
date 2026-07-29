/**
 * Purpose: Service cho Audit Log — ghi nhật ký hệ thống (RB-12).
 * Được gọi từ các service khác sau mỗi thao tác quản trị quan trọng.
 *
 * RB-12: Thao tác quản trị quan trọng phải ghi log.
 * RB-15 (skills.md §15): Nếu log bắt buộc và ghi log thất bại → không báo thành công.
 */
const auditLogRepository = require('../../data/repositories/audit-log.repository');
const LOG_RESULT = require('../../../../common/constants/log-result');

class AuditLogService {
  /**
   * Ghi một bản ghi audit log vào DB.
   * @param {object} params
   *  - actorId: uuid tài khoản thực hiện (ma_tk)
   *  - actorRole: string role JWT (ví dụ: 'ADMIN')
   *  - action: string mô tả hành động (ví dụ: 'LOGIN', 'LOCK_USER')
   *  - targetType: string tên đối tượng (ví dụ: 'NGUOIDUNG', 'VOUCHER')
   *  - targetId: uuid của đối tượng bị tác động
   *  - before: object|null dữ liệu trước khi thay đổi
   *  - after: object|null dữ liệu sau khi thay đổi
   *  - result: 'Thanh cong' | 'That bai'
   *  - reason: string|null lý do thực hiện
   * @param {boolean} strict - Nếu true, throw nếu ghi log thất bại (dùng cho thao tác bắt buộc log)
   */
  async log({
    actorId = null,
    actorRole = null,
    action,
    targetType = null,
    targetId = null,
    before = null,
    after = null,
    result = LOG_RESULT.THANH_CONG,
    reason = null,
  }, strict = false) {
    try {
      const logEntry = await auditLogRepository.create({
        vai_tro_thuc_hien: actorRole,
        hanh_dong: action,
        du_lieu_truoc: before,
        du_lieu_sau: after,
        ket_qua: result,
        ly_do_thuc_hien: reason,
        ma_tk_thuc_hien: actorId,
        doi_tuong: targetType,
        ma_doi_tuong: targetId,
      });
      return logEntry;
    } catch (err) {
      if (strict) {
        // RB-15: Nếu log bắt buộc mà thất bại → không cho tiếp tục
        throw new Error(`Ghi audit log bắt buộc thất bại: ${err.message}`);
      }
      // Lỗi log không chặn nghiệp vụ (best-effort logging)
      console.warn('[AuditLogService] Ghi log thất bại (non-strict):', err.message);
    }
  }

  /**
   * Đọc danh sách audit log với bộ lọc và phân trang.
   * @param {object} query - { page, limit, maTkThucHien, doiTuong, hanhDong, ketQua }
   */
  async listLogs({ page = 1, limit = 20, maTkThucHien, doiTuong, hanhDong, ketQua } = {}) {
    const { logs, total } = await auditLogRepository.list({
      page: Number(page),
      limit: Number(limit),
      maTkThucHien,
      doiTuong,
      hanhDong,
      ketQua,
    });

    return {
      logs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }
}

module.exports = new AuditLogService();
