/**
 * Purpose: Service xử lý giỏ hàng của khách hàng.
 */
class CartService {
  async getCart(userId) {
    return {
      userId,
      items: [],
      message: "Cart placeholder",
    };
  }
}

module.exports = new CartService();
