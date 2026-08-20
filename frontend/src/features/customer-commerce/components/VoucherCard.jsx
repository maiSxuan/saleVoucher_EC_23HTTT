import { Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function VoucherCard({ voucher: v, onClick }) {
  const { t } = useTranslation();
  // tính toán tỉ lệ giảm giá và số lượng còn lại
  const discountPct = Math.round((1 - v.salePrice / v.originalPrice) * 100);
  const remaining = v.totalQty - v.soldQty;
  const voucherName = typeof v.name === "object" && v.name !== null ? v.name.name || v.name.ten_voucher : (v.name || v.ten_voucher);

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden text-left transition-all duration-200 group flex flex-col h-full"
    >
      <div className="relative overflow-hidden">
        <img
          src={v.image || v.hinh_anh_url}
          alt={voucherName}
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discountPct > 0 && (
          <span className="absolute top-2.5 right-2.5 bg-red-500 text-white text-xs px-2.5 py-1 rounded-md font-bold shadow">
            -{discountPct}%
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <p className="text-xs text-orange-600 font-semibold uppercase tracking-wider mb-1">
            {typeof v.partner === 'object' && v.partner !== null ? (v.partner.ten_dn || v.partner.name || t("Đối tác")) : (v.partner || v.ten_dn || t("Đối tác"))}
          </p>
          <p className="text-base font-bold text-gray-900 line-clamp-2 mb-3 group-hover:text-orange-600 transition-colors">
            {voucherName}
          </p>
        </div>

        <div>
          <div className="flex items-baseline gap-2 mb-2">
            <p className="text-lg font-extrabold text-orange-600">
              {v.salePrice?.toLocaleString("vi-VN")}đ
            </p>
            <p className="text-xs text-gray-400 line-through font-medium">
              {v.originalPrice?.toLocaleString("vi-VN")}đ
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-50">
            {remaining <= 20 && remaining > 0 ? (
              <span className="text-red-500 font-semibold">
                {t("Còn lại")} {remaining}
              </span>
            ) : (
              <span>{t("Còn lại")} {remaining}</span>
            )}
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{new Date(v.endSaleDate).toLocaleDateString("vi-VN")}</span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
