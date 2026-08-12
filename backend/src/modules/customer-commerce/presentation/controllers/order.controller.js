const orderService = require('../../business/services/order.service');
const { paginatedResponse } = require('../../../../common/utils/response');

class OrderController {
  // Customer Handlers
  async review(req, res, next) {
    try {
      const { voucherIds } = req.body;
      const result = await orderService.reviewOrder({
        accountId: req.user.accountId,
        voucherIds,
      });
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { voucherIds, paymentMethod } = req.body;
      const result = await orderService.createOrder({
        accountId: req.user.accountId,
        voucherIds,
        paymentMethod,
        ipAddr: req.ip,
      });
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async commerceCancel(req, res, next) {
    try {
      const { id } = req.params;
      const result = await orderService.cancelOrderCustomer({
        accountId: req.user.accountId,
        orderId: id,
      });
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async repay(req, res, next) {
    try {
      const accountId = req.user.accountId || req.user.id;
      const { id } = req.params;
      const { paymentMethod } = req.body;
      const result = await orderService.repayOrder({
        accountId,
        orderId: id,
        paymentMethod,
        ipAddr: req.ip,
      });
      return res.json({ success: true, data: result });
    } catch (e) {
      next(e);
    }
  }

  async listCustomerOrders(req, res, next) {
    try {
      const accountId = req.user.accountId || req.user.id;
      const { status, page, limit } = req.query;
      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 10;
      const result = await orderService.getCustomerOrders(accountId, { status, page: pageNum, limit: limitNum });
      return paginatedResponse(res, result.orders, { page: pageNum, limit: limitNum, total: result.total });
    } catch (e) {
      next(e);
    }
  }

  async getCustomerOrder(req, res, next) {
    try {
      const accountId = req.user.accountId || req.user.id;
      const { id } = req.params;
      const order = await orderService.getCustomerOrderById(accountId, id);
      return res.json({ success: true, data: order });
    } catch (e) {
      next(e);
    }
  }

  async submitComplaint(req, res, next) {
    try {
      const accountId = req.user.accountId || req.user.id;
      const { id } = req.params;
      const { maVoucherMua, noiDung } = req.body;
      const result = await orderService.submitComplaint(accountId, id, { maVoucherMua, noiDung });
      return res.json({ success: true, data: result, message: 'Đã gửi phản ánh/khiếu nại thành công' });
    } catch (e) {
      next(e);
    }
  }

  async submitReview(req, res, next) {
    try {
      const accountId = req.user.accountId || req.user.id;
      const { id } = req.params;
      const { maVoucherMua, diem, noiDung } = req.body;
      const result = await orderService.submitReview(accountId, id, { maVoucherMua, diem, noiDung });
      return res.json({ success: true, data: result, message: 'Đã ghi nhận đánh giá thành công' });
    } catch (e) {
      next(e);
    }
  }

  // Admin Handlers
  async listAdminOrders(req, res, next) {
    try {
      const { search, orderStatus, paymentStatus, voucherCodeStatus, page, limit } = req.query;
      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 10;
      const result = await orderService.getAdminOrders({ search, orderStatus, paymentStatus, voucherCodeStatus, page: pageNum, limit: limitNum });
      return paginatedResponse(res, result.orders, { page: pageNum, limit: limitNum, total: result.total });
    } catch (e) {
      next(e);
    }
  }

  async getAdminOrder(req, res, next) {
    try {
      const { id } = req.params;
      const order = await orderService.getAdminOrderById(id);
      return res.json({ success: true, data: order });
    } catch (e) {
      next(e);
    }
  }

  async getOrderLogs(req, res, next) {
    try {
      const { id } = req.params;
      const logs = await orderService.getOrderLogs(id);
      return res.json({ success: true, data: logs });
    } catch (e) {
      next(e);
    }
  }

  async updatePaymentStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { newStatus, reason } = req.body;
      const adminAccountId = req.user.accountId || req.user.id;
      const result = await orderService.updatePaymentStatus(id, { newStatus, reason }, adminAccountId);
      return res.json({ success: true, data: result, message: 'Đã cập nhật trạng thái thanh toán' });
    } catch (e) {
      next(e);
    }
  }

  async cancelOrder(req, res, next) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const adminAccountId = req.user.accountId || req.user.id;
      const result = await orderService.cancelOrder(id, { reason }, adminAccountId);
      return res.json({ success: true, data: result, message: 'Đã chuyển đơn hàng sang chờ hoàn tiền' });
    } catch (e) {
      next(e);
    }
  }

  async customerCancelOrder(req, res, next) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const customerAccountId = req.user.accountId || req.user.id;
      const order = await orderService.getCustomerOrderById(customerAccountId, id);
      if (order.orderStatus !== 'Da thanh toan') {
        return res.status(400).json({ success: false, message: "Chỉ có thể yêu cầu hủy đơn cho đơn hàng đã thanh toán" });
      }
      const result = await orderService.cancelOrder(id, { reason: reason || 'Khách hàng yêu cầu hủy đơn và hoàn tiền' }, customerAccountId);
      return res.json({ success: true, data: result, message: 'Đã gửi yêu cầu hủy đơn, đơn hàng chuyển sang chờ hoàn tiền' });
    } catch (e) {
      next(e);
    }
  }

  async confirmRefund(req, res, next) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const adminAccountId = req.user.accountId || req.user.id;
      const result = await orderService.confirmRefund(id, { reason }, adminAccountId);
      return res.json({ success: true, data: result, message: 'Đã ghi nhận hoàn tiền mô phỏng thành công' });
    } catch (e) {
      next(e);
    }
  }

  async rejectRefund(req, res, next) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const adminAccountId = req.user.accountId || req.user.id;
      const result = await orderService.rejectRefund(id, { reason }, adminAccountId);
      return res.json({ success: true, data: result, message: 'Đã từ chối yêu cầu hoàn tiền' });
    } catch (e) {
      next(e);
    }
  }

  async reissueCode(req, res, next) {
    try {
      const { id } = req.params;
      const { maVoucherMua } = req.body;
      const adminAccountId = req.user.accountId || req.user.id;
      const result = await orderService.reissueCode(id, { maVoucherMua }, adminAccountId);
      return res.json({ success: true, data: result, message: 'Đã cấp lại mã voucher mới thành công' });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new OrderController();
