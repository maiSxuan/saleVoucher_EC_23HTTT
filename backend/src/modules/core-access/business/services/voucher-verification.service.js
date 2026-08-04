/**
 * Purpose: Service kiểm tra tính hợp lệ của voucher trước khi sử dụng.
 */
class VoucherVerificationService {
  /**
   * Tra cứu và kiểm tra tính hợp lệ của voucher code
   * @param {Object} params
   * @param {string} params.code Mã voucher cần kiểm tra
   * @param {string} [params.branchId] ID chi nhánh đang thao tác
   * @param {Object} [params.actor] Thông tin tài khoản thao tác (từ token req.user)
   */
  async verifyVoucher({ code, branchId = null, actor = null }) {
    if (!code || typeof code !== 'string' || !code.trim()) {
      return {
        valid: false,
        status: 'invalid',
        message: 'Vui lòng cung cấp mã voucher hợp lệ.',
        code: code || '',
        data: null,
      };
    }

    const cleanCode = code.trim().toUpperCase();

    // 1. Tìm kiếm trong cơ sở dữ liệu
    const rawData = await issuedVoucherRepository.findByCode(cleanCode);
    if (!rawData) {
      return {
        valid: false,
        status: 'invalid',
        message: `Mã voucher "${cleanCode}" không tồn tại trong hệ thống.`,
        code: cleanCode,
        data: null,
      };
    }

    const voucher = IssuedVoucherModel.fromDatabase(rawData);

    // 2. Sinh mã QR thật (DataURL) để hiển thị/xác thực
    try {
      voucher.qrCodeDataUrl = await QRCode.toDataURL(`ECQR:${cleanCode}`, {
        errorCorrectionLevel: 'M',
        margin: 2,
        width: 250,
      });
    } catch (qrErr) {
      console.warn('[VoucherVerificationService] Không thể tạo QR DataURL:', qrErr.message);
    }

    // 3. Xác định chi nhánh thao tác (Branch Scope - RB-09)
    // Nếu actor là nhân viên bán hàng, luôn lấy chi nhánh từ JWT thay vì tin dữ liệu client.
    const isBranchStaff = actor?.role === 'PARTNER_STAFF'
      || actor?.vai_tro_he_thong === 'Nhan vien ban hang';
    const activeBranchId = (isBranchStaff && actor?.ma_chi_nhanh)
      ? actor.ma_chi_nhanh
      : (branchId || null);

    // Kiểm tra phạm vi chi nhánh nếu có thông tin chi nhánh thao tác
    if (activeBranchId) {
      const isBranchApplicable = voucher.applicableBranches.some(
        b => b.branchId === activeBranchId
      );

      if (!isBranchApplicable) {
        return {
          valid: false,
          status: 'invalid_branch',
          message: 'Mã voucher không áp dụng cho chi nhánh đang làm việc của bạn (Quy tắc RB-09).',
          code: cleanCode,
          data: voucher,
        };
      }
    }

    // 4. Kiểm tra trạng thái đã sử dụng (RB-07)
    if (voucher.status === 'Da su dung') {
      return {
        valid: false,
        status: 'used',
        message: 'Mã voucher này đã được sử dụng trước đó.',
        code: cleanCode,
        data: voucher,
      };
    }

    if (voucher.status === 'Het han') {
      return {
        valid: false,
        status: 'expired',
        message: 'Mã voucher đã hết hạn sử dụng (Quy tắc RB-08).',
        code: cleanCode,
        data: voucher,
      };
    }

    // 5. Kiểm tra trạng thái vô hiệu hóa hoặc lỗi
    if (voucher.status === 'Vo hieu hoa' || voucher.status === 'Loi sinh ma') {
      return {
        valid: false,
        status: 'cancelled',
        message: 'Mã voucher đã bị vô hiệu hóa hoặc không hợp lệ.',
        code: cleanCode,
        data: voucher,
      };
    }

    // 6. Kiểm tra hạn sử dụng (RB-08)
    if (voucher.validUntil) {
      const expiryDate = new Date(voucher.validUntil);
      const now = new Date();
      if (expiryDate < now) {
        return {
          valid: false,
          status: 'expired',
          message: `Mã voucher đã hết hạn sử dụng vào ngày ${expiryDate.toLocaleDateString('vi-VN')} (Quy tắc RB-08).`,
          code: cleanCode,
          data: voucher,
        };
      }
    }

    // 7. Mã hoàn toàn hợp lệ, sẵn sàng sử dụng
    return {
      valid: true,
      message: "Voucher verification placeholder",
      payload,
    };
  }
}

module.exports = new VoucherVerificationService();
