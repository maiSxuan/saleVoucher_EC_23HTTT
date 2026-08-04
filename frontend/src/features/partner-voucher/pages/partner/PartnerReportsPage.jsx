import React, { useState } from "react";
import PartnerLayout from "../../../../layouts/PartnerLayout";
import Card from "../../../../shared/components/Card";
import StatCard from "../../../../shared/components/StatCard";
import SimpleChart from "../../../../shared/components/SimpleChart";
import { mockStore } from "../../../../shared/store/mockDataStore";

export function PartnerReportsPage() {
  const activePartner = mockStore.getActivePartner();
  const vouchers = mockStore.getVouchersByPartner(activePartner?.ma_hs);

  const [dateFilter, setDateFilter] = useState("30"); // 7, 30, 90 days

  // Compute metrics based on mock vouchers
  const totalSold = vouchers.reduce((acc, v) => acc + (v.so_luong_da_ban || 0), 0);
  const totalRevenue = vouchers.reduce((acc, v) => acc + (v.so_luong_da_ban || 0) * (v.gia_ban || 0), 0);
  const totalUsed = Math.round(totalSold * 0.75); // 75% redemption rate simulation

  const revenueTrendData = [
    { label: "T1", value: 12500000 },
    { label: "T2", value: 18400000 },
    { label: "T3", value: 24000000 },
    { label: "T4", value: 31200000 },
    { label: "T5", value: 28900000 },
    { label: "T6", value: 45000000 },
    { label: "T7 (Hiện tại)", value: totalRevenue > 0 ? totalRevenue : 52000000 },
  ];

  const topVouchersData = vouchers.map((v) => ({
    label: v.ten_voucher,
    value: v.so_luong_da_ban || 10,
    displayValue: `${v.so_luong_da_ban || 10} lượt bán`,
  }));

  const branchPerformanceData = (activePartner?.branches || []).map((b, idx) => ({
    label: b.ten_chi_nhanh,
    value: (idx + 1) * 45,
    displayValue: `${(idx + 1) * 45} voucher sử dụng`,
  }));

  return (
    <PartnerLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Báo Cáo Doanh Thu & Hiệu Quả Voucher</h2>
            <p className="text-sm text-slate-500 mt-1">Tổng hợp số liệu doanh số bán, lượng voucher được sử dụng tại các chi nhánh</p>
          </div>

          <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-xs">
            <button
              onClick={() => setDateFilter("7")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                dateFilter === "7" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              7 ngày qua
            </button>
            <button
              onClick={() => setDateFilter("30")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                dateFilter === "30" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              30 ngày qua
            </button>
            <button
              onClick={() => setDateFilter("90")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                dateFilter === "90" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              90 ngày qua
            </button>
          </div>
        </div>

        {/* KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Tổng Doanh Thu Phân Phối"
            value={`${(totalRevenue > 0 ? totalRevenue : 85050000).toLocaleString()}đ`}
            change="+18.4%"
            changeType="increase"
            icon="💰"
            subtitle="So với kỳ trước"
          />
          <StatCard
            title="Tổng Đơn Đặt Hàng"
            value={totalSold > 0 ? totalSold : 142}
            change="+12.2%"
            changeType="increase"
            icon="📦"
            subtitle="Đơn bán thành công"
          />
          <StatCard
            title="Voucher Đã Sử Dụng"
            value={totalUsed > 0 ? totalUsed : 108}
            change="+8.5%"
            changeType="increase"
            icon="🎟️"
            subtitle="Đã quét mã QR tại chi nhánh"
          />
          <StatCard
            title="Tỷ Lệ Lượt Dùng (Redeem Rate)"
            value="76.1%"
            change="+2.4%"
            changeType="increase"
            icon="📈"
            subtitle="Tỷ lệ khách tới cửa hàng"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SimpleChart title="Xu Hướng Doanh Thu Theo Tháng (VNĐ)" data={revenueTrendData} type="line" />
          <SimpleChart title="Top Voucher Bán Chạy Nhất" data={topVouchersData.length ? topVouchersData : [{ label: "Voucher Buffet", value: 142 }]} type="bar" />
        </div>

        {/* Branch Performance */}
        <Card title="Hiệu Quả Tiếp Nhận Khách Hàng Theo Chi Nhánh">
          <SimpleChart data={branchPerformanceData.length ? branchPerformanceData : [{ label: "Chi nhánh Q1", value: 90 }]} type="bar" />
        </Card>
      </div>
    </PartnerLayout>
  );
}

export default PartnerReportsPage;
