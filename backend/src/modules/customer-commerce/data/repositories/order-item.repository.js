/**
 * Purpose: Repository cho item trong đơn hàng.
 */
class OrderItemRepository {
  async create(payload) {
    return payload;
  }
}

module.exports = new OrderItemRepository();
