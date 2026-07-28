/**
 * Purpose: Model đại diện cho audit log.
 */
class AuditLogModel {
  constructor({ id, actor, action, target, createdAt }) {
    this.id = id;
    this.actor = actor;
    this.action = action;
    this.target = target;
    this.createdAt = createdAt;
  }
}

module.exports = AuditLogModel;
