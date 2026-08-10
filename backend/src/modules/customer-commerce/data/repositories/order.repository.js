/**
 * Purpose: Repository cho dữ liệu đơn hàng.
 */
const supabase = require("../../../../config/supabase");

class OrderRepository {
  async create({ accountId, total }) {
    const { data, error } = await supabase
      .from("donhang")
      .insert({ ma_tk_dat: accountId, tong_tien: total })
      .select("ma_dh, ngay_dat, tong_tien, trang_thai")
      .single();
    if (error) {
      const err = new Error("Không thể tạo đơn hàng"); // E2
      err.status = 500;
      throw err;
    }
    return data;
  }

  async updateStatus(orderId, status) {
    const { error } = await supabase
      .from("donhang")
      .update({ trang_thai: status })
      .eq("ma_dh", orderId);
    if (error) {
      const err = new Error("Không thể cập nhật trạng thái đơn hàng");
      err.status = 500;
      throw err;
    }
  }

  async findById(orderId, accountId) {
    const { data, error } = await supabase
      .from("donhang")
      .select("ma_dh, ngay_dat, tong_tien, trang_thai, ma_tk_dat")
      .eq("ma_dh", orderId)
      .maybeSingle();
    if (error) {
      const err = new Error("Không thể truy xuất đơn hàng");
      err.status = 500;
      throw err;
    }
    if (!data || data.ma_tk_dat !== accountId) return null; // không cho xem/thao tác đơn của người khác
    return data;
  }

  async findRawById(orderId) {
    const { data, error } = await supabase
      .from("donhang")
      .select("ma_dh, tong_tien, trang_thai, ma_tk_dat")
      .eq("ma_dh", orderId)
      .maybeSingle();
    if (error) {
      const err = new Error("Không thể truy xuất đơn hàng");
      err.status = 500;
      throw err;
    }
    return data;
  }
}

module.exports = new OrderRepository();
