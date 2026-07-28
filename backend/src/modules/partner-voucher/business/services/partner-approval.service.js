/**
 * Purpose: Service xử lý phê duyệt partner bởi admin.
 */
class PartnerApprovalService {
  async approve(payload) {
    return {
      message: "Partner approval placeholder",
      payload,
    };
  }
}

module.exports = new PartnerApprovalService();
