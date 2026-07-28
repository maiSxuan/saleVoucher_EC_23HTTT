/**
 * Purpose: Repository cho lưu và đọc audit log.
 */
class AuditLogRepository {
  async list(query) {
    return { query, logs: [] };
  }
}

module.exports = new AuditLogRepository();
