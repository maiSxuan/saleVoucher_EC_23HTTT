/**
 * Purpose: Gửi email dùng chung cho toàn backend (OTP, thông báo...).
 * Chặn đầu và kiểm tra tính hợp lệ của địa chỉ email và máy chủ SMTP trước khi gửi.
 */
const nodemailer = require("nodemailer");
const dns = require("dns").promises;
const { loadGmail, loadAuthGmail } = require("../../config/environment");
const AppError = require("../errors/AppError");

const config = loadGmail();
const authConfig = loadAuthGmail();

// Transporter dành cho Đăng ký (dùng SMTP_USER)
const transporter = nodemailer.createTransport({
  host: config.host || "smtp.gmail.com",
  port: Number(config.port) || 587,
  secure: Number(config.port) === 465 || config.secure === "true",
  auth: {
    user: config.user,
    pass: config.pass,
  },
});

// Transporter dành cho Quên mật khẩu / Xác thực OTP (dùng AUTH_SMTP_USER)
const authTransporter = nodemailer.createTransport({
  host: authConfig.host || "smtp.gmail.com",
  port: Number(authConfig.port) || 587,
  secure: Number(authConfig.port) === 465 || authConfig.secure === "true",
  auth: {
    user: authConfig.user,
    pass: authConfig.pass,
  },
});

/**
 * Kiểm tra tính hợp lệ và sự tồn tại của máy chủ nhận thư (SMTP / MX records) trên Internet.
 * Chặn đầu các email cục bộ, không có miền thực hoặc máy chủ thư không tồn tại.
 */
async function validateEmailDomain(email) {
  if (!email || typeof email !== "string" || !email.includes("@")) {
    throw new AppError("Địa chỉ email không đúng định dạng.", 400, "INVALID_EMAIL_FORMAT");
  }

  const parts = email.trim().split("@");
  if (parts.length !== 2) {
    throw new AppError("Địa chỉ email không hợp lệ.", 400, "INVALID_EMAIL_FORMAT");
  }

  const [localPart, domain] = parts;
  const cleanDomain = domain.toLowerCase().trim();

  if (!localPart || !cleanDomain) {
    throw new AppError("Địa chỉ email không được để trống phần tên hoặc tên miền.", 400, "INVALID_EMAIL_FORMAT");
  }

  // Chặn đầu các tên miền nội bộ / giả lập không thể nhận thư qua SMTP thực tế
  const blockedSuffixes = [".local", ".test", ".example", ".invalid", "localhost", ".lan", ".internal", ".dummy"];
  if (blockedSuffixes.some((suffix) => cleanDomain.endsWith(suffix) || cleanDomain === suffix.replace(".", ""))) {
    throw new AppError(
      `Địa chỉ email với tên miền "@${cleanDomain}" là email nội bộ/giả lập, không có máy chủ nhận thư (SMTP) trên Internet. Vui lòng sử dụng địa chỉ email thực tế (ví dụ: @gmail.com, @yahoo.com...).`,
      400,
      "SMTP_DOMAIN_NOT_ROUTABLE"
    );
  }

  // Kiểm tra định dạng tên miền cơ bản (phải có dấu chấm và phần TLD >= 2 ký tự)
  if (!cleanDomain.includes(".") || cleanDomain.startsWith(".") || cleanDomain.endsWith(".")) {
    throw new AppError(
      `Tên miền email "@${cleanDomain}" không hợp lệ.`,
      400,
      "INVALID_EMAIL_DOMAIN"
    );
  }

  // Tra cứu bản ghi MX (Mail Exchange) hoặc bản ghi A của domain trên hệ thống DNS
  try {
    const mxRecords = await dns.resolveMx(cleanDomain);
    if (!mxRecords || mxRecords.length === 0) {
      throw new Error("Không tìm thấy bản ghi MX");
    }
  } catch (dnsErr) {
    // Thử fallback kiểm tra A record nếu domain dùng máy chủ mail trực tiếp
    try {
      const aRecords = await dns.resolve4(cleanDomain);
      if (!aRecords || aRecords.length === 0) {
        throw new Error("Không tìm thấy bản ghi A");
      }
    } catch (_) {
      throw new AppError(
        `Không tìm thấy máy chủ nhận thư (SMTP/MX) cho tên miền "@${cleanDomain}". Địa chỉ email "${email}" không tồn tại hoặc không thể nhận thư qua Internet.`,
        400,
        "SMTP_SERVER_NOT_FOUND"
      );
    }
  }

  return true;
}

/**
 * Gửi email OTP (Đăng ký hoặc Quên mật khẩu)
 * Chặn đầu kiểm tra máy chủ SMTP trước khi gửi.
 */
async function sendOtpEmail(toEmail, otp, type = "register") {
  // 1. Chặn đầu: Kiểm tra định dạng và máy chủ DNS/SMTP của tên miền email
  await validateEmailDomain(toEmail);

  const isForgotPassword = type === "forgot_password";

  const subject = isForgotPassword
    ? "Mã OTP Đăng nhập/Quên mật khẩu EC Voucher"
    : "Mã xác thực đăng ký tài khoản EC Voucher";

  const content = isForgotPassword
    ? `<div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: auto; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #4F46E5; text-align: center;">Mã Xác Thực OTP</h2>
        <p>Chào bạn,</p>
        <p>Bạn đã yêu cầu khôi phục mật khẩu / đăng nhập bằng mã OTP vào hệ thống <strong>EC Voucher</strong>.</p>
        <p>Mã xác thực của bạn là:</p>
        <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #111827; border-radius: 8px; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #d97706; font-size: 14px;">Mã này sẽ hết hạn sau <strong>5 phút</strong>. Vui lòng không chia sẻ mã này cho bất kỳ ai.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #9ca3af; text-align: center;">Đây là email tự động, vui lòng không phản hồi.</p>
      </div>`
    : `<p>Mã xác thực (OTP) của bạn là: <b style="font-size:20px">${otp}</b></p>
       <p>Mã có hiệu lực trong 5 phút. Vui lòng không chia sẻ mã này cho người khác.</p>`;

  const activeTransporter = isForgotPassword ? authTransporter : transporter;
  const activeConfig = isForgotPassword ? authConfig : config;

  if (!activeConfig.user || !activeConfig.pass) {
    console.error(`[Mailer] Chưa cấu hình SMTP USER/PASS cho tác vụ ${type}`);
    throw new AppError("Chưa cấu hình tài khoản máy chủ SMTP gửi mail trong hệ thống.", 500, "SMTP_NOT_CONFIGURED");
  }

  try {
    const result = await activeTransporter.sendMail({
      from: activeConfig.from || `"EC Voucher" <${activeConfig.user}>`,
      to: toEmail,
      subject: subject,
      html: content,
    });
    console.info(`[Mailer] Đã gửi mã OTP thành công đến email: ${toEmail}`);
    return result;
  } catch (err) {
    console.error(`[Mailer] Gửi mail qua SMTP thất bại (${err.message}) đến ${toEmail}`);
    throw new AppError(
      `Không thể gửi email đến "${toEmail}" qua máy chủ SMTP (${err.message}). Vui lòng kiểm tra lại địa chỉ email hoặc tài khoản gửi.`,
      400,
      "SMTP_SEND_FAILED"
    );
  }
}

module.exports = {
  sendOtpEmail,
  validateEmailDomain,
};
