/**
 * Purpose: Repository cho giỏ hàng của customer.
 */
class CartRepository {
  async findByUserId(userId) {
    return { userId, items: [] };
  }
}

module.exports = new CartRepository();
