/**
 * Purpose: DTO mẫu cho payload voucher.
 */
class VoucherDto {
  constructor({ code, discount, partnerId }) {
    this.code = code;
    this.discount = discount;
    this.partnerId = partnerId;
  }
}

module.exports = VoucherDto;
