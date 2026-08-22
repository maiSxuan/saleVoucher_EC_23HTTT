/**
 * Purpose: Route cho đặt hàng và xem đơn hàng (Customer Commerce).
 */
const express = require("express");
const orderController = require("../controllers/order.controller");
const {
  authenticateMiddleware,
} = require("../../../../common/middleware/authenticate.middleware");
const {
  authorizeMiddleware,
} = require("../../../../common/middleware/authorize.middleware");
const { JWT_ROLES } = require("../../../../common/constants/roles");

const router = express.Router();

// --- B. QUẢN LÝ ĐƠN HÀNG (Lấy từ order module cũ) ---

// GET /orders/history — Danh sách đơn hàng của khách hàng hiện tại
// Đổi route gốc từ /customer/orders thành /orders/history cho nhất quán
router.get(
  "/history",
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.CUSTOMER),
  orderController.listCustomerOrders.bind(orderController),
);

// GET /orders/history/:id — Chi tiết 1 đơn hàng
router.get(
  "/history/:id",
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.CUSTOMER),
  orderController.getCustomerOrder.bind(orderController),
);

// POST /orders/:id/complaints — Gửi khiếu nại cho voucher trong đơn
router.post(
  "/:id/complaints",
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.CUSTOMER),
  orderController.submitComplaint.bind(orderController),
);

// POST /orders/:id/reviews — Gửi đánh giá cho voucher trong đơn
router.post(
  "/:id/reviews",
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.CUSTOMER),
  orderController.submitReview.bind(orderController),
);

// POST /orders/:id/request-cancel — Khách hàng yêu cầu hủy đơn / hoàn tiền (tên gốc customerCancelOrder)
router.post(
  "/:id/request-cancel",
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.CUSTOMER),
  orderController.commerceCancel.bind(orderController)
);

router.post(
  "/:id/pay",
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.CUSTOMER),
  orderController.repay.bind(orderController),
);

// --- A. ĐẶT HÀNG (Checkout) ---

router.post(
  "/",
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.CUSTOMER),
  orderController.create.bind(orderController),
);
router.post(
  "/review",
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.CUSTOMER),
  orderController.review.bind(orderController),
);
// Route hủy đơn ngay khi chưa checkout (tên gốc: commerceCancel)
router.post(
  "/:id/cancel",
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.CUSTOMER),
  orderController.commerceCancel.bind(orderController),
);

module.exports = router;
