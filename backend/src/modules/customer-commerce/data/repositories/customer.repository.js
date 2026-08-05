/**
 * Purpose: Repository cho thao tác dữ liệu khách hàng.
 */

const supabase = require("../../../../config/supabase");

class CustomerRepository {
  async checkLoginInfoExists(loginInfo) {
    const { data } = await supabase
      .from("taikhoan")
      .select("ma_tk")
      .eq("thong_tin_dang_nhap", loginInfo)
      .maybeSingle();
    return !!data;
  }

  async createCustomerAccount({
    ho_ten,
    email,
    sdt,
    loginInfo,
    hashedPassword,
  }) {
    //Insert NGUOIDUNG trước
    const { data: user, error: userErr } = await supabase
      .from("nguoidung")
      .insert({ ho_ten, email, vai_tro: "Khach hang" })
      .select()
      .single();
    if (userErr) throw userErr;

    //Insert TAIKHOAN, nếu lỗi -> xóa lại NGUOIDUNG vừa tạo (compensating action)
    const { data: account, error: accErr } = await supabase
      .from("taikhoan")
      .insert({
        thong_tin_dang_nhap: loginInfo,
        mat_khau: hashedPassword,
        ma_nguoi_dung: user.ma_nguoi_dung,
      })
      .select()
      .single();
    if (accErr) {
      await supabase
        .from("nguoidung")
        .delete()
        .eq("ma_nguoi_dung", user.ma_nguoi_dung);
      throw accErr;
    }
    return { user, account };
  }

  async findProfileById(userId) {
    const { data, error } = await supabase
      .from("nguoidung")
      .select("ma_nguoi_dung, ho_ten, email, sdt, ngay_sinh, gioi_tinh")
      .eq("ma_nguoi_dung", userId)
      .maybeSingle();
    if (error) {
      const err = new Error("Không thể truy xuất hồ sơ khách hàng"); // E1
      err.status = 500;
      throw err;
    }
    return data;
  }

  async findByEmailOrPhoneExcludingSelf({ email, sdt, userId }) {
    const { data, error } = await supabase
      .from("nguoidung")
      .select("ma_nguoi_dung, email, sdt")
      .neq("ma_nguoi_dung", userId)
      .or(`email.eq.${email},sdt.eq.${sdt}`);
    if (error) {
      const err = new Error("Không thể kiểm tra dữ liệu hồ sơ");
      err.status = 500;
      throw err;
    }
    return data || [];
  }

  async updateProfile(userId, { ho_ten, email, sdt, ngay_sinh, gioi_tinh }) {
    const { data, error } = await supabase
      .from("nguoidung")
      .update({ ho_ten, email, sdt, ngay_sinh, gioi_tinh })
      .eq("ma_nguoi_dung", userId)
      .select("ma_nguoi_dung, ho_ten, email, sdt, ngay_sinh, gioi_tinh")
      .single();
    if (error) {
      const err = new Error("Không thể cập nhật hồ sơ"); // E2
      err.status = 500;
      throw err;
    }
    return data;
  }

  async findAccountByUserId(userId) {
    const { data, error } = await supabase
      .from("taikhoan")
      .select("ma_tk, mat_khau")
      .eq("ma_nguoi_dung", userId)
      .maybeSingle();
    if (error) {
      const err = new Error("Không thể truy xuất tài khoản");
      err.status = 500;
      throw err;
    }
    return data;
  }

  async updatePassword(accountId, hashedPassword) {
    const { error } = await supabase
      .from("taikhoan")
      .update({ mat_khau: hashedPassword })
      .eq("ma_tk", accountId);
    if (error) {
      const err = new Error("Không thể đổi mật khẩu");
      err.status = 500;
      throw err;
    }
  }
}

module.exports = new CustomerRepository();
