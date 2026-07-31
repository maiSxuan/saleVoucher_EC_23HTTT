/**
 * Purpose: Controller cho truy vấn audit log hệ thống (BR-ADM-07).
 * Chỉ Admin được phép xem nhật ký hệ thống.
 * Dùng successResponse / paginatedResponse chuẩn từ utils.
 */
const { paginatedResponse } = require('../../../../common/utils/response');

class AuditLogController {
  constructor(auditLogService) {
    this.auditLogService = auditLogService;
    this.list = this.list.bind(this);
  }

  /**
   * GET /admin/logs
   * Query params: page, limit, maTkThucHien, doiTuong, hanhDong, ketQua
   */
  async list(req, res, next) {
    try {
      const { page, limit, maTkThucHien, doiTuong, hanhDong, ketQua } = req.query;

      const result = await this.auditLogService.listLogs({
        page,
        limit,
        maTkThucHien,
        doiTuong,
        hanhDong,
        ketQua,
      });

      return paginatedResponse(
        res,
        result.logs,
        result.pagination,
        'Lấy nhật ký hệ thống thành công'
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuditLogController;
