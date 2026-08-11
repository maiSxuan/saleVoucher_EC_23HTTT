const supabase = require('../../../../config/supabase');

class UserRepository {
  // -----------------------------------------------------------------------
  // 1. TÌM TÀI KHOẢN KHI ĐĂNG NHẬP
  //    Được gọi từ auth.service.js khi user login.
  //    Join TAIKHOAN với NGUOIDUNG để lấy thông tin đầy đủ.
  // -----------------------------------------------------------------------
  async findAccountByLoginInfo(loginInfo) {
    const cleanInfo = (loginInfo || '').trim();
    if (!cleanInfo) return null;

    const accountSelection = `
      ma_tk,
      thong_tin_dang_nhap,
      mat_khau,
      nguoidung:ma_nguoi_dung (
        ma_nguoi_dung, ho_ten, email, sdt, vai_tro, trang_thai, created_at, ma_chi_nhanh, ma_hsdn
      )
    `;

    try {
      const { data: exactAccount, error: exactError } = await supabase
        .from('taikhoan')
        .select(accountSelection)
        .eq('thong_tin_dang_nhap', cleanInfo)
        .maybeSingle();

      if (exactError) throw exactError;
      if (exactAccount) return exactAccount;

      // Hỗ trợ username/prefix của Ngân nhưng chỉ nhận khi kết quả là duy nhất.
      const { data: prefixAccounts, error: prefixError } = await supabase
        .from('taikhoan')
        .select(accountSelection)
        .ilike('thong_tin_dang_nhap', `${cleanInfo}%`)
        .limit(2);

      if (prefixError) throw prefixError;
      if (prefixAccounts?.length === 1) return prefixAccounts[0];

      // Hỗ trợ tìm tài khoản qua Email trong bảng NGUOIDUNG (UC-BUS-05)
      const { data: userRecord, error: userError } = await supabase
        .from('nguoidung')
        .select('ma_nguoi_dung')
        .or(`email.ilike.${cleanInfo},sdt.eq.${cleanInfo}`)
        .limit(1)
        .maybeSingle();

      if (!userError && userRecord) {
        const { data: accountByUser, error: accError } = await supabase
          .from('taikhoan')
          .select(accountSelection)
          .eq('ma_nguoi_dung', userRecord.ma_nguoi_dung)
          .maybeSingle();

        if (!accError && accountByUser) return accountByUser;
      }

      return null;
    } catch (e) {
      console.error('[UserRepository] findAccountByLoginInfo error:', e.message);
      return null;
    }
  }

  // -----------------------------------------------------------------------
  // API TÌM CHI NHÁNH VÀ ĐỐI TÁC CHO COMBOBOX
  // -----------------------------------------------------------------------
  async findAllBranches({ maHsdn, includeInactive = false } = {}) {
    let query = supabase
      .from('chinhanh')
      .select('ma_chi_nhanh, ten_chi_nhanh, dia_chi, khu_vuc, trang_thai, ma_hs')
      .order('ten_chi_nhanh', { ascending: true });

    if (maHsdn) query = query.eq('ma_hs', maHsdn);
    if (!includeInactive) query = query.eq('trang_thai', 'Dang hoat dong');

    const { data, error } = await query;
    if (error) throw new Error(`Lỗi lấy danh sách chi nhánh: ${error.message}`);
    return data;
  }

  async findAllPartners({ includeInactive = false } = {}) {
    let query = supabase
      .from('hosodn')
      .select('ma_hs, ten_dn, dia_chi, trang_thai')
      .order('ten_dn', { ascending: true });

    if (!includeInactive) query = query.eq('trang_thai', 'Dang hoat dong');

    const { data, error } = await query;
    if (error) throw new Error(`Lỗi lấy danh sách đối tác: ${error.message}`);
    return data;
  }

  // -----------------------------------------------------------------------
  // CÁC HÀM LẤY THÔNG TIN CHI TIẾT THEO YÊU CẦU 5.1
  // -----------------------------------------------------------------------
  async findBranchById(branchId) {
    const { data, error } = await supabase
      .from('chinhanh')
      .select('ma_chi_nhanh, ten_chi_nhanh, dia_chi, trang_thai, ma_hs')
      .eq('ma_chi_nhanh', branchId)
      .maybeSingle();
    if (error) throw new Error(`Không thể kiểm tra chi nhánh: ${error.message}`);
    return data;
  }

  async findPartnerById(partnerId) {
    const { data, error } = await supabase
      .from('hosodn')
      .select('ma_hs, ten_dn, dia_chi, trang_thai')
      .eq('ma_hs', partnerId)
      .maybeSingle();
    if (error) throw new Error(`Không thể kiểm tra đối tác: ${error.message}`);
    return data;
  }

  async getUserCompanyInfo(maHsdn) {
    if (!maHsdn) return null;
    const { data, error } = await supabase
      .from('hosodn')
      .select('ma_hs, ten_dn, dia_chi')
      .eq('ma_hs', maHsdn)
      .maybeSingle();
    if (error) throw new Error(`Lỗi lấy thông tin đối tác: ${error.message}`);
    return data;
  }

  async getUserBranchInfo(maChiNhanh) {
    if (!maChiNhanh) return null;
    const { data, error } = await supabase
      .from('chinhanh')
      .select('ma_chi_nhanh, ten_chi_nhanh, dia_chi, ma_hs, hosodn:ma_hs(ten_dn)')
      .eq('ma_chi_nhanh', maChiNhanh)
      .maybeSingle();
    if (error) throw new Error(`Lỗi lấy thông tin chi nhánh: ${error.message}`);
    return data;
  }

  async getUserOrderHistory(userId) {
    const { data: tkData } = await supabase.from('taikhoan').select('ma_tk').eq('ma_nguoi_dung', userId).maybeSingle();
    if (!tkData) return [];
    const { data, error } = await supabase
      .from('donhang')
      .select('*')
      .eq('ma_tk_dat', tkData.ma_tk)
      .order('ngay_dat', { ascending: false });
    if (error) throw new Error(`Lỗi lấy lịch sử đơn hàng: ${error.message}`);
    return data || [];
  }

  async getUserAuditLogs(userId) {
    const { data: tkData } = await supabase.from('taikhoan').select('ma_tk').eq('ma_nguoi_dung', userId).maybeSingle();
    if (!tkData) return [];
    const { data, error } = await supabase
      .from('log_ht')
      .select('*')
      .eq('ma_tk_thuc_hien', tkData.ma_tk)
      .order('thoi_diem_thuc_hien', { ascending: false });
    if (error) throw new Error(`Lỗi lấy lịch sử quản trị: ${error.message}`);
    return data || [];
  }

  // -----------------------------------------------------------------------
  // 2. LẤY DANH SÁCH NGƯỜI DÙNG (BR-ADM-01 — Admin xem danh sách)
  // -----------------------------------------------------------------------
  async findAll({ page = 1, limit = 20, name, phone, role, status } = {}) {
    const offset = (page - 1) * limit;

    let query = supabase
      .from('nguoidung')
      .select(
        'ma_nguoi_dung, ho_ten, email, sdt, vai_tro, trang_thai, created_at, ma_chi_nhanh',
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (name) query = query.ilike('ho_ten', `%${name}%`);
    if (phone) query = query.ilike('sdt', `%${phone}%`);
    if (role) query = query.eq('vai_tro', role);
    if (status) query = query.eq('trang_thai', status);

    const { data, error, count } = await query;

    if (error) {
      console.error('[UserRepository] findAll error:', error.message);
      throw new Error(`Lấy danh sách người dùng thất bại: ${error.message}`);
    }

    return { users: data, total: count };
  }

  // -----------------------------------------------------------------------
  // 3. TÌM NGƯỜI DÙNG THEO ID (BR-ADM-01 — Admin xem chi tiết)
  // -----------------------------------------------------------------------
  async findById(userId) {
    const { data, error } = await supabase
      .from('nguoidung')
      .select('ma_nguoi_dung, ho_ten, email, sdt, vai_tro, trang_thai, created_at, ma_chi_nhanh, ma_hsdn')
      .eq('ma_nguoi_dung', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('[UserRepository] findById error:', error.message);
      throw new Error(`Tìm người dùng thất bại: ${error.message}`);
    }
    return data;
  }

  // -----------------------------------------------------------------------
  // 4. CẬP NHẬT TRẠNG THÁI (khóa / mở khóa) NGƯỜI DÙNG
  // -----------------------------------------------------------------------
  async updateStatus(userId, newStatus) {
    const { data, error } = await supabase
      .from('nguoidung')
      .update({ trang_thai: newStatus })
      .eq('ma_nguoi_dung', userId)
      .select()
      .single();

    if (error) {
      console.error('[UserRepository] updateStatus error:', error.message);
      throw new Error(`Cập nhật trạng thái người dùng thất bại: ${error.message}`);
    }
    return data;
  }

  // -----------------------------------------------------------------------
  // 5. CẬP NHẬT VAI TRÒ (role) NGƯỜI DÙNG
  // -----------------------------------------------------------------------
  async updateRole(userId, newRole, maChiNhanh = null, maHsdn = null) {
    const updateData = { vai_tro: newRole };

    // Gán mã chi nhánh / đối tác theo đúng logic.
    // Nếu đổi sang Khách hàng / Admin thì set null cả 2.
    if (newRole === 'Nhan vien ban hang') {
      updateData.ma_chi_nhanh = maChiNhanh;
      updateData.ma_hsdn = null;
    } else if (newRole === 'Nhan vien quan ly voucher' || newRole === 'Nguoi dai dien') {
      updateData.ma_chi_nhanh = null;
      updateData.ma_hsdn = maHsdn;
    } else {
      updateData.ma_chi_nhanh = null;
      updateData.ma_hsdn = null;
    }

    const { data, error } = await supabase
      .from('nguoidung')
      .update(updateData)  // Cập nhật vai trò + mã chi nhánh + mã đối tác
      .eq('ma_nguoi_dung', userId)
      .select()
      .single();

    if (error) {
      console.error('[UserRepository] updateRole error:', error.message);
      throw new Error(`Cập nhật vai trò người dùng thất bại: ${error.message}`);
    }
    return data;
  }

  // -----------------------------------------------------------------------
  // 6. CẬP NHẬT MẬT KHẨU (dùng trong UC-BUS-05 Quên mật khẩu)
  //    accountId: ma_tk trong bảng TAIKHOAN
  //    hashedPassword: mật khẩu đã được hash bằng bcrypt trước khi truyền vào
  // -----------------------------------------------------------------------
  async updatePassword(accountId, hashedPassword) {
    const { data, error } = await supabase
      .from('taikhoan')
      .update({ mat_khau: hashedPassword })
      .eq('ma_tk', accountId)
      .select('ma_tk')
      .single();

    if (error) {
      console.error('[UserRepository] updatePassword error:', error.message);
      throw new Error(`Không thể cập nhật mật khẩu: ${error.message}`);
    }
    return data;
  }
}

module.exports = new UserRepository();
