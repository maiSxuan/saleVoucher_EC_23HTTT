const cartRepository = require("../../data/repositories/cart.repository");
const orderItemRepository = require("../../data/repositories/order-item.repository");
const { computeAvailability } = require("./voucher-aivailability.util");
const PaymentService = require("./payment.service");
const orderRepository = require("../../data/repositories/order.repository");
const auditLogService = require("../../../core-access/business/services/audit-log.service");
const OrderStatus = require("../../../../common/constants/order-status");
const PaymentStatus = require("../../../../common/constants/payment-status");
const VoucherCodeStatus = require("../../../../common/constants/issued-voucher-status");
const LogResult = require("../../../../common/constants/log-result");
const { sendNotificationEmail } = require("../../../../common/utils/mailer");
const vnpayGateway = require("./gateways/vnpay.gateway");
const paypalGateway = require("./gateways/paypal.gateway");
const translationService = require("../../../../common/services/translation.service");

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
      const err = new Error("Không tìm thấy đơn hàng");
      err.status = 404;
      throw err;
    }
    if (order.trang_thai === OrderStatus.DA_THANH_TOAN) {
      // Tạo yêu cầu hủy cho admin duyệt
      const ycHuy = await orderRepository.createCancelRequest(
        orderId,
        reason,
        accountId,
      );
      await auditLogService
        .log({
          actorId: accountId,
          actorRole: "CUSTOMER",
          action: "REQUEST_CANCEL_ORDER",
          targetType: "donhang",
          targetId: orderId,
          reason,
          after: { trang_thai: "Cho xu ly" },
        })
        .catch(() => {});
      return { type: "yeu_cau_huy", data: ycHuy };
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

    return { type: "huy_truc_tiep", orderId, status: OrderStatus.DA_HUY };
  }

  async repayOrder({ accountId, orderId, paymentMethod, ipAddr }) {
    const order = await orderRepository.findById(orderId, accountId);
    if (!order) {
      const err = new Error("Không tìm thấy đơn hàng");
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
    const result = await orderRepository.findCustomerOrders(accountId, filters);
    const lang = filters?.lang;
    if (lang && lang.toLowerCase().startsWith("en") && Array.isArray(result?.orders)) {
      for (const order of result.orders) {
        if (Array.isArray(order.items)) {
          for (const item of order.items) {
            if (item.voucherName) item.voucherName = await translationService.translateText(item.voucherName, "en");
            if (item.partnerName) item.partnerName = await translationService.translateText(item.partnerName, "en");
          }
        }
      }
    }
    return result;
  }

  async getCustomerOrderById(accountId, orderId, lang = null) {
    const order = await orderRepository.findCustomerOrderById(
      accountId,
      orderId,
    );
    if (!order) {
      const err = new Error("Không tìm thấy đơn hàng");
      err.statusCode = 404;
      throw err;
    }
    if (lang && lang.toLowerCase().startsWith("en")) {
      if (Array.isArray(order.items)) {
        for (const item of order.items) {
          if (item.voucherName) item.voucherName = await translationService.translateText(item.voucherName, "en");
          if (item.partnerName) item.partnerName = await translationService.translateText(item.partnerName, "en");
        }
      }
      if (Array.isArray(order.codes)) {
        for (const code of order.codes) {
          if (code.usedBranch) code.usedBranch = await translationService.translateText(code.usedBranch, "en");
        }
      }
    }
    return order;
  }

  async getAdminOrders(filters) {
    return await orderRepository.findAdminOrders(filters);
  }

  async getAdminOrderById(orderId) {
    const order = await orderRepository.findAdminOrderById(orderId);
    if (!order) {
      const err = new Error("Không tìm thấy đơn hàng");
      err.statusCode = 404;
      throw err;
    }
    return order;
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
        actorRole: "Admin van hanh",
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
      throw new Error("Chỉ hủy được đơn hàng đang ở trạng thái Đã thanh toán");
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
        actorRole: "Admin van hanh",
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
        actorRole: "Admin van hanh",
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
        actorRole: "Admin van hanh",
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
    if (!reason || !reason.trim())
      throw new Error("Lý do chấp nhận không được để trống");
    const result = await orderRepository.approveYeuCauHuy(
      maYcHuy,
      reason,
      adminAccountId,
    );
    await auditLogService.log(
      {
        actorId: adminAccountId,
        actorRole: "Admin van hanh",
        action: "APPROVE_CANCEL_REQUEST",
        targetType: "yeucauhuy",
        targetId: maYcHuy,
        reason,
        before: { trang_thai: "Cho xu ly" },
        after: { trang_thai: "Da chap nhan" },
      },
      true,
    );
    return result;
  }

  // UC-ADM-05: TỪ CHỐI YÊU CẦU HỦY (A1)
  async rejectYeuCauHuy(maYcHuy, reason, adminAccountId) {
    if (!reason || !reason.trim())
      throw new Error("Lý do từ chối không được để trống");
    const result = await orderRepository.rejectYeuCauHuy(
      maYcHuy,
      reason,
      adminAccountId,
    );
    await auditLogService.log(
      {
        actorId: adminAccountId,
        actorRole: "Admin van hanh",
        action: "REJECT_CANCEL_REQUEST",
        targetType: "yeucauhuy",
        targetId: maYcHuy,
        reason,
        before: { trang_thai: "Cho xu ly" },
        after: { trang_thai: "Da tu choi" },
      },
      true,
    );

    let notificationSent = true;
    try {
      const customer = await orderRepository.getOrderCustomerDeliveryContext(
        result.orderId,
      );
      await sendNotificationEmail(customer.customerEmail, {
        subject: `EC Voucher - Kết quả yêu cầu hủy đơn ${customer.orderId}`,
        title: "Yêu cầu hủy đơn đã bị từ chối",
        message: `Chào ${customer.customerName || "bạn"}, yêu cầu hủy ${maYcHuy} không được chấp nhận. Lý do: ${reason}`,
      });
    } catch (error) {
      notificationSent = false;
      await auditLogService.log({
        actorId: adminAccountId,
        actorRole: "Admin van hanh",
        action: "NOTIFY_CANCEL_REJECTION",
        targetType: "yeucauhuy",
        targetId: maYcHuy,
        result: LogResult.THAT_BAI,
        reason: error.message,
      });
    }
    return { ...result, notificationSent };
  }

  // -----------------------------------------------------------------------
  // UC-ADM-06: THỰC HIỆN HOÀN TIỀN QUA SANDBOX
  // -----------------------------------------------------------------------
  async executeRefund(maHoanTien, adminAccountId, ipAddr = "127.0.0.1") {
    const supabase = require("../../../../config/supabase");
    const { data: ht } = await supabase
      .from("hoantien")
      .select("*")
      .eq("ma_hoan_tien", maHoanTien)
      .single();
    if (!ht) throw new Error("Không tìm thấy bản ghi hoàn tiền");
    const retryableStatuses = ["Cho xu ly", "That bai"];
    if (!retryableStatuses.includes(ht.trang_thai)) {
      throw new Error(
        "Chỉ có thể hoàn tiền khi đang Chờ xử lý hoặc thử lại khi lần hoàn trước Thất bại",
      );
    }
    const isRetry = ht.trang_thai === "That bai";
    const refundRequestId = isRetry ? crypto.randomUUID() : maHoanTien;

    const { data: payment } = await supabase
      .from("thanhtoan")
      .select("*")
      .eq("ma_thanh_toan", ht.ma_thanh_toan)
      .single();
    if (!payment)
      throw new Error("Không tìm thấy giao dịch thanh toán gốc (E5)");
    if (payment.trang_thai !== PaymentStatus.THANH_CONG) {
      throw new Error("Chỉ được hoàn giao dịch thanh toán đã thành công");
    }
    if (
      Number(ht.so_tien) <= 0 ||
      Number(ht.so_tien) !== Number(payment.so_tien)
    ) {
      throw new Error(
        "Số tiền hoàn phải bằng đúng số tiền của giao dịch thanh toán gốc",
      );
    }

    const { data: order, error: orderError } = await supabase
      .from("donhang")
      .select("ma_dh, trang_thai")
      .eq("ma_dh", payment.ma_dh)
      .single();
    if (orderError || !order)
      throw new Error("Không tìm thấy đơn hàng cần hoàn tiền");
    if (order.trang_thai !== OrderStatus.CHO_HOAN_TIEN) {
      throw new Error("Đơn hàng không còn ở trạng thái Chờ hoàn tiền");
    }

    const { data: usedCodes, error: usedCodeError } = await supabase
      .from("voucher_mua")
      .select("ma_voucher_mua")
      .eq("ma_dh", payment.ma_dh)
      .eq("trang_thai", VoucherCodeStatus.DA_SU_DUNG)
      .limit(1);
    if (usedCodeError)
      throw new Error(
        `Không thể kiểm tra voucher đã sử dụng: ${usedCodeError.message}`,
      );
    if (usedCodes?.length) {
      throw new Error(
        "Đơn hàng có voucher đã sử dụng nên không đủ điều kiện hoàn tiền",
      );
    }
    const rawGateway = String(payment.phuong_thuc_tt || "").toLowerCase();
    const gateway = rawGateway.includes("paypal")
      ? "paypal"
      : rawGateway.includes("vnpay")
        ? "vnpay"
        : rawGateway;
    if (!["vnpay", "paypal"].includes(gateway)) {
      throw new Error(
        `Cổng thanh toán không hợp lệ: ${payment.phuong_thuc_tt || "không xác định"}`,
      );
    }

    let maGdGoc = payment.ma_gd_goc;
    if (!maGdGoc && gateway === "paypal") {
      maGdGoc = await paypalGateway.findCaptureIdByCustomId({
        paymentId: payment.ma_thanh_toan,
        paidAt: payment.thoi_gian_tt,
      });
      if (maGdGoc) {
        const { error: recoverError } = await supabase
          .from("thanhtoan")
          .update({ ma_gd_goc: maGdGoc })
          .eq("ma_thanh_toan", payment.ma_thanh_toan)
          .is("ma_gd_goc", null);
        if (recoverError)
          throw new Error(
            `Không thể lưu Capture ID đã đối soát: ${recoverError.message}`,
          );
        await auditLogService.log({
          actorId: adminAccountId,
          actorRole: "Admin van hanh",
          action: "RECOVER_PAYMENT_TRANSACTION_ID",
          targetType: "thanhtoan",
          targetId: payment.ma_thanh_toan,
          before: { ma_gd_goc: null },
          after: { ma_gd_goc: maGdGoc, gateway },
        });
      }
    }
    if (!maGdGoc) {
      const err = new Error(
        "Giao dịch thành công cũ chưa lưu mã giao dịch gốc và không thể tự đối soát. Vui lòng kiểm tra trên cổng thanh toán trước khi hoàn tiền.",
      );
      err.status = 409;
      throw err;
    }

    // Chuyển có điều kiện → Đang xử lý để hai request đồng thời không thể gọi
    // Sandbox hai lần cho cùng một bản ghi hoàn tiền.
    const { data: lockedRefund, error: lockError } = await supabase
      .from("hoantien")
      .update({ trang_thai: "Dang xu ly", ma_tk: adminAccountId })
      .eq("ma_hoan_tien", maHoanTien)
      .in("trang_thai", retryableStatuses)
      .select("ma_hoan_tien")
      .maybeSingle();
    if (lockError)
      throw new Error(`Không thể khóa yêu cầu hoàn tiền: ${lockError.message}`);
    if (!lockedRefund)
      throw new Error(
        "Yêu cầu hoàn tiền đang được xử lý bởi một thao tác khác",
      );

    let sandboxResult = {
      isSuccess: false,
      isPending: false,
      isTimeout: false,
      refundId: null,
      responseCode: "UNKNOWN",
      gateway,
    };
    try {
      if (gateway === "vnpay") {
        sandboxResult = await vnpayGateway.refundPayment({
          paymentId: payment.ma_thanh_toan,
          maGdGoc,
          amount: ht.so_tien,
          reason: ht.ly_do,
          transactionDate: payment.thoi_gian_tt,
          refundRequestId,
          createBy: adminAccountId,
          ipAddr,
        });
      } else if (gateway === "paypal") {
        sandboxResult = await paypalGateway.refundCapture({
          captureId: maGdGoc,
          reason: ht.ly_do,
          refundRequestId,
        });
      }
    } catch (err) {
      if (!err.isTimeout && !err.requestMayHaveReachedGateway) {
        // E1: lỗi trước khi gửi được lệnh refund (ví dụ không xác thực/kết nối
        // được Sandbox) phải trả bản ghi về Chờ xử lý để Admin có thể thử lại.
        await supabase
          .from("hoantien")
          .update({ trang_thai: "Cho xu ly", ma_tk: ht.ma_tk || null })
          .eq("ma_hoan_tien", maHoanTien)
          .eq("trang_thai", "Dang xu ly");

        await auditLogService.log(
          {
            actorId: adminAccountId,
            actorRole: "Admin van hanh",
            action: "EXECUTE_REFUND_SANDBOX",
            targetType: "hoantien",
            targetId: maHoanTien,
            result: LogResult.THAT_BAI,
            before: { trang_thai: ht.trang_thai },
            after: { outcome: "khong_ket_noi", gateway, maGdGoc },
            reason: err.message,
          },
          true,
        );

        return {
          outcome: "khong_ket_noi",
          gateway,
          refundId: null,
          responseCode: err.code || "GATEWAY_NOT_CALLED",
          message: err.message,
        };
      }
      sandboxResult = {
        isSuccess: false,
        isPending: false,
        isTimeout: true,
        refundId: null,
        responseCode: err.code || "GATEWAY_RESULT_UNKNOWN",
        message: err.message,
        gateway,
      };
    }

    let outcome;
    let persistenceMessage = null;
    try {
      const res = await orderRepository.executeRefundViaSandbox(
        maHoanTien,
        adminAccountId,
        sandboxResult,
      );
      outcome = res.outcome;
    } catch (err) {
      outcome = err.outcome || "can_kiem_tra";
      persistenceMessage = err.message;
    }

    let notificationSent = null;
    if (outcome === "thanh_cong") {
      notificationSent = true;
      try {
        const customer = await orderRepository.getOrderCustomerDeliveryContext(
          payment.ma_dh,
        );
        const formattedAmount = Number(ht.so_tien).toLocaleString("vi-VN");
        await sendNotificationEmail(customer.customerEmail, {
          subject: `Snow Voucher - Hoàn tiền đơn ${payment.ma_dh}`,
          title: "Hoàn tiền thành công",
          message: `Chào ${customer.customerName || "bạn"}, đơn ${payment.ma_dh} đã được hoàn ${formattedAmount} đ qua ${gateway.toUpperCase()}. Mã hoàn tiền: ${sandboxResult.refundId || "đang cập nhật"}.`,
        });
      } catch (error) {
        notificationSent = false;
        await auditLogService.log({
          actorId: adminAccountId,
          actorRole: "Admin van hanh",
          action: "NOTIFY_REFUND_COMPLETION",
          targetType: "hoantien",
          targetId: maHoanTien,
          result: LogResult.THAT_BAI,
          reason: error.message,
        });
      }
    }

    await auditLogService.log(
      {
        actorId: adminAccountId,
        actorRole: "Admin van hanh",
        action: "EXECUTE_REFUND_SANDBOX",
        targetType: "hoantien",
        targetId: maHoanTien,
        before: { trang_thai: ht.trang_thai },
        after: {
          outcome,
          isRetry,
          gateway,
          maGdGoc,
          refundId: sandboxResult.refundId,
          responseCode: sandboxResult.responseCode,
          transactionStatus: sandboxResult.transactionStatus || null,
        },
        reason: persistenceMessage || sandboxResult.message || null,
      },
      true,
    );

    return {
      outcome,
      gateway,
      refundId: sandboxResult.refundId,
      responseCode: sandboxResult.responseCode,
      transactionStatus: sandboxResult.transactionStatus || null,
      message: persistenceMessage || sandboxResult.message || null,
      notificationSent,
    };
  }

  // UC-ADM-06: ĐỐI SOÁT TRẠNG THÁI MỘT LỆNH HOÀN TIỀN ĐÃ GỬI
  async reconcileRefund(maHoanTien, adminAccountId, ipAddr = "127.0.0.1") {
    const supabase = require("../../../../config/supabase");
    const { data: ht, error: refundError } = await supabase
      .from("hoantien")
      .select("*")
      .eq("ma_hoan_tien", maHoanTien)
      .single();
    if (refundError || !ht) throw new Error("Không tìm thấy bản ghi hoàn tiền");
    if (ht.trang_thai !== "Can kiem tra") {
      throw new Error(
        "Chỉ đối soát được giao dịch hoàn tiền ở trạng thái Cần kiểm tra",
      );
    }
    if (!ht.ma_gd_hoan) {
      const error = new Error(
        "Chưa có mã hoàn tiền từ cổng thanh toán để đối soát",
      );
      error.status = 409;
      throw error;
    }

    const { data: payment, error: paymentError } = await supabase
      .from("thanhtoan")
      .select("*")
      .eq("ma_thanh_toan", ht.ma_thanh_toan)
      .single();
    if (paymentError || !payment)
      throw new Error("Không tìm thấy giao dịch thanh toán gốc");

    const rawGateway = String(payment.phuong_thuc_tt || "").toLowerCase();
    const gateway = rawGateway.includes("paypal")
      ? "paypal"
      : rawGateway.includes("vnpay")
        ? "vnpay"
        : rawGateway;
    if (!["vnpay", "paypal"].includes(gateway)) {
      throw new Error(
        `Cổng thanh toán không hợp lệ: ${payment.phuong_thuc_tt || "không xác định"}`,
      );
    }

    // Khóa ngắn hạn để hai quản trị viên không đối soát/cập nhật cùng lúc.
    // Lệnh sau chỉ gọi QueryDR/GET refund status, không gửi lại lệnh refund.
    const { data: lockedRefund, error: lockError } = await supabase
      .from("hoantien")
      .update({ trang_thai: "Dang xu ly", ma_tk: adminAccountId })
      .eq("ma_hoan_tien", maHoanTien)
      .eq("trang_thai", "Can kiem tra")
      .select("ma_hoan_tien")
      .maybeSingle();
    if (lockError)
      throw new Error(
        `Không thể khóa giao dịch đối soát: ${lockError.message}`,
      );
    if (!lockedRefund)
      throw new Error(
        "Giao dịch hoàn tiền đang được đối soát bởi thao tác khác",
      );

    let sandboxResult;
    try {
      sandboxResult =
        gateway === "vnpay"
          ? await vnpayGateway.queryRefundStatus({
              paymentId: payment.ma_thanh_toan,
              refundId: ht.ma_gd_hoan,
              transactionDate: payment.thoi_gian_tt,
              ipAddr,
            })
          : await paypalGateway.queryRefundStatus({ refundId: ht.ma_gd_hoan });
    } catch (error) {
      await supabase
        .from("hoantien")
        .update({ trang_thai: "Can kiem tra" })
        .eq("ma_hoan_tien", maHoanTien)
        .eq("trang_thai", "Dang xu ly");

      await auditLogService.log(
        {
          actorId: adminAccountId,
          actorRole: "Admin van hanh",
          action: "RECONCILE_REFUND_SANDBOX",
          targetType: "hoantien",
          targetId: maHoanTien,
          result: LogResult.THAT_BAI,
          before: { trang_thai: ht.trang_thai, ma_gd_hoan: ht.ma_gd_hoan },
          after: { outcome: "can_kiem_tra", gateway },
          reason: error.message,
        },
        true,
      );

      return {
        outcome: "can_kiem_tra",
        gateway,
        refundId: ht.ma_gd_hoan,
        responseCode: error.code || "GATEWAY_QUERY_FAILED",
        transactionStatus: null,
        message: error.message,
        notificationSent: null,
      };
    }

    let outcome;
    let persistenceMessage = null;
    try {
      const result = await orderRepository.executeRefundViaSandbox(
        maHoanTien,
        adminAccountId,
        sandboxResult,
      );
      outcome = result.outcome;
    } catch (error) {
      outcome = error.outcome || "can_kiem_tra";
      persistenceMessage = error.message;
    }

    let notificationSent = null;
    if (outcome === "thanh_cong") {
      notificationSent = true;
      try {
        const customer = await orderRepository.getOrderCustomerDeliveryContext(
          payment.ma_dh,
        );
        const formattedAmount = Number(ht.so_tien).toLocaleString("vi-VN");
        await sendNotificationEmail(customer.customerEmail, {
          subject: `Snow Voucher - Hoàn tiền đơn ${payment.ma_dh}`,
          title: "Hoàn tiền thành công",
          message: `Chào ${customer.customerName || "bạn"}, đơn ${payment.ma_dh} đã được hoàn ${formattedAmount} đ qua ${gateway.toUpperCase()}. Mã hoàn tiền: ${sandboxResult.refundId}.`,
        });
      } catch (error) {
        notificationSent = false;
        await auditLogService.log({
          actorId: adminAccountId,
          actorRole: "Admin van hanh",
          action: "NOTIFY_REFUND_COMPLETION",
          targetType: "hoantien",
          targetId: maHoanTien,
          result: LogResult.THAT_BAI,
          reason: error.message,
        });
      }
    }

    await auditLogService.log(
      {
        actorId: adminAccountId,
        actorRole: "Admin van hanh",
        action: "RECONCILE_REFUND_SANDBOX",
        targetType: "hoantien",
        targetId: maHoanTien,
        before: { trang_thai: ht.trang_thai, ma_gd_hoan: ht.ma_gd_hoan },
        after: {
          outcome,
          gateway,
          refundId: sandboxResult.refundId,
          responseCode: sandboxResult.responseCode,
          transactionStatus: sandboxResult.transactionStatus || null,
        },
        reason: persistenceMessage || sandboxResult.message || null,
      },
      true,
    );

    return {
      outcome,
      gateway,
      refundId: sandboxResult.refundId,
      responseCode: sandboxResult.responseCode,
      transactionStatus: sandboxResult.transactionStatus || null,
      message: persistenceMessage || sandboxResult.message || null,
      notificationSent,
    };
  }

  // UC-ADM-07: MỬ KHIẾU NẠI
  async openComplaint(maKhieuNai, adminAccountId) {
    const result = await orderRepository.openComplaint(
      maKhieuNai,
      adminAccountId,
    );
    await auditLogService.log(
      {
        actorId: adminAccountId,
        actorRole: "Admin van hanh",
        action: "OPEN_COMPLAINT",
        targetType: "khieunai",
        targetId: maKhieuNai,
        before: { trang_thai: "Moi" },
        after: { trang_thai: "Dang xu ly" },
      },
      true,
    );
    return result;
  }

  // UC-ADM-07: GỬi LẠI MÃ (A1)
  async resendCode(maKhieuNai, adminAccountId) {
    const pendingDelivery = await orderRepository.resendComplaintCode(
      maKhieuNai,
      adminAccountId,
    );

    try {
      const context =
        await orderRepository.getComplaintDeliveryContext(maKhieuNai);
      await sendNotificationEmail(context.customerEmail, {
        subject: `EC Voucher - Gửi lại mã cho đơn ${context.orderId}`,
        title: "Voucher code của bạn",
        message: `Chào ${context.customerName || "bạn"}, mã voucher theo khiếu nại ${maKhieuNai} được gửi lại bên dưới.`,
        voucherCode: pendingDelivery.voucherCode,
        voucherDetails: context.voucherDetails,
        qrValue: context.qrValue,
      });
    } catch (error) {
      await auditLogService.log({
        actorId: adminAccountId,
        actorRole: "Admin van hanh",
        action: "RESEND_VOUCHER_CODE",
        targetType: "khieunai",
        targetId: maKhieuNai,
        result: LogResult.THAT_BAI,
        after: {
          voucherCode: pendingDelivery.voucherCode,
          delivery: "That bai",
        },
        reason: error.message,
      });
      throw new Error(
        `Không thể gửi lại voucher code; khiếu nại vẫn đang xử lý. ${error.message}`,
      );
    }

    const result = await orderRepository.completeComplaintCodeDelivery(
      maKhieuNai,
      pendingDelivery.voucherPurchaseId,
      pendingDelivery.voucherCode,
      adminAccountId,
    );
    await auditLogService.log(
      {
        actorId: adminAccountId,
        actorRole: "Admin van hanh",
        action: "RESEND_VOUCHER_CODE",
        targetType: "khieunai",
        targetId: maKhieuNai,
        after: {
          voucherCode: result.voucherCode,
          delivery: "Thanh cong",
          trang_thai_kn: "Da xu ly",
        },
      },
      true,
    );
    return result;
  }

  // UC-ADM-07: CẤP LẠI MÃ MỚI (A2)
  async reissueCodeFromComplaint(maKhieuNai, adminAccountId) {
    const result = await orderRepository.reissueComplaintCode(
      maKhieuNai,
      adminAccountId,
    );

    try {
      const context =
        await orderRepository.getComplaintDeliveryContext(maKhieuNai);
      await sendNotificationEmail(context.customerEmail, {
        subject: `EC Voucher - Mã mới cho đơn ${context.orderId}`,
        title: "Voucher code mới của bạn",
        message: `Chào ${context.customerName || "bạn"}, EC Voucher đã cấp lại mã mới cho khiếu nại ${maKhieuNai}.`,
        voucherCode: result?.voucher_code,
      });
    } catch (error) {
      await auditLogService.log({
        actorId: adminAccountId,
        actorRole: "Admin van hanh",
        action: "REISSUE_CODE_FROM_COMPLAINT",
        targetType: "khieunai",
        targetId: maKhieuNai,
        result: LogResult.THAT_BAI,
        after: {
          newCode: result?.voucher_code,
          delivery: "That bai",
          trang_thai_kn: "Dang xu ly",
        },
        reason: error.message,
      });
      throw new Error(
        `Đã cấp mã mới nhưng chưa gửi được cho khách; khiếu nại vẫn đang xử lý. ${error.message}`,
      );
    }

    await orderRepository.completeComplaintCodeDelivery(
      maKhieuNai,
      result.ma_voucher_mua,
      result.voucher_code,
      adminAccountId,
    );
    await auditLogService.log(
      {
        actorId: adminAccountId,
        actorRole: "Admin van hanh",
        action: "REISSUE_CODE_FROM_COMPLAINT",
        targetType: "khieunai",
        targetId: maKhieuNai,
        after: {
          newCode: result?.voucher_code,
          delivery: "Thanh cong",
          trang_thai_kn: "Da xu ly",
        },
      },
      true,
    );
    return result;
  }

  // UC-ADM-07: CHẤP NHẬN KHIẾU NẠI → HOÀN TIỀN (A3)
  async approveComplaintRefund(maKhieuNai, reason, adminAccountId) {
    if (!reason || !reason.trim())
      throw new Error("Lý do hoàn tiền không được để trống");
    const result = await orderRepository.approveComplaintRefund(
      maKhieuNai,
      reason,
      adminAccountId,
    );
    await auditLogService.log(
      {
        actorId: adminAccountId,
        actorRole: "Admin van hanh",
        action: "APPROVE_COMPLAINT_REFUND",
        targetType: "khieunai",
        targetId: maKhieuNai,
        reason,
        after: {
          trang_thai_don_hang: "Cho hoan tien",
          ma_hoan_tien: result.hoanTien?.ma_hoan_tien,
        },
      },
      true,
    );
    return result;
  }

  // UC-ADM-07: TỪ CHỐI KHIẾU NẠI (A4)
  async rejectComplaint(maKhieuNai, reason, adminAccountId) {
    if (!reason || !reason.trim())
      throw new Error("Lý do từ chối không được để trống");
    const result = await orderRepository.rejectComplaint(
      maKhieuNai,
      reason,
      adminAccountId,
    );
    await auditLogService.log(
      {
        actorId: adminAccountId,
        actorRole: "Admin van hanh",
        action: "REJECT_COMPLAINT",
        targetType: "khieunai",
        targetId: maKhieuNai,
        reason,
        before: { trang_thai: "Dang xu ly" },
        after: { trang_thai: "Tu choi" },
      },
      true,
    );

    let notificationSent = true;
    try {
      const customer =
        await orderRepository.getComplaintDeliveryContext(maKhieuNai);
      await sendNotificationEmail(customer.customerEmail, {
        subject: `EC Voucher - Kết quả khiếu nại ${maKhieuNai}`,
        title: "Khiếu nại đã bị từ chối",
        message: `Chào ${customer.customerName || "bạn"}, khiếu nại liên quan đơn ${customer.orderId} không được chấp nhận. Lý do: ${reason}`,
      });
    } catch (error) {
      notificationSent = false;
      await auditLogService.log({
        actorId: adminAccountId,
        actorRole: "Admin van hanh",
        action: "NOTIFY_COMPLAINT_REJECTION",
        targetType: "khieunai",
        targetId: maKhieuNai,
        result: LogResult.THAT_BAI,
        reason: error.message,
      });
    }
    return { ...result, notificationSent };
  }

  async reissueCode(orderId, { maVoucherMua }, adminAccountId) {
    if (!maVoucherMua) throw new Error("Mã voucher mua không hợp lệ");

    const order = await this.getAdminOrderById(orderId);
    if (order.orderStatus !== OrderStatus.DA_THANH_TOAN) {
      throw new Error(
        "Chỉ được cấp lại mã cho đơn hàng đang ở trạng thái Đã thanh toán",
      );
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
      const customer =
        await orderRepository.getOrderCustomerDeliveryContext(orderId);
      await sendNotificationEmail(customer.customerEmail, {
        subject: `EC Voucher - Mã voucher cho đơn ${orderId}`,
        title: "Voucher code của bạn đã sẵn sàng",
        message: `Chào ${customer.customerName || "bạn"}, hệ thống đã khắc phục lỗi phát hành mã cho đơn ${orderId}.`,
        voucherCode: result.voucher_code,
      });
    } catch (error) {
      notificationSent = false;
      await auditLogService.log({
        actorId: adminAccountId,
        actorRole: "Admin van hanh",
        action: "DELIVER_REISSUED_VOUCHER_CODE",
        targetType: "voucher_mua",
        targetId: result.ma_voucher_mua,
        result: LogResult.THAT_BAI,
        after: { newCode: result.voucher_code, delivery: "That bai" },
        reason: error.message,
      });
    }

    await auditLogService.log(
      {
        actorId: adminAccountId,
        actorRole: "Admin van hanh",
        action: "REISSUE_VOUCHER_CODE",
        targetType: "voucher_mua",
        targetId: result.ma_voucher_mua,
        after: {
          newCode: result.voucher_code,
          delivery: notificationSent ? "Thanh cong" : "That bai",
        },
      },
      true,
    );

    return { ...result, notificationSent };
  }
}

module.exports = new OrderService();
