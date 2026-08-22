/**
 * FILE: backend/src/modules/core-access/presentation/routes/issued-voucher.routes.js
 * PURPOSE: Routes cho BR-CUS-07 — Nhận và xem voucher đã mua.
 *
 * Endpoints:
 *  GET  /vouchers/my             → Danh sách "Voucher của tôi" (CUSTOMER)
 *  GET  /vouchers/order/:orderId → Voucher theo đơn hàng vừa thanh toán (CUSTOMER)
 *  GET  /vouchers/:issuedId      → Chi tiết một voucher đã mua (CUSTOMER)
 *  POST /vouchers/issue          → Phát hành thủ công
 */
const express = require('express');
const IssuedVoucherController = require('../controllers/issued-voucher.controller');
const { authenticateMiddleware } = require('../../../../common/middleware/authenticate.middleware');

const router = express.Router();
const controller = new IssuedVoucherController();

// Danh sách voucher của tôi (CUSTOMER)
router.get('/vouchers/my', authenticateMiddleware, controller.getMyVouchers.bind(controller));

// Voucher theo đơn hàng sau thanh toán (CUSTOMER)
router.get('/vouchers/order/:orderId', authenticateMiddleware, controller.getVouchersByOrder.bind(controller));

// Chi tiết một voucher đã mua (CUSTOMER) - dùng /vouchers/issued/:issuedId hoặc /vouchers/my/:issuedId để tránh trùng wildcard
router.get('/vouchers/issued/:issuedId', authenticateMiddleware, controller.getIssuedVoucherDetail.bind(controller));
router.get('/vouchers/my/:issuedId', authenticateMiddleware, controller.getIssuedVoucherDetail.bind(controller));

// Phát hành thủ công
router.post('/vouchers/issue', authenticateMiddleware, controller.issueVoucher.bind(controller));

module.exports = router;
