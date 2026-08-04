/**
 * FILE: backend/src/modules/core-access/data/repositories/issued-voucher.repository.js
 * PURPOSE: Data Repository truy vấn và cập nhật bảng `voucher_mua` trong Supabase thật.
 *
 * Nghiệp vụ tuân thủ:
 * - BR-PAR-05: Tra cứu thông tin voucher code và quan hệ voucher/đơn hàng/chi nhánh.
 * - BR-PAR-06: Cập nhật trạng thái 'Da su dung' (Atomic update chống Race Condition).
 * - RB-07, RB-08, RB-09.
 */

const supabase = require('../../../../config/supabase');

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

    // Nạp thêm thông tin voucher và chi nhánh
    const enriched = await Promise.all(
      (data || []).map(async (row) => {
        let vInfo = null;
        let bInfo = null;
        let staffInfo = null;

        if (row.ma_voucher) {
          const { data: v } = await supabase
            .from('voucher')
            .select('ten_voucher, gia_tri_giam, gia_goc')
            .eq('ma_voucher', row.ma_voucher)
            .maybeSingle();
          vInfo = v;
        }

        if (row.ma_chi_nhanh_su_dung) {
          const { data: b } = await supabase
            .from('chinhanh')
            .select('ten_chi_nhanh')
            .eq('ma_chi_nhanh', row.ma_chi_nhanh_su_dung)
            .maybeSingle();
          bInfo = b;
        }

        if (row.ma_nhan_vien_xac_nhan) {
          const { data: tk } = await supabase
            .from('taikhoan')
            .select('thong_tin_dang_nhap, nguoidung:ma_nguoi_dung(ho_ten)')
            .eq('ma_tk', row.ma_nhan_vien_xac_nhan)
            .maybeSingle();
          staffInfo = tk;
        }

        return {
          ...row,
          voucher: vInfo,
          chinhanh: bInfo,
          nhanvien: staffInfo,
        };
      })
    );

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

      // Map tên voucher
      const result = await Promise.all(
        data.map(async (row) => {
          let vName = 'Voucher';
          if (row.ma_voucher) {
            const { data: v } = await supabase
              .from('voucher')
              .select('ten_voucher')
              .eq('ma_voucher', row.ma_voucher)
              .maybeSingle();
            if (v?.ten_voucher) vName = v.ten_voucher;
          }
          return {
            code: row.voucher_code,
            status: row.trang_thai,
            voucherName: vName,
          };
        })
      );

      return result;
    } catch (err) {
      console.error('[IssuedVoucherRepository] findSampleCodes exception:', err.message);
      return [];
    }
  }
}

module.exports = new IssuedVoucherRepository();
