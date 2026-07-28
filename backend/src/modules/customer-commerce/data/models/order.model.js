/**
 * Purpose: Model mẫu cho đơn hàng.
 */
class OrderModel {
  constructor({ id, customerId, status }) {
    this.id = id;
    this.customerId = customerId;
    this.status = status;
  }
}

module.exports = OrderModel;
