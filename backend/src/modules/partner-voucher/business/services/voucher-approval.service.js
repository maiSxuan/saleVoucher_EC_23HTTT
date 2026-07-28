/**
 * Purpose: Service xử lý phê duyệt voucher.
 */
class VoucherApprovalService {
  async approve(payload) {
    return {
      message: "Voucher approval placeholder",
      payload,
    };
  }
}

module.exports = new VoucherApprovalService();
