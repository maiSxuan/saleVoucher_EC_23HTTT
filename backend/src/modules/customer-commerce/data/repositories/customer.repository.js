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
}

module.exports = new CustomerRepository();
