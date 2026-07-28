/**
 * Purpose: Service xử lý logic khách hàng như profile, lịch sử và thông tin cá nhân.
 */
class CustomerService {
  async getProfile(userId) {
    return {
      id: userId,
      role: "customer",
      message: "Customer profile placeholder",
    };
  }
}

module.exports = new CustomerService();
