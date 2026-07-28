/**
 * Purpose: Service xử lý phát hành voucher cho user/partner.
 * Có thể tích hợp repository và validation ở đây.
 */
class VoucherIssuanceService {
  async issueVoucher(payload) {
    return {
      message: "Voucher issuance placeholder",
      payload,
    };
  }
}

module.exports = new VoucherIssuanceService();
