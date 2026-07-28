/**
 * Purpose: Route cho truy vấn audit log.
 */
const express = require("express");
const AuditLogController = require("../controllers/audit-log.controller");
const auditLogService = require("../../business/services/audit-log.service");

const router = express.Router();
const controller = new AuditLogController(auditLogService);

router.get("/audit-logs", controller.list.bind(controller));

module.exports = router;
