const cartRepository = require("../../data/repositories/cart.repository");
const orderItemRepository = require("../../data/repositories/order-item.repository");
const { computeAvailability } = require("./voucher-aivailability.util");
const PaymentService = require("./payment.service");
const orderRepository = require('../../data/repositories/order.repository');
const auditLogService = require('../../../core-access/business/services/audit-log.service');
const OrderStatus = require('../../../../common/constants/order-status');
const PaymentStatus = require('../../../../common/constants/payment-status');
const VoucherCodeStatus = require('../../../../common/constants/issued-voucher-status');
const LogResult = require('../../../../common/constants/log-result');
const { sendNotificationEmail } = require('../../../../common/utils/mailer');
const vnpayGateway = require('./gateways/vnpay.gateway');
const paypalGateway = require('./gateways/paypal.gateway');

class OrderService {
  // kiểm tra khả dụng, tính tổng tiền — CHƯA ghi DB
  async reviewOrder({ accountId, voucherIds }) {
    if (!Array.isArray(voucherIds) || voucherIds.length === 0) {
      const err = new Error("Giỏ hàng trống, không thể tạo đơn hàng");
      err.status = 400;
      throw err;
    }

    const cartId = await cartRepository.findOrCreateCart(accountId);
    const rows = await cartRepository.getItems(cartId);
    const selected = rows.filter(
      (r) => voucherIds.includes(r.ma_voucher) && r.voucher,
    );

    if (selected.length !== voucherIds.length) {
      const err = new Error("Một số voucher không còn trong giỏ hàng");
      err.status = 404;
      throw err;
    }

    const items = selected.map((r) => {
      const v = r.voucher;
      const originalPrice = Number(v.gia_goc);
      const salePrice = originalPrice - (Number(v.gia_tri_giam) || 0);
      const remaining = v.so_luong_phat_hanh - v.so_luong_da_ban;
      return {
        voucherId: v.ma_voucher,
        name: v.ten_voucher,
        image: v.hinh_anh_url,
        quantity: r.so_luong,
        salePrice,
        subtotal: salePrice * r.so_luong,
        availability: computeAvailability(v),
        remaining,
      };
    });

    const invalidItems = items.filter(
      (i) => i.availability !== "selling" || i.quantity > i.remaining,
    );
    if (invalidItems.length > 0) {
      const err = new Error(
        "Một hoặc nhiều voucher không còn đủ số lượng để đặt mua",
      ); // A3
      err.status = 409;
      err.details = { invalidItems: invalidItems.map((i) => i.voucherId) };
      throw err;
    }

    const total = items.reduce((sum, i) => sum + i.subtotal, 0);
    return { items, total };
  }

  //tạo đơn hàng + tạo link thanh toán (CHƯA xác nhận thành công/thất bại)
  async createOrder({ accountId, voucherIds, paymentMethod, ipAddr }) {
    const { items, total } = await this.reviewOrder({ accountId, voucherIds });
    const order = await orderRepository.create({ accountId, total });
    await orderItemRepository.createMany(order.ma_dh, items);

    // Giữ nguyên giỏ cho đến khi gateway xác nhận thanh toán thành công.
    // _finalizePayment sẽ xóa đúng các item; nếu khách hủy hoặc gateway lỗi,
    // họ vẫn có thể quay lại giỏ và thử lại.
    return PaymentService._startPayment({
      order,
      total,
      paymentMethod,
      ipAddr,
    });
  }

  // Khách hàng hủy giao dịch
  // - Đơn chưa thanh toán: hủy trực tiếp
  // - Đơn đã thanh toán: tạo YEUCAUHUY để Admin duyệt (UC-ADM-05)
  async cancelOrderCustomer({ accountId, orderId, reason }) {
    const order = await orderRepository.findById(orderId, accountId);
    if (!order) {
      const err = new Error('Không tìm thấy đơn hàng');
      err.status = 404;
      throw err;
    }
    if (order.trang_thai === OrderStatus.DA_THANH_TOAN) {
      // Tạo yêu cầu hủy cho admin duyệt
      const ycHuy = await orderRepository.createCancelRequest(orderId, reason, accountId);
      await auditLogService.log({
        actorId: accountId,
        actorRole: 'CUSTOMER',
        action: 'REQUEST_CANCEL_ORDER',
        targetType: 'donhang',
        targetId: orderId,
        reason,
        after: { trang_thai: 'Cho xu ly' },
      }).catch(() => {});
      return { type: 'yeu_cau_huy', data: ycHuy };
    }
    // Chưa thanh toán → hủy trực tiếp
    await orderRepository.updateStatus(orderId, OrderStatus.DA_HUY);

    await auditLogService
      .log({
        actorId: accountId,
        actorRole: "CUSTOMER",
        action: "CANCEL_ORDER_NO_REFUND",
        targetType: "donhang",
        targetId: orderId,
        before: { orderStatus: order.trang_thai },
        after: { orderStatus: OrderStatus.DA_HUY },
        reason: "Khách hàng hủy đơn hàng chưa thanh toán",
      })
      .catch(() => {});

    return { type: 'huy_truc_tiep', orderId, status: OrderStatus.DA_HUY };
  }

  async repayOrder({ accountId, orderId, paymentMethod, ipAddr }) {
    const order = await orderRepository.findById(orderId, accountId);
    if (!order) {
      const err = new Error('Không tìm thấy đơn hàng');
      err.status = 404;
      throw err;
    }
    if (order.trang_thai !== OrderStatus.CHO_THANH_TOAN) {
      const err = new Error(
        "Chỉ có thể thanh toán lại đơn hàng đang ở trạng thái Chờ thanh toán",
      );
      err.status = 409;
      throw err;
    }

    return PaymentService._startPayment({
      order,
      total: order.tong_tien,
      paymentMethod,
      ipAddr,
    });
  }

  async getCustomerOrders(accountId, filters) {
    return await orderRepository.findCustomerOrders(accountId, filters);
  }

  async getCustomerOrderById(accountId, orderId) {
    const order = await orderRepository.findCustomerOrderById(
      accountId,
      orderId,
    );
    if (!order) {
      const err = new Error("Không tìm thấy đơn hàng");
      err.statusCode = 404;
      throw err;
    }
    return order;
  }

  async getAdminOrders(filters) {
    return await orderRepository.findAdminOrders(filters);
  }

  async getAdminOrderById(orderId, adminAccountId = null) {
    const order = await orderRepository.findAdminOrderById(orderId);
    if (!order) {
      const err = new Error("Không tìm thấy đơn hàng");
      err.statusCode = 404;
      throw err;
    }
    if (adminAccountId) {
      await auditLogService.log({
        actorId: adminAccountId,
        actorRole: 'ADMIN',
        action: 'VIEW_ORDER_DETAIL',
        targetType: 'donhang',
        targetId: orderId,
        after: { accessType: 'read_only' },
        reason: 'Kiểm tra chi tiết đơn hàng',
      }).catch(() => {});
    }
    return order;
  }

  async getOrderLogs(orderId) {
    const supabase = require("../../../../config/supabase");
    const order = await orderRepository.findAdminOrderById(orderId);
    if (!order) return [];

    const targets = [
      { types: ['donhang', 'DONHANG'], ids: [orderId] },
      { types: ['yeucauhuy'], ids: (order.cancelRequests || []).map((item) => item.id) },
      { types: ['hoantien'], ids: (order.refunds || []).map((item) => item.id) },
      { types: ['khieunai'], ids: (order.complaints || []).map((item) => item.id) },
      { types: ['voucher_mua'], ids: (order.codes || []).map((item) => item.id) },
    ].filter((target) => target.ids.length > 0);

    const results = await Promise.all(targets.map(async (target) => {
      const { data, error } = await supabase
        .from('log_ht')
        .select('*')
        .in('doi_tuong', target.types)
        .in('ma_doi_tuong', target.ids);
      if (error) throw error;
      return data || [];
    }));

    return results
      .flat()
      .sort((left, right) => new Date(right.thoi_diem_thuc_hien) - new Date(left.thoi_diem_thuc_hien));
  }

  async submitComplaint(accountId, orderId, { maVoucherMua, noiDung }) {
    // Kiểm tra khách hàng có sở hữu đơn hàng này không
    await this.getCustomerOrderById(accountId, orderId);
    const complaint = await orderRepository.insertComplaint({
      maVoucherMua,
      noiDung,
      maTk: accountId,
    });

    // Ghi log
    await auditLogService
      .log({
        actorId: accountId,
        actorRole: "CUSTOMER",
        action: "SUBMIT_COMPLAINT",
        targetType: "voucher_mua",
        targetId: maVoucherMua,
        after: { noiDung },
      })
      .catch(() => {});

    return complaint;
  }

  async submitReview(accountId, orderId, { maVoucherMua, diem, noiDung }) {
    await this.getCustomerOrderById(accountId, orderId);
    const review = await orderRepository.insertReview({
      maVoucherMua,
      diem,
      noiDung,
      maTk: accountId,
    });

    await auditLogService
      .log({
        actorId: accountId,
        actorRole: "CUSTOMER",
        action: "SUBMIT_REVIEW",
        targetType: "voucher_mua",
        targetId: maVoucherMua,
        after: { diem, noiDung },
      })
      .catch(() => {});

    return review;
  }

  async updatePaymentStatus(orderId, { newStatus, reason }, adminAccountId) {
    if (!reason || !reason.trim()) throw new Error("Lý do không được để trống");

    const result = await orderRepository.updatePaymentStatusAndGenerateCodes(
      orderId,
      newStatus,
      reason,
      adminAccountId,
    );

    await auditLogService.log(
      {
        actorId: adminAccountId,
        actorRole: "ADMIN",
        action: "MANUAL_CONFIRM_PAYMENT",
        targetType: "donhang",
        targetId: orderId,
        reason,
        after: { newStatus },
      },
      true,
    );

    return result;
  }

  async cancelOrder(orderId, { reason }, adminAccountId) {
    if (!reason || !reason.trim())
      throw new Error("Lý do hủy không được để trống");

    const order = await this.getAdminOrderById(orderId);
    if (order.orderStatus !== OrderStatus.DA_THANH_TOAN) {
      throw new Error('Chỉ hủy được đơn hàng đang ở trạng thái Đã thanh toán');
    }
    if (order.paymentStatus !== PaymentStatus.THANH_CONG) {
      throw new Error("Chỉ hủy được đơn đã thanh toán");
    }
    if (
      order.voucherCodeStatus !== "not_issued" &&
      order.voucherCodeStatus !== VoucherCodeStatus.LOI_SINH_MA
    ) {
      throw new Error("Không thể hủy đơn đã phát hành mã thành công");
    }

    const result = await orderRepository.cancelOrder(orderId, reason);

    await auditLogService.log(
      {
        actorId: adminAccountId,
        actorRole: "ADMIN",
        action: "CANCEL_ORDER",
        targetType: "donhang",
        targetId: orderId,
        reason,
      },
      true,
    );

    return result;
  }

  async confirmRefund(orderId, { reason }, adminAccountId) {
    if (!reason || !reason.trim())
      throw new Error("Lý do hoàn tiền không được để trống");

    const order = await this.getAdminOrderById(orderId);
    if (order.orderStatus !== OrderStatus.CHO_HOAN_TIEN) {
      throw new Error("Đơn hàng không ở trạng thái Chờ hoàn tiền");
    }

    const result = await orderRepository.confirmRefund(
      orderId,
      reason,
      adminAccountId,
    );

    await auditLogService.log(
      {
        actorId: adminAccountId,
        actorRole: "ADMIN",
        action: "CONFIRM_REFUND",
        targetType: "donhang",
        targetId: orderId,
        reason,
      },
      true,
    );

    return result;
  }

  async rejectRefund(orderId, { reason }, adminAccountId) {
    if (!reason || !reason.trim())
      throw new Error("Lý do từ chối không được để trống");

    const order = await this.getAdminOrderById(orderId);
    if (order.orderStatus !== OrderStatus.CHO_HOAN_TIEN) {
      throw new Error("Đơn hàng không ở trạng thái Chờ hoàn tiền");
    }

    const result = await orderRepository.rejectRefund(
      orderId,
      reason,
      adminAccountId,
    );

    await auditLogService.log(
      {
        actorId: adminAccountId,
        actorRole: "ADMIN",
        action: "REJECT_REFUND",
        targetType: "donhang",
        targetId: orderId,
        reason,
      },
      true,
    );

    return result;
  }

  // -----------------------------------------------------------------------
  // UC-ADM-05: CHẤP NHẬN YÊU CẦU HỦY
  // -----------------------------------------------------------------------
  async approveYeuCauHuy(maYcHuy, reason, adminAccountId) {
    if (!reason || !reason.trim()) throw new Error('Lý do chấp nhận không được để trống');
    const result = await orderRepository.approveYeuCauHuy(maYcHuy, reason, adminAccountId);
    await auditLogService.log({
      actorId: adminAccountId, actorRole: 'ADMIN',
      action: 'APPROVE_CANCEL_REQUEST', targetType: 'yeucauhuy', targetId: maYcHuy,
      reason, before: { trang_thai: 'Cho xu ly' }, after: { trang_thai: 'Da chap nhan' },
    }, true);
    return result;
  }

  // UC-ADM-05: TỪ CHỐI YÊU CẦU HỦY (A1)
  async rejectYeuCauHuy(maYcHuy, reason, adminAccountId) {
    if (!reason || !reason.trim()) throw new Error('Lý do từ chối không được để trống');
    const result = await orderRepository.rejectYeuCauHuy(maYcHuy, reason, adminAccountId);
    await auditLogService.log({
      actorId: adminAccountId, actorRole: 'ADMIN',
      action: 'REJECT_CANCEL_REQUEST', targetType: 'yeucauhuy', targetId: maYcHuy,
      reason, before: { trang_thai: 'Cho xu ly' }, after: { trang_thai: 'Da tu choi' },
    }, true);

    let notificationSent = true;
    try {
      const customer = await orderRepository.getOrderCustomerDeliveryContext(result.orderId);
      await sendNotificationEmail(customer.customerEmail, {
        subject: `EC Voucher - Kết quả yêu cầu hủy đơn ${customer.orderId}`,
        title: 'Yêu cầu hủy đơn đã bị từ chối',
        message: `Chào ${customer.customerName || 'bạn'}, yêu cầu hủy ${maYcHuy} không được chấp nhận. Lý do: ${reason}`,
      });
    } catch (error) {
      notificationSent = false;
      await auditLogService.log({
        actorId: adminAccountId, actorRole: 'ADMIN',
        action: 'NOTIFY_CANCEL_REJECTION', targetType: 'yeucauhuy', targetId: maYcHuy,
        result: LogResult.THAT_BAI, reason: error.message,
      });
    }
    return { ...result, notificationSent };
  }

  // -----------------------------------------------------------------------
  // UC-ADM-06: THỰC HIỆN HOÀN TIỀN QUA SANDBOX
  // -----------------------------------------------------------------------
  async executeRefund(maHoanTien, adminAccountId) {
    const supabase = require('../../../../config/supabase');
    const { data: ht } = await supabase.from('hoantien').select('*').eq('ma_hoan_tien', maHoanTien).single();
    if (!ht) throw new Error('Không tìm thấy bản ghi hoàn tiền');
    if (ht.trang_thai !== 'Cho xu ly') throw new Error('Hoàn tiền không ở trạng thái Chờ xử lý');

    const { data: payment } = await supabase.from('thanhtoan').select('*').eq('ma_thanh_toan', ht.ma_thanh_toan).single();
    if (!payment) throw new Error('Không tìm thấy giao dịch thanh toán gốc (E5)');
    const rawGateway = String(payment.phuong_thuc_tt || '').toLowerCase();
    const gateway = rawGateway.includes('paypal')
      ? 'paypal'
      : rawGateway.includes('vnpay')
        ? 'vnpay'
        : rawGateway;
    if (!['vnpay', 'paypal'].includes(gateway)) {
      throw new Error(`Cổng thanh toán không hợp lệ: ${payment.phuong_thuc_tt || 'không xác định'}`);
    }

    let maGdGoc = payment.ma_gd_goc;
    if (!maGdGoc && gateway === 'paypal') {
      maGdGoc = await paypalGateway.findCaptureIdByCustomId({
        paymentId: payment.ma_thanh_toan,
        paidAt: payment.thoi_gian_tt,
      });
      if (maGdGoc) {
        const { error: recoverError } = await supabase.from('thanhtoan')
          .update({ ma_gd_goc: maGdGoc })
          .eq('ma_thanh_toan', payment.ma_thanh_toan)
          .is('ma_gd_goc', null);
        if (recoverError) throw new Error(`Không thể lưu Capture ID đã đối soát: ${recoverError.message}`);
        await auditLogService.log({
          actorId: adminAccountId,
          actorRole: 'ADMIN',
          action: 'RECOVER_PAYMENT_TRANSACTION_ID',
          targetType: 'thanhtoan',
          targetId: payment.ma_thanh_toan,
          before: { ma_gd_goc: null },
          after: { ma_gd_goc: maGdGoc, gateway },
        });
      }
    }
    if (!maGdGoc) {
      const err = new Error('Giao dịch thành công cũ chưa lưu mã giao dịch gốc và không thể tự đối soát. Vui lòng kiểm tra trên cổng thanh toán trước khi hoàn tiền.');
      err.status = 409;
      throw err;
    }

    // Chuyển có điều kiện → Đang xử lý để hai request đồng thời không thể gọi
    // Sandbox hai lần cho cùng một bản ghi hoàn tiền.
    const { data: lockedRefund, error: lockError } = await supabase
      .from('hoantien')
      .update({ trang_thai: 'Dang xu ly', ma_tk: adminAccountId })
      .eq('ma_hoan_tien', maHoanTien)
      .eq('trang_thai', 'Cho xu ly')
      .select('ma_hoan_tien')
      .maybeSingle();
    if (lockError) throw new Error(`Không thể khóa yêu cầu hoàn tiền: ${lockError.message}`);
    if (!lockedRefund) throw new Error('Yêu cầu hoàn tiền đang được xử lý bởi một thao tác khác');

    let sandboxResult = { isSuccess: false, isTimeout: false, refundId: null, responseCode: 'UNKNOWN' };
    try {
      if (gateway === 'vnpay') {
        sandboxResult = await vnpayGateway.refundPayment({
          paymentId: payment.ma_thanh_toan,
          maGdGoc,
          amount: ht.so_tien,
          reason: ht.ly_do,
          transactionDate: payment.thoi_gian_tt,
          refundRequestId: maHoanTien,
          createBy: adminAccountId,
        });
      } else if (gateway === 'paypal') {
        sandboxResult = await paypalGateway.refundCapture({
          captureId: maGdGoc,
          amountVnd: ht.so_tien,
          reason: ht.ly_do,
          refundRequestId: maHoanTien,
        });
      }
    } catch (err) {
      if (!err.isTimeout) {
        // E1: lỗi trước khi gửi được lệnh refund (ví dụ không xác thực/kết nối
        // được Sandbox) phải trả bản ghi về Chờ xử lý để Admin có thể thử lại.
        await supabase.from('hoantien')
          .update({ trang_thai: 'Cho xu ly', ma_tk: ht.ma_tk || null })
          .eq('ma_hoan_tien', maHoanTien)
          .eq('trang_thai', 'Dang xu ly');

        await auditLogService.log({
          actorId: adminAccountId, actorRole: 'ADMIN',
          action: 'EXECUTE_REFUND_SANDBOX', targetType: 'hoantien', targetId: maHoanTien,
          result: LogResult.THAT_BAI,
          before: { trang_thai: 'Cho xu ly' },
          after: { outcome: 'khong_ket_noi', gateway, maGdGoc },
          reason: err.message,
        }, true);

        return { outcome: 'khong_ket_noi', refundId: null, responseCode: err.message };
      }
      sandboxResult = { isSuccess: false, isTimeout: true, refundId: null, responseCode: err.message };
    }

    let outcome;
    try {
      const res = await orderRepository.executeRefundViaSandbox(maHoanTien, adminAccountId, sandboxResult);
      outcome = res.outcome;
    } catch (err) {
      outcome = err.outcome || 'can_kiem_tra';
    }

    await auditLogService.log({
      actorId: adminAccountId, actorRole: 'ADMIN',
      action: 'EXECUTE_REFUND_SANDBOX', targetType: 'hoantien', targetId: maHoanTien,
      before: { trang_thai: 'Cho xu ly' },
      after: { outcome, gateway, maGdGoc, refundId: sandboxResult.refundId, responseCode: sandboxResult.responseCode },
    }, true);

    return { outcome, refundId: sandboxResult.refundId, responseCode: sandboxResult.responseCode };
  }

  // UC-ADM-07: MỬ KHIẾU NẠI
  async openComplaint(maKhieuNai, adminAccountId) {
    const result = await orderRepository.openComplaint(maKhieuNai, adminAccountId);
    await auditLogService.log({
      actorId: adminAccountId, actorRole: 'ADMIN',
      action: 'OPEN_COMPLAINT', targetType: 'khieunai', targetId: maKhieuNai,
      before: { trang_thai: 'Moi' }, after: { trang_thai: 'Dang xu ly' },
    }, true);
    return result;
  }

  // UC-ADM-07: GỬi LẠI MÃ (A1)
  async resendCode(maKhieuNai, adminAccountId) {
    const pendingDelivery = await orderRepository.resendComplaintCode(maKhieuNai, adminAccountId);

    try {
      const context = await orderRepository.getComplaintDeliveryContext(maKhieuNai);
      await sendNotificationEmail(context.customerEmail, {
        subject: `EC Voucher - Gửi lại mã cho đơn ${context.orderId}`,
        title: 'Voucher code của bạn',
        message: `Chào ${context.customerName || 'bạn'}, mã voucher theo khiếu nại ${maKhieuNai} được gửi lại bên dưới.`,
        voucherCode: pendingDelivery.voucherCode,
      });
    } catch (error) {
      await auditLogService.log({
        actorId: adminAccountId, actorRole: 'ADMIN',
        action: 'RESEND_VOUCHER_CODE', targetType: 'khieunai', targetId: maKhieuNai,
        result: LogResult.THAT_BAI,
        after: { voucherCode: pendingDelivery.voucherCode, delivery: 'That bai' },
        reason: error.message,
      });
      throw new Error(`Không thể gửi lại voucher code; khiếu nại vẫn đang xử lý. ${error.message}`);
    }

    const result = await orderRepository.completeComplaintCodeDelivery(
      maKhieuNai,
      pendingDelivery.voucherPurchaseId,
      pendingDelivery.voucherCode,
      adminAccountId,
    );
    await auditLogService.log({
      actorId: adminAccountId, actorRole: 'ADMIN',
      action: 'RESEND_VOUCHER_CODE', targetType: 'khieunai', targetId: maKhieuNai,
      after: { voucherCode: result.voucherCode, delivery: 'Thanh cong', trang_thai_kn: 'Da xu ly' },
    }, true);
    return result;
  }

  // UC-ADM-07: CẤP LẠI MÃ MỚI (A2)
  async reissueCodeFromComplaint(maKhieuNai, adminAccountId) {
    const result = await orderRepository.reissueComplaintCode(maKhieuNai, adminAccountId);

    try {
      const context = await orderRepository.getComplaintDeliveryContext(maKhieuNai);
      await sendNotificationEmail(context.customerEmail, {
        subject: `EC Voucher - Mã mới cho đơn ${context.orderId}`,
        title: 'Voucher code mới của bạn',
        message: `Chào ${context.customerName || 'bạn'}, EC Voucher đã cấp lại mã mới cho khiếu nại ${maKhieuNai}.`,
        voucherCode: result?.voucher_code,
      });
    } catch (error) {
      await auditLogService.log({
        actorId: adminAccountId, actorRole: 'ADMIN',
        action: 'REISSUE_CODE_FROM_COMPLAINT', targetType: 'khieunai', targetId: maKhieuNai,
        result: LogResult.THAT_BAI,
        after: { newCode: result?.voucher_code, delivery: 'That bai', trang_thai_kn: 'Dang xu ly' },
        reason: error.message,
      });
      throw new Error(`Đã cấp mã mới nhưng chưa gửi được cho khách; khiếu nại vẫn đang xử lý. ${error.message}`);
    }

    await orderRepository.completeComplaintCodeDelivery(
      maKhieuNai,
      result.ma_voucher_mua,
      result.voucher_code,
      adminAccountId,
    );
    await auditLogService.log({
      actorId: adminAccountId, actorRole: 'ADMIN',
      action: 'REISSUE_CODE_FROM_COMPLAINT', targetType: 'khieunai', targetId: maKhieuNai,
      after: { newCode: result?.voucher_code, delivery: 'Thanh cong', trang_thai_kn: 'Da xu ly' },
    }, true);
    return result;
  }

  // UC-ADM-07: CHẤP NHẬN KHIẾU NẠI → HOÀN TIỀN (A3)
  async approveComplaintRefund(maKhieuNai, reason, adminAccountId) {
    if (!reason || !reason.trim()) throw new Error('Lý do hoàn tiền không được để trống');
    const result = await orderRepository.approveComplaintRefund(maKhieuNai, reason, adminAccountId);
    await auditLogService.log({
      actorId: adminAccountId, actorRole: 'ADMIN',
      action: 'APPROVE_COMPLAINT_REFUND', targetType: 'khieunai', targetId: maKhieuNai,
      reason, after: { trang_thai_don_hang: 'Cho hoan tien', ma_hoan_tien: result.hoanTien?.ma_hoan_tien },
    }, true);
    return result;
  }

  // UC-ADM-07: TỪ CHỐI KHIẾU NẠI (A4)
  async rejectComplaint(maKhieuNai, reason, adminAccountId) {
    if (!reason || !reason.trim()) throw new Error('Lý do từ chối không được để trống');
    const result = await orderRepository.rejectComplaint(maKhieuNai, reason, adminAccountId);
    await auditLogService.log({
      actorId: adminAccountId, actorRole: 'ADMIN',
      action: 'REJECT_COMPLAINT', targetType: 'khieunai', targetId: maKhieuNai,
      reason, before: { trang_thai: 'Dang xu ly' }, after: { trang_thai: 'Tu choi' },
    }, true);

    let notificationSent = true;
    try {
      const customer = await orderRepository.getComplaintDeliveryContext(maKhieuNai);
      await sendNotificationEmail(customer.customerEmail, {
        subject: `EC Voucher - Kết quả khiếu nại ${maKhieuNai}`,
        title: 'Khiếu nại đã bị từ chối',
        message: `Chào ${customer.customerName || 'bạn'}, khiếu nại liên quan đơn ${customer.orderId} không được chấp nhận. Lý do: ${reason}`,
      });
    } catch (error) {
      notificationSent = false;
      await auditLogService.log({
        actorId: adminAccountId, actorRole: 'ADMIN',
        action: 'NOTIFY_COMPLAINT_REJECTION', targetType: 'khieunai', targetId: maKhieuNai,
        result: LogResult.THAT_BAI, reason: error.message,
      });
    }
    return { ...result, notificationSent };
  }

  async reissueCode(orderId, { maVoucherMua }, adminAccountId) {
    if (!maVoucherMua) throw new Error("Mã voucher mua không hợp lệ");

    const order = await this.getAdminOrderById(orderId);
    if (order.orderStatus !== OrderStatus.DA_THANH_TOAN) {
      throw new Error('Chỉ được cấp lại mã cho đơn hàng đang ở trạng thái Đã thanh toán');
    }
    if (order.paymentStatus !== PaymentStatus.THANH_CONG) {
      throw new Error("Đơn hàng chưa thanh toán thành công");
    }

    const codeInfo = order.codes.find((c) => c.id === maVoucherMua);
    if (!codeInfo) {
      throw new Error("Mã voucher không thuộc đơn hàng này");
    }

    if (
      codeInfo.status !== VoucherCodeStatus.LOI_SINH_MA &&
      codeInfo.status !== "not_issued"
    ) {
      throw new Error(
        "Chỉ được cấp lại mã khi chưa phát hành hoặc lỗi sinh mã",
      );
    }

    const result = await orderRepository.reissueVoucherCode(
      maVoucherMua,
      adminAccountId,
    );

    let notificationSent = true;
    try {
      const customer = await orderRepository.getOrderCustomerDeliveryContext(orderId);
      await sendNotificationEmail(customer.customerEmail, {
        subject: `EC Voucher - Mã voucher cho đơn ${orderId}`,
        title: 'Voucher code của bạn đã sẵn sàng',
        message: `Chào ${customer.customerName || 'bạn'}, hệ thống đã khắc phục lỗi phát hành mã cho đơn ${orderId}.`,
        voucherCode: result.voucher_code,
      });
    } catch (error) {
      notificationSent = false;
      await auditLogService.log({
        actorId: adminAccountId,
        actorRole: 'ADMIN',
        action: 'DELIVER_REISSUED_VOUCHER_CODE',
        targetType: 'voucher_mua',
        targetId: result.ma_voucher_mua,
        result: LogResult.THAT_BAI,
        after: { newCode: result.voucher_code, delivery: 'That bai' },
        reason: error.message,
      });
    }

    await auditLogService.log(
      {
        actorId: adminAccountId,
        actorRole: "ADMIN",
        action: "REISSUE_VOUCHER_CODE",
        targetType: "voucher_mua",
        targetId: result.ma_voucher_mua,
        after: { newCode: result.voucher_code, delivery: notificationSent ? 'Thanh cong' : 'That bai' },
      },
      true,
    );

    return { ...result, notificationSent };
  }
}

module.exports = new OrderService();
