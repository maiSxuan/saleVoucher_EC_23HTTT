const express = require('express');
const orderController = require('../controllers/order.controller');
const { authenticateMiddleware } = require('../../../../common/middleware/authenticate.middleware');
const { authorizeMiddleware } = require('../../../../common/middleware/authorize.middleware');
const { JWT_ROLES } = require('../../../../common/constants/roles');

const router = express.Router();

// GET /admin/orders — Danh sách đơn hàng toàn hệ thống (có filter & phân trang)
router.get(
  '/admin/orders',
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.ADMIN),
  orderController.listAdminOrders.bind(orderController)
);

// GET /admin/orders/:id — Chi tiết đơn hàng (đầy đủ items, codes, history)
router.get(
  '/admin/orders/:id',
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.ADMIN),
  orderController.getAdminOrder.bind(orderController)
);

// GET /admin/orders/:id/logs — Lấy nhật ký hệ thống của riêng đơn hàng
router.get(
  '/admin/orders/:id/logs',
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.ADMIN),
  orderController.getOrderLogs.bind(orderController)
);

// POST /admin/orders/:id/payment-status — A4a: Xử lý thanh toán bất thường / xác nhận thủ công
router.post(
  '/admin/orders/:id/payment-status',
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.ADMIN),
  orderController.updatePaymentStatus.bind(orderController)
);

// POST /admin/orders/:id/cancel — A4b: Hủy đơn hàng (chuyển chờ hoàn tiền)
router.post(
  '/admin/orders/:id/cancel',
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.ADMIN),
  orderController.cancelOrder.bind(orderController)
);

// POST /admin/orders/:id/refund — A4c: Ghi nhận hoàn tiền mô phỏng
router.post(
  '/admin/orders/:id/refund',
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.ADMIN),
  orderController.confirmRefund.bind(orderController)
);

// POST /admin/orders/:id/refund/reject — A4c: Từ chối hoàn tiền
router.post(
  '/admin/orders/:id/refund/reject',
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.ADMIN),
  orderController.rejectRefund.bind(orderController)
);

// POST /admin/orders/:id/reissue-code — A4d: Cấp lại mã lỗi
router.post(
  '/admin/orders/:id/reissue-code',
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.ADMIN),
  orderController.reissueCode.bind(orderController)
);

module.exports = router;
