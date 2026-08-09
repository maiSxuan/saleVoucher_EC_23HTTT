import React from "react";

export function Badge({ status, text, size = "md" }) {
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
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "Nhap":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Het hang":
        return "bg-purple-50 text-purple-700 border-purple-200";
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
    if (text) return text;
    switch (statusVal) {
      case "Dang hoat dong": return "Đang hoạt động";
      case "Cho duyet": return "Chờ duyệt";
      case "Tu choi": return "Từ chối";
      case "Tam khoa": return "Tạm khóa";
      case "Nhap": return "Bản nháp";
      case "Da duyet": return "Đã duyệt";
      case "Dang ban": return "Đang bán";
      case "Hien thi": return "Đang bán";
      case "Bao luu": return "Chưa công bố";
      case "Cho hien thi": return "Chờ mở bán";
      case "Tam an": return "Tạm ẩn";
      case "Tam ngung": return "Tạm ngưng";
      case "Ngung ban": return "Ngừng bán";
      case "Yeu cau bo sung": return "Cần bổ sung";
      case "Het hang": return "Hết hàng";
      case "Het han": return "Hết hạn";
      default: return statusVal;
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
