import React, { useState, useEffect } from "react";
import PartnerLayout from "../../../../layouts/PartnerLayout";
import { BarChart2, TrendingUp, Tag, ShoppingCart, RotateCcw, AlertCircle, Info } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer } from "recharts";
import { getPartnerReportApi, getVouchersByPartnerApi } from "../../../../shared/api/partnerApi";
import { useTranslation } from "react-i18next";

export function PartnerReportsPage() {
  const { t } = useTranslation();
  const formatDateYYYYMMDD = (d) => d.toISOString().slice(0, 10);

  const today = new Date();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);

  const [startDate, setStartDate] = useState(formatDateYYYYMMDD(thirtyDaysAgo));
  const [endDate, setEndDate] = useState(formatDateYYYYMMDD(today));
  const [selectedVoucherId, setSelectedVoucherId] = useState("all");

  const [vouchersList, setVouchersList] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [timelineMode, setTimelineMode] = useState("day");

  const activeChartData = React.useMemo(() => {
    if (!reportData) return [];
    if (timelineMode === "month") {
      return reportData.revenueTimeline?.monthly || [];
    }
    if (timelineMode === "year") {
      return reportData.revenueTimeline?.yearly || [];
    }
    return reportData.revenueTimeline?.daily || reportData.revenueTrend || [];
  }, [reportData, timelineMode]);

  const formatYAxisTick = (val) => {
    if (val == null || val === 0) return "0";
    if (val >= 1_000_000) {
      const v = (val / 1_000_000).toFixed(1).replace(".0", "");
      return `${v}M`;
    }
    if (val >= 1_000) {
      const v = (val / 1_000).toFixed(0);
      return `${v}k`;
    }
    return String(val);
  };

  const getLoggedInPartnerId = () => {
    try {
      const storedUser = localStorage.getItem("user") || localStorage.getItem("ec_auth_user");
      if (storedUser) {
        const u = JSON.parse(storedUser);
        return u.ma_hsdn || u.ma_hs || u.id || u.ma_nguoi_dung;
      }
    } catch (e) {}
    return null;
  };

  const fetchReport = async () => {
    setLoading(true);
    setHasError(false);
    try {
      const partnerId = getLoggedInPartnerId();
      const res = await getPartnerReportApi({
        partnerId,
        voucherId: selectedVoucherId,
        startDate,
        endDate,
      });

      if (res) {
        setReportData(res);
        if (res.vouchers) setVouchersList(res.vouchers);
      } else {
        setHasError(true);
      }
    } catch (e) {
      console.error("[PartnerReportsPage] fetch error:", e);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function init() {
      const partnerId = getLoggedInPartnerId();
      const vList = await getVouchersByPartnerApi(partnerId);
      if (vList) setVouchersList(vList);
      await fetchReport();
    }
    init();
  }, []);

  const handleUpdateReport = (e) => {
    if (e) e.preventDefault();
    fetchReport();
  };

  const totalRevenue = reportData?.totalRevenue || 0;
  const totalIssued = reportData?.totalIssued || 0;
  const totalSold = reportData?.totalSold || 0;
  const totalUsed = reportData?.totalUsed || 0;
  const usageRate = reportData?.usageRate || 0;
  const filteredData = reportData?.filteredData || [];
  const emptyReason = hasError ? "error" : reportData?.emptyReason || "none";

  const kpis = [
    { label: t("Tổng doanh thu"), value: `${(totalRevenue / 1000000).toFixed(1)}M₫`, icon: <TrendingUp size={20} />, color: "emerald" },
    { label: t("Tổng voucher phát hành"), value: totalIssued.toLocaleString(), icon: <Tag size={20} />, color: "blue" },
    { label: t("Tổng voucher đã bán"), value: totalSold.toLocaleString(), icon: <ShoppingCart size={20} />, color: "purple" },
    { label: t("Tỷ lệ sử dụng"), value: `${usageRate}%`, icon: <BarChart2 size={20} />, color: "amber" },
  ];

  const colorMap = {
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-600",
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    purple: "bg-purple-50 border-purple-200 text-purple-600",
    amber: "bg-amber-50 border-amber-200 text-amber-600",
  };

  return (
    <PartnerLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("Báo cáo Đối tác")}</h1>
          <p className="text-sm text-gray-500 mt-1">{t("Hiệu quả kinh doanh và phát hành voucher của doanh nghiệp")}</p>
        </div>

        {/* Filters Bar */}
        <form onSubmit={handleUpdateReport} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                {t("Chương trình voucher")} <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedVoucherId}
                onChange={(e) => setSelectedVoucherId(e.target.value)}
                className="w-full h-11 border border-gray-200 rounded-xl px-3.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
              >
                <option value="all">{t("Tất cả chương trình")}</option>
                {vouchersList.map((v) => (
                  <option key={v.ma_voucher} value={v.ma_voucher}>
                    {v.ten_voucher}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                {t("Từ ngày")} <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-11 border border-gray-200 rounded-xl px-3.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                {t("Đến ngày")} <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full h-11 border border-gray-200 rounded-xl px-3.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              {t("Khoảng thời gian:")} <strong className="text-gray-600">{startDate}</strong> {t("đến")}{" "}
              <strong className="text-gray-600">{endDate}</strong>
            </p>
            <button
              type="submit"
              className="h-10 px-5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              {t("Cập nhật báo cáo")}
            </button>
          </div>
        </form>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 flex items-center justify-center text-gray-400 gap-3">
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">{t("Đang tải dữ liệu báo cáo...")}</span>
          </div>
        )}

        {/* Empty — No Vouchers */}
        {!loading && emptyReason === "no_vouchers" && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 flex flex-col items-center text-center">
            <Tag size={40} className="text-gray-300 mb-3" />
            <h3 className="font-semibold text-gray-700 mb-1">{t("Chưa có dữ liệu báo cáo")}</h3>
            <p className="text-sm text-gray-500 mb-4">{t("Doanh nghiệp chưa có chương trình voucher được phê duyệt.")}</p>
          </div>
        )}

        {/* Empty — No Transactions */}
        {!loading && emptyReason === "no_transactions" && (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {kpis.map((k) => (
                <div key={k.label} className={`p-4 rounded-xl border ${colorMap[k.color]}`}>
                  <span className="mb-2 block opacity-70">{k.icon}</span>
                  <p className="text-2xl font-bold">{k.color === "emerald" ? "0₫" : k.color === "amber" ? "0%" : "0"}</p>
                  <p className="text-xs opacity-80 mt-0.5">{k.label}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col items-center text-center">
              <Info size={32} className="text-gray-300 mb-3" />
              <h3 className="font-semibold text-gray-700 mb-1">{t("Không có giao dịch trong kỳ này")}</h3>
              <p className="text-sm text-gray-500 mb-4">{t("Thay đổi khoảng thời gian bộ lọc và bấm \"Cập nhật báo cáo\".")}</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && emptyReason === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 flex flex-col items-center text-center">
            <AlertCircle size={32} className="text-red-400 mb-3" />
            <h3 className="font-semibold text-red-700 mb-1">{t("Không thể tải dữ liệu báo cáo")}</h3>
            <p className="text-sm text-red-600 mb-4">{t("Lỗi kết nối máy chủ. Vui lòng thử lại.")}</p>
            <button
              onClick={fetchReport}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 cursor-pointer"
            >
              <RotateCcw size={14} /> {t("Thử lại")}
            </button>
          </div>
        )}

        {/* Main Report Content */}
        {!loading && emptyReason === "none" && (
          <>
            {/* 4 KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {kpis.map((k) => (
                <div key={k.label} className={`p-4 rounded-xl border ${colorMap[k.color]}`}>
                  <span className="mb-2 block opacity-70">{k.icon}</span>
                  <p className="text-2xl font-bold">{k.value}</p>
                  <p className="text-xs opacity-80 mt-0.5">{k.label}</p>
                </div>
              ))}
            </div>

            {/* Revenue Area Chart matching requested design */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
              {/* Header & Subtitle & Mode Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">{t("Biểu đồ doanh thu")}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {t("Biến động doanh thu thanh toán thành công theo thời gian")}
                  </p>
                </div>

                {/* Tab Switcher: Theo ngày | Theo tháng | Theo năm */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0 border border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => setTimelineMode("day")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      timelineMode === "day"
                        ? "bg-white text-blue-600 shadow-xs font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {t("Theo ngày")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimelineMode("month")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      timelineMode === "month"
                        ? "bg-white text-blue-600 shadow-xs font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {t("Theo tháng")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimelineMode("year")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      timelineMode === "year"
                        ? "bg-white text-blue-600 shadow-xs font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {t("Theo năm")}
                  </button>
                </div>
              </div>

              {/* Recharts Container */}
              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activeChartData} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="partnerRevGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0284c7" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      axisLine={{ stroke: "#e2e8f0" }}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={formatYAxisTick}
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-xl shadow-xl border border-slate-700/60 text-xs min-w-[160px]">
                              <div className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                                📅 {data.fullLabel || data.day}
                              </div>
                              <div className="flex items-center justify-between gap-3 pt-1 border-t border-slate-800">
                                <span className="text-slate-400">{t("Doanh thu:")}</span>
                                <span className="font-bold text-emerald-400">
                                  {Number(data.revenue).toLocaleString("vi-VN")} ₫
                                </span>
                              </div>
                              {data.count != null && (
                                <div className="flex items-center justify-between gap-3 text-[11px] text-slate-400 mt-0.5">
                                  <span>{t("Số giao dịch:")}</span>
                                  <span className="font-semibold text-slate-200">{data.count} {t("đơn")}</span>
                                </div>
                              )}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#0284c7"
                      strokeWidth={2.5}
                      fill="url(#partnerRevGrad)"
                      dot={{ r: 3.5, fill: "#0284c7", stroke: "#0284c7", strokeWidth: 1 }}
                      activeDot={{ r: 6, fill: "#0284c7", stroke: "#ffffff", strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Breakdown Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 text-sm">{t("Bảng chi tiết theo chương trình")}</h3>
                <p className="text-xs text-gray-400">
                  {t("Từ")} {startDate} {t("đến")} {endDate}
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      {[t("Chương trình voucher"), t("Phát hành"), t("Đã bán"), t("Đã sử dụng"), t("Doanh thu"), t("Tỷ lệ sử dụng")].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">
                          {t("Không có dữ liệu")}
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((d) => (
                        <tr key={d.voucherId} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{d.voucherName}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{d.issued.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{d.sold.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{d.used.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm font-medium text-emerald-700">{(d.revenue / 1000000).toFixed(1)}M₫</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-100 rounded-full h-1.5 max-w-16">
                                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${d.usageRate}%` }} />
                              </div>
                              <span className="text-sm font-medium text-gray-700">{d.usageRate}%</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                    {filteredData.length > 0 && (
                      <tr className="bg-gray-50 font-semibold">
                        <td className="px-4 py-3 text-sm text-gray-900">{t("Tổng")}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{totalIssued.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{totalSold.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{totalUsed.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-emerald-700">{(totalRevenue / 1000000).toFixed(1)}M₫</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{usageRate}%</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Vertical Bar Chart Comparison */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4 text-sm">{t("So sánh Phát hành / Đã bán / Đã sử dụng")}</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={filteredData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="voucherName" type="category" tick={{ fontSize: 10 }} width={140} />
                  <Tooltip />
                  <Bar dataKey="issued" fill="#e2e8f0" name={t("Phát hành")} />
                  <Bar dataKey="sold" fill="#6366f1" name={t("Đã bán")} />
                  <Bar dataKey="used" fill="#10b981" name={t("Đã sử dụng")} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </PartnerLayout>
  );
}

export default PartnerReportsPage;