/**
 * Purpose: Model mẫu cho giỏ hàng.
 */
class CartModel {
  constructor({ id, userId }) {
    this.id = id;
    this.userId = userId;
  }
}

module.exports = CartModel;
