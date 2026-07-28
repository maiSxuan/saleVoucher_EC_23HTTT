/**
 * Purpose: Service xử lý logic partner.
 * Đây là nơi đặt business rule cho việc tạo/sửa/xem partner.
 */
class PartnerService {
  async createPartner(payload) {
    return {
      message: "Partner creation placeholder",
      payload,
    };
  }
}

module.exports = new PartnerService();
