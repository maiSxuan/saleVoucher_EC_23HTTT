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

function restoreUuid(value) {
  const raw = String(value || '');
  if (!/^[0-9a-fA-F]{32}$/.test(raw)) return raw;
  return `${raw.slice(0, 8)}-${raw.slice(8, 12)}-${raw.slice(12, 16)}-${raw.slice(16, 20)}-${raw.slice(20)}`;
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
    // URL thanh toán gửi UUID không dấu gạch; repository cần UUID chuẩn.
    paymentId: restoreUuid(query.vnp_TxnRef),
  };
}

/**
 * Gọi VNPay Sandbox Refund API (vnp_Command = refund).
 * @param {object} params
 *  - paymentId: uuid của bản ghi THANHTOAN (dùng làm vnp_TxnRef gốc)
 *  - maGdGoc: Mã giao dịch gốc từ VNPay (vnp_TransactionNo)
 *  - amount: Số tiền hoàn (VND, số nguyên)
 *  - reason: Lý do hoàn tiền
 * @returns {{ isSuccess, refundId, responseCode }}
 */
async function refundPayment({ paymentId, maGdGoc, amount, reason, transactionDate, refundRequestId, createBy }) {
  const vnpayConfig = loadVnpay();
  const txnRef = String(paymentId || '').replace(/-/g, '');
  const requestId = String(refundRequestId || crypto.randomUUID()).replace(/[^a-zA-Z0-9]/g, '').slice(0, 32);
  const createDate = formatDate(new Date());
  const originalTransactionDate = formatDate(transactionDate ? new Date(transactionDate) : new Date());
  const createdBy = String(createBy || 'admin').replace(/[^a-zA-Z0-9]/g, '').slice(0, 245) || 'admin';

  const params = {
    vnp_RequestId: requestId,
    vnp_Version: '2.1.0',
    vnp_Command: 'refund',
    vnp_TmnCode: vnpayConfig.tmnCode,
    vnp_TransactionType: '02', // 02 = refund toàn bộ
    vnp_TxnRef: txnRef,
    vnp_Amount: Math.round(Number(amount) || 0) * 100,
    vnp_TransactionNo: maGdGoc || '',
    vnp_TransactionDate: originalTransactionDate,
    vnp_CreateBy: createdBy,
    vnp_CreateDate: createDate,
    vnp_IpAddr: '127.0.0.1',
    vnp_OrderInfo: reason || 'Hoan tien don hang',
  };

  // VNPay Refund 2.1.0 yêu cầu checksum theo đúng thứ tự và phân cách
  // bằng "|", khác với chữ ký query string của URL thanh toán.
  const signData = [
    params.vnp_RequestId,
    params.vnp_Version,
    params.vnp_Command,
    params.vnp_TmnCode,
    params.vnp_TransactionType,
    params.vnp_TxnRef,
    params.vnp_Amount,
    params.vnp_TransactionNo,
    params.vnp_TransactionDate,
    params.vnp_CreateBy,
    params.vnp_CreateDate,
    params.vnp_IpAddr,
    params.vnp_OrderInfo,
  ].join('|');
  const hmac = crypto.createHmac('sha512', vnpayConfig.hashSecret);
  params.vnp_SecureHash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  try {
    const res = await fetch(
      `${vnpayConfig.url.replace('/paymentv2/vpcpay.html', '/merchant_webapi/api/transaction')}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
        signal: AbortSignal.timeout(15000),
      }
    );
    const data = await res.json();
    const isSuccess = data.vnp_ResponseCode === '00';
    return {
      isSuccess,
      refundId: data.vnp_TransactionNo || null,
      responseCode: data.vnp_ResponseCode || 'UNKNOWN',
      transactionStatus: data.vnp_TransactionStatus || null,
    };
  } catch (err) {
    // Timeout hoặc mất kết nối → không xác định được kết quả
    const timeoutErr = new Error(`VNPay Sandbox không phản hồi: ${err.message}`);
    timeoutErr.isTimeout = true;
    throw timeoutErr;
  }
}

module.exports = { buildPaymentUrl, verify, refundPayment };
