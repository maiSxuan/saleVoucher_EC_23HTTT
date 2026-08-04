const supabase = require('../../../../config/supabase');

class UserRepository {
  // -----------------------------------------------------------------------
  // 1. TÌM TÀI KHOẢN KHI ĐĂNG NHẬP
  //    Được gọi từ auth.service.js khi user login.
  //    Join TAIKHOAN với NGUOIDUNG để lấy thông tin đầy đủ.
  // -----------------------------------------------------------------------
  async findAccountByLoginInfo(loginInfo) {
    const { data, error } = await supabase
      .from('taikhoan')
      .select(`
        ma_tk,
        thong_tin_dang_nhap,
        mat_khau,
        nguoidung:ma_nguoi_dung (
          ma_nguoi_dung, ho_ten, email, sdt, vai_tro, trang_thai, created_at, ma_chi_nhanh, ma_hsdn
        )
      `)
      .eq('thong_tin_dang_nhap', loginInfo)
      .limit(1)
      .maybeSingle();

    if (error) {
      // Trả null thay vì throw — để auth.service.js xử lý "không tìm thấy"
      console.error('[UserRepository] findAccountByLoginInfo error:', error.message);
      return null;
    }
    return data;
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
      .eq('trang_thai', 'Hoan thanh')
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
  //    Hỗ trợ lọc theo: tên, sdt, vai_tro, trang_thai.
  //    Hỗ trợ phân trang: page, limit.
  //    Trả về { users, total }.
  // -----------------------------------------------------------------------
  async findAll({ page = 1, limit = 20, name, phone, role, status } = {}) {
    // (page - 1) * limit = offset, để bắt đầu từ dòng đúng
    const offset = (page - 1) * limit;

    // Bắt đầu xây query — select all fields + count tổng số bản ghi
    let query = supabase
      .from('nguoidung')
      .select(
        'ma_nguoi_dung, ho_ten, email, sdt, vai_tro, trang_thai, created_at, ma_chi_nhanh',
        { count: 'exact' }  // count: 'exact' để lấy tổng số records (dùng phân trang)
      )
      .order('created_at', { ascending: false })  // Mới nhất lên đầu
      .range(offset, offset + limit - 1);       // Giới hạn số bản ghi trả về

    // Áp dụng bộ lọc nếu client truyền vào
    // ilike: tìm không phân biệt hoa thường, '%..%' = chứa chuỗi này
    if (name) query = query.ilike('ho_ten', `%${name}%`);
    if (phone) query = query.ilike('sdt', `%${phone}%`);
    // eq: tìm chính xác (vai trò và trạng thái phải match đúng giá trị DB)
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
  //    Trả về toàn bộ thông tin người dùng đó, hoặc null nếu không tìm thấy.
  // -----------------------------------------------------------------------
  async findById(userId) {
    const { data, error } = await supabase
      .from('nguoidung')
      .select('ma_nguoi_dung, ho_ten, email, sdt, vai_tro, trang_thai, created_at, ma_chi_nhanh, ma_hsdn')
      .eq('ma_nguoi_dung', userId)
      .single();  // .single() → lỗi nếu không tìm thấy, trả null nếu null

    if (error) {
      // PGRST116 là error code của PostgREST khi không tìm thấy bản ghi
      if (error.code === 'PGRST116') return null;
      console.error('[UserRepository] findById error:', error.message);
      throw new Error(`Tìm người dùng thất bại: ${error.message}`);
    }
    return data;
  }

  // -----------------------------------------------------------------------
  // 4. CẬP NHẬT TRẠNG THÁI (khóa / mở khóa) NGƯỜI DÙNG
  //    Được gọi từ user.service.js sau khi kiểm tra quyền và business rule.
  //    Chỉ update cột trang_thai, không sửa các cột khác.
  // -----------------------------------------------------------------------
  async updateStatus(userId, newStatus) {
    const { data, error } = await supabase
      .from('nguoidung')
      .update({ trang_thai: newStatus })  // Chỉ cập nhật đúng 1 cột
      .eq('ma_nguoi_dung', userId)        // Lọc đúng user cần cập nhật
      .select()                           // Trả về bản ghi sau khi update để service xác nhận
      .single();

    if (error) {
      console.error('[UserRepository] updateStatus error:', error.message);
      throw new Error(`Cập nhật trạng thái người dùng thất bại: ${error.message}`);
    }
    return data;  // Trả về bản ghi đã được update
  }

  // -----------------------------------------------------------------------
  // 5. CẬP NHẬT VAI TRÒ (role) NGƯỜI DÙNG
  //    Được gọi từ user.service.js sau khi kiểm tra quyền.
  //    Chỉ update cột vai_tro.
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
}

module.exports = new UserRepository();
