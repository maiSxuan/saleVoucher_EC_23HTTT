/**
 * Helper định dạng và xác định trạng thái hiển thị / công bố Voucher thống nhất toàn ứng dụng
 */
export function getVoucherPublicationStatus(v) {
  if (!v) return { label: "Bản nháp", color: "bg-sky-50 text-sky-700 border-sky-200", dot: "bg-sky-500", key: "Nhap" };

  const status = v.trang_thai || v.trang_thai_kiem_duyet || "";

  if (status === "Ngung ban") {
    return { label: "Ngừng bán", color: "bg-rose-50 text-rose-700 border-rose-200", dot: "bg-rose-500", key: "Ngung ban" };
  }
  if (status === "Tam ngung" || status === "Tam an") {
    return { label: "Tạm ngưng", color: "bg-slate-100 text-slate-600 border-slate-200", dot: "bg-slate-400", key: "Tam ngung" };
  }
  if (status === "Tu choi") {
    return { label: "Bị từ chối", color: "bg-rose-50 text-rose-700 border-rose-200", dot: "bg-rose-500", key: "Tu choi" };
  }
  if (status === "Nhap") {
    return { label: "Bản nháp", color: "bg-sky-50 text-sky-700 border-sky-200", dot: "bg-sky-500", key: "Nhap" };
  }
  if (status === "Cho duyet") {
    return { label: "Chờ duyệt", color: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500", key: "Cho duyet" };
  }

  // Approved / Active selling status ("Dang ban" / "Da duyet")
  const isApproved = status === "Dang ban" || status === "Da duyet" || v.trang_thai_kiem_duyet === "Da duyet";
  if (!isApproved) {
    return { label: "Chưa công bố", color: "bg-slate-100 text-slate-600 border-slate-200", dot: "bg-slate-400", key: "Chua cong bo" };
  }

  const now = new Date();
  const sold = Number(v.so_luong_da_ban) || 0;
  const total = Number(v.so_luong_phat_hanh) || 0;

  if (sold >= total && total > 0) {
    return { label: "Hết hàng", color: "bg-violet-50 text-violet-700 border-violet-200", dot: "bg-violet-500", key: "Het hang" };
  }

  if (v.tg_ket_thuc_ban) {
    const end = new Date(v.tg_ket_thuc_ban);
    if (!isNaN(end.getTime()) && now > end) {
      return { label: "Hết hạn", color: "bg-slate-100 text-slate-600 border-slate-200", dot: "bg-slate-400", key: "Het han" };
    }
  }

  if (v.tg_bat_dau_ban) {
    const start = new Date(v.tg_bat_dau_ban);
    // Allow a 1-hour buffer for timezone parsing (e.g. UTC vs Local Time)
    if (!isNaN(start.getTime()) && start.getTime() - now.getTime() > 60 * 60 * 1000) {
      return { label: "Chờ mở bán", color: "bg-sky-50 text-sky-700 border-sky-200", dot: "bg-sky-500", key: "Cho mo ban" };
    }
  }

  return { label: "Đang bán", color: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500", key: "Dang ban" };
}

export default getVoucherPublicationStatus;
