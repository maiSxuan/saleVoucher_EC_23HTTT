/**
 * Purpose: Repository cho dữ liệu đơn hàng.
 */
class OrderRepository {
  async create(payload) {
    return payload;
  }
}

module.exports = new OrderRepository();
