const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASS, 
      },
    });
  }

  /**
   * Gửi email OTP
   * @param {string} toEmail - Email người nhận
   * @param {string} otp - Mã OTP 6 số
   */
  async sendOTP(toEmail, otp) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('[EmailService] SMTP chưa được cấu hình. Chỉ log OTP ra console: ', otp);
      return;
    }

    const mailOptions = {
      from: `"EC Voucher System" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: 'Mã OTP Đăng nhập EC Voucher',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: auto; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #4F46E5; text-align: center;">Mã Xác Thực OTP</h2>
          <p>Chào bạn,</p>
          <p>Bạn đã yêu cầu đăng nhập bằng mã OTP vào hệ thống <strong>EC Voucher</strong>.</p>
          <p>Mã xác thực của bạn là:</p>
          <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #111827; border-radius: 8px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="color: #d97706; font-size: 14px;">Mã này sẽ hết hạn sau <strong>5 phút</strong>. Vui lòng không chia sẻ mã này cho bất kỳ ai.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">Đây là email tự động, vui lòng không phản hồi.</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`[EmailService] Đã gửi OTP đến ${toEmail}`);
    } catch (error) {
      console.error('[EmailService] Lỗi khi gửi email:', error);
      throw new Error('Không thể gửi email OTP lúc này, vui lòng thử lại sau.');
    }
  }
}

module.exports = new EmailService();
