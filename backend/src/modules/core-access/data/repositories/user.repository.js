const supabase = require('../../../../config/supabase');

/**
 * Purpose: Repository cho thao tác trên bảng user.
 * Sau này sẽ nằm ở đây để tách khỏi business logic.
 */
class UserRepository {
  async findAccountByLoginInfo(loginInfo) {
    const { data, error } = await supabase
      .from('taikhoan')
      .select(`
        *,
        nguoidung:ma_nguoi_dung (
          ma_nguoi_dung, ho_ten, email, sdt, vai_tro, trang_thai, ma_chi_nhanh
        )
      `)
      .eq('thong_tin_dang_nhap', loginInfo)
      .single();

    if (error) {
      console.error("Supabase Error finding account:", error);
      return null;
    }
    return data;
  }
}

module.exports = new UserRepository();
