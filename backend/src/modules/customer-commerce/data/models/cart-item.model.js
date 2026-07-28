/**
 * Purpose: Model mẫu cho item trong giỏ hàng.
 */
class CartItemModel {
  constructor({ id, cartId, voucherId, quantity }) {
    this.id = id;
    this.cartId = cartId;
    this.voucherId = voucherId;
    this.quantity = quantity;
  }
}

module.exports = CartItemModel;
