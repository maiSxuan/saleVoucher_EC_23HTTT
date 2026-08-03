/**
 * FILE: backend/src/modules/core-access/presentation/routes/redemption.routes.js
 * PURPOSE: Routes cho xác thực và sử dụng voucher code (BR-PAR-05, BR-PAR-06).
 */

const express = require('express');
const RedemptionController = require('../controllers/redemption.controller');
const voucherVerificationService = require('../../business/services/voucher-verification.service');
const voucherRedemptionService = require('../../business/services/voucher-redemption.service');
const { authenticateMiddleware } = require('../../../../common/middleware/authenticate.middleware');
const { authorizeMiddleware } = require('../../../../common/middleware/authorize.middleware');
const { JWT_ROLES } = require('../../../../common/constants/roles');

const router = express.Router();
const controller = new RedemptionController(
  voucherVerificationService,
  voucherRedemptionService
);

// Danh sách các vai trò được phép tra cứu & xác nhận voucher tại chi nhánh
const ALLOWED_STAFF_ROLES = [
  JWT_ROLES.ADMIN,
  JWT_ROLES.PARTNER_OWNER,
  JWT_ROLES.PARTNER_STAFF,
];

// 1. Tra cứu / Xác minh tính hợp lệ voucher code (BR-PAR-05)
router.post(
  '/vouchers/verify',
  authenticateMiddleware,
  authorizeMiddleware(...ALLOWED_STAFF_ROLES),
  controller.verify.bind(controller)
);

// 2. Xác nhận sử dụng voucher code (BR-PAR-06)
router.post(
  '/vouchers/redeem',
  authenticateMiddleware,
  authorizeMiddleware(...ALLOWED_STAFF_ROLES),
  controller.redeem.bind(controller)
);

// 3. Lịch sử sử dụng voucher tại chi nhánh
router.get(
  '/vouchers/usage-history',
  authenticateMiddleware,
  authorizeMiddleware(...ALLOWED_STAFF_ROLES),
  controller.getUsageHistory.bind(controller)
);

// 4. Lấy danh sách mã mẫu từ DB để demo test nhanh
router.get(
  '/vouchers/sample-codes',
  authenticateMiddleware,
  authorizeMiddleware(...ALLOWED_STAFF_ROLES),
  controller.getSampleCodes.bind(controller)
);

module.exports = router;
