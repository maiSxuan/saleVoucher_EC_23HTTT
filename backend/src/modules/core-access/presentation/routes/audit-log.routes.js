/**
 * Purpose: Route cho truy vấn nhật ký hệ thống (BR-ADM-07).
 * Bảo vệ bằng authenticate + authorize(Admin he thong).
 * Endpoint: GET /admin/logs
 */
const express = require('express');
const AuditLogController = require('../controllers/audit-log.controller');
const auditLogService = require('../../business/services/audit-log.service');
const { authenticateMiddleware } = require('../../../../common/middleware/authenticate.middleware');
const { authorizeMiddleware } = require('../../../../common/middleware/authorize.middleware');
const { JWT_ROLES } = require('../../../../common/constants/roles');

const router = express.Router();
const controller = new AuditLogController(auditLogService);

// Chỉ Admin he thong được phép xem nhật ký hệ thống.
router.get(
  '/admin/logs',
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.ADMIN_SYSTEM),
  controller.list
);

module.exports = router;
