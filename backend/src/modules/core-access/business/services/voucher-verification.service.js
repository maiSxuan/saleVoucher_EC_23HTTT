/**
 * FILE: backend/src/modules/core-access/business/services/voucher-verification.service.js
 * PURPOSE: Service nghiệp vụ kiểm tra và xác thực tính hợp lệ của voucher code (BR-PAR-05).
 *
 * Nghiệp vụ tuân thủ:
 * - BR-PAR-05: Kiểm tra voucher code, phân loại trạng thái hợp lệ, đã sử dụng, hết hạn, vô hiệu hóa, không hợp lệ.
 * - RB-08: Voucher hết hạn, bị hủy hoặc bị khóa thì không được sử dụng.
 * - RB-09: Đối tác chỉ được xác thực voucher thuộc phạm vi chi nhánh hoặc chương trình của mình.
 * - NFR-02: Ẩn danh thông tin cá nhân khách hàng sở hữu mã.
 * - Sinh mã QR thật qua thư viện `qrcode`.
 */

const QRCode = require('qrcode');
const supabase = require('../../../../config/supabase');
const issuedVoucherRepository = require('../../data/repositories/issued-voucher.repository');
const IssuedVoucherModel = require('../../data/models/issued-voucher.model');

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
      voucher.qrCodeDataUrl = await QRCode.toDataURL(cleanCode, {
        errorCorrectionLevel: 'H',
        margin: 2,
        width: 250,
      });
    } catch (qrErr) {
      console.warn('[VoucherVerificationService] Không thể tạo QR DataURL:', qrErr.message);
    }

    // 3. Xác định chi nhánh thao tác (Branch Scope - RB-09)
    // Nếu actor là 'Nhan vien ban hang', ưu tiên lấy ma_chi_nhanh từ tài khoản
    const activeBranchId = (actor?.role === 'Nhan vien ban hang' && actor?.ma_chi_nhanh)
      ? actor.ma_chi_nhanh
      : (branchId || null);

    // Kiểm tra phạm vi chi nhánh nếu có thông tin chi nhánh thao tác
    if (activeBranchId && voucher.applicableBranches.length > 0) {
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
      status: 'valid',
      message: 'Mã voucher hợp lệ, sẵn sàng xác nhận sử dụng.',
      code: cleanCode,
      data: voucher,
    };
  }

  /**
   * Lấy danh sách chi nhánh phù hợp với doanh nghiệp của tài khoản đang đăng nhập
   */
  async getBranchesForActor(actor) {
    if (!actor) return [];

    let maHsdn = actor.ma_hsdn || null;

    // Lấy lại quan hệ từ NGUOIDUNG nếu JWT chưa có ma_hsdn.
    if (!maHsdn) {
      const userId = actor.id || actor.ma_nguoi_dung;
      if (userId) {
        const { data: user } = await supabase
          .from('nguoidung')
          .select('ma_hsdn')
          .eq('ma_nguoi_dung', userId)
          .maybeSingle();
        if (user?.ma_hsdn) maHsdn = user.ma_hsdn;
      }
    }

    // Nếu là nhân viên bán hàng có ma_chi_nhanh cụ thể
    if (actor.ma_chi_nhanh && (actor.role === 'PARTNER_STAFF' || actor.vai_tro_he_thong === 'Nhan vien ban hang')) {
      const { data, error } = await supabase
        .from('chinhanh')
        .select('ma_chi_nhanh, ten_chi_nhanh, dia_chi, khu_vuc, trang_thai, ma_hs, hosodn(ten_dn)')
        .eq('ma_chi_nhanh', actor.ma_chi_nhanh);
      if (!error && data && data.length > 0) return data;
    }

    // Nếu có ma_hsdn (Doanh nghiệp của Người đại diện / Quản lý voucher)
    if (maHsdn) {
      const { data, error } = await supabase
        .from('chinhanh')
        .select('ma_chi_nhanh, ten_chi_nhanh, dia_chi, khu_vuc, trang_thai, ma_hs, hosodn(ten_dn)')
        .eq('ma_hs', maHsdn)
        .order('ten_chi_nhanh', { ascending: true });
      if (error) throw new Error(`Lỗi lấy danh sách chi nhánh đối tác: ${error.message}`);
      return data || [];
    }

    // Fallback
    const { data } = await supabase
      .from('chinhanh')
      .select('ma_chi_nhanh, ten_chi_nhanh, dia_chi, khu_vuc, trang_thai, ma_hs, hosodn(ten_dn)')
      .eq('trang_thai', 'Dang hoat dong')
      .limit(20);
    return data || [];
  }

  /**
   * Lấy danh sách mã mẫu từ DB để demo kiểm thử
   */
  async getSampleCodes() {
    return await issuedVoucherRepository.findSampleCodes(10);
  }
}

module.exports = new VoucherVerificationService();
