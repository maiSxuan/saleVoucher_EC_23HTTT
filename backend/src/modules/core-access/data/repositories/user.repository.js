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
          ma_nguoi_dung, ho_ten, email, sdt, vai_tro, trang_thai, created_at, ma_chi_nhanh
        )
      `)
      .eq('thong_tin_dang_nhap', loginInfo)
      .single();

    if (error) {
      // Trả null thay vì throw — để auth.service.js xử lý "không tìm thấy"
      console.error('[UserRepository] findAccountByLoginInfo error:', error.message);
      return null;
    }
    return data;
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
      .select('ma_nguoi_dung, ho_ten, email, sdt, vai_tro, trang_thai, created_at, ma_chi_nhanh')
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
  async updateRole(userId, newRole) {
    const { data, error } = await supabase
      .from('nguoidung')
      .update({ vai_tro: newRole })  // Chỉ cập nhật đúng 1 cột
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
