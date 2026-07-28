/**
 * Purpose: Service xử lý logic voucher của partner.
 */
class VoucherService {
  async listVouchers(query) {
    return {
      message: "Voucher list placeholder",
      query,
    };
  }
}

module.exports = new VoucherService();
