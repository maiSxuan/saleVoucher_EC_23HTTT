/**
 * Purpose: DTO mẫu cho payload tạo đơn hàng.
 */
class OrderDto {
  constructor({ customerId, items }) {
    this.customerId = customerId;
    this.items = items;
  }
}

module.exports = OrderDto;
