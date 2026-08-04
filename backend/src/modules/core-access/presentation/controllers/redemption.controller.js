/**
 * FILE: backend/src/modules/core-access/presentation/controllers/redemption.controller.js
 * PURPOSE: Controller tiếp nhận và điều hướng các request tra cứu, quét mã QR và xác nhận sử dụng voucher.
 *
 * Nghiệp vụ tuân thủ:
 * - BR-PAR-05: Kiểm tra voucher code
 * - BR-PAR-06: Xác nhận sử dụng voucher
 */

class RedemptionController {
  constructor(voucherVerificationService, voucherRedemptionService) {
    this.voucherVerificationService = voucherVerificationService;
    this.voucherRedemptionService = voucherRedemptionService;
  }

  /**
   * 1. POST /vouchers/verify
   * Tra cứu và xác minh tính hợp lệ của mã voucher
   */
  async verify(req, res, next) {
    try {
      const code = req.body.code || req.query.code;
      const branchId = req.body.branchId || req.query.branchId;
      const actor = req.user || null;

      const result = await this.voucherVerificationService.verifyVoucher({
        code,
        branchId,
        actor,
      });

      return res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 2. POST /vouchers/redeem
   * Xác nhận sử dụng voucher tại quầy chi nhánh
   */
  async redeem(req, res, next) {
    try {
      const { code, branchId, note } = req.body;
      const actor = req.user;

      const result = await this.voucherRedemptionService.redeemVoucher({
        code,
        branchId,
        actor,
        note,
      });

      return res.json({
        success: true,
        message: result.message,
        data: result.voucher,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 3. GET /vouchers/usage-history
   * Lấy lịch sử các voucher đã sử dụng tại chi nhánh
   */
  async getUsageHistory(req, res, next) {
    try {
      const { branchId, page = 1, limit = 20 } = req.query;
      const actor = req.user;

      // Nếu là nhân viên bán hàng, bắt buộc chỉ xem chi nhánh của mình
      const activeBranchId = (actor?.role === 'PARTNER_STAFF' && actor?.ma_chi_nhanh)
        ? actor.ma_chi_nhanh
        : (branchId || null);

      const result = await this.voucherRedemptionService.getUsageHistory({
        branchId: activeBranchId,
        page: Number(page),
        limit: Number(limit),
      });

      return res.json({
        success: true,
        data: result.records,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 4. GET /vouchers/sample-codes
   * Lấy danh sách mã mẫu từ DB phục vụ kiểm thử nhanh
   */
  async getSampleCodes(req, res, next) {
    try {
      const sampleCodes = await this.voucherVerificationService.getSampleCodes();
      return res.json({
        success: true,
        data: sampleCodes,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 5. GET /vouchers/branches
   * Lấy danh sách chi nhánh tương ứng với doanh nghiệp/phạm vi của người dùng
   */
  async getBranches(req, res, next) {
    try {
      const actor = req.user;
      const branches = await this.voucherVerificationService.getBranchesForActor(actor);
      return res.json({
        success: true,
        data: branches,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RedemptionController;
