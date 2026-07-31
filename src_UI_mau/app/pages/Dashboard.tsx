import { Users, Building2, Tag, ShoppingCart, TrendingUp, AlertCircle, Clock, CheckCircle, ArrowRight, RefreshCw } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import type { Page } from "../components/layout/AdminLayout";
import { mockUsers, mockPartners, mockVouchers, mockOrders, mockLogs } from "../data/mockData";

interface DashboardProps {
  onNavigate: (page: Page, filters?: Record<string, unknown>) => void;
}

const revenueData = [
  { date: '10/7', revenue: 1200000, orders: 8 },
  { date: '11/7', revenue: 890000, orders: 6 },
  { date: '12/7', revenue: 1650000, orders: 11 },
  { date: '13/7', revenue: 740000, orders: 5 },
  { date: '14/7', revenue: 2100000, orders: 14 },
  { date: '15/7', revenue: 980000, orders: 7 },
];

const partnerStatusData = [
  { id: 'approved', name: 'Đã duyệt', value: 2, color: '#16a34a' },
  { id: 'pending', name: 'Chờ duyệt', value: 1, color: '#d97706' },
  { id: 'rejected', name: 'Bị từ chối', value: 1, color: '#dc2626' },
  { id: 'locked', name: 'Tạm khóa', value: 1, color: '#6b7280' },
];

export default function Dashboard({ onNavigate }: DashboardProps) {
  const lockedUsers = mockUsers.filter(u => u.status === 'locked').length;
  const pendingPartners = mockPartners.filter(p => p.profileStatus === 'pending').length;
  const pendingBranchRequests = mockPartners.reduce((acc, p) => acc + p.branchRequests.filter(r => r.status === 'pending').length, 0);
  const pendingVouchers = mockVouchers.filter(v => v.reviewStatus === 'pending').length;
  const pendingRefundOrders = mockOrders.filter(o => o.orderStatus === 'pending_refund').length;
  const codeErrorOrders = mockOrders.filter(o => o.voucherCodeStatus === 'generation_error').length;
  const totalRevenue = mockOrders.filter(o => o.paymentStatus === 'success').reduce((acc, o) => acc + o.total, 0);
  const totalSold = mockVouchers.reduce((acc, v) => acc + v.soldCount, 0);

  const kpiCards = [
    { label: 'Tổng người dùng', value: mockUsers.length, icon: Users, color: 'blue', page: 'users' as Page },
    { label: 'Tài khoản Tạm khóa', value: lockedUsers, icon: AlertCircle, color: 'red', page: 'users' as Page, filter: { status: 'locked' } },
    { label: 'Đối tác chờ duyệt', value: pendingPartners, icon: Building2, color: 'amber', page: 'partners' as Page, filter: { profileStatus: 'pending' } },
    { label: 'Yêu cầu chi nhánh', value: pendingBranchRequests, icon: Building2, color: 'orange', page: 'partners' as Page },
    { label: 'Voucher chờ duyệt', value: pendingVouchers, icon: Tag, color: 'amber', page: 'vouchers' as Page },
    { label: 'Tổng đơn hàng', value: mockOrders.length, icon: ShoppingCart, color: 'blue', page: 'orders' as Page },
    { label: 'Đơn chờ hoàn tiền', value: pendingRefundOrders, icon: RefreshCw, color: 'red', page: 'orders' as Page, filter: { orderStatus: 'pending_refund' } },
    { label: 'Lỗi sinh mã', value: codeErrorOrders, icon: AlertCircle, color: 'red', page: 'orders' as Page, filter: { voucherCodeStatus: 'generation_error' } },
    { label: 'Doanh thu mô phỏng', value: totalRevenue.toLocaleString('vi-VN') + 'đ', icon: TrendingUp, color: 'green' },
    { label: 'Voucher đã bán', value: totalSold, icon: Tag, color: 'green' },
  ];

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    amber: 'bg-amber-50 text-amber-600',
    orange: 'bg-orange-50 text-orange-600',
    green: 'bg-green-50 text-green-600',
  };
  const valuColorMap: Record<string, string> = {
    blue: 'text-blue-700',
    red: 'text-red-700',
    amber: 'text-amber-700',
    orange: 'text-orange-700',
    green: 'text-green-700',
  };

  const pendingQueue = [
    pendingPartners > 0 && {
      type: 'Đối tác chờ duyệt',
      items: mockPartners.filter(p => p.profileStatus === 'pending').map(p => ({ id: p.id, label: p.businessName, time: p.createdAt, urgency: 'high' })),
      page: 'partners' as Page,
    },
    pendingBranchRequests > 0 && {
      type: 'Yêu cầu thay đổi chi nhánh',
      items: mockPartners.flatMap(p => p.branchRequests.filter(r => r.status === 'pending').map(r => ({ id: r.id, label: `${p.businessName} - ${r.type === 'add' ? 'Thêm' : r.type === 'edit' ? 'Sửa' : 'Xóa'} chi nhánh`, time: r.requestedAt, urgency: 'medium' }))),
      page: 'partners' as Page,
    },
    pendingVouchers > 0 && {
      type: 'Voucher chờ duyệt',
      items: mockVouchers.filter(v => v.reviewStatus === 'pending').map(v => ({ id: v.id, label: v.name, time: v.submittedAt, urgency: 'medium' })),
      page: 'vouchers' as Page,
    },
    pendingRefundOrders > 0 && {
      type: 'Đơn chờ hoàn tiền',
      items: mockOrders.filter(o => o.orderStatus === 'pending_refund').map(o => ({ id: o.id, label: `${o.id} - ${o.customerName}`, time: o.createdAt, urgency: 'high' })),
      page: 'orders' as Page,
      filter: { orderStatus: 'pending_refund' },
    },
    codeErrorOrders > 0 && {
      type: 'Đơn lỗi sinh mã',
      items: mockOrders.filter(o => o.voucherCodeStatus === 'generation_error').map(o => ({ id: o.id, label: `${o.id} - ${o.customerName}`, time: o.createdAt, urgency: 'high' })),
      page: 'orders' as Page,
    },
  ].filter(Boolean) as Array<{ type: string; items: Array<{ id: string; label: string; time: string; urgency: string }>; page: Page; filter?: Record<string, unknown> }>;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tổng quan hệ thống</h1>
        <p className="text-sm text-gray-500 mt-1">Cập nhật lúc: 15/07/2025 07:30 — Dữ liệu mô phỏng</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpiCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <button
              key={i}
              onClick={() => card.page && onNavigate(card.page, card.filter)}
              className={`bg-white rounded-xl p-4 border border-gray-200 text-left hover:shadow-md transition-shadow ${card.page ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${colorMap[card.color]}`}>
                <Icon size={18} />
              </div>
              <div className={`text-xl font-bold ${valuColorMap[card.color]}`}>{card.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{card.label}</div>
            </button>
          );
        })}
      </div>

      {/* Charts + Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Doanh thu mô phỏng 7 ngày qua</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} allowDuplicatedCategory={false} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `${(v / 1000000).toFixed(1)}M`} tickCount={5} />
              <Tooltip formatter={(v: number) => `${v.toLocaleString('vi-VN')}đ`} />
              <Area key="revenue-area" type="monotone" dataKey="revenue" stroke="#2563eb" fill="#dbeafe" strokeWidth={2} name="Doanh thu" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Partner status */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Trạng thái đối tác</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={partnerStatusData} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} allowDuplicatedCategory={false} />
              <Tooltip />
              <Bar key="partner-status-bar" dataKey="value" radius={[0, 4, 4, 0]} name="Số đối tác" isAnimationActive={false}>
                {partnerStatusData.map(entry => (
                  <Cell key={entry.id} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pending Queue */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Queue cần xử lý</h3>
          <span className="text-sm text-gray-500">{pendingQueue.reduce((a, b) => a + b.items.length, 0)} mục đang chờ</span>
        </div>

        {pendingQueue.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-gray-400">
            <CheckCircle size={40} className="mb-2 text-green-400" />
            <p className="text-sm">Không có mục nào cần xử lý</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingQueue.map((group, gi) => (
              <div key={gi}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{group.type}</span>
                  <button
                    onClick={() => onNavigate(group.page, group.filter)}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    Xem tất cả <ArrowRight size={12} />
                  </button>
                </div>
                <div className="space-y-1">
                  {group.items.map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.urgency === 'high' ? 'bg-red-500' : 'bg-amber-500'}`} />
                        <span className="text-sm text-gray-800 truncate">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        <span className="text-xs text-gray-400 whitespace-nowrap flex items-center gap-1">
                          <Clock size={11} /> {item.time}
                        </span>
                        <button
                          onClick={() => onNavigate(group.page, group.filter)}
                          className="text-xs text-blue-600 hover:text-blue-800 whitespace-nowrap"
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent logs */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Nhật ký gần nhất</h3>
          <button onClick={() => onNavigate('logs')} className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
            Xem tất cả <ArrowRight size={14} />
          </button>
        </div>
        <div className="space-y-2">
          {mockLogs.slice(0, 5).map(log => (
            <div key={log.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${log.result === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
              <div className="flex-1 min-w-0">
                <span className="text-sm text-gray-800">{log.action} — </span>
                <span className="text-sm text-gray-600">{log.target}</span>
                {log.reason && <span className="text-xs text-gray-400 ml-2">({log.reason.slice(0, 40)}...)</span>}
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">{log.timestamp.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
