/**
 * Purpose: Service xử lý đặt hàng và trạng thái đơn hàng.
 */
class OrderService {
  async createOrder(payload) {
    return {
      message: "Order creation placeholder",
      payload,
    };
  }
}

module.exports = new OrderService();
