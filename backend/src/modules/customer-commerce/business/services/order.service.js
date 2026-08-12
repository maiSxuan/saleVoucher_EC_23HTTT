const cartRepository = require("../../data/repositories/cart.repository");
const orderItemRepository = require("../../data/repositories/order-item.repository");
const { computeAvailability } = require("./voucher-aivailability.util");
const PaymentService = require("./payment.service");
const orderRepository = require("../../data/repositories/order.repository");
const auditLogService = require("../../../core-access/business/services/audit-log.service");
const OrderStatus = require("../../../../common/constants/order-status");
const PaymentStatus = require("../../../../common/constants/payment-status");
const VoucherCodeStatus = require("../../../../common/constants/issued-voucher-status");

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

    const cartId = await cartRepository.findOrCreateCart(accountId);
    await cartRepository.removeItems(cartId, voucherIds);

    return PaymentService._startPayment({
      order,
      total,
      paymentMethod,
      ipAddr,
    });
  }

  //khách hàng hủy giao dịch
  async cancelOrderCustomer({ accountId, orderId }) {
    const order = await orderRepository.findById(orderId, accountId);
    if (!order) {
      const err = new Error("Không tìm thấy đơn hàng");
      err.status = 404;
      throw err;
    }
    if (order.trang_thai === "Da thanh toan") {
      const err = new Error(
        "Đơn hàng đã thanh toán, không thể hủy theo cách này",
      );
      err.status = 409;
      throw err;
    }
    await orderRepository.updateStatus(orderId, "Da huy");

    await auditLogService
      .log({
        actorId: accountId,
        actorRole: "CUSTOMER",
        action: "CANCEL_ORDER_NO_REFUND",
        targetType: "donhang",
        targetId: orderId,
        before: { orderStatus: order.trang_thai },
        after: { orderStatus: "Da huy" },
        reason: "Khách hàng hủy đơn hàng chưa thanh toán",
      })
      .catch(() => {});

    return { orderId, status: "Da huy" };
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

  async getAdminOrderById(orderId) {
    const order = await orderRepository.findAdminOrderById(orderId);
    if (!order) {
      const err = new Error("Không tìm thấy đơn hàng");
      err.statusCode = 404;
      throw err;
    }
    return order;
  }

  async getOrderLogs(orderId) {
    const supabase = require("../../../../config/supabase");
    const { data, error } = await supabase
      .from("log_ht")
      .select("*")
      .eq("doi_tuong", "donhang")
      .eq("ma_doi_tuong", orderId)
      .order("thoi_diem_thuc_hien", { ascending: false });

    if (error) throw new Error(`Lỗi lấy nhật ký đơn hàng: ${error.message}`);
    return data || [];
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

  async reissueCode(orderId, { maVoucherMua }, adminAccountId) {
    if (!maVoucherMua) throw new Error("Mã voucher mua không hợp lệ");

    const order = await this.getAdminOrderById(orderId);
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

    await auditLogService.log(
      {
        actorId: adminAccountId,
        actorRole: "ADMIN",
        action: "REISSUE_VOUCHER_CODE",
        targetType: "voucher_mua",
        targetId: result.ma_voucher_mua,
        after: { newCode: result.voucher_code },
      },
      true,
    );

    return result;
  }
}

module.exports = new OrderService();
