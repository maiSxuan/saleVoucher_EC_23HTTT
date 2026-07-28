/**
 * Purpose: Validator mẫu cho payload tạo voucher.
 * Khi triển khai thật, nên validate code, discount, expiry date ở đây.
 */
function validateVoucherPayload(payload) {
  if (!payload || !payload.code) {
    throw new Error("Voucher code is required");
  }

  return payload;
}

module.exports = {
  validateVoucherPayload,
};
