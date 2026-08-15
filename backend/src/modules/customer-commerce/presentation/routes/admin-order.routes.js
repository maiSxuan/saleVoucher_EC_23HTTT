const express = require('express');
const orderController = require('../controllers/order.controller');
const { authenticateMiddleware } = require('../../../../common/middleware/authenticate.middleware');
const { authorizeMiddleware } = require('../../../../common/middleware/authorize.middleware');
const { JWT_ROLES } = require('../../../../common/constants/roles');

const router = express.Router();

// GET /admin/orders — Danh sách đơn hàng toàn hệ thống (có filter & phân trang)
router.get(
  '/',
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.ADMIN),
  orderController.listAdminOrders.bind(orderController)
);

// GET /admin/orders/:id — Chi tiết đơn hàng (đầy đủ items, codes, history)
router.get(
  '/:id',
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.ADMIN),
  orderController.getAdminOrder.bind(orderController)
);

// -----------------------------------------------------------------------
// UC-ADM-05: XỬ LÝ YÊU CẦU HỦY
// -----------------------------------------------------------------------
router.post(
  '/cancel-requests/:id/approve',
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.ADMIN),
  orderController.approveCancelRequest.bind(orderController)
);

router.post(
  '/cancel-requests/:id/reject',
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.ADMIN),
  orderController.rejectCancelRequest.bind(orderController)
);

// -----------------------------------------------------------------------
// UC-ADM-06: THỰC HIỆN HOÀN TIỀN
// -----------------------------------------------------------------------
router.post(
  '/refunds/:id/execute',
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.ADMIN),
  orderController.executeRefund.bind(orderController)
);

router.post(
  '/refunds/:id/reconcile',
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.ADMIN),
  orderController.reconcileRefund.bind(orderController)
);

// -----------------------------------------------------------------------
// UC-ADM-07: XỬ LÝ KHIẾU NẠI
// -----------------------------------------------------------------------
router.post(
  '/complaints/:id/open',
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.ADMIN),
  orderController.openComplaint.bind(orderController)
);

router.post(
  '/complaints/:id/resend-code',
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.ADMIN),
  orderController.resendComplaintCode.bind(orderController)
);

router.post(
  '/complaints/:id/reissue-code',
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.ADMIN),
  orderController.reissueComplaintCode.bind(orderController)
);

router.post(
  '/complaints/:id/approve-refund',
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.ADMIN),
  orderController.approveComplaintRefund.bind(orderController)
);

router.post(
  '/complaints/:id/reject',
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.ADMIN),
  orderController.rejectComplaint.bind(orderController)
);

// POST /admin/orders/:id/reissue-code — A4d: Cấp lại mã lỗi
router.post(
  '/:id/reissue-code',
  authenticateMiddleware,
  authorizeMiddleware(JWT_ROLES.ADMIN),
  orderController.reissueCode.bind(orderController)
);

module.exports = router;
