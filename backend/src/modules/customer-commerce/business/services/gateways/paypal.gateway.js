/**
 * Purpose: Tích hợp cổng thanh toán quốc tế PayPal (sandbox).
 */
const { loadPaypal } = require("../../../../../config/environment");

// [Tạm thời] Tỷ giá quy đổi cố định VND -> USD vì PayPal không hỗ trợ VND.
const VND_TO_USD_RATE = 25000;

async function getAccessToken() {
  const paypalConfig = loadPaypal();
  const auth = Buffer.from(
    `${paypalConfig.clientId}:${paypalConfig.clientSecret}`,
  ).toString("base64");
  const res = await fetch(`${paypalConfig.apiBase}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error("Không thể xác thực với PayPal");
    err.status = 500;
    throw err;
  }
  return data.access_token;
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
  const captureId = data.purchase_units?.[0]?.payments?.captures?.[0]?.id || null;

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
    fields: 'transaction_info',
    page_size: '500',
  });

  const res = await fetch(`${paypalConfig.apiBase}/v1/reporting/transactions?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    signal: AbortSignal.timeout(15000),
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(`Không thể đối soát giao dịch PayPal Sandbox (${data?.message || res.status})`);
    err.status = 502;
    throw err;
  }

  const transaction = (data.transaction_details || []).find(({ transaction_info: info }) =>
    info?.custom_field === paymentId
      && info?.transaction_status === 'S'
      && info?.transaction_event_code === 'T0006'
      && info?.transaction_id
  );
  return transaction?.transaction_info?.transaction_id || null;
}

/**
 * Gọi PayPal Sandbox Refund API.
 * @param {object} params
 *  - captureId: PayPal Capture ID (lưu trong THANHTOAN.ma_gd_goc)
 *  - amountVnd: Số tiền hoàn (VND — sẽ quy đổi sang USD)
 *  - reason: Lý do hoàn tiền
 * @returns {{ isSuccess, refundId, responseCode }}
 */
async function refundCapture({ captureId, amountVnd, reason, refundRequestId }) {
  const paypalConfig = loadPaypal();
  const accessToken = await getAccessToken();
  const amountUsd = (amountVnd / VND_TO_USD_RATE).toFixed(2);

  try {
    const res = await fetch(
      `${paypalConfig.apiBase}/v2/payments/captures/${captureId}/refund`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          ...(refundRequestId ? { 'PayPal-Request-Id': String(refundRequestId).replace(/[^a-zA-Z0-9]/g, '').slice(0, 38) } : {}),
        },
        body: JSON.stringify({
          amount: { currency_code: 'USD', value: amountUsd },
          note_to_payer: reason || 'Hoan tien don hang',
        }),
        signal: AbortSignal.timeout(15000),
      }
    );
    const data = await res.json();
    const isSuccess = res.ok && data.status === 'COMPLETED';
    return {
      isSuccess,
      refundId: data.id || null,
      responseCode: data.status || data.name || data.details?.[0]?.issue || (res.ok ? 'COMPLETED' : `HTTP_${res.status}`),
    };
  } catch (err) {
    const timeoutErr = new Error(`PayPal Sandbox không phản hồi: ${err.message}`);
    timeoutErr.isTimeout = true;
    throw timeoutErr;
  }
}

module.exports = { createOrder, captureOrder, findCaptureIdByCustomId, refundCapture };
