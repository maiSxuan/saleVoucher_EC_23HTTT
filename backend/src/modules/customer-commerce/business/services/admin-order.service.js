/**
 * Purpose: Service cho admin quản lý đơn hàng và trạng thái.
 */
class AdminOrderService {
  async listOrders(query) {
    return {
      message: "Admin order list placeholder",
      query,
    };
  }
}

module.exports = new AdminOrderService();
