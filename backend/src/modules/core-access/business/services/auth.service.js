/**
 * Purpose: Service xử lý logic authentication.
 * Login từ Supabase thật (bảng TAIKHOAN + NGUOIDUNG).
 * Ghi audit log sau mỗi lần login thành công hoặc thất bại.
 *
 * JWT Flow:
 *  - Login → sinh accessToken (1440m) + refreshToken (7d)
 *  - refreshToken lưu trong refreshTokenStore (in-memory Map)
 *  - POST /auth/refresh → verify refreshToken → cấp accessToken mới
 *  - POST /auth/logout  → revoke refreshToken khỏi store
 */
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const supabase = require("../../../../config/supabase");
const userRepository = require("../../data/repositories/user.repository");
const auditLogService = require("./audit-log.service");
const { DB_TO_JWT } = require("../../../../common/constants/roles");
const LOG_RESULT = require("../../../../common/constants/log-result");
const AppError = require("../../../../common/errors/AppError");
const UnauthorizedError = require("../../../../common/errors/UnauthorizedError");
const ForbiddenError = require("../../../../common/errors/ForbiddenError");
const emailService = require("./email.service");
const { loadJwt } = require("../../../../config/environment");

const jwtConfig = loadJwt();
const JWT_SECRET = jwtConfig.secret;
const JWT_REFRESH_SECRET = jwtConfig.refreshSecret;
const ACCESS_TOKEN_EXPIRY = jwtConfig.accessTokenExpiry;
const REFRESH_TOKEN_EXPIRY = jwtConfig.refreshTokenExpiry;

// ---------------------------------------------------------------
// In-memory stores (đủ dùng cho môi trường học tập / dev)
// Nếu cần production: thay bằng Redis hoặc bảng DB refresh_tokens
// ---------------------------------------------------------------
const otpStore = new Map(); // key: email → { otp, expiresAt }
const refreshTokenStore = new Map(); // key: refreshToken → userPayload
const loginFailureStore = new Map(); // key: accountId → { count }

// ---------------------------------------------------------------
// Helper: Sinh cặp access + refresh token từ userPayload
// ---------------------------------------------------------------
function generateTokenPair(userPayload) {
  const accessToken = jwt.sign(userPayload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

  const refreshToken = jwt.sign(
    { id: userPayload.id, accountId: userPayload.accountId },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY },
  );

  // Lưu vào store để có thể revoke
  refreshTokenStore.set(refreshToken, userPayload);

  return { accessToken, refreshToken };
}

// ---------------------------------------------------------------
// Helper: Lấy thêm thông tin hồ sơ DN + chi nhánh
// ---------------------------------------------------------------
async function enrichUserPayload(account) {
  let maHsdn = account.nguoidung.ma_hsdn || null;
  let tenDn = null;

  if (!maHsdn) {
    const { data: currentUser } = await supabase
      .from("nguoidung")
      .select("ma_hsdn")
      .eq("ma_nguoi_dung", account.nguoidung.ma_nguoi_dung)
      .maybeSingle();
    if (currentUser?.ma_hsdn) maHsdn = currentUser.ma_hsdn;
  }

  if (maHsdn) {
    const { data: hsData } = await supabase
      .from("hosodn")
      .select("ma_hs, ten_dn")
      .eq("ma_hs", maHsdn)
      .maybeSingle();
    if (hsData) tenDn = hsData.ten_dn;
  }

  let branchInfo = null;
  if (account.nguoidung.ma_chi_nhanh) {
    const { data: bData } = await supabase
      .from("chinhanh")
      .select("ma_chi_nhanh, ten_chi_nhanh, dia_chi, khu_vuc, ma_hs")
      .eq("ma_chi_nhanh", account.nguoidung.ma_chi_nhanh)
      .maybeSingle();
    if (bData) {
      branchInfo = bData;
      if (!maHsdn && bData.ma_hs) maHsdn = bData.ma_hs;
    }
  }

  return { maHsdn, tenDn, branchInfo };
}

class AuthService {
  /**
   * Đăng nhập người dùng.
   * @returns {{ accessToken, refreshToken, user }}
   */
  async login({ email, username, password }) {
    const loginIdentifier = (email || username || "").trim();

    if (!loginIdentifier || !password) {
      throw new AppError(
        "Email/Tài khoản và mật khẩu là bắt buộc",
        400,
        "VALIDATION_ERROR",
      );
    }

    const account =
      await userRepository.findAccountByLoginInfo(loginIdentifier);

    if (!account || !account.nguoidung) {
      await auditLogService.log({
        actorId: null,
        actorRole: null,
        action: "LOGIN",
        targetType: "TAIKHOAN",
        targetId: null,
        result: LOG_RESULT.THAT_BAI,
        reason: `Không tìm thấy tài khoản: ${loginIdentifier}`,
      });
      throw new UnauthorizedError("Email hoặc mật khẩu không đúng");
    }

    const isCustomer = account.nguoidung.vai_tro === "Khach hang";

    if (account.nguoidung.trang_thai === "Tam khoa") {
      await auditLogService.log({
        actorId: account.ma_tk,
        actorRole: account.nguoidung.vai_tro,
        action: "LOGIN",
        targetType: "TAIKHOAN",
        targetId: account.ma_tk,
        result: LOG_RESULT.THAT_BAI,
        reason: "Tài khoản đã bị tạm khóa",
      });
      throw new ForbiddenError(
        "Tài khoản đã tạm khóa, vui lòng liên hệ nkngan23@clc.fitus.edu.vn để mở khóa tài khoản",
      );
    }

    // Kiểm tra mật khẩu — hỗ trợ bcrypt hash và plain-text cho seed/test cũ.
    let isMatch = false;
    if (
      account.mat_khau.startsWith("$2a$") ||
      account.mat_khau.startsWith("$2b$")
    ) {
      isMatch = await bcrypt.compare(password, account.mat_khau);
    } else {
      isMatch = password === account.mat_khau;
    }

    if (!isMatch) {
      let failureState = loginFailureStore.get(account.ma_tk) || { count: 0 };
      failureState.count += 1;
      loginFailureStore.set(account.ma_tk, failureState);

      if (isCustomer) {
        if (failureState.count >= 5) {
          await userRepository.updateStatus(
            account.nguoidung.ma_nguoi_dung,
            "Tam khoa",
          );
          loginFailureStore.delete(account.ma_tk);

          await auditLogService.log({
            actorId: account.ma_tk,
            actorRole: account.nguoidung.vai_tro,
            action: "LOGIN",
            targetType: "TAIKHOAN",
            targetId: account.ma_tk,
            result: LOG_RESULT.THAT_BAI,
            reason: "Sai mật khẩu 5 lần liên tiếp -> khóa tài khoản",
          });

          throw new ForbiddenError(
            "Tài khoản đã tạm khóa, vui lòng liên hệ với admin để mở khóa tài khoản",
          );
        } else {
          await auditLogService.log({
            actorId: account.ma_tk,
            actorRole: account.nguoidung.vai_tro,
            action: "LOGIN",
            targetType: "TAIKHOAN",
            targetId: account.ma_tk,
            result: LOG_RESULT.THAT_BAI,
            reason: `Sai mật khẩu lần ${failureState.count}`,
          });
          throw new UnauthorizedError(
            `Email hoặc mật khẩu không đúng (${failureState.count}/5 lần thất bại)`,
          );
        }
      }

      await auditLogService.log({
        actorId: account.ma_tk,
        actorRole: account.nguoidung.vai_tro,
        action: "LOGIN",
        targetType: "TAIKHOAN",
        targetId: account.ma_tk,
        result: LOG_RESULT.THAT_BAI,
        reason: `Sai mật khẩu`,
      });
      throw new UnauthorizedError("Email hoặc mật khẩu không đúng");
    }

    // Đăng nhập thành công -> xóa trạng thái lỗi sai mật khẩu.
    if (isCustomer) {
      loginFailureStore.delete(account.ma_tk);
    }

    const dbVaiTro = account.nguoidung.vai_tro;
    const mappedRole = DB_TO_JWT[dbVaiTro] || "CUSTOMER";

    const { maHsdn, tenDn, branchInfo } = await enrichUserPayload(account);

    const userPayload = {
      id: account.nguoidung.ma_nguoi_dung,
      accountId: account.ma_tk,
      role: mappedRole,
      email: account.nguoidung.email,
      name: account.nguoidung.ho_ten,
      vai_tro_he_thong: dbVaiTro,
      ma_chi_nhanh: account.nguoidung.ma_chi_nhanh ?? null,
      ma_hsdn: maHsdn,
      ten_doanh_nghiep: tenDn,
      ten_chi_nhanh: branchInfo?.ten_chi_nhanh ?? null,
      dia_chi_chi_nhanh: branchInfo?.dia_chi ?? null,
      khu_vuc_chi_nhanh: branchInfo?.khu_vuc ?? null,
    };

    const { accessToken, refreshToken } = generateTokenPair(userPayload);

    await auditLogService.log({
      actorId: account.ma_tk,
      actorRole: mappedRole,
      action: "LOGIN",
      targetType: "TAIKHOAN",
      targetId: account.ma_tk,
      result: LOG_RESULT.THANH_CONG,
    });

    // Tương thích ngược: trả thêm `token` field
    return { accessToken, token: accessToken, refreshToken, user: userPayload };
  }

  /**
   * Sinh Access Token mới từ Refresh Token còn hạn.
   * @param {string} refreshToken
   * @returns {{ accessToken, refreshToken }}
   */
  async refreshAccessToken(refreshToken) {
    if (!refreshToken) {
      throw new UnauthorizedError("Thiếu refresh token");
    }

    // Kiểm tra token có trong store (chưa bị revoke)
    if (!refreshTokenStore.has(refreshToken)) {
      throw new UnauthorizedError(
        "Refresh token không hợp lệ hoặc đã bị thu hồi",
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (error) {
      // Xóa khỏi store nếu hết hạn/sai
      refreshTokenStore.delete(refreshToken);
      throw new UnauthorizedError(
        error.name === "TokenExpiredError"
          ? "Refresh token đã hết hạn. Vui lòng đăng nhập lại."
          : "Refresh token không hợp lệ.",
      );
    }

    // Lấy full userPayload từ store để sign access token mới
    const userPayload = refreshTokenStore.get(refreshToken);

    // Revoke refresh token cũ (Rotation: mỗi lần refresh → token mới)
    refreshTokenStore.delete(refreshToken);

    // Tạo cặp token mới
    const tokens = generateTokenPair(userPayload);

    return {
      accessToken: tokens.accessToken,
      token: tokens.accessToken, // tương thích ngược
      refreshToken: tokens.refreshToken,
    };
  }

  /**
   * Thu hồi Refresh Token (dùng khi Logout).
   * @param {string} refreshToken
   */
  revokeRefreshToken(refreshToken) {
    if (refreshToken) {
      refreshTokenStore.delete(refreshToken);
    }
  }

  /**
   * Sinh mã OTP cho chức năng Quên mật khẩu.
   */
  /**
   * Sinh mã OTP cho chức năng Quên mật khẩu (UC-BUS-05).
   * Hỗ trợ tìm tài khoản theo Email hoặc Số điện thoại đăng ký.
   */
  async generateOTP(emailOrPhone) {
    const cleanInfo = (emailOrPhone || "").trim();
    if (!cleanInfo) {
      throw new AppError(
        "Vui lòng nhập email đã đăng ký",
        400,
        "VALIDATION_ERROR",
      );
    }

    const account = await userRepository.findAccountByLoginInfo(cleanInfo);
    if (!account || !account.nguoidung) {
      throw new AppError(
        "Không tìm thấy tài khoản tương ứng với thông tin đã cung cấp",
        404,
        "USER_NOT_FOUND",
      );
    }

    const targetEmail =
      account.nguoidung.email || (cleanInfo.includes("@") ? cleanInfo : null);
    if (!targetEmail) {
      throw new AppError(
        "Tài khoản chưa được cấu hình địa chỉ email hợp lệ để nhận mã xác thực",
        400,
        "EMAIL_NOT_CONFIGURED",
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    try {
      // Gửi OTP qua email thật bằng Nodemailer (kiểm tra chặn đầu DNS/SMTP)
      await emailService.sendOtpEmail(targetEmail, otp, "forgot_password");

      // Gửi email thành công mới lưu vào store và ghi audit log thành công
      otpStore.set(targetEmail.toLowerCase(), {
        otp,
        expiresAt,
        accountId: account.ma_tk,
      });
      if (cleanInfo.toLowerCase() !== targetEmail.toLowerCase()) {
        otpStore.set(cleanInfo.toLowerCase(), {
          otp,
          expiresAt,
          accountId: account.ma_tk,
        });
      }

      await auditLogService.log({
        actorId: account.ma_tk,
        actorRole: account.nguoidung.vai_tro,
        action: "REQUEST_OTP",
        targetType: "TAIKHOAN",
        targetId: account.ma_tk,
        result: LOG_RESULT.THANH_CONG,
        reason: "Yêu cầu mã OTP quên mật khẩu thành công",
      });

      // Tạo chuỗi che giấu email (ví dụ: c***r@gmail.com)
      const maskedEmail = targetEmail.replace(
        /^(.)(.*)(@.*)$/,
        (_, first, middle, domain) => {
          return first + "*".repeat(Math.max(middle.length, 3)) + domain;
        },
      );

      return {
        email: targetEmail,
        maskedEmail,
        expiresIn: 300,
      };
    } catch (mailErr) {
      await auditLogService.log({
        actorId: account.ma_tk,
        actorRole: account.nguoidung.vai_tro,
        action: "REQUEST_OTP",
        targetType: "TAIKHOAN",
        targetId: account.ma_tk,
        result: LOG_RESULT.THAT_BAI,
        reason: `Gửi mã OTP thất bại: ${mailErr.message}`,
      });
      throw mailErr;
    }
  }

  /**
   * Đăng nhập bằng OTP.
   * @returns {{ accessToken, refreshToken, user }}
   */
  async loginWithOTP({ email, otp }) {
    if (!email || !otp) {
      throw new AppError(
        "Email và mã OTP là bắt buộc",
        400,
        "VALIDATION_ERROR",
      );
    }

    const storedData = otpStore.get(email);
    if (!storedData) {
      throw new UnauthorizedError("Mã OTP không hợp lệ hoặc chưa được yêu cầu");
    }

    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(email);
      throw new UnauthorizedError("Mã OTP đã hết hạn. Vui lòng yêu cầu lại.");
    }

    if (storedData.otp !== otp) {
      throw new UnauthorizedError("Mã OTP không chính xác");
    }

    otpStore.delete(email);

    const account = await userRepository.findAccountByLoginInfo(email);
    if (!account || !account.nguoidung) {
      throw new UnauthorizedError("Tài khoản không tồn tại");
    }

    if (account.nguoidung.trang_thai !== "Dang hoat dong") {
      throw new ForbiddenError("Tài khoản đã Tạm khóa hoặc không hoạt động");
    }

    const dbVaiTro = account.nguoidung.vai_tro;
    const mappedRole = DB_TO_JWT[dbVaiTro] || "CUSTOMER";

    const { maHsdn, tenDn, branchInfo } = await enrichUserPayload(account);

    const userPayload = {
      id: account.nguoidung.ma_nguoi_dung,
      accountId: account.ma_tk,
      role: mappedRole,
      email: account.nguoidung.email,
      name: account.nguoidung.ho_ten,
      vai_tro_he_thong: dbVaiTro,
      ma_chi_nhanh: account.nguoidung.ma_chi_nhanh ?? null,
      ma_hsdn: maHsdn,
      ten_doanh_nghiep: tenDn,
      ten_chi_nhanh: branchInfo?.ten_chi_nhanh ?? null,
      dia_chi_chi_nhanh: branchInfo?.dia_chi ?? null,
      khu_vuc_chi_nhanh: branchInfo?.khu_vuc ?? null,
    };

    const { accessToken, refreshToken } = generateTokenPair(userPayload);

    await auditLogService.log({
      actorId: account.ma_tk,
      actorRole: mappedRole,
      action: "LOGIN_OTP",
      targetType: "TAIKHOAN",
      targetId: account.ma_tk,
      result: LOG_RESULT.THANH_CONG,
    });

    return { accessToken, token: accessToken, refreshToken, user: userPayload };
  }

  async getMe(token) {
    if (!token) {
      throw new UnauthorizedError("Thiếu token đăng nhập");
    }

    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new UnauthorizedError(
        error.name === "TokenExpiredError"
          ? "Token đã hết hạn"
          : "Token không hợp lệ",
      );
    }
  }

  /**
   * UC-BUS-05 (Bước 11 / A11): Xác minh OTP hợp lệ mà KHÔNG xóa.
   * Dùng trước bước đặt mật khẩu mới để kiểm tra và báo lỗi sớm (A11).
   * @param {{ email: string, otp: string }}
   * @returns {{ valid: true }}
   */
  verifyOtp({ email, otp }) {
    const cleanInfo = (email || "").trim().toLowerCase();
    const cleanOtp = (otp || "").trim();

    if (!cleanInfo || !cleanOtp) {
      throw new AppError(
        "Thông tin tài khoản và mã xác thực là bắt buộc",
        400,
        "VALIDATION_ERROR",
      );
    }

    const storedData = otpStore.get(cleanInfo);
    if (!storedData) {
      throw new UnauthorizedError(
        "Mã xác thực không hợp lệ hoặc chưa được yêu cầu",
      );
    }

    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(cleanInfo);
      throw new UnauthorizedError(
        "Mã xác thực đã hết hạn. Vui lòng yêu cầu gửi lại mã mới.",
      );
    }

    if (storedData.otp !== cleanOtp) {
      throw new UnauthorizedError("Mã xác thực không chính xác");
    }

    return { valid: true };
  }

  /**
   * UC-BUS-05 (Bước 15-16): Đặt lại mật khẩu sau khi mã xác thực hợp lệ.
   * NFR-02: Hash bcrypt trước khi lưu.
   * NFR-03/E3: Nếu DB thất bại, giữ nguyên mật khẩu cũ.
   * NFR-06: OTP chỉ bị xóa sau khi DB lưu thành công.
   * @param {{ email, otp, newPassword, confirmPassword }}
   */
  async resetPassword({ email, otp, newPassword, confirmPassword }) {
    const cleanInfo = (email || "").trim();
    const cleanOtp = (otp || "").trim();

    if (!cleanInfo || !cleanOtp || !newPassword) {
      throw new AppError(
        "Thông tin tài khoản, mã xác thực và mật khẩu mới là bắt buộc",
        400,
        "VALIDATION_ERROR",
      );
    }

    // A11: Xác minh mã OTP trước khi tiếp tục
    this.verifyOtp({ email: cleanInfo, otp: cleanOtp });

    if (newPassword.length < 6) {
      throw new AppError(
        "Mật khẩu mới phải có ít nhất 6 ký tự",
        400,
        "WEAK_PASSWORD",
      );
    }

    if (confirmPassword !== undefined && newPassword !== confirmPassword) {
      throw new AppError(
        "Mật khẩu mới và xác nhận mật khẩu không khớp",
        400,
        "PASSWORD_MISMATCH",
      );
    }

    // E1: Lấy tài khoản
    const account = await userRepository.findAccountByLoginInfo(cleanInfo);
    if (!account || !account.nguoidung) {
      throw new AppError(
        "Không tìm thấy tài khoản tương ứng",
        404,
        "USER_NOT_FOUND",
      );
    }

    // NFR-02: Hash mật khẩu bằng bcrypt trước khi lưu
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // E3: Cập nhật DB — nếu thất bại, giữ nguyên mật khẩu cũ
    try {
      await userRepository.updatePassword(account.ma_tk, hashedPassword);
    } catch (dbError) {
      await auditLogService.log({
        actorId: account.ma_tk,
        actorRole: account.nguoidung.vai_tro,
        action: "RESET_PASSWORD",
        targetType: "TAIKHOAN",
        targetId: account.ma_tk,
        result: LOG_RESULT.THAT_BAI,
        reason: "Lưu mật khẩu vào DB thất bại: " + dbError.message,
      });
      throw new AppError(
        "Không thể cập nhật mật khẩu mới. Mật khẩu hiện tại của bạn vẫn được giữ nguyên.",
        500,
        "RESET_PASSWORD_FAILED",
      );
    }

    // NFR-06: Chỉ xóa OTP sau khi DB lưu thành công
    otpStore.delete(cleanInfo.toLowerCase());
    if (account.nguoidung.email) {
      otpStore.delete(account.nguoidung.email.toLowerCase());
    }

    await auditLogService.log({
      actorId: account.ma_tk,
      actorRole: account.nguoidung.vai_tro,
      action: "RESET_PASSWORD",
      targetType: "TAIKHOAN",
      targetId: account.ma_tk,
      result: LOG_RESULT.THANH_CONG,
      reason: "Đặt lại mật khẩu thành công qua OTP",
    });

    return { message: "Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại." };
  }

  async logout(refreshToken) {
    // Thu hồi refresh token nếu có
    this.revokeRefreshToken(refreshToken);
    return { message: "Đã đăng xuất" };
  }
}

module.exports = new AuthService();
