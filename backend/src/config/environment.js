/**
 * Purpose: Đọc biến môi trường và cung cấp cấu hình tập trung.
 * Các file khác nên dùng hàm này thay vì đọc process.env trực tiếp.
 */
require("dotenv").config();

function loadEnvironment() {
  return {
    nodeEnv: process.env.NODE_ENV || "development",
    port: process.env.PORT || "3001",
  };
}

function loadDatabase() {
  return {
    supabaseUrl:
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey:
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  };
}

// Cấu hình email cho đăng ký khách hàng
function loadGmail() {
  return {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.MAIL_FROM,
  };
}

// Cấu hình email cho OTP Quên mật khẩu
function loadAuthGmail() {
  return {
    host: process.env.AUTH_SMTP_HOST,
    port: process.env.AUTH_SMTP_PORT,
    secure: process.env.AUTH_SMTP_SECURE,
    user: process.env.AUTH_SMTP_USER,
    pass: process.env.AUTH_SMTP_PASS,
    from: process.env.AUTH_MAIL_FROM
  };
}

// Cấu hình JWT (Access Token + Refresh Token)
function loadJwt() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET chưa được cấu hình trong .env");

  return {
    secret,
    refreshSecret:
      process.env.JWT_REFRESH_SECRET || secret + "_refresh",
    accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || "7d",
  };
}

// Cấu hình cổng thanh toán VNPay
function loadVnpay() {
  return {
    tmnCode: process.env.VNP_TMN_CODE || "9FN7EYEX",
    hashSecret: process.env.VNP_HASH_SECRET || "G57UKVRM4ANJCAAYTAOOBAW59I1IP4C2",
    url: process.env.VNP_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    returnUrl: process.env.VNP_RETURN_URL || "http://localhost:5173/customer/checkout/return",
  };
}

// Cấu hình cổng thanh toán PayPal
function loadPaypal() {
  return {
    clientId: process.env.PAYPAL_CLIENT_ID || "Ae7buYUBnSKlVc8AoB60bGATOCUSNaakS4opi_mfk1d513cbiEh2MzSIV4SY17PXMbx1r8TTj5x8Z58k",
    clientSecret: process.env.PAYPAL_CLIENT_SECRET || "ENRPftImPnKXKD7nafSAsm8oovI5kGQSfObuEOCw8mGwol5lpX2AP8tQ-vkQThJOyILDv4hUUhkCgqWT",
    apiBase: process.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com",
    returnUrl: process.env.PAYPAL_RETURN_URL || "http://localhost:5173/customer/checkout/return",
    cancelUrl: process.env.PAYPAL_CANCEL_URL || "http://localhost:5173/customer/cart",
  };
}

// Cấu hình tổng hợp các cổng thanh toán
function loadPayment() {
  return {
    vnpay: loadVnpay(),
    paypal: loadPaypal(),
  };
}

module.exports = {
  loadEnvironment,
  loadDatabase,
  loadGmail,
  loadAuthGmail,
  loadJwt,
  loadVnpay,
  loadPaypal,
  loadPayment,
};

