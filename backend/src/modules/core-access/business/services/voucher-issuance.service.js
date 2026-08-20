/**
 * FILE: backend/src/modules/core-access/business/services/voucher-issuance.service.js
 * PURPOSE: Service phát hành voucher code sau khi thanh toán thành công (BR-CUS-07).
 *
 * Luồng cơ bản (theo spec):
 *  1. Nhận orderId + danh sách items cần phát hành.
 *  2. Kiểm tra đơn hàng đã thanh toán thành công (issuance eligibility contract từ My).
 *  3. Sinh mã code duy nhất cho mỗi item × quantity — idempotent.
 *  4. Ghi audit log bắt buộc (NFR-06).
 *  5. Nếu lỗi → ghi nhận quyền lợi VOUCHER_MUA ở trạng thái "Loi sinh ma".
 */
const issuedVoucherRepository = require('../../data/repositories/issued-voucher.repository');
const auditLogService = require('./audit-log.service');
const supabase = require('../../../../config/supabase');
const translationService = require('../../../../common/services/translation.service');

class VoucherIssuanceService {
  async issueAfterPayment(eligibility, actorMeta = {}) {
    const { orderId, customerId, items = [], paymentSuccess } = eligibility;
    const { actorId = null, actorRole = 'SYSTEM' } = actorMeta;

    // 1. Kiểm tra tiền điều kiện
    if (!paymentSuccess) {
      const err = new Error('Đơn hàng chưa thanh toán thành công. Không thể phát hành voucher.');
      err.status = 409;
      throw err;
    }

    if (!orderId || !items || items.length === 0) {
      const err = new Error('Thiếu thông tin đơn hàng hoặc danh sách sản phẩm để phát hành.');
      err.status = 400;
      throw err;
    }

    const issuedAll = [];

    try {
      // 2. Phát hành code cho từng item × quantity
      for (const item of items) {
        const issued = await issuedVoucherRepository.issueForOrder({
          orderId,
          voucherId: item.voucherId,
          quantity: item.quantity || 1,
          voucherPrefix: 'EC',
        });
        issuedAll.push(...issued);
      }

      // Trạng thái đơn vẫn là "Da thanh toan"; trạng thái phát hành được quản
      // lý độc lập ở VOUCHER_MUA theo đúng mô hình dữ liệu.

      // 3. Ghi audit log (NFR-06)
      await auditLogService.log({
        actorId,
        actorRole,
        action: 'ISSUE_VOUCHER_CODE',
        targetType: 'DONHANG',
        targetId: orderId,
        after: {
          issuedCount: issuedAll.length,
          codes: issuedAll.map((v) => v.voucher_code),
        },
        result: 'Thanh cong',
        reason: `Phát hành ${issuedAll.length} mã voucher sau thanh toán thành công`,
      }, false); // non-strict: không chặn nếu log thất bại

      return issuedAll;
    } catch (err) {
      // A4: Không sinh được code → tạo các bản ghi lỗi còn thiếu để Admin có
      // đúng ma_voucher_mua mà cấp lại. Không ghi "Loi sinh ma" vào DONHANG
      // vì trạng thái này không thuộc vòng đời đơn hàng.
      console.error('[VoucherIssuanceService] issueAfterPayment error:', err.message);

      try {
        await issuedVoucherRepository.markIssuanceFailure({ orderId, items });
      } catch (markError) {
        console.error('[VoucherIssuanceService] Failed to persist issuance error:', markError.message);
      }

      // A4.2: Ghi nhận lỗi vào audit log
      await auditLogService.log({
        actorId,
        actorRole,
        action: 'ISSUE_VOUCHER_CODE',
        targetType: 'DONHANG',
        targetId: orderId,
        result: 'That bai',
        reason: err.message,
      }, false);

      throw err;
    }
  }

  /**
   * Lấy danh sách voucher đã phát hành của một đơn hàng (dùng để hiển thị sau thanh toán).
   * @param {string} orderId - Mã đơn hàng
   * @param {string} accountId - ma_tk của người dùng (để ownership check)
   */
  async getVouchersByOrder(orderId, accountId) {
    if (!orderId) {
      const err = new Error('Thiếu mã đơn hàng');
      err.status = 400;
      throw err;
    }

    // Ownership check: chỉ được lấy đơn của mình
    const { data: order } = await supabase
      .from('donhang')
      .select('ma_dh, ma_tk_dat, trang_thai')
      .eq('ma_dh', orderId)
      .maybeSingle();

    if (!order) {
      const err = new Error('Không tìm thấy đơn hàng');
      err.status = 404;
      throw err;
    }

    if (accountId && order.ma_tk_dat !== accountId) {
      const err = new Error('Không có quyền truy cập đơn hàng này');
      err.status = 403;
      throw err;
    }

    const rows = await issuedVoucherRepository.findByOrderId(orderId);
    return rows;
  }

  /**
   * Lấy tất cả voucher của khách hàng đang đăng nhập ("Voucher của tôi").
   * @param {string} accountId - ma_tk
   * @param {object} opts - { page, limit, status }
   */
  async getMyVouchers(accountId, opts = {}) {
    if (!accountId) {
      const err = new Error('Chưa xác thực người dùng');
      err.status = 401;
      throw err;
    }
    const result = await issuedVoucherRepository.findByCustomer(accountId, opts);
    if (opts.lang && opts.lang.toLowerCase().startsWith("en") && result && Array.isArray(result.records)) {
      await Promise.all(
        result.records.map(async (row) => {
          if (row.voucher) {
            await translationService.translateVoucherFields(row.voucher, undefined, "en");
          }
        })
      );
    }
    return result;
  }

  /**
   * Lấy chi tiết một voucher đã mua (kiểm tra ownership).
   * @param {string} issuedVoucherId - ma_voucher_mua
   * @param {string} accountId - ma_tk người đang đăng nhập
   */
  async getIssuedVoucherDetail(issuedVoucherId, accountId) {
    if (!issuedVoucherId) {
      const err = new Error('Thiếu mã voucher đã mua');
      err.status = 400;
      throw err;
    }

    const { data: vm } = await supabase
      .from('voucher_mua')
      .select('*')
      .eq('ma_voucher_mua', issuedVoucherId)
      .maybeSingle();

    if (!vm) {
      const err = new Error('Không tìm thấy voucher này');
      err.status = 404;
      throw err;
    }

    // Ownership check: lấy ma_tk_dat từ donhang
    if (accountId) {
      const { data: order } = await supabase
        .from('donhang')
        .select('ma_tk_dat')
        .eq('ma_dh', vm.ma_dh)
        .maybeSingle();

      if (!order || order.ma_tk_dat !== accountId) {
        const err = new Error('Không có quyền truy cập voucher này');
        err.status = 403;
        throw err;
      }
    }

    const enriched = await issuedVoucherRepository._enrichRows([vm]);
    return enriched[0] || null;
  }
}

module.exports = new VoucherIssuanceService();
