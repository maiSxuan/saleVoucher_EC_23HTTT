/**
 * Purpose: Repository cho lưu và đọc voucher.
 */
class VoucherRepository {
  async list(query) {
    return { query, vouchers: [] };
  }
}

module.exports = new VoucherRepository();
