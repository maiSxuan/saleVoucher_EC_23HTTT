/**
 * Purpose: Tích hợp cổng thanh toán quốc tế PayPal (sandbox).
 */
const PAYPAL_API_BASE =
  process.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com";

// [Tạm thời] Tỷ giá quy đổi cố định VND -> USD vì PayPal không hỗ trợ VND.
const VND_TO_USD_RATE = 25000;

async function getAccessToken() {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`,
  ).toString("base64");
  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
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
  const accessToken = await getAccessToken();
  const amountUsd = (amountVnd / VND_TO_USD_RATE).toFixed(2);

  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
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
        return_url: process.env.PAYPAL_RETURN_URL,
        cancel_url: process.env.PAYPAL_CANCEL_URL,
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
  const accessToken = await getAccessToken();
  const res = await fetch(
    `${PAYPAL_API_BASE}/v2/checkout/orders/${paypalOrderId}/capture`,
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
