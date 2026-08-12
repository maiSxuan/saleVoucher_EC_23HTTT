/**
 * Purpose: Service xử lý thanh toán cho đơn hàng.
 * BR-CUS-07: Sau khi payment thành công → gọi voucherIssuanceService để sinh code.
 */

const vnpayGateway = require("./gateways/vnpay.gateway");
const paypalGateway = require("./gateways/paypal.gateway");
const paymentRepository = require("../../data/repositories/payment.repository");
const orderRepository = require("../../data/repositories/order.repository");
const cartRepository = require("../../data/repositories/cart.repository");
const orderItemRepository = require("../../data/repositories/order-item.repository");
const catalogRepository = require("../../data/repositories/catalog.repository");
// Contract: gọi qua service (không import repository của core-access trực tiếp)
const voucherIssuanceService = require('../../../core-access/business/services/voucher-issuance.service');

class PaymentService {
  // Tạo bản ghi thanh toán "Dang xu ly" + sinh link redirect tới cổng đã chọn
  async _startPayment({ order, total, paymentMethod, ipAddr }) {
    await paymentRepository.markPendingAttemptsFailed(order.ma_dh);

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
      const err = new Error('Chữ ký không hợp lệ'); // chống giả mạo callback
      err.status = 400;
      throw err;
    }
    // Lưu lại mã giao dịch VNPay (vnp_TransactionNo) vào THANHTOAN.ma_gd_goc
    const maGdGoc = query.vnp_TransactionNo || null;
    return this._finalizePayment({ paymentId, isSuccess, maGdGoc });
  }

  // Xử lý callback từ PayPal (sau khi khách approve trên trang PayPal)
  async finalizePaypalPayment(paypalOrderId) {
    const { isSuccess, paymentId, maGdGoc } =
      await paypalGateway.captureOrder(paypalOrderId);
    if (!paymentId) {
      const err = new Error('Không xác định được giao dịch tương ứng');
      err.status = 400;
      throw err;
    }
    // maGdGoc là PayPal Capture ID — lưu để dùng cho refund.
    return this._finalizePayment({ paymentId, isSuccess, maGdGoc: maGdGoc || null });
  }

  // Cập nhật trạng thái đơn hàng + thanh toán sau khi có kết quả từ cổng
  async _finalizePayment({ paymentId, isSuccess, maGdGoc = null }) {
    const payment = await paymentRepository.findById(paymentId);
    if (!payment) {
      const err = new Error("Không tìm thấy giao dịch thanh toán");
      err.status = 404;
      throw err;
    }
    // Chống xử lý trùng nếu cổng gọi callback nhiều lần (VNPay IPN có thể gọi lại)
    if (payment.trang_thai !== "Dang xu ly") {
      // Callback lặp có thể bù Capture/Transaction ID cho bản ghi thành công cũ.
      if (payment.trang_thai === 'Thanh cong' && !payment.ma_gd_goc && maGdGoc) {
        await paymentRepository.updateStatus(paymentId, 'Thanh cong', maGdGoc);
      }
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

    if (['paypal', 'vnpay'].includes(String(payment.phuong_thuc_tt || '').toLowerCase()) && !maGdGoc) {
      const err = new Error('Cổng thanh toán chưa trả về mã giao dịch gốc; chưa thể hoàn tất thanh toán');
      err.status = 502;
      throw err;
    }

    // Bước 7-8: thanh toán thành công
    await paymentRepository.updateStatus(paymentId, 'Thanh cong', maGdGoc);
    await orderRepository.updateStatus(payment.ma_dh, 'Da thanh toan');

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

    // BR-CUS-07: Phát hành voucher code ngay sau thanh toán thành công
    let issuanceResult = { issued: [], issuePending: false };
    try {
      const order = await orderRepository.findRawById(payment.ma_dh);
      const issuanceItems = items.map((i) => ({
        voucherId: i.ma_voucher,
        quantity: i.so_luong,
      }));

      const issued = await voucherIssuanceService.issueAfterPayment(
        {
          orderId: payment.ma_dh,
          customerId: order?.ma_tk_dat || null,
          items: issuanceItems,
          paymentSuccess: true,
          requestKey: payment.ma_dh,
        },
        { actorId: null, actorRole: 'SYSTEM' },
      );
      issuanceResult.issued = issued;
    } catch (issueErr) {
      // A4: Lỗi phát hành không rollback payment — ghi nhận và để admin xử lý thủ công
      console.error('[PaymentService] Issuance failed after payment success:', issueErr.message);
      issuanceResult.issuePending = true;
    }

    return {
      orderId: payment.ma_dh,
      status: "success",
      orderStatus: "Da thanh toan",
      voucherCodeStatus: issuanceResult.issuePending ? "Loi sinh ma" : "Chua su dung",
      issuedCount: issuanceResult.issued.length,
      issuePending: issuanceResult.issuePending,
    };
  }
}

module.exports = new PaymentService();
