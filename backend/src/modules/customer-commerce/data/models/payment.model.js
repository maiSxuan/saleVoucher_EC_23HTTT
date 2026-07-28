/**
 * Purpose: Model mẫu cho thông tin thanh toán.
 */
class PaymentModel {
  constructor({ id, orderId, method, status }) {
    this.id = id;
    this.orderId = orderId;
    this.method = method;
    this.status = status;
  }
}

module.exports = PaymentModel;
