/**
 * Purpose: Repository cho chi tiết đơn hàng.
 */
const supabase = require("../../../../config/supabase");

class OrderItemRepository {
  async createMany(orderId, items) {
    const rows = items.map((i) => ({
      ma_dh: orderId,
      ma_voucher: i.voucherId,
      so_luong: i.quantity,
      gia_tai_thoi_diem_mua: i.salePrice,
    }));
    const { error } = await supabase.from("chitietdonhang").insert(rows);
    if (error) {
      const err = new Error("Không thể lưu chi tiết đơn hàng");
      err.status = 500;
      throw err;
    }
  }

  async findByOrderId(orderId) {
    const { data, error } = await supabase
      .from("chitietdonhang")
      .select("ma_voucher, so_luong, gia_tai_thoi_diem_mua")
      .eq("ma_dh", orderId);
    if (error) {
      const err = new Error("Không thể truy xuất chi tiết đơn hàng");
      err.status = 500;
      throw err;
    }
    return data || [];
  }
}

module.exports = new OrderItemRepository();
