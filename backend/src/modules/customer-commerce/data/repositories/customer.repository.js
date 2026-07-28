/**
 * Purpose: Repository cho thao tác dữ liệu khách hàng.
 */
class CustomerRepository {
  async findById(id) {
    return { id, name: "demo-customer" };
  }
}

module.exports = new CustomerRepository();
