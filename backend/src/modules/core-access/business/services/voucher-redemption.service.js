/**
 * Purpose: Service xử lý luồng redemption của voucher.
 * Dùng sau khi voucher đã được xác thực.
 */
class VoucherRedemptionService {
  async redeemVoucher(payload) {
    return {
      message: "Voucher redemption placeholder",
      payload,
    };
  }
}

module.exports = new VoucherRedemptionService();
