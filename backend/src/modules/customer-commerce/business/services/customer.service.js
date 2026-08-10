/**
 * Purpose: Service xử lý logic khách hàng như profile, lịch sử và thông tin cá nhân.
 */
const bcrypt = require("bcryptjs");
const customerRepository = require("../../data/repositories/customer.repository");
const { sendOtpEmail } = require("../../../../common/utils/mailer");

const pendingRegistrations = new Map(); // key: loginInfo -> { gmail, hashedPassword, otp, expiresAt, attempts }
const OTP_TTL_MS = 5 * 60 * 1000;

function genOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

class CustomerService {
  async register({ loginInfo, password, confirmPassword }) {
    // A5: kiểm tra định dạng
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginInfo);

    if (!isEmail) {
      const err = new Error("Vui lòng nhập đúng định dạng địa chỉ email");
      err.status = 400;
      throw err;
    }
    if (!password || password.length < 6) {
      const err = new Error("Mật khẩu phải có ít nhất 6 ký tự");
      err.status = 400;
      throw err;
    }
    if (password !== confirmPassword) {
      const err = new Error("Mật khẩu xác nhận không khớp");
      err.status = 400;
      throw err;
    }

    // A6: kiểm tra trùng lặp
    const exists = await customerRepository.checkLoginInfoExists(loginInfo);
    if (exists) {
      const err = new Error("Email đã được đăng ký");
      err.status = 409;
      throw err;
    }

    // sinh họ tên tạm thời
    const defaultHoTen = loginInfo.includes("@")
      ? loginInfo.split("@")[0]
      : `Khách hàng ${loginInfo.slice(-4)}`;

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = genOtp();
    pendingRegistrations.set(loginInfo, {
      defaultHoTen,
      hashedPassword,
      otp,
      expiresAt: Date.now() + OTP_TTL_MS,
      attempts: 0,
    });

    try {
      await sendOtpEmail(loginInfo, otp);
    } catch (mailErr) {
      pendingRegistrations.delete(loginInfo); // gửi thất bại thì hủy luôn, để user thử lại
      console.error(
        "[CustomerService] Gửi email OTP thất bại:",
        mailErr.message,
      );
      const err = new Error(
        mailErr.message ||
          "Không gửi được email xác thực. Vui lòng kiểm tra lại địa chỉ email.",
      );
      err.status = mailErr.statusCode || mailErr.status || 400;
      throw err;
    }

    return {
      loginInfo,
      message: "Đã gửi mã xác thực, vui lòng kiểm tra email",
    };
  }

  async verifyOtp({ loginInfo, otp }) {
    const pending = pendingRegistrations.get(loginInfo);
    if (!pending) {
      const err = new Error("Không tìm thấy yêu cầu đăng ký");
      err.status = 400;
      throw err;
    }

    if (Date.now() > pending.expiresAt) {
      pendingRegistrations.delete(loginInfo);
      const err = new Error("Mã xác thực đã hết hạn");
      err.status = 400;
      throw err;
    }

    if (otp !== pending.otp) {
      pending.attempts += 1;
      if (pending.attempts >= 3) {
        pendingRegistrations.delete(loginInfo);
        const err = new Error("Nhập sai quá 3 lần, vui lòng đăng ký lại");
        err.status = 400;
        throw err;
      }
      const err = new Error(
        `Mã xác thực không đúng (${pending.attempts}/3 lần)`,
      );
      err.status = 400;
      throw err;
    }

    // OTP đúng -> mới thật sự tạo hồ sơ trong DB
    const { user, account } = await customerRepository.createCustomerAccount({
      ho_ten: pending.defaultHoTen,
      email: loginInfo.includes("@") ? loginInfo : null,
      loginInfo,
      hashedPassword: pending.hashedPassword,
    });
    pendingRegistrations.delete(loginInfo);

    return { userId: user.ma_nguoi_dung, ho_ten: user.ho_ten };
  }

  async resendOtp({ loginInfo }) {
    const pending = pendingRegistrations.get(loginInfo);
    if (!pending) {
      const err = new Error("Không tìm thấy yêu cầu đăng ký");
      err.status = 400;
      throw err;
    }
    pending.otp = genOtp();
    pending.expiresAt = Date.now() + OTP_TTL_MS;
    pending.attempts = 0;
    pending.otp = genOtp();
    pending.expiresAt = Date.now() + OTP_TTL_MS;
    pending.attempts = 0;
    await sendOtpEmail(loginInfo, pending.otp);
    return { message: "Đã gửi lại mã xác thực" };
  }

  async getProfile(userId) {
    const profile = await customerRepository.findProfileById(userId);
    if (!profile) {
      const err = new Error("Không tìm thấy hồ sơ khách hàng");
      err.status = 404;
      throw err;
    }
    return profile;
  }

  async updateProfile(userId, { ho_ten, email, sdt, ngay_sinh, gioi_tinh }) {
    const fieldErrors = {};
    if (!ho_ten || !ho_ten.trim())
      fieldErrors.ho_ten = "Họ và tên không được để trống";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      fieldErrors.email = "Email không hợp lệ";
    if (!sdt || !/^0\d{9}$/.test(sdt))
      fieldErrors.sdt = "Số điện thoại không hợp lệ";
    if (gioi_tinh && !["Nam", "Nu", "Khac"].includes(gioi_tinh))
      fieldErrors.gioi_tinh = "Giới tính không hợp lệ";

    if (Object.keys(fieldErrors).length > 0) {
      // dữ liệu cập nhật không hợp lệ
      const err = new Error("Dữ liệu cập nhật không hợp lệ");
      err.status = 400;
      err.details = { fieldErrors };
      throw err;
    }

    const duplicates = await customerRepository.findByEmailOrPhoneExcludingSelf(
      { email, sdt, userId },
    );
    if (duplicates.some((d) => d.email === email)) {
      const err = new Error("Email đã được sử dụng bởi tài khoản khác");
      err.status = 409;
      err.details = { fieldErrors: { email: "Email đã được sử dụng" } };
      throw err;
    }
    if (duplicates.some((d) => d.sdt === sdt)) {
      const err = new Error("Số điện thoại đã được sử dụng bởi tài khoản khác");
      err.status = 409;
      err.details = { fieldErrors: { sdt: "Số điện thoại đã được sử dụng" } };
      throw err;
    }

    return customerRepository.updateProfile(userId, {
      ho_ten: ho_ten.trim(),
      email,
      sdt,
      ngay_sinh: ngay_sinh || null,
      gioi_tinh: gioi_tinh || null,
    });
  }

  async changePassword(userId, { oldPassword, newPassword, confirmPassword }) {
    if (!oldPassword || !newPassword || !confirmPassword) {
      const err = new Error("Vui lòng điền đầy đủ các trường");
      err.status = 400;
      throw err;
    }
    if (newPassword.length < 6) {
      const err = new Error("Mật khẩu mới phải từ 6 ký tự");
      err.status = 400;
      throw err;
    }
    if (newPassword !== confirmPassword) {
      const err = new Error("Mật khẩu xác nhận không khớp");
      err.status = 400;
      throw err;
    }

    const account = await customerRepository.findAccountByUserId(userId);
    if (!account) {
      const err = new Error("Không tìm thấy tài khoản");
      err.status = 404;
      throw err;
    }

    const isMatch = await bcrypt.compare(oldPassword, account.mat_khau);
    if (!isMatch) {
      const err = new Error("Mật khẩu hiện tại không đúng");
      err.status = 400;
      throw err;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await customerRepository.updatePassword(account.ma_tk, hashedPassword);
    return { message: "Đổi mật khẩu thành công" };
  }
}

module.exports = new CustomerService();
