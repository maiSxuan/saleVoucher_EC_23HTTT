/**
 * FILE: backend/src/modules/core-access/presentation/routes/dashboard.routes.js
 * PURPOSE: Route GET /dashboard — Admin Dashboard tổng quan (BR_ADM_06).
 *          Yêu cầu xác thực + ADMIN role.
 */
const express = require('express');
const AdminDashboardController = require('../controllers/admin-dashboard.controller');
const adminDashboardService = require('../../business/services/admin-dashboard.service');
const { authenticateMiddleware } = require('../../../../common/middleware/authenticate.middleware');
const { authorizeMiddleware } = require('../../../../common/middleware/authorize.middleware');
const { JWT_ROLES } = require('../../../../common/constants/roles');

const router = express.Router();
const controller = new AdminDashboardController(adminDashboardService);

// GET /dashboard — Chỉ ADMIN được truy cập
router.get(
  '/dashboard',
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.ADMIN),
  controller.getSummary.bind(controller)
);

module.exports = router;
