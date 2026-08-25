/**
 * FILE: backend/src/modules/core-access/presentation/controllers/issued-voucher.controller.js
 * PURPOSE: Controller cho BR-CUS-07 — Nhận voucher đã mua.
 *
 * Endpoints:
 *  - GET  /vouchers/my          → Danh sách "Voucher của tôi"
 *  - GET  /vouchers/order/:id   → Voucher theo đơn hàng (dùng sau thanh toán)
 *  - GET  /vouchers/:id         → Chi tiết một voucher đã mua
 */
const voucherIssuanceService = require('../../business/services/voucher-issuance.service');

class IssuedVoucherController {
  constructor() {
    this.service = voucherIssuanceService;
  }

  /**
   * GET /vouchers/my
   * Danh sách voucher của khách hàng đang đăng nhập.
   * Query: ?page=1&limit=20&status=Chua su dung
   */
  async getMyVouchers(req, res, next) {
    try {
      const accountId = req.user?.accountId || req.user?.id;
      const lang = req.query.lang || req.headers["accept-language"] || "vi";
      const { page = 1, limit = 20, status } = req.query;

      const result = await this.service.getMyVouchers(accountId, {
        page: Number(page),
        limit: Number(limit),
        status: status || undefined,
        lang,
      });

      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /vouchers/order/:orderId
   * Voucher đã phát hành cho đơn hàng — dùng ngay sau thanh toán thành công.
   */
  async getVouchersByOrder(req, res, next) {
    try {
      const accountId = req.user?.accountId || req.user?.id;
      const { orderId } = req.params;
      const lang = req.query.lang || req.headers["accept-language"] || "vi";

      const rows = await this.service.getVouchersByOrder(orderId, accountId, lang);
      res.json({ success: true, data: rows });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /vouchers/:issuedId
   * Chi tiết một voucher đã mua (có QR code, chi nhánh, hạn sử dụng).
   */
  async getIssuedVoucherDetail(req, res, next) {
    try {
      const accountId = req.user?.accountId || req.user?.id;
      const { issuedId } = req.params;
      const lang = req.query.lang || req.headers["accept-language"] || "vi";

      const data = await this.service.getIssuedVoucherDetail(issuedId, accountId, lang);
      if (!data) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy voucher này' });
      }

      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /vouchers/issue (giữ lại tương thích — dùng nội bộ, không expose ra customer)
   */
  async issueVoucher(req, res, next) {
    try {
      const actorId = req.user?.accountId || req.user?.id;
      const actorRole = req.user?.role || req.user?.vai_tro_he_thong || 'SYSTEM';
      const result = await this.service.issueAfterPayment(req.body, { actorId, actorRole });
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = IssuedVoucherController;
