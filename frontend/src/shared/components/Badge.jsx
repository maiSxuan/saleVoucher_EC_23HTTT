import React from "react";
import { useTranslation } from "react-i18next";

export function Badge({ status, text, size = "md" }) {
  const { t } = useTranslation();

  const getBadgeStyle = (statusVal) => {
    switch (statusVal) {
      case "Dang hoat dong":
      case "Dang ban":
      case "Da duyet":
      case "Thanh cong":
      case "Hien thi":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Cho duyet":
      case "Cho hien thi":
      case "Yeu cau bo sung":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Tu choi":
      case "Tam khoa":
      case "That bai":
      case "Ngung ban":
      case "Vo hieu hoa":
      case "Vo Hieu Hoa":
      case "Vo_hieu_hoa":
      case "disabled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "Nhap":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "Het hang":
        return "bg-violet-50 text-violet-700 border-violet-200";
      case "Bao luu":
      case "Tam ngung":
      case "Tam an":
      case "Tam ngung hoat dong":
      case "Het han":
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getLabel = (statusVal) => {
    if (text) return t(text);
    switch (statusVal) {
      case "Dang hoat dong": return t("Đang hoạt động");
      case "Cho duyet": return t("Chờ duyệt");
      case "Tu choi": return t("Từ chối");
      case "Da tu choi": return t("Đã từ chối");
      case "Da chap nhan": return t("Đã chấp nhận");
      case "Tam khoa": return t("Tạm khóa");
      case "Nhap": return t("Bản nháp");
      case "Da duyet": return t("Đã duyệt");
      case "Dang ban": return t("Đang bán");
      case "Hien thi": return t("Đang bán");
      case "Bao luu": return t("Chưa công bố");
      case "Cho hien thi": return t("Chờ mở bán");
      case "Tam an": return t("Tạm ẩn");
      case "Tam ngung": return t("Tạm ngưng");
      case "Ngung ban": return t("Ngừng bán");
      case "Yeu cau bo sung": return t("Cần bổ sung");
      case "Het hang": return t("Hết hàng");
      case "Het han": return t("Hết hạn");
      case "Chua su dung": return t("Chưa sử dụng");
      case "Da su dung": return t("Đã sử dụng");
      case "Cho xu ly": return t("Chờ xử lý");
      case "Dang xu ly": return t("Đang xử lý");
      case "Da xu ly": return t("Đã xử lý");
      case "Hoan tien":
      case "Da hoan tien": return t("Đã hoàn tiền");
      case "Cho hoan tien": return t("Chờ hoàn tiền");
      case "Cho thanh toan": return t("Chờ thanh toán");
      case "Da thanh toan": return t("Đã thanh toán");
      case "Huy":
      case "Da huy": return t("Đã hủy");
      case "Vo hieu hoa":
      case "Vo Hieu Hoa":
      case "Vo_hieu_hoa":
      case "disabled": return t("Vô hiệu hóa");
      default: return t(statusVal);
    }
  };

  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs tracking-wide";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${sizeClasses} ${getBadgeStyle(
        status
      )}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
      {getLabel(status)}
    </span>
  );
}

export default Badge;
