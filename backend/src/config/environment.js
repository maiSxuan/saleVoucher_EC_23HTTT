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

function loadSendGrid() {
  return {
    apiKey: process.env.SENDGRID_API_KEY,
    from: process.env.SENDGRID_FROM,
  };
}

function loadAuthSendGrid() {
  return {
    apiKey: process.env.AUTH_SENDGRID_API_KEY || process.env.SENDGRID_API_KEY,
    from: process.env.AUTH_SENDGRID_FROM || process.env.SENDGRID_FROM,
  };
}

// Cấu hình JWT (Access Token + Refresh Token)
function loadJwt() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET chưa được cấu hình trong .env");

  return {
    secret,
    refreshSecret: process.env.JWT_REFRESH_SECRET || secret + "_refresh",
    accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || "1440m",
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || "7d",
  };
}

// Cấu hình cổng thanh toán VNPay
function loadVnpay() {
  // vnp_ReturnUrl chỉ thuộc luồng PAY: VNPay chuyển trình duyệt khách hàng
  // về trang kết quả sau thanh toán. Refund API trả JSON trực tiếp cho backend.
  // Refund phải dùng cùng TmnCode/HashSecret đã tạo giao dịch PAY gốc;
  // dùng một merchant khác sẽ khiến QueryDR/Refund trả mã 91.
  return {
    tmnCode: process.env.VNP_TMN_CODE,
    hashSecret: process.env.VNP_HASH_SECRET,
    url: process.env.VNP_URL,
    paymentReturnUrl:
      process.env.VNP_PAYMENT_RETURN_URL || process.env.VNP_RETURN_URL,
    refundApiUrl:
      process.env.VNP_API_URL_REFUND ||
      "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
  };
}

// Cấu hình cổng thanh toán PayPal
function loadPaypal() {
  return {
    clientId: process.env.PAYPAL_CLIENT_ID,
    clientSecret: process.env.PAYPAL_CLIENT_SECRET,
    apiBase: process.env.PAYPAL_API_BASE,
    returnUrl: process.env.PAYPAL_RETURN_URL,
    cancelUrl: process.env.PAYPAL_CANCEL_URL,
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
  loadSendGrid,
  loadAuthSendGrid,
  loadJwt,
  loadVnpay,
  loadPaypal,
  loadPayment,
};
