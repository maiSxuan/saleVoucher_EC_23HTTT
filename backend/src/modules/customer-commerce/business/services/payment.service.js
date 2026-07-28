/**
 * Purpose: Service xử lý thanh toán cho đơn hàng.
 */
class PaymentService {
  async pay(payload) {
    return {
      message: "Payment placeholder",
      payload,
    };
  }
}

module.exports = new PaymentService();
