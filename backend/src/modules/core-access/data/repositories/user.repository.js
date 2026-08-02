const supabase = require('../../../../config/supabase');

class UserRepository {
  // -----------------------------------------------------------------------
  // 1. TÌM TÀI KHOẢN KHI ĐĂNG NHẬP
  //    Được gọi từ auth.service.js khi user login.
  //    Join TAIKHOAN với NGUOIDUNG để lấy thông tin đầy đủ.
  // -----------------------------------------------------------------------
  async findAccountByLoginInfo(loginInfo) {
    const cleanInfo = (loginInfo || '').trim();
    try {
      const { data, error } = await supabase
        .from('taikhoan')
        .select(`
          ma_tk,
          thong_tin_dang_nhap,
          mat_khau,
          nguoidung:ma_nguoi_dung (
            ma_nguoi_dung, ho_ten, email, sdt, vai_tro, trang_thai, created_at, ma_chi_nhanh
          )
        `)
        .or(`thong_tin_dang_nhap.eq.${cleanInfo},thong_tin_dang_nhap.ilike.${cleanInfo}%`)
        .limit(1);

      if (error || !data || data.length === 0) {
        return null;
      }
      return data[0];
    } catch (e) {
      console.error('[UserRepository] findAccountByLoginInfo error:', e.message);
      return null;
    }
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
      .select('ma_nguoi_dung, ho_ten, email, sdt, vai_tro, trang_thai, created_at, ma_chi_nhanh')
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
  async updateRole(userId, newRole) {
    const { data, error } = await supabase
      .from('nguoidung')
      .update({ vai_tro: newRole })
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
