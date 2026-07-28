/**
 * Purpose: Repository cho item trong giỏ hàng.
 */
class CartItemRepository {
  async create(payload) {
    return payload;
  }
}

module.exports = new CartItemRepository();
