import { useState } from "react";
import { BarChart2, TrendingUp, Tag, ShoppingCart, RotateCcw, AlertCircle, Info } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer, Cell } from "recharts";
import { mockPartnerVouchers, mockReportData } from "../data/partnerMockData";

type EmptyReason = 'none' | 'no_vouchers' | 'no_transactions' | 'error';

export default function PartnerReports() {
  const [selectedVoucherId, setSelectedVoucherId] = useState<string>('all');
  const [startDate, setStartDate] = useState('2026-07-01');
  const [endDate, setEndDate] = useState('2026-07-16');
  const [emptyReason, setEmptyReason] = useState<EmptyReason>('none');
  const [loading, setLoading] = useState(false);

  const approvedVouchers = mockPartnerVouchers.filter(v => v.reviewStatus === 'approved');

  const simulateFilter = (reason: EmptyReason) => {
    setLoading(true);
    setTimeout(() => {
      setEmptyReason(reason);
      setLoading(false);
    }, 700);
  };

  // Calculate KPIs
  const filteredData = selectedVoucherId === 'all'
    ? mockReportData
    : mockReportData.filter(d => d.voucherId === selectedVoucherId);

  const totalRevenue = filteredData.reduce((s, d) => s + d.revenue, 0);
  const totalIssued = filteredData.reduce((s, d) => s + d.issued, 0);
  const totalSold = filteredData.reduce((s, d) => s + d.sold, 0);
  const totalUsed = filteredData.reduce((s, d) => s + d.used, 0);
  const usageRate = totalSold > 0 ? Math.round((totalUsed / totalSold) * 100) : 0;

  // Revenue trend mock data
  const revenueTrend = [
    { day: '01/07', revenue: 4500000 },
    { day: '04/07', revenue: 6200000 },
    { day: '07/07', revenue: 5800000 },
    { day: '10/07', revenue: 8100000 },
    { day: '13/07', revenue: 7300000 },
    { day: '16/07', revenue: 4250000 },
  ];

  const kpis = [
    { label: 'Tổng doanh thu', value: `${(totalRevenue / 1000000).toFixed(1)}M₫`, icon: <TrendingUp size={20} />, color: 'emerald' },
    { label: 'Tổng voucher phát hành', value: totalIssued.toLocaleString(), icon: <Tag size={20} />, color: 'blue' },
    { label: 'Tổng voucher đã bán', value: totalSold.toLocaleString(), icon: <ShoppingCart size={20} />, color: 'purple' },
    { label: 'Tỷ lệ sử dụng', value: `${usageRate}%`, icon: <BarChart2 size={20} />, color: 'amber' },
  ];

  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-600',
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    amber: 'bg-amber-50 border-amber-200 text-amber-600',
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Báo cáo Đối tác</h1>
        <p className="text-sm text-gray-500 mt-1">Hiệu quả kinh doanh voucher của Sushi World Vietnam — chỉ đọc</p>
      </div>

      {/* Demo simulation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs font-semibold text-blue-700 mb-2">Demo — Mô phỏng trạng thái báo cáo:</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setEmptyReason('none')} className={`text-xs px-2 py-1 rounded border ${emptyReason === 'none' ? 'bg-blue-600 text-white border-blue-600' : 'border-blue-300 text-blue-600 hover:bg-blue-100'}`}>Có dữ liệu</button>
          <button onClick={() => simulateFilter('no_vouchers')} className={`text-xs px-2 py-1 rounded border ${emptyReason === 'no_vouchers' ? 'bg-blue-600 text-white border-blue-600' : 'border-blue-300 text-blue-600 hover:bg-blue-100'}`}>Chưa có voucher duyệt</button>
          <button onClick={() => simulateFilter('no_transactions')} className={`text-xs px-2 py-1 rounded border ${emptyReason === 'no_transactions' ? 'bg-blue-600 text-white border-blue-600' : 'border-blue-300 text-blue-600 hover:bg-blue-100'}`}>Không có giao dịch</button>
          <button onClick={() => simulateFilter('error')} className={`text-xs px-2 py-1 rounded border ${emptyReason === 'error' ? 'bg-blue-600 text-white border-blue-600' : 'border-blue-300 text-blue-600 hover:bg-blue-100'}`}>Lỗi tải dữ liệu</button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Chương trình voucher <span className="text-red-500">*</span></label>
            <select value={selectedVoucherId} onChange={e => setSelectedVoucherId(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="all">Tất cả chương trình</option>
              {approvedVouchers.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Từ ngày <span className="text-red-500">*</span></label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Đến ngày <span className="text-red-500">*</span></label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700">Cập nhật báo cáo</button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Khoảng thời gian: <strong>{startDate}</strong> đến <strong>{endDate}</strong>
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 flex items-center justify-center text-gray-400 gap-3">
          <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Đang tải dữ liệu báo cáo...</span>
        </div>
      )}

      {/* Empty — no vouchers */}
      {!loading && emptyReason === 'no_vouchers' && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 flex flex-col items-center text-center">
          <Tag size={40} className="text-gray-300 mb-3" />
          <h3 className="font-semibold text-gray-700 mb-1">Chưa có dữ liệu báo cáo</h3>
          <p className="text-sm text-gray-500 mb-4">Doanh nghiệp chưa có chương trình voucher được Admin phê duyệt.</p>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700">Tạo voucher mới</button>
        </div>
      )}

      {/* Empty — no transactions */}
      {!loading && emptyReason === 'no_transactions' && (
        <div>
          {/* Still show 4 KPIs but all zero */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {kpis.map(k => (
              <div key={k.label} className={`p-4 rounded-xl border ${colorMap[k.color]}`}>
                <span className="mb-2 block opacity-70">{k.icon}</span>
                <p className="text-2xl font-bold">{k.color === 'emerald' ? '0₫' : k.color === 'amber' ? '0%' : '0'}</p>
                <p className="text-xs opacity-80 mt-0.5">{k.label}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col items-center text-center">
            <Info size={32} className="text-gray-300 mb-3" />
            <h3 className="font-semibold text-gray-700 mb-1">Không có giao dịch trong kỳ này</h3>
            <p className="text-sm text-gray-500 mb-4">Thay đổi bộ lọc để xem dữ liệu của kỳ khác.</p>
            <button onClick={() => { setStartDate('2026-06-01'); setEndDate('2026-07-16'); }} className="text-sm text-emerald-600 hover:underline">Mở rộng khoảng thời gian</button>
          </div>
        </div>
      )}

      {/* Error state */}
      {!loading && emptyReason === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 flex flex-col items-center text-center">
          <AlertCircle size={32} className="text-red-400 mb-3" />
          <h3 className="font-semibold text-red-700 mb-1">Không thể tải dữ liệu báo cáo</h3>
          <p className="text-sm text-red-600 mb-4">Lỗi kết nối máy chủ. Vui lòng thử lại.</p>
          <button onClick={() => simulateFilter('none')} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700">
            <RotateCcw size={14} /> Thử lại
          </button>
        </div>
      )}

      {/* Main report data */}
      {!loading && emptyReason === 'none' && (
        <>
          {/* 4 Required KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {kpis.map(k => (
              <div key={k.label} className={`p-4 rounded-xl border ${colorMap[k.color]}`}>
                <span className="mb-2 block opacity-70">{k.icon}</span>
                <p className="text-2xl font-bold">{k.value}</p>
                <p className="text-xs opacity-80 mt-0.5">{k.label}</p>
              </div>
            ))}
          </div>

          {/* Revenue chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm">Doanh thu mô phỏng theo ngày</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={v => `${(v / 1000000).toFixed(1)}M`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [`${v.toLocaleString()}đ`, 'Doanh thu']} />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-xs text-amber-600 text-center mt-2">Dữ liệu doanh thu là mô phỏng — không phản ánh giao dịch thật</p>
          </div>

          {/* Breakdown table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 text-sm">Bảng chi tiết theo chương trình</h3>
              <p className="text-xs text-gray-400">Từ {startDate} đến {endDate}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {['Chương trình voucher', 'Phát hành', 'Đã bán', 'Đã sử dụng', 'Doanh thu', 'Tỷ lệ sử dụng'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">Không có dữ liệu</td>
                    </tr>
                  ) : filteredData.map(d => (
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
                  ))}
                  {filteredData.length > 0 && (
                    <tr className="bg-gray-50 font-semibold">
                      <td className="px-4 py-3 text-sm text-gray-900">Tổng</td>
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

          {/* Bar chart breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm">So sánh Phát hành / Đã bán / Đã sử dụng</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={filteredData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="voucherName" type="category" tick={{ fontSize: 10 }} width={140} />
                <Tooltip />
                <Bar dataKey="issued" fill="#e2e8f0" name="Phát hành" />
                <Bar dataKey="sold" fill="#6366f1" name="Đã bán" />
                <Bar dataKey="used" fill="#10b981" name="Đã sử dụng" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
