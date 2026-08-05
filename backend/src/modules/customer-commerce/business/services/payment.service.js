/**
 * Purpose: Service xử lý thanh toán cho đơn hàng.
 */

const vnpayGateway = require("./gateways/vnpay.gateway");
const paypalGateway = require("./gateways/paypal.gateway");
const paymentRepository = require("../../data/repositories/payment.repository");
const orderRepository = require("../../data/repositories/order.repository");
const cartRepository = require("../../data/repositories/cart.repository");
const orderItemRepository = require("../../data/repositories/order-item.repository");
const catalogRepository = require("../../data/repositories/catalog.repository");

class PaymentService {
  // Tạo bản ghi thanh toán "Dang xu ly" + sinh link redirect tới cổng đã chọn
  async _startPayment({ order, total, paymentMethod, ipAddr }) {
    const paymentId = await paymentRepository.createAttempt({
      orderId: order.ma_dh,
      amount: total,
      method: paymentMethod,
    });

    if (paymentMethod === "vnpay") {
      const redirectUrl = vnpayGateway.buildPaymentUrl({
        paymentId,
        amount: total,
        ipAddr: ipAddr || "127.0.0.1",
        orderInfo: `Thanh toan don hang ${order.ma_dh}`,
      });
      return { orderId: order.ma_dh, paymentId, redirectUrl };
    }

    if (paymentMethod === "paypal") {
      const { redirectUrl } = await paypalGateway.createOrder({
        paymentId,
        amountVnd: total,
      });
      return { orderId: order.ma_dh, paymentId, redirectUrl };
    }

    const err = new Error("Phương thức thanh toán không hợp lệ");
    err.status = 400;
    throw err;
  }

  // Xử lý callback từ VNPay (dùng chung cho cả Return URL và IPN)
  async finalizeVnpayPayment(query) {
    const { isValid, isSuccess, paymentId } = vnpayGateway.verify(query);
    if (!isValid) {
      const err = new Error("Chữ ký không hợp lệ"); // chống giả mạo callback
      err.status = 400;
      throw err;
    }
    return this._finalizePayment({ paymentId, isSuccess });
  }

  // Xử lý callback từ PayPal (sau khi khách approve trên trang PayPal)
  async finalizePaypalPayment(paypalOrderId) {
    const { isSuccess, paymentId } =
      await paypalGateway.captureOrder(paypalOrderId);
    if (!paymentId) {
      const err = new Error("Không xác định được giao dịch tương ứng");
      err.status = 400;
      throw err;
    }
    return this._finalizePayment({ paymentId, isSuccess });
  }

  // Cập nhật trạng thái đơn hàng + thanh toán sau khi có kết quả từ cổng
  async _finalizePayment({ paymentId, isSuccess }) {
    const payment = await paymentRepository.findById(paymentId);
    if (!payment) {
      const err = new Error("Không tìm thấy giao dịch thanh toán");
      err.status = 404;
      throw err;
    }
    // Chống xử lý trùng nếu cổng gọi callback nhiều lần (VNPay IPN có thể gọi lại)
    if (payment.trang_thai !== "Dang xu ly") {
      return {
        orderId: payment.ma_dh,
        status: payment.trang_thai === "Thanh cong" ? "success" : "failed",
      };
    }

    if (!isSuccess) {
      // A6 + NFR-03.1
      await paymentRepository.updateStatus(paymentId, "That bai");
      return {
        orderId: payment.ma_dh,
        status: "failed",
        orderStatus: "Cho thanh toan",
      };
    }

    // Bước 7-8: thanh toán thành công
    await paymentRepository.updateStatus(paymentId, "Thanh cong");
    await orderRepository.updateStatus(payment.ma_dh, "Da thanh toan");

    const items = await orderItemRepository.findByOrderId(payment.ma_dh);
    for (const item of items) {
      await catalogRepository.incrementSoldQuantity(
        item.ma_voucher,
        item.so_luong,
      );
    }

    try {
      const order = await orderRepository.findRawById(payment.ma_dh);
      const cartId = await cartRepository.findOrCreateCart(order.ma_tk_dat);
      await cartRepository.removeItems(
        cartId,
        items.map((i) => i.ma_voucher),
      );
    } catch {
      /* không chặn kết quả thành công nếu dọn giỏ hàng lỗi */
    }

    return {
      orderId: payment.ma_dh,
      status: "success",
      orderStatus: "Da thanh toan",
    };
  }
}

module.exports = new PaymentService();
