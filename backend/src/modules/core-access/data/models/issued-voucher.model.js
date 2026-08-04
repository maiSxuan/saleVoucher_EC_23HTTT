/**
 * FILE: backend/src/modules/core-access/data/models/issued-voucher.model.js
 * PURPOSE: Model đại diện cho mã voucher đã phát hành (VOUCHER_MUA) trong module core-access.
 *
 * Tại sao cần file này?
 * - Chuẩn hóa dữ liệu trả về từ Supabase (snake_case) sang camelCase cho backend service & frontend.
 * - Hỗ trợ ẩn danh thông tin khách hàng sở hữu mã (NFR-02) để đảm bảo tính riêng tư khi nhân viên quầy tra cứu.
 * - Chứa các phương thức tính toán giá trị giảm giá, trạng thái hiệu lực.
 */

class IssuedVoucherModel {
  constructor({
    id,
    orderId,
    voucherId,
    code,
    status,
    qrValue,
    qrCodeDataUrl = null,
    issuedAt,
    usedAt = null,
    usedBranchId = null,
    usedBranchName = null,
    confirmedByAccountId = null,
    // Thông tin chi tiết voucher đi kèm
    voucherName = '',
    description = '',
    originalPrice = 0,
    discountValue = 0,
    conditions = '',
    validFrom = null,
    validUntil = null,
    voucherStatus = '',
    imageUrl = '',
    // Thông tin đối tác & chi nhánh áp dụng
    partnerId = null,
    partnerName = '',
    applicableBranches = [],
    // Thông tin khách hàng sở hữu
    customerMaskedName = '',
    customerPhoneMasked = '',
  }) {
    this.id = id;
    this.orderId = orderId;
    this.voucherId = voucherId;
    this.code = code;
    this.status = status; // 'Chua su dung' | 'Da su dung' | 'Het han' | 'Vo hieu hoa' | 'Loi sinh ma'
    this.qrValue = qrValue;
    this.qrCodeDataUrl = qrCodeDataUrl;
    this.issuedAt = issuedAt;
    this.usedAt = usedAt;
    this.usedBranchId = usedBranchId;
    this.usedBranchName = usedBranchName;
    this.confirmedByAccountId = confirmedByAccountId;

    // Chi tiết voucher
    this.voucherName = voucherName;
    this.description = description;
    this.originalPrice = Number(originalPrice) || 0;
    this.discountValue = Number(discountValue) || 0;
    this.conditions = conditions;
    this.validFrom = validFrom;
    this.validUntil = validUntil;
    this.voucherStatus = voucherStatus;
    this.imageUrl = imageUrl;

    // Thông tin đối tác & chi nhánh
    this.partnerId = partnerId;
    this.partnerName = partnerName;
    this.applicableBranches = applicableBranches; // Array<{ branchId, branchName, address, area }>

    // Thông tin khách hàng được ẩn danh (NFR-02)
    this.customerMaskedName = customerMaskedName;
    this.customerPhoneMasked = customerPhoneMasked;
  }

  /**
   * Tính toán thông tin giá sau khi giảm
   */
  get priceCalculation() {
    const original = this.originalPrice;
    const discount = Math.min(this.discountValue, original);
    const finalPrice = Math.max(0, original - discount);

    return {
      originalPrice: original,
      discountAmount: discount,
      finalPrice: finalPrice,
      hasPriceData: original > 0,
    };
  }

  /**
   * Helper ẩn danh tên khách hàng: "Nguyễn Văn An" -> "N*** V** A"
   */
  static maskName(name) {
    if (!name || typeof name !== 'string') return 'Khách hàng';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].charAt(0) + '***';
    }
    return parts.map((p, idx) => {
      if (idx === 0 || idx === parts.length - 1) {
        return p.charAt(0) + '*'.repeat(Math.max(1, p.length - 1));
      }
      return p.charAt(0) + '**';
    }).join(' ');
  }

  /**
   * Helper ẩn danh SĐT: "0901234567" -> "090****567"
   */
  static maskPhone(phone) {
    if (!phone || typeof phone !== 'string') return '';
    const clean = phone.replace(/\D/g, '');
    if (clean.length < 7) return '***';
    return clean.slice(0, 3) + '****' + clean.slice(-3);
  }

  /**
   * Chuyển đổi từ dữ liệu thô Supabase sang UserModel
   */
  static fromDatabase(row) {
    if (!row) return null;

    const voucher = row.voucher || {};
    const donhang = row.donhang || {};
    const buyerAccount = donhang.taikhoan || {};
    const buyerUser = buyerAccount.nguoidung || {};
    const usedBranch = row.chinhanh || row.chinhanh_sudung || {};

    // Danh sách chi nhánh áp dụng từ row.applicableBranches hoặc voucher.voucher_cn
    const rawBranches = row.applicableBranches || voucher.voucher_cn || [];
    const branches = rawBranches.map(vc => ({
      branchId: vc.ma_chi_nhanh || vc.branchId,
      branchName: vc.ten_chi_nhanh || vc.branchName || 'Chi nhánh',
      address: vc.dia_chi || vc.address || '',
      area: vc.khu_vuc || vc.area || '',
      status: vc.trang_thai || vc.status || '',
      partnerId: vc.ma_hs || vc.partnerId || null,
      partnerName: vc.ten_dn || vc.partnerName || '',
    }));

    const partnerName = branches[0]?.partnerName || '';
    const partnerId = branches[0]?.partnerId || null;

    return new IssuedVoucherModel({
      id: row.ma_voucher_mua,
      orderId: row.ma_dh,
      voucherId: row.ma_voucher,
      code: row.voucher_code,
      status: row.trang_thai,
      qrValue: row.gia_tri_qr_mo_phong || `ECQR:${row.voucher_code}`,
      issuedAt: row.thoi_gian_sinh_ma,
      usedAt: row.ngay_su_dung,
      usedBranchId: row.ma_chi_nhanh_su_dung,
      usedBranchName: usedBranch.ten_chi_nhanh || null,
      confirmedByAccountId: row.ma_nhan_vien_xac_nhan,

      // Voucher
      voucherName: voucher.ten_voucher || '',
      description: voucher.mo_ta || '',
      originalPrice: voucher.gia_goc || 0,
      discountValue: voucher.gia_tri_giam || 0,
      conditions: voucher.dieu_kien_ap_dung || 'Áp dụng tại các chi nhánh được chỉ định.',
      validFrom: voucher.tg_bat_dau_ban,
      validUntil: voucher.tg_ket_thuc_ban,
      voucherStatus: voucher.trang_thai || '',
      imageUrl: voucher.hinh_anh_url || '',

      // Partner & Branches
      partnerId,
      partnerName,
      applicableBranches: branches,

      // Masked Customer Info (NFR-02)
      customerMaskedName: IssuedVoucherModel.maskName(donhang.nguoi_nhan || buyerUser.ho_ten),
      customerPhoneMasked: IssuedVoucherModel.maskPhone(buyerUser.sdt),
    });
  }
}

module.exports = IssuedVoucherModel;
