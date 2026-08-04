/**
 * FILE: backend/src/modules/core-access/business/services/voucher-redemption.service.js
 * PURPOSE: Service xử lý nghiệp vụ xác nhận sử dụng voucher (BR-PAR-06 - Redemption).
 *
 * Nghiệp vụ tuân thủ:
 * - BR-PAR-06: Xác nhận sử dụng voucher đã được kiểm tra hợp lệ tại chi nhánh.
 * - RB-07: Voucher đã sử dụng không được dùng lại (chống Race Condition với atomic update).
 * - RB-09: Nhân viên chỉ được xác nhận voucher thuộc phạm vi chi nhánh của mình.
 * - RB-12 & NFR-06: Ghi nhận nhật ký hệ thống bắt buộc (Strict Audit Log).
 * - Kịch bản E3: Nếu ghi log thất bại, tự động rollback trạng thái voucher để bảo toàn tính toàn vẹn dữ liệu.
 */

const issuedVoucherRepository = require('../../data/repositories/issued-voucher.repository');
const voucherVerificationService = require('./voucher-verification.service');
const auditLogService = require('./audit-log.service');
const LOG_RESULT = require('../../../../common/constants/log-result');
const AppError = require('../../../../common/errors/AppError');
const ValidationError = require('../../../../common/errors/ValidationError');

class VoucherRedemptionService {
  /**
   * Xác nhận sử dụng voucher
   * @param {Object} params
   * @param {string} params.code Mã voucher cần xác nhận
   * @param {string} [params.branchId] ID chi nhánh thực hiện
   * @param {Object} params.actor Thông tin tài khoản thao tác (req.user)
   * @param {string} [params.note] Ghi chú khi sử dụng
   */
  async redeemVoucher({ code, branchId = null, actor, note = '' }) {
    if (!code || typeof code !== 'string' || !code.trim()) {
      throw new ValidationError('Vui lòng cung cấp mã voucher cần xác nhận.');
    }

    const cleanCode = code.trim().toUpperCase();

    // Bước 1: Kiểm tra tính hợp lệ của voucher (BR-PAR-05)
    const verification = await voucherVerificationService.verifyVoucher({
      code: cleanCode,
      branchId,
      actor,
    });

    if (!verification.valid) {
      throw new AppError(
        verification.message || 'Voucher không hợp lệ để sử dụng.',
        400,
        'VOUCHER_NOT_REDEEMABLE'
      );
    }

    const voucherData = verification.data;

    // Bước 2: Xác định chi nhánh sử dụng
    // Nếu là nhân viên bán hàng thì lấy chi nhánh của họ, nếu là Quản lý/Admin lấy branchId gửi lên hoặc chi nhánh đầu tiên
    const isBranchStaff = actor?.role === 'PARTNER_STAFF'
      || actor?.vai_tro_he_thong === 'Nhan vien ban hang';
    const targetBranchId = (isBranchStaff && actor?.ma_chi_nhanh)
      ? actor.ma_chi_nhanh
      : (branchId || voucherData.applicableBranches[0]?.branchId || null);

    // Bước 3: Cập nhật trạng thái thành 'Da su dung' (Atomic update chống Race Condition)
    const staffId = actor?.accountId || actor?.id || null;
    const updatedRecord = await issuedVoucherRepository.redeemCode({
      code: cleanCode,
      branchId: targetBranchId,
      staffAccountId: staffId,
    });

    if (!updatedRecord) {
      // Đã có quầy khác xác nhận mã này ngay trước đó
      throw new AppError(
        'Mã voucher đã được sử dụng trước đó bởi một phiên khác (Race Condition).',
        409,
        'VOUCHER_ALREADY_USED'
      );
    }

    // Bước 4: Ghi Audit Log bắt buộc (RB-12, NFR-06 - Strict Mode)
    try {
      await auditLogService.log(
        {
          actorId: staffId,
          actorRole: actor?.role || 'Nhan vien ban hang',
          action: 'XAC_NHAN_SU_DUNG_VOUCHER',
          targetType: 'VOUCHER_MUA',
          targetId: voucherData.id,
          before: {
            trang_thai: 'Chua su dung',
            voucher_code: cleanCode,
          },
          after: {
            trang_thai: 'Da su dung',
            ma_chi_nhanh_su_dung: targetBranchId,
            ngay_su_dung: updatedRecord.ngay_su_dung,
            ma_nhan_vien_xac_nhan: updatedRecord.ma_nhan_vien_xac_nhan || staffId,
          },
          result: LOG_RESULT.THANH_CONG,
          reason: note || `Xác nhận sử dụng voucher tại quầy chi nhánh (${targetBranchId || 'Mặc định'})`,
        },
        true // strict = true
      );
    } catch (logError) {
      // Bước 5 (Kịch bản E3): Log thất bại -> Tự động Rollback trạng thái voucher
      console.error('[VoucherRedemptionService] Lỗi ghi nhật ký kiểm toán, tiến hành rollback:', logError.message);
      await issuedVoucherRepository.revertRedemption(cleanCode);
      throw new AppError(
        'Không thể hoàn tất thao tác do lỗi ghi nhận nhật ký hệ thống (E3). Trạng thái voucher đã được khôi phục nguyên vẹn.',
        500,
        'AUDIT_LOG_FAILED'
      );
    }

    return {
      success: true,
      message: 'Xác nhận sử dụng voucher thành công.',
      voucher: {
        ...voucherData,
        status: 'Da su dung',
        usedAt: updatedRecord.ngay_su_dung,
        usedBranchId: targetBranchId,
      },
    };
  }

  /**
   * Lấy danh sách lịch sử các voucher đã sử dụng
   */
  async getUsageHistory({ branchId = null, limit = 20, page = 1 }) {
    return await issuedVoucherRepository.findUsageHistory({ branchId, limit, page });
  }
}

module.exports = new VoucherRedemptionService();
