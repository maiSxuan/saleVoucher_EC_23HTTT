/**
 * Purpose: Gửi email dùng chung cho toàn backend (OTP, thông báo...).
 */
const nodemailer = require("nodemailer");
const { loadGmail } = require("../../config/environment");
const config = loadGmail();

const transporter = nodemailer.createTransport({
  host: config.host,
  port: Number(config.port) || 587,
  secure: config.secure === "true", // nếu port 465
  auth: {
    user: config.user,
    pass: config.pass,
  },
});

async function sendOtpEmail(toEmail, otp) {
  await transporter.sendMail({
    from: config.from || `"EC Voucher" <${config.user}>`,
    to: toEmail,
    subject: "Mã xác thực đăng ký tài khoản EC Voucher",
    html: `<p>Mã xác thực (OTP) của bạn là: <b style="font-size:20px">${otp}</b></p>
           <p>Mã có hiệu lực trong 5 phút. Vui lòng không chia sẻ mã này cho người khác.</p>`,
  });
}

module.exports = { sendOtpEmail };
