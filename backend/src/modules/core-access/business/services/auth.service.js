/**
 * Purpose: Service xử lý logic authentication.
 * Đây là nơi chứa business rule cho login/register/logout.
 */
class AuthService {
  async login({ email, password }) {
    if (!email || !password) {
      const err = new Error('Email và mật khẩu là bắt buộc');
      err.status = 400;
      throw err;
    }

    // Lấy tài khoản từ DB
    const account = await userRepository.findAccountByLoginInfo(email);
    if (!account || !account.nguoidung) {
      const err = new Error('Email hoặc mật khẩu không đúng');
      err.status = 401;
      throw err;
    }

    // Kiểm tra trạng thái
    if (account.nguoidung.trang_thai !== 'Dang hoat dong') {
      const err = new Error('Tài khoản đã bị khóa hoặc không hoạt động');
      err.status = 403;
      throw err;
    }

    // Kiểm tra mật khẩu (hỗ trợ hash từ PostgreSQL `crypt`)
    // Nếu dùng `pgcrypto` crypt('...', gen_salt('bf')), ta có thể so sánh bằng bcrypt.
    let isMatch = false;
    if (account.mat_khau.startsWith('$2a$') || account.mat_khau.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(password, account.mat_khau);
    } else {
      // Fallback nếu password lưu dạng plain-text
      isMatch = password === account.mat_khau;
    }

    if (!isMatch) {
      const err = new Error('Email hoặc mật khẩu không đúng');
      err.status = 401;
      throw err;
    }

    // Map role
    let mappedRole = 'CUSTOMER';
    const dbVaiTro = account.nguoidung.vai_tro;
    if (dbVaiTro === 'Admin') mappedRole = 'ADMIN';
    else if (dbVaiTro === 'Nguoi dai dien') mappedRole = 'PARTNER_OWNER';
    else if (dbVaiTro === 'Nhan vien ban hang' || dbVaiTro === 'Nhan vien quan ly voucher') mappedRole = 'PARTNER_STAFF';

    const userPayload = {
      id: account.nguoidung.ma_nguoi_dung,
      role: mappedRole,
      email: account.nguoidung.email,
      name: account.nguoidung.ho_ten,
      vai_tro_he_thong: dbVaiTro,
      ma_chi_nhanh: account.nguoidung.ma_chi_nhanh
    };

    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '1d' });

    return { token, user: userPayload };
  }
}

module.exports = new AuthService();
