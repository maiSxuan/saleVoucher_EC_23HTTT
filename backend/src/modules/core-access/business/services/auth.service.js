/**
 * Purpose: Service xử lý logic authentication.
 * Login từ Supabase thật (bảng TAIKHOAN + NGUOIDUNG).
 * Ghi audit log sau mỗi lần login thành công hoặc thất bại.
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../../../../config/supabase');
const userRepository = require('../../data/repositories/user.repository');
const auditLogService = require('./audit-log.service');
const { DB_TO_JWT } = require('../../../../common/constants/roles');
const LOG_RESULT = require('../../../../common/constants/log-result');
const AppError = require('../../../../common/errors/AppError');
const UnauthorizedError = require('../../../../common/errors/UnauthorizedError');
const ForbiddenError = require('../../../../common/errors/ForbiddenError');
const emailService = require('./email.service');

const JWT_SECRET = process.env.JWT_SECRET || 'saleVoucher_EC';

const otpStore = new Map();

class AuthService {
  /**
   * Đăng nhập người dùng.
   * @param {string} email - Thông tin đăng nhập (email hoặc SĐT hoặc username)
   * @param {string} password - Mật khẩu
   * @returns {{ token, user }}
   */
  async login({ email, username, password }) {
    const loginIdentifier = (email || username || '').trim();

    if (!loginIdentifier || !password) {
      throw new AppError('Email/Tài khoản và mật khẩu là bắt buộc', 400, 'VALIDATION_ERROR');
    }

    // Lấy tài khoản từ Supabase (hỗ trợ email hoặc prefix username)
    const account = await userRepository.findAccountByLoginInfo(loginIdentifier);

    if (!account || !account.nguoidung) {
      await auditLogService.log({
        actorId: null,
        actorRole: null,
        action: 'LOGIN',
        targetType: 'TAIKHOAN',
        targetId: null,
        result: LOG_RESULT.THAT_BAI,
        reason: `Không tìm thấy tài khoản: ${loginIdentifier}`,
      });
      throw new UnauthorizedError('Email hoặc mật khẩu không đúng');
    }

    // Kiểm tra trạng thái tài khoản
    if (account.nguoidung.trang_thai !== 'Dang hoat dong') {
      await auditLogService.log({
        actorId: account.ma_tk,
        actorRole: null,
        action: 'LOGIN',
        targetType: 'TAIKHOAN',
        targetId: account.ma_tk,
        result: LOG_RESULT.THAT_BAI,
        reason: `Tài khoản Tạm khóa: ${account.nguoidung.trang_thai}`,
      });
      throw new ForbiddenError('Tài khoản đã Tạm khóa hoặc không hoạt động');
    }

    // Kiểm tra mật khẩu — hỗ trợ bcrypt hash và plain-text cho seed/test cũ.
    let isMatch = false;
    if (account.mat_khau.startsWith('$2a$') || account.mat_khau.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(password, account.mat_khau);
    } else {
      isMatch = password === account.mat_khau;
    }

    if (!isMatch) {
      await auditLogService.log({
        actorId: account.ma_tk,
        actorRole: null,
        action: 'LOGIN',
        targetType: 'TAIKHOAN',
        targetId: account.ma_tk,
        result: LOG_RESULT.THAT_BAI,
        reason: 'Sai mật khẩu',
      });
      throw new UnauthorizedError('Email hoặc mật khẩu không đúng');
    }

    // Map vai trò DB → JWT role
    const dbVaiTro = account.nguoidung.vai_tro;
    const mappedRole = DB_TO_JWT[dbVaiTro] || 'CUSTOMER';

    const userPayload = {
      id: account.nguoidung.ma_nguoi_dung,
      accountId: account.ma_tk,
      role: mappedRole,
      email: account.nguoidung.email,
      name: account.nguoidung.ho_ten,
      vai_tro_he_thong: dbVaiTro,
      ma_chi_nhanh: account.nguoidung.ma_chi_nhanh ?? null,
      ma_hsdn: account.nguoidung.ma_hsdn ?? null,
      ten_chi_nhanh: branchInfo?.ten_chi_nhanh ?? null,
      dia_chi_chi_nhanh: branchInfo?.dia_chi ?? null,
      khu_vuc_chi_nhanh: branchInfo?.khu_vuc ?? null,
    };

    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '1d' });

    // Ghi audit log thành công
    await auditLogService.log({
      actorId: account.ma_tk,
      actorRole: mappedRole,
      action: 'LOGIN',
      targetType: 'TAIKHOAN',
      targetId: account.ma_tk,
      result: LOG_RESULT.THANH_CONG,
    });

    return { token, accessToken: token, user: userPayload };
  }

  /**
   * Sinh mã OTP cho chức năng Quên mật khẩu.
   * Chặn đầu: Kiểm tra tính tồn tại của máy chủ SMTP/MX trước khi gửi.
   */
  async generateOTP(email) {
    if (!email) {
      throw new AppError('Email là bắt buộc', 400, 'VALIDATION_ERROR');
    }

    const account = await userRepository.findAccountByLoginInfo(email);
    if (!account || !account.nguoidung) {
      throw new AppError('Không tìm thấy tài khoản với email này', 404, 'USER_NOT_FOUND');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    try {
      // Gửi OTP qua email thật bằng Nodemailer (kiểm tra chặn đầu DNS/SMTP)
      await emailService.sendOtpEmail(email, otp, 'forgot_password');

      // Gửi email thành công mới lưu vào store và ghi audit log thành công
      otpStore.set(email, { otp, expiresAt });

      await auditLogService.log({
        actorId: account.ma_tk,
        actorRole: account.nguoidung.vai_tro,
        action: 'REQUEST_OTP',
        targetType: 'TAIKHOAN',
        targetId: account.ma_tk,
        result: LOG_RESULT.THANH_CONG,
        reason: 'Yêu cầu mã OTP quên mật khẩu thành công',
      });

      return otp;
    } catch (mailErr) {
      await auditLogService.log({
        actorId: account.ma_tk,
        actorRole: account.nguoidung.vai_tro,
        action: 'REQUEST_OTP',
        targetType: 'TAIKHOAN',
        targetId: account.ma_tk,
        result: LOG_RESULT.THAT_BAI,
        reason: `Gửi mã OTP thất bại: ${mailErr.message}`,
      });

      throw mailErr;
    }
  }

  /**
   * Đăng nhập bằng OTP.
   */
  async loginWithOTP({ email, otp }) {
    if (!email || !otp) {
      throw new AppError('Email và mã OTP là bắt buộc', 400, 'VALIDATION_ERROR');
    }

    const storedData = otpStore.get(email);
    if (!storedData) {
      throw new UnauthorizedError('Mã OTP không hợp lệ hoặc chưa được yêu cầu');
    }

    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(email);
      throw new UnauthorizedError('Mã OTP đã hết hạn. Vui lòng yêu cầu lại.');
    }

    if (storedData.otp !== otp) {
      throw new UnauthorizedError('Mã OTP không chính xác');
    }

    otpStore.delete(email);

    const account = await userRepository.findAccountByLoginInfo(email);
    if (!account || !account.nguoidung) {
      throw new UnauthorizedError('Tài khoản không tồn tại');
    }

    if (account.nguoidung.trang_thai !== 'Dang hoat dong') {
      throw new ForbiddenError('Tài khoản đã Tạm khóa hoặc không hoạt động');
    }

    const dbVaiTro = account.nguoidung.vai_tro;
    const mappedRole = DB_TO_JWT[dbVaiTro] || 'CUSTOMER';

    let branchInfo = null;
    if (account.nguoidung.ma_chi_nhanh) {
      const { data: bData } = await supabase
        .from('chinhanh')
        .select('ma_chi_nhanh, ten_chi_nhanh, dia_chi, khu_vuc')
        .eq('ma_chi_nhanh', account.nguoidung.ma_chi_nhanh)
        .maybeSingle();
      if (bData) branchInfo = bData;
    }

    const userPayload = {
      id: account.nguoidung.ma_nguoi_dung,
      accountId: account.ma_tk,
      role: mappedRole,
      email: account.nguoidung.email,
      name: account.nguoidung.ho_ten,
      vai_tro_he_thong: dbVaiTro,
      ma_chi_nhanh: account.nguoidung.ma_chi_nhanh ?? null,
      ma_hsdn: account.nguoidung.ma_hsdn ?? null,
      ten_chi_nhanh: branchInfo?.ten_chi_nhanh ?? null,
      dia_chi_chi_nhanh: branchInfo?.dia_chi ?? null,
      khu_vuc_chi_nhanh: branchInfo?.khu_vuc ?? null,
    };

    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '1d' });

    await auditLogService.log({
      actorId: account.ma_tk,
      actorRole: mappedRole,
      action: 'LOGIN_OTP',
      targetType: 'TAIKHOAN',
      targetId: account.ma_tk,
      result: LOG_RESULT.THANH_CONG,
    });

    return { token, accessToken: token, user: userPayload };
  }

  async getMe(token) {
    if (!token) {
      throw new UnauthorizedError('Thiếu token đăng nhập');
    }

    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new UnauthorizedError(
        error.name === 'TokenExpiredError' ? 'Token đã hết hạn' : 'Token không hợp lệ'
      );
    }
  }

  async logout() {
    // JWT hiện là stateless; client xóa token để kết thúc phiên.
    return { message: 'Đã đăng xuất' };
  }
}

module.exports = new AuthService();
