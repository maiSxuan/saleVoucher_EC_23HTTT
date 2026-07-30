/**
 * Purpose: Service xử lý logic authentication.
 * Login từ Supabase thật (bảng TAIKHOAN + NGUOIDUNG).
 * Ghi audit log sau mỗi lần login thành công hoặc thất bại.
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../../data/repositories/user.repository');
const auditLogService = require('./audit-log.service');
const { DB_TO_JWT } = require('../../../../common/constants/roles');
const LOG_RESULT = require('../../../../common/constants/log-result');
const AppError = require('../../../../common/errors/AppError');
const UnauthorizedError = require('../../../../common/errors/UnauthorizedError');
const ForbiddenError = require('../../../../common/errors/ForbiddenError');

const JWT_SECRET = process.env.JWT_SECRET || 'saleVoucher_EC';

class AuthService {
  /**
   * Đăng nhập người dùng.
   * @param {string} email - Thông tin đăng nhập (email hoặc SĐT)
   * @param {string} password - Mật khẩu
   * @returns {{ token, user }}
   */
  async login({ email, password }) {
    if (!email || !password) {
      throw new AppError('Email và mật khẩu là bắt buộc', 400, 'VALIDATION_ERROR');
    }

    // Lấy tài khoản từ Supabase
    const account = await userRepository.findAccountByLoginInfo(email);

    if (!account || !account.nguoidung) {
      // Ghi log thất bại (non-strict — không chặn response lỗi)
      await auditLogService.log({
        actorId: null,
        actorRole: null,
        action: 'LOGIN',
        targetType: 'TAIKHOAN',
        targetId: null,
        result: LOG_RESULT.THAT_BAI,
        reason: `Không tìm thấy tài khoản: ${email}`,
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
        reason: `Tài khoản bị khóa: ${account.nguoidung.trang_thai}`,
      });
      throw new ForbiddenError('Tài khoản đã bị khóa hoặc không hoạt động');
    }

    // Kiểm tra mật khẩu — hỗ trợ bcrypt hash (pgcrypto gen_salt('bf'))
    let isMatch = false;
    if (account.mat_khau.startsWith('$2a$') || account.mat_khau.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(password, account.mat_khau);
    } else {
      // Fallback plain-text (chỉ dùng cho seed/test data)
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

    return { token, user: userPayload };
  }
}

module.exports = new AuthService();
