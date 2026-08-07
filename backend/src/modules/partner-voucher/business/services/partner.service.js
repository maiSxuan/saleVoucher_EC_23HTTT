const partnerRepository = require("../../data/repositories/partner.repository");
const branchRepository = require("../../data/repositories/branch.repository");
const { sendOtpEmail } = require("../../../../common/utils/mailer");

const pendingPartnerRegistrations = new Map(); // key: email -> { email, sdt, password, ho_ten, otp, expiresAt, attempts, isVerified }
const OTP_TTL_MS = 5 * 60 * 1000;

function genOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

class PartnerService {
  async getPartners(query) {
    const partners = await partnerRepository.findAll(query);
    const result = await Promise.all(
      partners.map(async (p) => {
        const branches = await branchRepository.findByPartnerId(p.ma_hs);
        return { ...p, branches };
      })
    );
    return result;
  }

  async getPartnerById(id) {
    const partner = await partnerRepository.findById(id);
    if (!partner) return null;
    const branches = await branchRepository.findByPartnerId(id);
    return { ...partner, branches };
  }

  async registerAccount(payload) {
    return await partnerRepository.createAccount(payload);
  }

  /**
   * Bước 1.1: Yêu cầu gửi mã OTP xác thực tài khoản Đăng ký đối tác
   */
  async requestRegisterOtp({ email, sdt, password, ho_ten }) {
    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      const err = new Error("Địa chỉ email không đúng định dạng.");
      err.status = 400;
      throw err;
    }

    if (!password || password.length < 6) {
      const err = new Error("Mật khẩu phải có ít nhất 6 ký tự.");
      err.status = 400;
      throw err;
    }

    // Kiểm tra trùng lặp email/tài khoản trên hệ thống
    const isExisting = await partnerRepository.checkAccountExists(cleanEmail);
    if (isExisting) {
      const err = new Error("Email hoặc tài khoản này đã được đăng ký trên hệ thống.");
      err.status = 409;
      throw err;
    }

    const otp = genOtp();
    pendingPartnerRegistrations.set(cleanEmail, {
      email: cleanEmail,
      sdt: sdt || "",
      password,
      ho_ten: ho_ten || cleanEmail.split("@")[0],
      otp,
      expiresAt: Date.now() + OTP_TTL_MS,
      attempts: 0,
      isVerified: false,
    });

    try {
      await sendOtpEmail(cleanEmail, otp, "register");
    } catch (mailErr) {
      console.warn("[PartnerService] Direct mailer send failed, OTP available in log/console:", mailErr.message);
    }

    return {
      success: true,
      email: cleanEmail,
      message: "Mã OTP xác thực đã được gửi đến email của bạn.",
      demoOtp: process.env.NODE_ENV !== "production" ? otp : undefined,
    };
  }

  /**
   * Bước 1.2: Xác thực mã OTP tài khoản
   */
  async verifyRegisterOtp({ email, otp }) {
    const cleanEmail = (email || "").trim().toLowerCase();
    const pending = pendingPartnerRegistrations.get(cleanEmail);

    if (!pending) {
      const err = new Error("Không tìm thấy yêu cầu đăng ký tài khoản hoặc đã hết hạn.");
      err.status = 400;
      throw err;
    }

    if (Date.now() > pending.expiresAt) {
      pendingPartnerRegistrations.delete(cleanEmail);
      const err = new Error("Mã OTP đã hết hạn. Vui lòng yêu cầu gửi lại mã.");
      err.status = 400;
      throw err;
    }

    if ((otp || "").trim() !== pending.otp) {
      pending.attempts += 1;
      if (pending.attempts >= 3) {
        pendingPartnerRegistrations.delete(cleanEmail);
        const err = new Error("Nhập sai quá 3 lần. Vui lòng thực hiện đăng ký lại.");
        err.status = 400;
        throw err;
      }
      const err = new Error(`Mã OTP không chính xác (${pending.attempts}/3 lần).`);
      err.status = 400;
      throw err;
    }

    // OTP đúng -> Tạo tài khoản chính thức trong DB
    const userAccount = await partnerRepository.createAccount({
      email: pending.email,
      password: pending.password,
      ho_ten: pending.ho_ten,
      sdt: pending.sdt,
    });

    pendingPartnerRegistrations.delete(cleanEmail);

    return {
      success: true,
      isVerified: true,
      message: "Xác thực tài khoản thành công!",
      userAccount,
    };
  }

  /**
   * Bước 1.3: Gửi lại mã OTP
   */
  async resendRegisterOtp({ email }) {
    const cleanEmail = (email || "").trim().toLowerCase();
    const pending = pendingPartnerRegistrations.get(cleanEmail);

    if (!pending) {
      const err = new Error("Không tìm thấy thông tin đăng ký. Vui lòng điền lại thông tin tài khoản.");
      err.status = 400;
      throw err;
    }

    const newOtp = genOtp();
    pending.otp = newOtp;
    pending.expiresAt = Date.now() + OTP_TTL_MS;
    pending.attempts = 0;
    pendingPartnerRegistrations.set(cleanEmail, pending);

    try {
      await sendOtpEmail(cleanEmail, newOtp, "register");
    } catch (mailErr) {
      console.warn("[PartnerService] Resend mailer error:", mailErr.message);
    }

    return {
      success: true,
      message: "Đã gửi lại mã OTP thành công!",
      demoOtp: process.env.NODE_ENV !== "production" ? newOtp : undefined,
    };
  }

  async checkTaxCodeUniqueness(mst) {
    return await partnerRepository.checkTaxCodeUniqueness(mst);
  }

  async createPartner(payload) {
    return await partnerRepository.create(payload);
  }

  async updatePartner(id, payload) {
    return await partnerRepository.update(id, payload);
  }

  async approvePartner(id, reason = "") {
    const updated = await partnerRepository.updateStatus(id, "Dang hoat dong");
    const branches = await branchRepository.findByPartnerId(id);
    await Promise.all(
      branches.map((b) => branchRepository.update(b.ma_chi_nhanh, { trang_thai: "Dang hoat dong" }))
    );
    return updated;
  }

  async rejectPartner(id, reason = "") {
    return await partnerRepository.updateStatus(id, "Tu choi", reason);
  }

  async lockUnlockPartner(id, isLocking, reason = "") {
    const status = isLocking ? "Tam khoa" : "Dang hoat dong";
    return await partnerRepository.updateStatus(id, status, reason);
  }
}

module.exports = new PartnerService();