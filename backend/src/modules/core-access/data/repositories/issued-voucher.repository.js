/**
 * Purpose: Repository cho thao tác phát hành voucher (VOUCHER_MUA).
 * BR-CUS-07: Phát hành voucher code sau khi thanh toán thành công.
 *
 * Idempotency: Mỗi (orderId, voucherId, stt) chỉ sinh một mã.
 * Unique: voucher_code là UNIQUE trong DB — collision retry tối đa 5 lần.
 */
const supabase = require('../../../../config/supabase');
const crypto = require('crypto');

/** Sinh mã code dạng EC26-XXXX-XXXXXXXX (không dùng lại) */
function generateCode(prefix = 'EC') {
  const year = new Date().getFullYear().toString().slice(-2);
  const rand1 = Math.random().toString(36).toUpperCase().slice(2, 6).padEnd(4, '0');
  const rand2 = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `${prefix}${year}-${rand1}-${rand2}`;
}

class IssuedVoucherRepository {
  /**
   * 1. Tìm voucher đã mua theo mã code (BR-PAR-05)
   * Kết hợp dữ liệu từ voucher_mua + voucher + donhang + chinhanh
   * @param {string} code Mã voucher (ví dụ: 'EC26-FOOD-A1B2C3D4')
   */
  async findByCode(code) {
    if (!code) return null;
    const cleanCode = code.trim().toUpperCase();

    try {
      // 1.1 Lấy bản ghi voucher_mua
      const { data: vm, error: vmError } = await supabase
        .from('voucher_mua')
        .select('*')
        .eq('voucher_code', cleanCode)
        .maybeSingle();

      if (vmError) {
        throw new Error(`Lỗi tra cứu voucher đã phát hành: ${vmError.message}`);
      }
      if (!vm) return null;

      // 1.2 Lấy thông tin voucher gốc
      let voucherInfo = null;
      if (vm.ma_voucher) {
        const { data: v } = await supabase
          .from('voucher')
          .select('*')
          .eq('ma_voucher', vm.ma_voucher)
          .maybeSingle();
        voucherInfo = v;
      }

      // 1.3 Lấy thông tin người mua từ donhang -> taikhoan -> nguoidung
      let customerInfo = null;
      if (vm.ma_dh) {
        const { data: dh } = await supabase
          .from('donhang')
          .select('ma_dh, nguoi_nhan, ma_tk_dat')
          .eq('ma_dh', vm.ma_dh)
          .maybeSingle();

        if (dh?.ma_tk_dat) {
          const { data: tk } = await supabase
            .from('taikhoan')
            .select('ma_tk, nguoidung:ma_nguoi_dung (ho_ten, email, sdt)')
            .eq('ma_tk', dh.ma_tk_dat)
            .maybeSingle();

          customerInfo = {
            ho_ten: tk?.nguoidung?.ho_ten || dh.nguoi_nhan || 'Khách hàng',
            email: tk?.nguoidung?.email || '',
            sdt: tk?.nguoidung?.sdt || '',
          };
        } else if (dh?.nguoi_nhan) {
          customerInfo = { ho_ten: dh.nguoi_nhan };
        }
      }

      // 1.4 Lấy đúng các chi nhánh áp dụng qua bảng liên kết VOUCHER_CN (RB-09)
      let branches = [];
      if (vm.ma_voucher) {
        const { data: voucherBranches, error: voucherBranchesError } = await supabase
          .from('voucher_cn')
          .select('ma_chi_nhanh')
          .eq('ma_voucher', vm.ma_voucher);

        if (voucherBranchesError) {
          throw new Error(`Lỗi lấy phạm vi chi nhánh voucher: ${voucherBranchesError.message}`);
        }

        const branchIds = (voucherBranches || []).map((row) => row.ma_chi_nhanh);
        if (branchIds.length > 0) {
          const { data: branchRows, error: branchError } = await supabase
            .from('chinhanh')
            .select('ma_chi_nhanh, ten_chi_nhanh, dia_chi, trang_thai, khu_vuc, ma_hs')
            .in('ma_chi_nhanh', branchIds)
            .eq('trang_thai', 'Dang hoat dong');

          if (branchError) {
            throw new Error(`Lỗi lấy thông tin chi nhánh voucher: ${branchError.message}`);
          }

          const partnerIds = [...new Set((branchRows || []).map((row) => row.ma_hs).filter(Boolean))];
          let partnerById = new Map();
          if (partnerIds.length > 0) {
            const { data: partners, error: partnerError } = await supabase
              .from('hosodn')
              .select('ma_hs, ten_dn')
              .in('ma_hs', partnerIds);

            if (partnerError) {
              throw new Error(`Lỗi lấy thông tin đối tác voucher: ${partnerError.message}`);
            }
            partnerById = new Map((partners || []).map((partner) => [partner.ma_hs, partner.ten_dn]));
          }

          branches = (branchRows || []).map((branch) => ({
            ...branch,
            ten_dn: partnerById.get(branch.ma_hs) || '',
          }));
        }
      }

      // 1.5 Lấy thông tin chi nhánh đã sử dụng (nếu đã dùng)
      let usedBranchInfo = null;
      if (vm.ma_chi_nhanh_su_dung) {
        const { data: ub } = await supabase
          .from('chinhanh')
          .select('ma_chi_nhanh, ten_chi_nhanh, dia_chi')
          .eq('ma_chi_nhanh', vm.ma_chi_nhanh_su_dung)
          .maybeSingle();
        usedBranchInfo = ub;
      }

      return {
        ...vm,
        voucher: voucherInfo,
        donhang: {
          taikhoan: {
            nguoidung: customerInfo,
          },
        },
        chinhanh: usedBranchInfo,
        applicableBranches: branches || [],
      };
    } catch (err) {
      console.error('[IssuedVoucherRepository] findByCode exception:', err.message);
      throw err;
    }
  }

  /**
   * 2. Xác nhận sử dụng voucher (Atomic Update - BR-PAR-06, RB-07)
   * Chỉ cập nhật nếu trạng thái hiện tại là 'Chua su dung' (tránh Race Condition)
   */
  async redeemCode({ code, branchId = null, staffAccountId = null }) {
    const cleanCode = code.trim().toUpperCase();
    const now = new Date().toISOString();

    let validStaffAccountId = null;
    if (staffAccountId) {
      // 1. Kiểm tra xem staffAccountId có phải là ma_tk trong bảng taikhoan không
      const { data: tkDirect } = await supabase
        .from('taikhoan')
        .select('ma_tk')
        .eq('ma_tk', staffAccountId)
        .maybeSingle();

      if (tkDirect?.ma_tk) {
        validStaffAccountId = tkDirect.ma_tk;
      } else {
        // 2. Nếu không phải ma_tk, thử tìm theo ma_nguoi_dung
        const { data: tkByNd } = await supabase
          .from('taikhoan')
          .select('ma_tk')
          .eq('ma_nguoi_dung', staffAccountId)
          .maybeSingle();
        if (tkByNd?.ma_tk) {
          validStaffAccountId = tkByNd.ma_tk;
        }
      }
    }

    const updatePayload = {
      trang_thai: 'Da su dung',
      ngay_su_dung: now,
      ma_chi_nhanh_su_dung: branchId || null,
      ma_nhan_vien_xac_nhan: validStaffAccountId,
    };

    const { data, error } = await supabase
      .from('voucher_mua')
      .update(updatePayload)
      .eq('voucher_code', cleanCode)
      .eq('trang_thai', 'Chua su dung') // Atomic check
      .select('*');

    if (error) {
      console.error('[IssuedVoucherRepository] redeemCode error:', error.message);
      throw new Error(`Cập nhật sử dụng voucher thất bại: ${error.message}`);
    }

    // Nếu không có bản ghi nào được update -> mã đã bị đổi ở phiên khác
    if (!data || data.length === 0) {
      return null;
    }

    return data[0];
  }

  /**
   * 3. Rollback trạng thái khi gặp lỗi E3 (Ghi log thất bại)
   */
  async revertRedemption(code) {
    const cleanCode = code.trim().toUpperCase();
    const { data, error } = await supabase
      .from('voucher_mua')
      .update({
        trang_thai: 'Chua su dung',
        ngay_su_dung: null,
        ma_chi_nhanh_su_dung: null,
        ma_nhan_vien_xac_nhan: null,
      })
      .eq('voucher_code', cleanCode)
      .select('*');

    if (error) {
      console.error('[IssuedVoucherRepository] revertRedemption error:', error.message);
    }
    return data;
  }

  /**
   * 4. Lấy lịch sử voucher đã sử dụng tại quầy chi nhánh
   */
  async findUsageHistory({ branchId = null, limit = 20, page = 1 } = {}) {
    const offset = (page - 1) * limit;

    let query = supabase
      .from('voucher_mua')
      .select('*', { count: 'exact' })
      .eq('trang_thai', 'Da su dung')
      .order('ngay_su_dung', { ascending: false })
      .range(offset, offset + limit - 1);

    if (branchId) {
      query = query.eq('ma_chi_nhanh_su_dung', branchId);
    }

    const { data, error, count } = await query;
    if (error) {
      console.error('[IssuedVoucherRepository] findUsageHistory error:', error.message);
      return { records: [], total: 0, page, limit, totalPages: 0 };
    }

    const rows = data || [];
    const voucherIds = [...new Set(rows.map((row) => row.ma_voucher).filter(Boolean))];
    const branchIds = [...new Set(rows.map((row) => row.ma_chi_nhanh_su_dung).filter(Boolean))];
    const staffIds = [...new Set(rows.map((row) => row.ma_nhan_vien_xac_nhan).filter(Boolean))];
    const emptyResult = Promise.resolve({ data: [] });
    const [voucherResult, branchResult, staffResult] = await Promise.all([
      voucherIds.length
        ? supabase
          .from('voucher')
          .select('ma_voucher, ten_voucher, gia_tri_giam, gia_goc')
          .in('ma_voucher', voucherIds)
        : emptyResult,
      branchIds.length
        ? supabase
          .from('chinhanh')
          .select('ma_chi_nhanh, ten_chi_nhanh')
          .in('ma_chi_nhanh', branchIds)
        : emptyResult,
      staffIds.length
        ? supabase
          .from('taikhoan')
          .select('ma_tk, thong_tin_dang_nhap, nguoidung:ma_nguoi_dung(ho_ten)')
          .in('ma_tk', staffIds)
        : emptyResult,
    ]);
    const vouchersById = new Map(
      (voucherResult.data || []).map((voucher) => [voucher.ma_voucher, {
        ten_voucher: voucher.ten_voucher,
        gia_tri_giam: voucher.gia_tri_giam,
        gia_goc: voucher.gia_goc,
      }]),
    );
    const branchesById = new Map(
      (branchResult.data || []).map((branch) => [branch.ma_chi_nhanh, {
        ten_chi_nhanh: branch.ten_chi_nhanh,
      }]),
    );
    const staffById = new Map(
      (staffResult.data || []).map((staff) => [staff.ma_tk, {
        thong_tin_dang_nhap: staff.thong_tin_dang_nhap,
        nguoidung: staff.nguoidung,
      }]),
    );
    const enriched = rows.map((row) => ({
      ...row,
      voucher: vouchersById.get(row.ma_voucher) || null,
      chinhanh: branchesById.get(row.ma_chi_nhanh_su_dung) || null,
      nhanvien: staffById.get(row.ma_nhan_vien_xac_nhan) || null,
    }));

    return {
      records: enriched,
      total: count || enriched.length,
      page,
      limit,
      totalPages: Math.ceil((count || enriched.length) / limit),
    };
  }

  /**
   * 5. Lấy danh sách mã mẫu từ DB để demo test nhanh
   */
  async findSampleCodes(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('voucher_mua')
        .select('*')
        .limit(limit);

      if (error || !data) {
        console.warn('[IssuedVoucherRepository] findSampleCodes error:', error?.message);
        return [];
      }

      const voucherIds = [...new Set(data.map((row) => row.ma_voucher).filter(Boolean))];
      let voucherNamesById = new Map();
      if (voucherIds.length > 0) {
        const { data: vouchers, error: voucherError } = await supabase
          .from('voucher')
          .select('ma_voucher, ten_voucher')
          .in('ma_voucher', voucherIds);
        if (voucherError) {
          console.warn('[IssuedVoucherRepository] findSampleCodes voucher error:', voucherError.message);
        }
        voucherNamesById = new Map(
          (vouchers || []).map((voucher) => [voucher.ma_voucher, voucher.ten_voucher]),
        );
      }

      const result = data.map((row) => ({
        code: row.voucher_code,
        status: row.trang_thai,
        voucherName: voucherNamesById.get(row.ma_voucher) || 'Voucher',
      }));

      return result;
    } catch (err) {
      console.error('[IssuedVoucherRepository] findSampleCodes exception:', err.message);
      return [];
    }
  }
  /**
   * 6. [BR-CUS-07] Phát hành voucher code cho một item trong đơn hàng.
   *    Idempotency: Kiểm tra bản ghi đã tồn tại cho (orderId, voucherId, stt) trước khi sinh mới.
   *    Retry tối đa 5 lần nếu collision code.
   * @param {object} params - { orderId, voucherId, quantity, voucherPrefix }
   * @returns {Array<object>} Danh sách bản ghi voucher_mua vừa sinh
   */
  async issueForOrder({ orderId, voucherId, quantity = 1, voucherPrefix = 'EC' }) {
    // Idempotency: Kiểm tra đã phát hành cho đơn này chưa
    const { data: existing } = await supabase
      .from('voucher_mua')
      .select('ma_voucher_mua, voucher_code, trang_thai')
      .eq('ma_dh', orderId)
      .eq('ma_voucher', voucherId);

    if (existing && existing.length >= quantity) {
      // Đã phát hành đủ số lượng — trả về mà không insert thêm (idempotency)
      return existing;
    }

    const alreadyIssued = existing ? existing.length : 0;
    const toIssue = quantity - alreadyIssued;
    const now = new Date().toISOString();
    const results = [...(existing || [])];

    for (let i = 0; i < toIssue; i++) {
      let inserted = null;
      let attempt = 0;
      while (!inserted && attempt < 5) {
        attempt++;
        const code = generateCode(voucherPrefix);
        const qrValue = `ECQR:${code}`;

        const { data, error } = await supabase
          .from('voucher_mua')
          .insert({
            ma_dh: orderId,
            ma_voucher: voucherId,
            voucher_code: code,
            trang_thai: 'Chua su dung',
            gia_tri_qr_mo_phong: qrValue,
            thoi_gian_sinh_ma: now,
          })
          .select('ma_voucher_mua, voucher_code, trang_thai, ma_dh, ma_voucher, thoi_gian_sinh_ma, gia_tri_qr_mo_phong')
          .single();

        if (!error) {
          inserted = data;
        } else if (error.code === '23505') {
          // Unique violation — thử lại với code khác
          console.warn(`[IssuedVoucherRepository] Code collision attempt ${attempt}: ${error.message}`);
        } else {
          throw new Error(`Lỗi phát hành voucher code: ${error.message}`);
        }
      }

      if (!inserted) {
        throw new Error('Không thể sinh mã voucher duy nhất sau 5 lần thử. Vui lòng thử lại.');
      }
      results.push(inserted);
    }

    return results;
  }

  /**
   * Ghi nhận các mã còn thiếu khi phát hành thất bại. Mỗi bản ghi lỗi vẫn là
   * một quyền lợi voucher cụ thể, nhờ đó Admin có thể cấp lại đúng mã/đúng đơn.
   */
  async markIssuanceFailure({ orderId, items = [] }) {
    const failedRows = [];

    for (const item of items) {
      const quantity = Math.max(1, Number(item.quantity) || 1);
      const { data: existing, error: existingError } = await supabase
        .from('voucher_mua')
        .select('ma_voucher_mua')
        .eq('ma_dh', orderId)
        .eq('ma_voucher', item.voucherId);

      if (existingError) {
        throw new Error(`Không thể kiểm tra mã đã phát hành: ${existingError.message}`);
      }

      const missing = Math.max(0, quantity - (existing?.length || 0));
      for (let index = 0; index < missing; index++) {
        const failureCode = `ERR-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
        const { data, error } = await supabase
          .from('voucher_mua')
          .insert({
            ma_dh: orderId,
            ma_voucher: item.voucherId,
            voucher_code: failureCode,
            trang_thai: 'Loi sinh ma',
            gia_tri_qr_mo_phong: null,
            thoi_gian_sinh_ma: new Date().toISOString(),
          })
          .select('*')
          .single();

        if (error) {
          throw new Error(`Không thể ghi nhận lỗi phát hành voucher: ${error.message}`);
        }
        failedRows.push(data);
      }
    }

    return failedRows;
  }

  /**
   * 7. [BR-CUS-07] Lấy tất cả voucher đã phát hành của một đơn hàng (kèm chi tiết voucher + chi nhánh).
   * @param {string} orderId - Mã đơn hàng
   * @returns {Array<object>} raw rows
   */
  async findByOrderId(orderId) {
    if (!orderId) return [];

    const { data: vms, error } = await supabase
      .from('voucher_mua')
      .select('*')
      .eq('ma_dh', orderId)
      .order('thoi_gian_sinh_ma', { ascending: true });

    if (error) {
      console.error('[IssuedVoucherRepository] findByOrderId error:', error.message);
      return [];
    }

    return this._enrichRows(vms || []);
  }

  /**
   * 8. [BR-CUS-07] Lấy danh sách voucher của khách hàng ("Voucher của tôi").
   * Chỉ trả về voucher thuộc về tài khoản đang đăng nhập — không lộ data người khác (NFR-02).
   * @param {string} accountId - ma_tk của khách hàng
   * @param {object} opts - { page, limit, status }
   */
  async findByCustomer(accountId, { page = 1, limit = 20, status } = {}) {
    if (!accountId) return { records: [], total: 0, page, limit, totalPages: 0 };

    const offset = (page - 1) * limit;

    // Lấy danh sách ma_dh thuộc về accountId
    const { data: orders } = await supabase
      .from('donhang')
      .select('ma_dh')
      .eq('ma_tk_dat', accountId);

    if (!orders || orders.length === 0) {
      return { records: [], total: 0, page, limit, totalPages: 0 };
    }

    const orderIds = orders.map((o) => o.ma_dh);

    let query = supabase
      .from('voucher_mua')
      .select('*', { count: 'exact' })
      .in('ma_dh', orderIds)
      .order('thoi_gian_sinh_ma', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('trang_thai', status);
    }

    const { data, error, count } = await query;
    if (error) {
      console.error('[IssuedVoucherRepository] findByCustomer error:', error.message);
      return { records: [], total: 0, page, limit, totalPages: 0 };
    }

    const enriched = await this._enrichRows(data || []);
    return {
      records: enriched,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  /**
   * Helper nội bộ: Nạp thêm thông tin voucher + chi nhánh áp dụng cho một mảng raw rows.
   * @private
   */
  async _enrichRows(rows) {
    if (!rows || rows.length === 0) return [];

    const voucherIds = [...new Set(rows.map((r) => r.ma_voucher).filter(Boolean))];
    let voucherMap = new Map();

    if (voucherIds.length > 0) {
      const { data: vouchers } = await supabase
        .from('voucher')
        .select('ma_voucher, ten_voucher, mo_ta, gia_goc, gia_tri_giam, dieu_kien_ap_dung, tg_bat_dau_ban, tg_ket_thuc_ban, trang_thai, hinh_anh_url')
        .in('ma_voucher', voucherIds);

      (vouchers || []).forEach((v) => voucherMap.set(v.ma_voucher, v));
    }

    // Lấy chi nhánh áp dụng cho từng voucher
    let branchMap = new Map(); // voucherId → [{...}]
    if (voucherIds.length > 0) {
      const { data: vcLinks } = await supabase
        .from('voucher_cn')
        .select('ma_voucher, ma_chi_nhanh')
        .in('ma_voucher', voucherIds);

      if (vcLinks && vcLinks.length > 0) {
        const branchIds = [...new Set(vcLinks.map((vc) => vc.ma_chi_nhanh).filter(Boolean))];
        const { data: branches } = await supabase
          .from('chinhanh')
          .select('ma_chi_nhanh, ten_chi_nhanh, dia_chi, khu_vuc, ma_hs')
          .in('ma_chi_nhanh', branchIds);

        const partnerIds = [...new Set((branches || []).map((b) => b.ma_hs).filter(Boolean))];
        let partnerMap = new Map();
        if (partnerIds.length > 0) {
          const { data: partners } = await supabase
            .from('hosodn')
            .select('ma_hs, ten_dn')
            .in('ma_hs', partnerIds);
          (partners || []).forEach((p) => partnerMap.set(p.ma_hs, p.ten_dn));
        }

        const branchById = new Map((branches || []).map((b) => [b.ma_chi_nhanh, b]));
        vcLinks.forEach((vc) => {
          const b = branchById.get(vc.ma_chi_nhanh);
          if (!b) return;
          if (!branchMap.has(vc.ma_voucher)) branchMap.set(vc.ma_voucher, []);
          branchMap.get(vc.ma_voucher).push({
            branchId: b.ma_chi_nhanh,
            branchName: b.ten_chi_nhanh,
            address: b.dia_chi,
            area: b.khu_vuc,
            partnerId: b.ma_hs,
            partnerName: partnerMap.get(b.ma_hs) || '',
          });
        });
      }
    }

    return rows.map((row) => {
      const v = voucherMap.get(row.ma_voucher) || {};
      const branches = branchMap.get(row.ma_voucher) || [];
      return {
        ...row,
        voucher: v,
        applicableBranches: branches,
        partnerName: branches[0]?.partnerName || '',
        partnerId: branches[0]?.partnerId || null,
      };
    });
  }
}

module.exports = new IssuedVoucherRepository();
