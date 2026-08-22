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
  const value = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(value.getTime())) {
    throw new Error("Thời gian giao dịch VNPay không hợp lệ");
  }
  const vietnamTime = new Date(value.getTime() + 7 * 60 * 60 * 1000);
  const pad = (n) => String(n).padStart(2, "0");
  return (
    vietnamTime.getUTCFullYear().toString() +
    pad(vietnamTime.getUTCMonth() + 1) +
    pad(vietnamTime.getUTCDate()) +
    pad(vietnamTime.getUTCHours()) +
    pad(vietnamTime.getUTCMinutes()) +
    pad(vietnamTime.getUTCSeconds())
  );
}

function createHmac(secret, value) {
  return crypto
    .createHmac("sha512", secret)
    .update(Buffer.from(value, "utf-8"))
    .digest("hex");
}

function assertRefundConfig(config) {
  const missing = [];
  if (!config.tmnCode) missing.push("VNP_TMN_CODE");
  if (!config.hashSecret) missing.push("VNP_HASH_SECRET");
  if (!config.refundApiUrl) missing.push("VNP_API_URL_REFUND");
  if (missing.length) {
    const error = new Error(`Thiếu cấu hình VNPay Refund: ${missing.join(", ")}`);
    error.status = 500;
    error.code = "VNPAY_REFUND_CONFIG_MISSING";
    throw error;
  }
}

function restoreUuid(value) {
  const raw = String(value || "");
  if (!/^[0-9a-fA-F]{32}$/.test(raw)) return raw;
  return `${raw.slice(0, 8)}-${raw.slice(8, 12)}-${raw.slice(12, 16)}-${raw.slice(16, 20)}-${raw.slice(20)}`;
}

function buildPaymentUrl({ paymentId, amount, ipAddr, orderInfo, createDate }) {
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
    // Chỉ lệnh pay mới có vnp_ReturnUrl. Refund dùng Web API server-to-server
    // và không chuyển hướng trình duyệt của admin.
    vnp_ReturnUrl: vnpayConfig.paymentReturnUrl,
    vnp_IpAddr: ipAddr || "127.0.0.1",
    vnp_CreateDate: formatDate(createDate || new Date()),
  };

  vnpParams = sortObject(vnpParams);
  const signData = qs.stringify(vnpParams, { encode: false }); // giữ nguyên - dùng để ký
  vnpParams.vnp_SecureHash = createHmac(vnpayConfig.hashSecret, signData);

  return `${vnpayConfig.url}?${qs.stringify(vnpParams, { encode: false })}`;
}

function verify(query) {
  const vnpayConfig = loadVnpay();
  const params = { ...query };
  const secureHash = params.vnp_SecureHash;
  delete params.vnp_SecureHash;
  delete params.vnp_SecureHashType;

  const signData = qs.stringify(sortObject(params), { encode: false });
  const checkSum = createHmac(vnpayConfig.hashSecret, signData);

  return {
    isValid: secureHash === checkSum,
    isSuccess: query.vnp_ResponseCode === "00",
    // URL thanh toán gửi UUID không dấu gạch; repository cần UUID chuẩn.
    paymentId: restoreUuid(query.vnp_TxnRef),
  };
}

function verifyRefundResponse(data, secret) {
  const receivedHash = String(data?.vnp_SecureHash || "").toLowerCase();
  const signData = [
    data?.vnp_ResponseId,
    data?.vnp_Command,
    data?.vnp_ResponseCode,
    data?.vnp_Message,
    data?.vnp_TmnCode,
    data?.vnp_TxnRef,
    data?.vnp_Amount,
    data?.vnp_BankCode,
    data?.vnp_PayDate,
    data?.vnp_TransactionNo,
    data?.vnp_TransactionType,
    data?.vnp_TransactionStatus,
    data?.vnp_OrderInfo,
  ].map((value) => value ?? "").join("|");
  const expectedHash = createHmac(secret, signData).toLowerCase();
  const receivedBuffer = Buffer.from(receivedHash, "utf8");
  const expectedBuffer = Buffer.from(expectedHash, "utf8");
  const isValid = receivedBuffer.length === expectedBuffer.length
    && crypto.timingSafeEqual(receivedBuffer, expectedBuffer);

  if (!isValid) {
    const error = new Error("Chữ ký phản hồi VNPay Refund không hợp lệ");
    error.status = 502;
    error.code = "VNPAY_REFUND_INVALID_SIGNATURE";
    error.requestMayHaveReachedGateway = true;
    throw error;
  }
}

function verifyQueryResponse(data, secret) {
  const receivedHash = String(data?.vnp_SecureHash || "").toLowerCase();
  const signData = [
    data?.vnp_ResponseId,
    data?.vnp_Command,
    data?.vnp_ResponseCode,
    data?.vnp_Message,
    data?.vnp_TmnCode,
    data?.vnp_TxnRef,
    data?.vnp_Amount,
    data?.vnp_BankCode,
    data?.vnp_PayDate,
    data?.vnp_TransactionNo,
    data?.vnp_TransactionType,
    data?.vnp_TransactionStatus,
    data?.vnp_OrderInfo,
    data?.vnp_PromotionCode,
    data?.vnp_PromotionAmount,
  ].map((value) => value ?? "").join("|");
  const expectedHash = createHmac(secret, signData).toLowerCase();
  const receivedBuffer = Buffer.from(receivedHash, "utf8");
  const expectedBuffer = Buffer.from(expectedHash, "utf8");
  const isValid = receivedBuffer.length === expectedBuffer.length
    && crypto.timingSafeEqual(receivedBuffer, expectedBuffer);

  if (!isValid) {
    const error = new Error("Chữ ký phản hồi VNPay QueryDR không hợp lệ");
    error.status = 502;
    error.code = "VNPAY_QUERY_INVALID_SIGNATURE";
    throw error;
  }
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
async function refundPayment({
  paymentId,
  maGdGoc,
  amount,
  reason,
  transactionDate,
  refundRequestId,
  createBy,
  ipAddr,
}) {
  const config = loadVnpay();
  assertRefundConfig(config);
  const numericAmount = Math.round(Number(amount));
  if (!paymentId || !maGdGoc || !Number.isFinite(numericAmount) || numericAmount <= 0) {
    const error = new Error("Thông tin giao dịch gốc hoặc số tiền hoàn VNPay không hợp lệ");
    error.status = 400;
    error.code = "INVALID_VNPAY_REFUND_INPUT";
    throw error;
  }

  const params = {
    vnp_RequestId: String(refundRequestId || crypto.randomUUID())
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 32),
    vnp_Version: "2.1.0",
    vnp_Command: "refund",
    vnp_TmnCode: config.tmnCode,
    vnp_TransactionType: "02",
    vnp_TxnRef: String(paymentId).replace(/-/g, ""),
    vnp_Amount: numericAmount * 100,
    vnp_TransactionNo: String(maGdGoc),
    vnp_TransactionDate: formatDate(transactionDate),
    vnp_CreateBy: String(createBy || "admin")
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 245) || "admin",
    vnp_CreateDate: formatDate(new Date()),
    vnp_IpAddr: String(ipAddr || "127.0.0.1").replace(/^::ffff:/, ""),
    vnp_OrderInfo: String(reason || "Hoan tien don hang").slice(0, 255),
  };
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
  ].join("|");
  params.vnp_SecureHash = createHmac(config.hashSecret, signData);

  try {
    const response = await fetch(config.refundApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
      signal: AbortSignal.timeout(15000),
    });
    const rawBody = await response.text();
    let data;
    try {
      data = rawBody ? JSON.parse(rawBody) : {};
    } catch {
      const error = new Error(`VNPay Refund trả dữ liệu không hợp lệ (HTTP ${response.status})`);
      error.status = 502;
      error.code = "VNPAY_REFUND_INVALID_JSON";
      error.requestMayHaveReachedGateway = true;
      throw error;
    }
    if (!response.ok) {
      const error = new Error(`VNPay Refund HTTP ${response.status}: ${data.vnp_Message || "Không có mô tả"}`);
      error.status = 502;
      error.code = "VNPAY_REFUND_HTTP_ERROR";
      error.requestMayHaveReachedGateway = true;
      throw error;
    }

    verifyRefundResponse(data, config.hashSecret);
    const responseCode = String(data.vnp_ResponseCode || "UNKNOWN");
    const transactionStatus = String(data.vnp_TransactionStatus || "UNKNOWN");
    const isSuccess = responseCode === "00" && transactionStatus === "00";
    const isPending = responseCode === "94"
      || (responseCode === "00" && ["01", "05", "06"].includes(transactionStatus));
    return {
      isSuccess,
      isPending,
      isTimeout: false,
      refundId: data.vnp_TransactionNo || null,
      responseCode,
      transactionStatus,
      message: data.vnp_Message || null,
      gateway: "vnpay",
    };
  } catch (error) {
    if (error.code?.startsWith("VNPAY_REFUND_")) throw error;
    const gatewayError = new Error(`VNPay Sandbox không phản hồi: ${error.message}`);
    gatewayError.isTimeout = ["AbortError", "TimeoutError"].includes(error.name);
    gatewayError.code = gatewayError.isTimeout
      ? "VNPAY_REFUND_TIMEOUT"
      : "VNPAY_REFUND_CONNECTION_ERROR";
    gatewayError.requestMayHaveReachedGateway = true;
    throw gatewayError;
  }
}

/**
 * Đối soát một giao dịch hoàn tiền đã được VNPay tiếp nhận.
 * Đây là lệnh querydr chỉ đọc; tuyệt đối không gửi lại vnp_Command=refund.
 */
async function queryRefundStatus({ paymentId, refundId, transactionDate, ipAddr }) {
  const config = loadVnpay();
  assertRefundConfig(config);
  if (!paymentId || !refundId || !transactionDate) {
    const error = new Error("Thiếu thông tin để đối soát hoàn tiền VNPay");
    error.status = 400;
    error.code = "INVALID_VNPAY_QUERY_INPUT";
    throw error;
  }

  const params = {
    vnp_RequestId: crypto.randomUUID().replace(/-/g, "").slice(0, 32),
    vnp_Version: "2.1.0",
    vnp_Command: "querydr",
    vnp_TmnCode: config.tmnCode,
    vnp_TxnRef: String(paymentId).replace(/-/g, ""),
    vnp_OrderInfo: `Kiem tra hoan tien ${String(refundId)}`.slice(0, 255),
    vnp_TransactionNo: String(refundId),
    vnp_TransactionDate: formatDate(transactionDate),
    vnp_CreateDate: formatDate(new Date()),
    vnp_IpAddr: String(ipAddr || "127.0.0.1").replace(/^::ffff:/, ""),
  };
  const signData = [
    params.vnp_RequestId,
    params.vnp_Version,
    params.vnp_Command,
    params.vnp_TmnCode,
    params.vnp_TxnRef,
    params.vnp_TransactionDate,
    params.vnp_CreateDate,
    params.vnp_IpAddr,
    params.vnp_OrderInfo,
  ].join("|");
  params.vnp_SecureHash = createHmac(config.hashSecret, signData);

  try {
    const response = await fetch(config.refundApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
      signal: AbortSignal.timeout(15000),
    });
    const rawBody = await response.text();
    let data;
    try {
      data = rawBody ? JSON.parse(rawBody) : {};
    } catch {
      const error = new Error(`VNPay QueryDR trả dữ liệu không hợp lệ (HTTP ${response.status})`);
      error.status = 502;
      error.code = "VNPAY_QUERY_INVALID_JSON";
      throw error;
    }
    if (!response.ok) {
      const error = new Error(`VNPay QueryDR HTTP ${response.status}: ${data.vnp_Message || "Không có mô tả"}`);
      error.status = 502;
      error.code = "VNPAY_QUERY_HTTP_ERROR";
      throw error;
    }

    const responseCode = String(data.vnp_ResponseCode || "UNKNOWN");
    if (responseCode === "94" && !data.vnp_SecureHash) {
      // VNPay Sandbox có thể giới hạn nhiều QueryDR liên tiếp trên cùng giao dịch
      // và chỉ trả { vnp_ResponseCode, vnp_Message }, không có chữ ký phản hồi.
      // Đây không phải lỗi HashSecret và cũng không cho phép gửi lại lệnh refund.
      const error = new Error(
        "VNPay đang giới hạn truy vấn lặp trên giao dịch này. Lệnh hoàn tiền trước vẫn còn hiệu lực; vui lòng đợi một lúc rồi kiểm tra lại.",
      );
      error.status = 429;
      error.code = "VNPAY_QUERY_DUPLICATE";
      throw error;
    }

    verifyQueryResponse(data, config.hashSecret);
    const transactionStatus = String(data.vnp_TransactionStatus || "UNKNOWN");
    const transactionType = String(data.vnp_TransactionType || "UNKNOWN");
    const isRefundTransaction = ["02", "03"].includes(transactionType);
    const isSuccess = responseCode === "00"
      && isRefundTransaction
      && transactionStatus === "00";
    const isDefinitiveFailure = responseCode === "00"
      && isRefundTransaction
      && ["02", "04", "07", "09"].includes(transactionStatus);

    return {
      isSuccess,
      isPending: !isSuccess && !isDefinitiveFailure,
      isTimeout: false,
      refundId: data.vnp_TransactionNo || String(refundId),
      responseCode,
      transactionStatus,
      transactionType,
      message: data.vnp_Message || null,
      gateway: "vnpay",
    };
  } catch (error) {
    if (error.code?.startsWith("VNPAY_QUERY_")) throw error;
    const gatewayError = new Error(`VNPay Sandbox không phản hồi khi đối soát: ${error.message}`);
    gatewayError.isTimeout = ["AbortError", "TimeoutError"].includes(error.name);
    gatewayError.code = gatewayError.isTimeout
      ? "VNPAY_QUERY_TIMEOUT"
      : "VNPAY_QUERY_CONNECTION_ERROR";
    throw gatewayError;
  }
}

module.exports = { buildPaymentUrl, verify, refundPayment, queryRefundStatus };
