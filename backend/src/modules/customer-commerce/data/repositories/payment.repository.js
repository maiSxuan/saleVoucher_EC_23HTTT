/**
 * Purpose: Repository cho dữ liệu thanh toán (mô phỏng — chưa tích hợp cổng thật).
 */
const supabase = require("../../../../config/supabase");

class PaymentRepository {
  async createAttempt({ orderId, amount, method }) {
    const { data, error } = await supabase
      .from("thanhtoan")
      .insert({
        ma_dh: orderId,
        so_tien: amount,
        phuong_thuc_tt: method,
        trang_thai: "Dang xu ly",
      })
      .select("ma_thanh_toan")
      .single();
    if (error) {
      const err = new Error("Không thể khởi tạo giao dịch thanh toán"); // E3
      err.status = 500;
      throw err;
    }
    return data.ma_thanh_toan;
  }

  async updateStatus(paymentId, status) {
    const { error } = await supabase
      .from("thanhtoan")
      .update({ trang_thai: status })
      .eq("ma_thanh_toan", paymentId);
    if (error) {
      const err = new Error("Không thể cập nhật trạng thái thanh toán");
      err.status = 500;
      throw err;
    }
  }

  async markPendingAttemptsFailed(orderId) {
    const { error } = await supabase
      .from("thanhtoan")
      .update({ trang_thai: "That bai" })
      .eq("ma_dh", orderId)
      .eq("trang_thai", "Dang xu ly");
    if (error) {
      const err = new Error("Không thể cập nhật trạng thái giao dịch thanh toán đang chờ");
      err.status = 500;
      throw err;
    }
  }

  async findById(paymentId) {
    const { data, error } = await supabase
      .from("thanhtoan")
      .select("ma_thanh_toan, ma_dh, trang_thai, so_tien")
      .eq("ma_thanh_toan", paymentId)
      .maybeSingle();
    if (error) {
      const err = new Error("Không thể truy xuất giao dịch thanh toán");
      err.status = 500;
      throw err;
    }
    return data;
  }
}

module.exports = new PaymentRepository();
