const orderService = require('../../business/services/order.service');
const { paginatedResponse } = require('../../../../common/utils/response');

class OrderController {
  // Customer Handlers
  async review(req, res, next) {
    try {
      const accountId = req.user.accountId || req.user.id;
      // Chấp nhận cả contract chuẩn { voucherIds } và body mảng từ client cũ.
      const voucherIds = Array.isArray(req.body) ? req.body : req.body?.voucherIds;
      const result = await orderService.reviewOrder({ accountId, voucherIds });
      return res.json({ success: true, data: result });
    } catch (e) {
      next(e);
    }
  }

  async create(req, res, next) {
    try {
      const accountId = req.user.accountId || req.user.id;
      const { voucherIds, paymentMethod } = req.body;
      const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const result = await orderService.createOrder({ accountId, voucherIds, paymentMethod, ipAddr });
      return res.json({ success: true, data: result });
    } catch (e) {
      next(e);
    }
  }

  async commerceCancel(req, res, next) {
    try {
      const accountId = req.user.accountId || req.user.id;
      const { id } = req.params;
      const { reason } = req.body;
      const result = await orderService.cancelOrderCustomer({ accountId, orderId: id, reason });
      return res.json({ success: true, data: result, message: 'Đã gửi yêu cầu hủy đơn hàng' });
    } catch (e) {
      next(e);
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
      return res.json({
        success: true,
        data: result.orders,
        actionCenter: result.actionCenter,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: result.total,
          totalPages: Math.ceil(result.total / limitNum),
        },
      });
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

  // -----------------------------------------------------------------------
  // UC-ADM-05: XỬ LÝ YÊU CẦU HỦY
  // -----------------------------------------------------------------------
  async approveCancelRequest(req, res, next) {
    try {
      const { id } = req.params; // ma_yc_huy
      const { reason } = req.body;
      const adminAccountId = req.user.accountId || req.user.id;
      const result = await orderService.approveYeuCauHuy(id, reason, adminAccountId);
      return res.json({ success: true, data: result, message: 'Đã chấp nhận yêu cầu hủy' });
    } catch (e) {
      next(e);
    }
  }

  async rejectCancelRequest(req, res, next) {
    try {
      const { id } = req.params; // ma_yc_huy
      const { reason } = req.body;
      const adminAccountId = req.user.accountId || req.user.id;
      const result = await orderService.rejectYeuCauHuy(id, reason, adminAccountId);
      return res.json({ success: true, data: result, message: 'Đã từ chối yêu cầu hủy' });
    } catch (e) {
      next(e);
    }
  }

  // -----------------------------------------------------------------------
  // UC-ADM-06: THỰC HIỆN HOÀN TIỀN
  // -----------------------------------------------------------------------
  async executeRefund(req, res, next) {
    try {
      const { id } = req.params; // ma_hoan_tien
      const adminAccountId = req.user.accountId || req.user.id;
      const result = await orderService.executeRefund(id, adminAccountId);
      return res.json({ success: true, data: result, message: 'Đã xử lý hoàn tiền' });
    } catch (e) {
      next(e);
    }
  }

  // -----------------------------------------------------------------------
  // UC-ADM-07: XỬ LÝ KHIẾU NẠI
  // -----------------------------------------------------------------------
  async openComplaint(req, res, next) {
    try {
      const { id } = req.params; // ma_khieu_nai
      const adminAccountId = req.user.accountId || req.user.id;
      const result = await orderService.openComplaint(id, adminAccountId);
      return res.json({ success: true, data: result, message: 'Đã mở khiếu nại' });
    } catch (e) {
      next(e);
    }
  }

  async resendComplaintCode(req, res, next) {
    try {
      const { id } = req.params; // ma_khieu_nai
      const adminAccountId = req.user.accountId || req.user.id;
      const result = await orderService.resendCode(id, adminAccountId);
      return res.json({ success: true, data: result, message: 'Đã gửi lại mã voucher' });
    } catch (e) {
      next(e);
    }
  }

  async reissueComplaintCode(req, res, next) {
    try {
      const { id } = req.params; // ma_khieu_nai
      const adminAccountId = req.user.accountId || req.user.id;
      const result = await orderService.reissueCodeFromComplaint(id, adminAccountId);
      return res.json({ success: true, data: result, message: 'Đã cấp lại mã mới' });
    } catch (e) {
      next(e);
    }
  }

  async approveComplaintRefund(req, res, next) {
    try {
      const { id } = req.params; // ma_khieu_nai
      const { reason } = req.body;
      const adminAccountId = req.user.accountId || req.user.id;
      const result = await orderService.approveComplaintRefund(id, reason, adminAccountId);
      return res.json({ success: true, data: result, message: 'Đã chấp nhận khiếu nại và chuyển sang hoàn tiền' });
    } catch (e) {
      next(e);
    }
  }

  async rejectComplaint(req, res, next) {
    try {
      const { id } = req.params; // ma_khieu_nai
      const { reason } = req.body;
      const adminAccountId = req.user.accountId || req.user.id;
      const result = await orderService.rejectComplaint(id, reason, adminAccountId);
      return res.json({ success: true, data: result, message: 'Đã từ chối khiếu nại' });
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
