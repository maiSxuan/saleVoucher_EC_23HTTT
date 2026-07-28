/**
 * Purpose: Model mẫu cho item trong đơn hàng.
 */
class OrderItemModel {
  constructor({ id, orderId, voucherId, quantity }) {
    this.id = id;
    this.orderId = orderId;
    this.voucherId = voucherId;
    this.quantity = quantity;
  }
}

module.exports = OrderItemModel;
