/**
 * Purpose: Controller cho các truy vấn audit log.
 * Dùng để xem lịch sử hoạt động và thay đổi hệ thống.
 */
class AuditLogController {
  constructor(auditLogService) {
    this.auditLogService = auditLogService;
  }

  async list(req, res, next) {
    try {
      const result = await this.auditLogService.listLogs(req.query);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuditLogController;
