/**
 * Purpose: Service cho việc đọc và xử lý audit log.
 */
class AuditLogService {
  async listLogs(query) {
    return {
      message: "Audit log placeholder",
      query,
    };
  }
}

module.exports = new AuditLogService();
