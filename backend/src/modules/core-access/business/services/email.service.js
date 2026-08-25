/**
 * Dịch vụ gửi email của module Core Access.
 * Bọc mailer dùng chung để AuthService không phụ thuộc trực tiếp vào Resend.
 */
const { sendOtpEmail } = require("../../../../common/utils/mailer");

class EmailService {
  async sendOtpEmail(toEmail, otp, type = "forgot_password") {
    return sendOtpEmail(toEmail, otp, type);
  }
}

module.exports = new EmailService();
