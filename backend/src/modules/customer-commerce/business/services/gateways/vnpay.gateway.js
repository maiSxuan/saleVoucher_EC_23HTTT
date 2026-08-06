/**
 * Purpose: Tích hợp cổng thanh toán nội địa VNPay (sandbox).
 */
const crypto = require("crypto");
const qs = require("qs");

const { loadVnpay } = require("../../../../../config/environment");

function sortObject(obj) {
  const sorted = {};
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      // VNPay yêu cầu encode kiểu application/x-www-form-urlencoded:
      // dấu cách -> "+" (không phải %20 như encodeURIComponent/qs mặc định)
      sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
    });
  return sorted;
}

function formatDate(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return (
    date.getFullYear().toString() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
}

function buildPaymentUrl({ paymentId, amount, ipAddr, orderInfo }) {
  const vnpayConfig = loadVnpay();
  const txnRef = String(paymentId || "").replace(/-/g, "");

  let vnpParams = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: vnpayConfig.tmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: txnRef,
    vnp_OrderInfo: orderInfo || "Thanh toan don hang",
    vnp_OrderType: "other",
    vnp_Amount: Math.round(Number(amount) || 0) * 100,
    vnp_ReturnUrl: vnpayConfig.returnUrl,
    vnp_IpAddr: ipAddr || "127.0.0.1",
    vnp_CreateDate: formatDate(new Date()),
  };

  vnpParams = sortObject(vnpParams);
  const signData = qs.stringify(vnpParams, { encode: false }); // giữ nguyên - dùng để ký
  const hmac = crypto.createHmac("sha512", vnpayConfig.hashSecret);
  vnpParams.vnp_SecureHash = hmac
    .update(Buffer.from(signData, "utf-8"))
    .digest("hex");

  return `${vnpayConfig.url}?${qs.stringify(vnpParams, { encode: false })}`;
}

function verify(query) {
  const vnpayConfig = loadVnpay();
  const params = { ...query };
  const secureHash = params.vnp_SecureHash;
  delete params.vnp_SecureHash;
  delete params.vnp_SecureHashType;

  const signData = qs.stringify(sortObject(params), { encode: false });
  const hmac = crypto.createHmac("sha512", vnpayConfig.hashSecret);
  const checkSum = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  return {
    isValid: secureHash === checkSum,
    isSuccess: query.vnp_ResponseCode === "00",
    paymentId: query.vnp_TxnRef,
  };
}

module.exports = { buildPaymentUrl, verify };
