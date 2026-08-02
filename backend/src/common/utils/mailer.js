/**
 * Purpose: Gửi email dùng chung cho toàn backend (OTP, thông báo...).
 */
const nodemailer = require("nodemailer");
const { loadGmail, loadAuthGmail } = require("../../config/environment");

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

// Transporter dành cho Quên mật khẩu (dùng AUTH_SMTP_USER)
const authTransporter = nodemailer.createTransport({
  host: authConfig.host || "smtp.gmail.com",
  port: Number(authConfig.port) || 587,
  secure: Number(authConfig.port) === 465 || authConfig.secure === "true",
  auth: {
    user: authConfig.user,
    pass: authConfig.pass,
  },
});

async function sendOtpEmail(toEmail, otp, type = "register") {
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

  try {
    if (!activeConfig.user || !activeConfig.pass) {
      console.log(`[MAILER INFO] No SMTP config found. Generated OTP: [ ${otp} ] for ${toEmail}`);
      return;
    }
    await activeTransporter.sendMail({
      from: activeConfig.from || `"EC Voucher" <${activeConfig.user}>`,
      to: toEmail,
      subject: subject,
      html: content,
    });
    console.log(`[MAILER SUCCESS] Sent OTP ${otp} to ${toEmail}`);
  } catch (err) {
    console.warn(`[MAILER WARNING] Could not send email via SMTP (${err.message}). Generated OTP: [ ${otp} ] for ${toEmail}`);
  }
}

module.exports = { sendOtpEmail };
