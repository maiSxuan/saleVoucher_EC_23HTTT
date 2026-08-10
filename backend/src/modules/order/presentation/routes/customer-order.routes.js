const express = require('express');
const orderController = require('../controllers/order.controller');
const { authenticateMiddleware } = require('../../../../common/middleware/authenticate.middleware');
const { authorizeMiddleware } = require('../../../../common/middleware/authorize.middleware');
const { JWT_ROLES } = require('../../../../common/constants/roles');

const router = express.Router();

// GET /customer/orders — Danh sách đơn hàng của khách hàng hiện tại
router.get(
  '/customer/orders',
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.CUSTOMER, JWT_ROLES.ADMIN),
  orderController.listCustomerOrders.bind(orderController)
);

// GET /customer/orders/:id — Chi tiết 1 đơn hàng
router.get(
  '/customer/orders/:id',
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.CUSTOMER, JWT_ROLES.ADMIN),
  orderController.getCustomerOrder.bind(orderController)
);

// POST /customer/orders/:id/complaints — Gửi khiếu nại cho voucher trong đơn
router.post(
  '/customer/orders/:id/complaints',
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.CUSTOMER),
  orderController.submitComplaint.bind(orderController)
);

// POST /customer/orders/:id/reviews — Gửi đánh giá cho voucher trong đơn
router.post(
  '/customer/orders/:id/reviews',
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.CUSTOMER),
  orderController.submitReview.bind(orderController)
);

// POST /customer/orders/:id/cancel — Khách hàng yêu cầu hủy đơn / hoàn tiền
router.post(
  '/customer/orders/:id/cancel',
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.CUSTOMER),
  orderController.customerCancelOrder.bind(orderController)
);

module.exports = router;
