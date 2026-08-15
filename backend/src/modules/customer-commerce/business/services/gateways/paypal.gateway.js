/**
 * Purpose: Tích hợp cổng thanh toán quốc tế PayPal (sandbox).
 */
const { loadPaypal } = require("../../../../../config/environment");

// [Tạm thời] Tỷ giá quy đổi cố định VND -> USD vì PayPal không hỗ trợ VND.
const VND_TO_USD_RATE = 25000;
let accessTokenCache = { token: null, expiresAt: 0 };

function assertPaypalConfig(config) {
  const missing = [];
  if (!config.clientId) missing.push("PAYPAL_CLIENT_ID");
  if (!config.clientSecret) missing.push("PAYPAL_CLIENT_SECRET");
  if (!config.apiBase) missing.push("PAYPAL_API_BASE");
  if (missing.length) {
    const error = new Error(`Thiếu cấu hình PayPal: ${missing.join(", ")}`);
    error.status = 500;
    error.code = "PAYPAL_CONFIG_MISSING";
    throw error;
  }
}

async function getAccessToken() {
  const paypalConfig = loadPaypal();
  assertPaypalConfig(paypalConfig);
  if (accessTokenCache.token && accessTokenCache.expiresAt > Date.now() + 60_000) {
    return accessTokenCache.token;
  }

  const auth = Buffer.from(
    `${paypalConfig.clientId}:${paypalConfig.clientSecret}`,
  ).toString("base64");
  try {
    const res = await fetch(`${paypalConfig.apiBase}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
      signal: AbortSignal.timeout(15000),
    });
    const data = await res.json();
    if (!res.ok || !data.access_token) {
      const error = new Error(
        `Không thể xác thực với PayPal (${data.error_description || data.error || res.status})`,
      );
      error.status = 502;
      error.code = "PAYPAL_AUTH_FAILED";
      throw error;
    }
    accessTokenCache = {
      token: data.access_token,
      expiresAt: Date.now() + Math.max(0, Number(data.expires_in) || 0) * 1000,
    };
    return data.access_token;
  } catch (error) {
    if (error.code === "PAYPAL_AUTH_FAILED") throw error;
    const gatewayError = new Error(`PayPal Sandbox không phản hồi khi xác thực: ${error.message}`);
    gatewayError.isTimeout = ["AbortError", "TimeoutError"].includes(error.name);
    gatewayError.code = gatewayError.isTimeout
      ? "PAYPAL_AUTH_TIMEOUT"
      : "PAYPAL_AUTH_CONNECTION_ERROR";
    throw gatewayError;
  }
}

async function createOrder({ paymentId, amountVnd }) {
  const paypalConfig = loadPaypal();
  const accessToken = await getAccessToken();
  const amountUsd = (amountVnd / VND_TO_USD_RATE).toFixed(2);

  const res = await fetch(`${paypalConfig.apiBase}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          custom_id: paymentId,
          amount: { currency_code: "USD", value: amountUsd },
        },
      ],
      application_context: {
        return_url: paypalConfig.returnUrl,
        cancel_url: paypalConfig.cancelUrl,
      },
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    const err = new Error("Không thể tạo giao dịch PayPal");
    err.status = 500;
    throw err;
  }

  const approveLink = data.links.find((l) => l.rel === "approve")?.href;
  return { paypalOrderId: data.id, redirectUrl: approveLink };
}

async function captureOrder(paypalOrderId) {
  const paypalConfig = loadPaypal();
  const accessToken = await getAccessToken();
  const res = await fetch(
    `${paypalConfig.apiBase}/v2/checkout/orders/${paypalOrderId}/capture`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data = await res.json();
  const isSuccess = res.ok && data.status === "COMPLETED";
  const paymentId =
    data.purchase_units?.[0]?.payments?.captures?.[0]?.custom_id;
  const captureId =
    data.purchase_units?.[0]?.payments?.captures?.[0]?.id || null;

  return {
    isSuccess,
    paymentId,
    maGdGoc: captureId,
    responseCode: data.status || "FAILED",
  };
}

/**
 * Recover a Capture ID for legacy successful payments whose callback was
 * processed before ma_gd_goc was persisted. PayPal reporting exposes the
 * application's payment UUID in transaction_info.custom_field.
 */
async function findCaptureIdByCustomId({ paymentId, paidAt }) {
  if (!paymentId) return null;

  const paypalConfig = loadPaypal();
  const accessToken = await getAccessToken();
  const paidDate = paidAt ? new Date(paidAt) : new Date();
  if (Number.isNaN(paidDate.getTime())) return null;

  const startDate = new Date(paidDate.getTime() - 24 * 60 * 60 * 1000);
  const endDate = new Date(paidDate.getTime() + 48 * 60 * 60 * 1000);
  const params = new URLSearchParams({
    start_date: startDate.toISOString(),
    end_date: endDate.toISOString(),
    fields: "transaction_info",
    page_size: "500",
  });

  const res = await fetch(
    `${paypalConfig.apiBase}/v1/reporting/transactions?${params}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: AbortSignal.timeout(15000),
    },
  );
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(
      `Không thể đối soát giao dịch PayPal Sandbox (${data?.message || res.status})`,
    );
    err.status = 502;
    throw err;
  }

  const transaction = (data.transaction_details || []).find(
    ({ transaction_info: info }) =>
      info?.custom_field === paymentId &&
      info?.transaction_status === "S" &&
      info?.transaction_event_code === "T0006" &&
      info?.transaction_id,
  );
  return transaction?.transaction_info?.transaction_id || null;
}

/**
 * Hoàn toàn bộ một Capture qua PayPal Payments REST API v2.
 * Không truyền amount để PayPal hoàn đúng toàn bộ số tiền và currency đã capture.
 */
async function refundCapture({ captureId, reason, refundRequestId }) {
  if (!captureId) {
    const error = new Error("Thiếu PayPal Capture ID để hoàn tiền");
    error.status = 400;
    error.code = "PAYPAL_CAPTURE_ID_MISSING";
    throw error;
  }

  const config = loadPaypal();
  assertPaypalConfig(config);
  const accessToken = await getAccessToken();
  const requestId = String(refundRequestId || "")
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .slice(0, 38);

  try {
    const response = await fetch(
      `${config.apiBase}/v2/payments/captures/${encodeURIComponent(captureId)}/refund`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          Prefer: "return=representation",
          ...(requestId ? { "PayPal-Request-Id": requestId } : {}),
        },
        body: JSON.stringify({
          note_to_payer: String(reason || "Hoan tien don hang").slice(0, 255),
        }),
        signal: AbortSignal.timeout(15000),
      },
    );

    const rawBody = await response.text();
    let data;
    try {
      data = rawBody ? JSON.parse(rawBody) : {};
    } catch {
      const error = new Error(`PayPal Refund trả dữ liệu không hợp lệ (HTTP ${response.status})`);
      error.status = 502;
      error.code = "PAYPAL_REFUND_INVALID_JSON";
      error.requestMayHaveReachedGateway = true;
      throw error;
    }

    const responseCode = data.status
      || data.details?.[0]?.issue
      || data.name
      || `HTTP_${response.status}`;
    if (!response.ok && response.status >= 500) {
      const error = new Error(`PayPal Refund HTTP ${response.status}: ${responseCode}`);
      error.status = 502;
      error.code = "PAYPAL_REFUND_HTTP_ERROR";
      error.requestMayHaveReachedGateway = true;
      throw error;
    }

    return {
      isSuccess: response.ok && data.status === "COMPLETED",
      isPending: response.ok && data.status === "PENDING",
      isTimeout: false,
      refundId: data.id || null,
      responseCode,
      transactionStatus: data.status || null,
      message: data.message || data.details?.[0]?.description || null,
      gateway: "paypal",
      debugId: data.debug_id || null,
    };
  } catch (error) {
    if (error.code?.startsWith("PAYPAL_REFUND_")) throw error;
    const gatewayError = new Error(`PayPal Sandbox không phản hồi: ${error.message}`);
    gatewayError.isTimeout = ["AbortError", "TimeoutError"].includes(error.name);
    gatewayError.code = gatewayError.isTimeout
      ? "PAYPAL_REFUND_TIMEOUT"
      : "PAYPAL_REFUND_CONNECTION_ERROR";
    gatewayError.requestMayHaveReachedGateway = true;
    throw gatewayError;
  }
}

/**
 * Đọc trạng thái Refund resource đã được PayPal tạo trước đó.
 * GET này không phát sinh thêm giao dịch hoàn tiền.
 */
async function queryRefundStatus({ refundId }) {
  if (!refundId) {
    const error = new Error("Thiếu PayPal Refund ID để đối soát");
    error.status = 400;
    error.code = "PAYPAL_REFUND_ID_MISSING";
    throw error;
  }

  const config = loadPaypal();
  assertPaypalConfig(config);
  const accessToken = await getAccessToken();

  try {
    const response = await fetch(
      `${config.apiBase}/v2/payments/refunds/${encodeURIComponent(refundId)}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        signal: AbortSignal.timeout(15000),
      },
    );
    const rawBody = await response.text();
    let data;
    try {
      data = rawBody ? JSON.parse(rawBody) : {};
    } catch {
      const error = new Error(`PayPal Refund status trả dữ liệu không hợp lệ (HTTP ${response.status})`);
      error.status = 502;
      error.code = "PAYPAL_QUERY_INVALID_JSON";
      throw error;
    }
    if (!response.ok) {
      const detail = data.details?.[0]?.issue || data.name || data.message || response.status;
      const error = new Error(`Không thể đối soát PayPal Refund (${detail})`);
      error.status = 502;
      error.code = "PAYPAL_QUERY_HTTP_ERROR";
      throw error;
    }

    const status = String(data.status || "UNKNOWN").toUpperCase();
    const isSuccess = status === "COMPLETED";
    const isDefinitiveFailure = ["FAILED", "CANCELLED", "DENIED"].includes(status);
    return {
      isSuccess,
      isPending: !isSuccess && !isDefinitiveFailure,
      isTimeout: false,
      refundId: data.id || String(refundId),
      responseCode: status,
      transactionStatus: status,
      message: data.status_details?.reason || null,
      gateway: "paypal",
      debugId: data.debug_id || null,
    };
  } catch (error) {
    if (error.code?.startsWith("PAYPAL_QUERY_")) throw error;
    const gatewayError = new Error(`PayPal Sandbox không phản hồi khi đối soát: ${error.message}`);
    gatewayError.isTimeout = ["AbortError", "TimeoutError"].includes(error.name);
    gatewayError.code = gatewayError.isTimeout
      ? "PAYPAL_QUERY_TIMEOUT"
      : "PAYPAL_QUERY_CONNECTION_ERROR";
    throw gatewayError;
  }
}

module.exports = {
  createOrder,
  captureOrder,
  findCaptureIdByCustomId,
  refundCapture,
  queryRefundStatus,
};
