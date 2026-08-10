const orderRepository = require('../../data/repositories/order.repository');
const auditLogService = require('../../../core-access/business/services/audit-log.service');

class OrderService {
  async getCustomerOrders(accountId, filters) {
    return await orderRepository.findCustomerOrders(accountId, filters);
  }

  async getCustomerOrderById(accountId, orderId) {
    const order = await orderRepository.findCustomerOrderById(accountId, orderId);
    if (!order) {
      const err = new Error('Không tìm thấy đơn hàng');
      err.statusCode = 404;
      throw err;
    }
    return order;
  }

  async getAdminOrders(filters) {
    return await orderRepository.findAdminOrders(filters);
  }

  async getAdminOrderById(orderId) {
    const order = await orderRepository.findAdminOrderById(orderId);
    if (!order) {
      const err = new Error('Không tìm thấy đơn hàng');
      err.statusCode = 404;
      throw err;
    }
    return order;
  }

  async getOrderLogs(orderId) {
    const supabase = require('../../../../config/supabase');
    const { data, error } = await supabase
      .from('log_ht')
      .select('*')
      .eq('doi_tuong', 'donhang')
      .eq('ma_doi_tuong', orderId)
      .order('thoi_diem_thuc_hien', { ascending: false });

    if (error) throw new Error(`Lỗi lấy nhật ký đơn hàng: ${error.message}`);
    return data || [];
  }

  async submitComplaint(accountId, orderId, { maVoucherMua, noiDung }) {
    // Kiểm tra khách hàng có sở hữu đơn hàng này không
    await this.getCustomerOrderById(accountId, orderId);
    const complaint = await orderRepository.insertComplaint({ maVoucherMua, noiDung, maTk: accountId });
    
    // Ghi log
    await auditLogService.log({
      actorId: accountId,
      actorRole: 'CUSTOMER',
      action: 'SUBMIT_COMPLAINT',
      targetType: 'voucher_mua',
      targetId: maVoucherMua,
      after: { noiDung },
    }).catch(() => {});

    return complaint;
  }

  async submitReview(accountId, orderId, { maVoucherMua, diem, noiDung }) {
    await this.getCustomerOrderById(accountId, orderId);
    const review = await orderRepository.insertReview({ maVoucherMua, diem, noiDung, maTk: accountId });
    
    await auditLogService.log({
      actorId: accountId,
      actorRole: 'CUSTOMER',
      action: 'SUBMIT_REVIEW',
      targetType: 'voucher_mua',
      targetId: maVoucherMua,
      after: { diem, noiDung },
    }).catch(() => {});

    return review;
  }

  async updatePaymentStatus(orderId, { newStatus, reason }, adminAccountId) {
    const result = await orderRepository.updatePaymentStatusAndGenerateCodes(orderId, newStatus, reason, adminAccountId);
    
    await auditLogService.log({
      actorId: adminAccountId,
      actorRole: 'ADMIN',
      action: 'MANUAL_CONFIRM_PAYMENT',
      targetType: 'donhang',
      targetId: orderId,
      reason,
      after: { newStatus },
    }, true);

    return result;
  }

  async cancelOrder(orderId, { reason }, adminAccountId) {
    const result = await orderRepository.cancelOrder(orderId, reason);

    await auditLogService.log({
      actorId: adminAccountId,
      actorRole: 'ADMIN',
      action: 'CANCEL_ORDER',
      targetType: 'donhang',
      targetId: orderId,
      reason,
    }, true);

    return result;
  }

  async confirmRefund(orderId, { reason }, adminAccountId) {
    const result = await orderRepository.confirmRefund(orderId, reason, adminAccountId);

    await auditLogService.log({
      actorId: adminAccountId,
      actorRole: 'ADMIN',
      action: 'CONFIRM_REFUND',
      targetType: 'donhang',
      targetId: orderId,
      reason,
    }, true);

    return result;
  }

  async rejectRefund(orderId, { reason }, adminAccountId) {
    const result = await orderRepository.rejectRefund(orderId, reason, adminAccountId);

    await auditLogService.log({
      actorId: adminAccountId,
      actorRole: 'ADMIN',
      action: 'REJECT_REFUND',
      targetType: 'donhang',
      targetId: orderId,
      reason,
    }, true);

    return result;
  }

  async reissueCode(orderId, { maVoucherMua }, adminAccountId) {
    const result = await orderRepository.reissueVoucherCode(maVoucherMua, adminAccountId);

    await auditLogService.log({
      actorId: adminAccountId,
      actorRole: 'ADMIN',
      action: 'REISSUE_VOUCHER_CODE',
      targetType: 'voucher_mua',
      targetId: result.ma_voucher_mua,
      after: { newCode: result.voucher_code },
    }, true);

    return result;
  }
}

module.exports = new OrderService();
