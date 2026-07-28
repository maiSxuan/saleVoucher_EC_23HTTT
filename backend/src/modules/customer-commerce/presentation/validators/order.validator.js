/**
 * Purpose: Validator mẫu cho payload đặt hàng.
 * Khi triển khai thật, nên validate cart, customerId và payment info ở đây.
 */
function validateOrderPayload(payload) {
  if (!payload || !payload.customerId) {
    throw new Error("customerId is required");
  }

  return payload;
}

module.exports = {
  validateOrderPayload,
};
