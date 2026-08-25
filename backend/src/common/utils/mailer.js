/**
 * Purpose: Gửi email dùng chung cho toàn backend (OTP, thông báo...).
 * Chặn đầu và kiểm tra tính hợp lệ của địa chỉ email trước khi gửi qua SendGrid.
 */
const sgMail = require("@sendgrid/mail");
const QRCode = require("qrcode");
const { loadSendGrid, loadAuthSendGrid } = require("../../config/environment");
const AppError = require("../errors/AppError");

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getActiveMailer(type = "register") {
  require("dotenv").config();
  const isForgotPassword = type === "forgot_password";
  const cfg = isForgotPassword ? loadAuthSendGrid() : loadSendGrid();
  const apiKey = (cfg.apiKey || "").trim();
  const from = (cfg.from || "").trim();

  if (!apiKey || !from) {
    return null;
  }

  sgMail.setApiKey(apiKey);

  return {
    from,
  };
}

async function sendWithSendGrid(mailer, mailOptions) {
  const attachments = (mailOptions.attachments || []).map((attachment) => ({
    content: Buffer.isBuffer(attachment.content)
      ? attachment.content.toString("base64")
      : attachment.content,
    filename: attachment.filename,
    type: attachment.contentType || "application/octet-stream",
    disposition: attachment.contentDisposition || "attachment",
    ...(attachment.cid ? { content_id: attachment.cid } : {}),
  }));

  const [response] = await sgMail.send({
    ...mailOptions,
    attachments,
    from: mailer.from,
  });

  return response;
}

/**
 * Kiểm tra tính hợp lệ của tên miền email trước khi gửi qua SendGrid.
 * Chặn đầu các email cục bộ hoặc không có tên miền thực.
 */
async function validateEmailDomain(email) {
  if (!email || typeof email !== "string" || !email.includes("@")) {
    throw new AppError(
      "Địa chỉ email không đúng định dạng.",
      400,
      "INVALID_EMAIL_FORMAT",
    );
  }

  const parts = email.trim().split("@");
  if (parts.length !== 2) {
    throw new AppError(
      "Địa chỉ email không hợp lệ.",
      400,
      "INVALID_EMAIL_FORMAT",
    );
  }

  const [localPart, domain] = parts;
  const cleanDomain = domain.toLowerCase().trim();

  if (!localPart || !cleanDomain) {
    throw new AppError(
      "Địa chỉ email không được để trống phần tên hoặc tên miền.",
      400,
      "INVALID_EMAIL_FORMAT",
    );
  }

  // Chặn đầu các tên miền nội bộ / giả lập không thể nhận thư thực tế
  const blockedSuffixes = [
    ".local",
    ".test",
    ".example",
    ".invalid",
    "localhost",
    ".lan",
    ".internal",
    ".dummy",
  ];
  if (
    blockedSuffixes.some(
      (suffix) =>
        cleanDomain.endsWith(suffix) || cleanDomain === suffix.replace(".", ""),
    )
  ) {
    throw new AppError(
      `Địa chỉ email với tên miền "@${cleanDomain}" là email nội bộ/giả lập, không có máy chủ nhận thư (SMTP) trên Internet. Vui lòng sử dụng địa chỉ email thực tế (ví dụ: @gmail.com, @yahoo.com...).`,
      400,
      "DUMMY_DOMAIN_NOT_ALLOWED",
    );
  }

  // Đã kiểm tra tính hợp lệ tên miền email
  return true;
}

/**
 * Gửi email OTP (Đăng ký hoặc Quên mật khẩu)
 * Chặn đầu kiểm tra máy chủ SMTP trước khi gửi.
 */
async function sendOtpEmail(toEmail, otp, type = "register") {
  // 1. Chặn đầu: Kiểm tra định dạng và tên miền email
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
    : `<div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: auto; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #2563EB; text-align: center;">Mã Xác Thực Đăng Ký Tài Khoản</h2>
        <p>Chào bạn,</p>
        <p>Cảm ơn bạn đã đăng ký tài khoản trên hệ thống <strong>EC Voucher</strong>.</p>
        <p>Mã xác thực OTP của bạn là:</p>
        <div style="background-color: #eff6ff; padding: 15px; text-align: center; font-size: 26px; font-weight: bold; letter-spacing: 6px; color: #1d4ed8; border-radius: 8px; margin: 20px 0; border: 1px solid #bfdbfe;">
          ${otp}
        </div>
        <p style="color: #d97706; font-size: 14px;">Mã này có hiệu lực trong <strong>5 phút</strong>. Vui lòng không chia sẻ mã này cho bất kỳ ai.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #9ca3af; text-align: center;">Đây là email tự động từ hệ thống EC Voucher.</p>
      </div>`;

  const mailerObj = getActiveMailer(type);

  if (!mailerObj) {
    console.error(
      `[Mailer] Chưa cấu hình SENDGRID_API_KEY/SENDGRID_FROM cho tác vụ ${type}`,
    );
    throw new AppError(
      "Chưa cấu hình SendGrid API key hoặc địa chỉ email gửi trong hệ thống.",
      500,
      "SENDGRID_NOT_CONFIGURED",
    );
  }

  try {
    const result = await sendWithSendGrid(mailerObj, {
      to: toEmail,
      subject: subject,
      html: content,
    });
    console.info(`[Mailer] Đã gửi mã OTP thành công đến email: ${toEmail}`);
    return result;
  } catch (err) {
    console.error(
      `[Mailer] Gửi mail qua SendGrid thất bại (${err.message}) đến ${toEmail}`,
    );
    throw new AppError(
      `Không thể gửi email đến "${toEmail}" qua SendGrid (${err.message}). Vui lòng kiểm tra lại địa chỉ gửi và cấu hình SendGrid.`,
      400,
      "SENDGRID_SEND_FAILED",
    );
  }
}

/**
 * Send a transactional notification (voucher delivery, complaint result, ...).
 * Callers decide whether a delivery failure blocks their business workflow.
 */
async function sendNotificationEmail(
  toEmail,
  {
    subject,
    title,
    message,
    voucherCode,
    voucherDetails = null,
    qrValue = null,
  } = {},
) {
  await validateEmailDomain(toEmail);

  const mailerObj = getActiveMailer("register");
  if (!mailerObj) {
    throw new AppError(
      "Chưa cấu hình SendGrid API key hoặc địa chỉ email gửi trong hệ thống.",
      500,
      "SENDGRID_NOT_CONFIGURED",
    );
  }

  const safeTitle = escapeHtml(title || "Thông báo từ EC Voucher");
  const safeMessage = escapeHtml(
    message || "Thông tin tài khoản của bạn vừa được cập nhật.",
  );
  const safeVoucherCode = escapeHtml(voucherCode);
  const formatDate = (value) => {
    if (!value) return "Không giới hạn";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? escapeHtml(value)
      : date.toLocaleString("vi-VN");
  };
  const formatCurrency = (value) => {
    if (value === null || value === undefined || value === "")
      return "Chưa cập nhật";
    const amount = Number(value);
    return Number.isFinite(amount)
      ? `${amount.toLocaleString("vi-VN")} đ`
      : "Chưa cập nhật";
  };
  const codeBlock = voucherCode
    ? `<div style="margin:20px 0;padding:16px;text-align:center;border:1px solid #bfdbfe;border-radius:8px;background:#eff6ff;font-size:24px;font-weight:700;letter-spacing:3px;color:#1d4ed8">${safeVoucherCode}</div>`
    : "";
  const voucherBlock = voucherDetails
    ? `<div style="margin:20px 0;padding:16px;border:1px solid #e5e7eb;border-radius:10px;background:#f8fafc">
        <div style="font-size:12px;font-weight:700;letter-spacing:.08em;color:#64748b;margin-bottom:4px">THÔNG TIN VOUCHER ĐÃ MUA</div>
        <div style="font-size:17px;font-weight:700;color:#0f172a;margin-bottom:12px">${escapeHtml(voucherDetails.name || "Voucher đã mua")}</div>
        <table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px;color:#475569">
          <tr><td style="padding:5px 8px 5px 0">Mã đơn hàng</td><td style="padding:5px 0;font-weight:600;color:#0f172a">${escapeHtml(voucherDetails.orderId || "")}</td></tr>
          <tr><td style="padding:5px 8px 5px 0">Mã voucher mua</td><td style="padding:5px 0;font-weight:600;color:#0f172a">${escapeHtml(voucherDetails.purchaseId || "")}</td></tr>
          <tr><td style="padding:5px 8px 5px 0">Giá đã mua</td><td style="padding:5px 0;font-weight:600;color:#0f172a">${formatCurrency(voucherDetails.purchasePrice)}</td></tr>
          <tr><td style="padding:5px 8px 5px 0">Trạng thái</td><td style="padding:5px 0;font-weight:600;color:#047857">${escapeHtml(voucherDetails.status || "Chưa sử dụng")}</td></tr>
          <tr><td style="padding:5px 8px 5px 0">Phát hành lúc</td><td style="padding:5px 0;font-weight:600;color:#0f172a">${formatDate(voucherDetails.issuedAt)}</td></tr>
          <tr><td style="padding:5px 8px 5px 0">Hiệu lực từ</td><td style="padding:5px 0;font-weight:600;color:#0f172a">${formatDate(voucherDetails.validFrom)}</td></tr>
          <tr><td style="padding:5px 8px 5px 0">Hiệu lực đến</td><td style="padding:5px 0;font-weight:600;color:#0f172a">${formatDate(voucherDetails.validUntil)}</td></tr>
        </table>
        ${voucherDetails.conditions ? `<div style="margin-top:12px;padding-top:12px;border-top:1px solid #e2e8f0;font-size:13px;line-height:1.5;color:#64748b"><strong style="color:#334155">Điều kiện áp dụng:</strong> ${escapeHtml(voucherDetails.conditions)}</div>` : ""}
      </div>`
    : "";

  let qrAttachment = null;
  let qrDownloadAttachment = null;
  let qrBlock = "";
  if (voucherCode && (qrValue || voucherDetails)) {
    try {
      const qrContent = String(qrValue || voucherCode).trim();
      const qrCid = `voucher-qr-${String(voucherDetails?.purchaseId || Date.now()).replace(/[^a-zA-Z0-9]/g, "")}@snowvoucher`;
      const qrBuffer = await QRCode.toBuffer(qrContent, {
        type: "png",
        errorCorrectionLevel: "H",
        margin: 2,
        width: 240,
      });
      qrAttachment = {
        filename: "voucher-qr.png",
        content: qrBuffer,
        cid: qrCid,
        contentType: "image/png",
        contentDisposition: "inline",
      };
      qrDownloadAttachment = {
        filename: "ma-qr-voucher.png",
        content: qrBuffer,
        contentType: "image/png",
        contentDisposition: "attachment",
      };
      qrBlock = `<div style="margin:20px 0;text-align:center">
        <div style="font-size:15px;font-weight:700;color:#0f172a;margin-bottom:8px">Mã QR voucher</div>
        <img src="cid:${qrCid}" alt="Mã QR voucher" width="240" height="240" style="display:block;width:240px;height:240px;margin:0 auto;border:1px solid #e5e7eb;border-radius:10px" />
        <div style="margin-top:8px;font-size:12px;color:#64748b">Đưa mã QR này cho nhân viên tại quầy để sử dụng.</div>
      </div>`;
    } catch (error) {
      throw new AppError(
        `Không thể tạo mã QR cho voucher (${error.message}).`,
        500,
        "QR_GENERATION_FAILED",
      );
    }
  }

  try {
    return await sendWithSendGrid(mailerObj, {
      to: toEmail,
      subject: subject || safeTitle,
      html: `<div style="font-family:Arial,sans-serif;padding:20px;max-width:560px;margin:auto;border:1px solid #e5e7eb;border-radius:10px">
        <h2 style="color:#2563eb">${safeTitle}</h2>
        <p>${safeMessage}</p>
        ${voucherBlock}
        ${codeBlock}
        ${qrBlock}
        <p style="font-size:12px;color:#9ca3af">Đây là email tự động từ hệ thống EC Voucher.</p>
      </div>`,
      attachments: qrAttachment ? [qrAttachment, qrDownloadAttachment] : [],
    });
  } catch (err) {
    throw new AppError(
      `Không thể gửi thông báo đến "${toEmail}" qua SendGrid (${err.message}).`,
      400,
      "SENDGRID_SEND_FAILED",
    );
  }
}

module.exports = {
  sendOtpEmail,
  sendNotificationEmail,
  validateEmailDomain,
};
