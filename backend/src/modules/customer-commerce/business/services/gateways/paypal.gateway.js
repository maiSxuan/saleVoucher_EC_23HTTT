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

  return { isSuccess, paymentId };
}

module.exports = { createOrder, captureOrder };
