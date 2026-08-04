/**
 * Purpose: Tính trạng thái khả dụng thực tế của voucher (dùng chung cho catalog và cart).
 */
function computeAvailability(v) {
  const now = new Date();
  const remaining = v.so_luong_phat_hanh - v.so_luong_da_ban;

  if (v.trang_thai === "Tam ngung") return "suspended";
  if (v.trang_thai !== "Dang ban") return "stopped";
  if (new Date(v.tg_bat_dau_ban) > now) return "scheduled";
  if (new Date(v.tg_ket_thuc_ban) < now) return "expired";
  if (remaining <= 0) return "sold_out";
  return "selling";
}

module.exports = { computeAvailability };
