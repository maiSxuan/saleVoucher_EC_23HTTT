import { Tag, Search, BarChart2, AlertCircle, Clock, CheckCircle, TrendingUp, Store, ArrowRight, Users2, FileText, ShoppingBag } from "lucide-react";
import { mockPartnerVouchers, mockPartnerBranches } from "../data/partnerMockData";
import type { PartnerPage } from "./PartnerLayout";

interface PartnerDashboardProps {
  onNavigate: (page: PartnerPage) => void;
  mode: 'owner' | 'staff';
}

export default function PartnerDashboard({ onNavigate, mode }: PartnerDashboardProps) {
  const vouchers = mockPartnerVouchers;
  const draft = vouchers.filter(v => v.reviewStatus === 'draft').length;
  const pending = vouchers.filter(v => v.reviewStatus === 'pending').length;
  const selling = vouchers.filter(v => v.publicationStatus === 'selling').length;
  const rejected = vouchers.filter(v => v.reviewStatus === 'rejected').length;
  const suspended = vouchers.filter(v => v.publicationStatus === 'suspended').length;
  const totalSold = vouchers.reduce((s, v) => s + v.soldCount, 0);
  const totalUsed = vouchers.reduce((s, v) => s + v.usedCount, 0);
  const revenue = vouchers.filter(v => v.reviewStatus === 'approved').reduce((s, v) => s + v.soldCount * v.salePrice, 0);
  const usageRate = totalSold > 0 ? Math.round((totalUsed / totalSold) * 100) : 0;
  const branchPending = mockPartnerBranches.filter(b => b.pendingRequest).length;

  const kpis = [
    { label: 'Voucher Nháp', value: draft, icon: <FileText size={20} />, color: 'gray', page: 'vouchers' as PartnerPage },
    { label: 'Chờ duyệt', value: pending, icon: <Clock size={20} />, color: 'amber', page: 'vouchers' as PartnerPage },
    { label: 'Đang bán', value: selling, icon: <Tag size={20} />, color: 'green', page: 'vouchers' as PartnerPage },
    { label: 'Bị từ chối', value: rejected, icon: <AlertCircle size={20} />, color: 'red', page: 'vouchers' as PartnerPage },
    { label: 'Tạm ngưng', value: suspended, icon: <ShoppingBag size={20} />, color: 'orange', page: 'vouchers' as PartnerPage },
    { label: 'Yêu cầu chi nhánh', value: branchPending, icon: <Store size={20} />, color: 'blue', page: 'branches' as PartnerPage },
    { label: 'Voucher đã bán', value: totalSold, icon: <TrendingUp size={20} />, color: 'green', page: 'reports' as PartnerPage },
    { label: 'Đã sử dụng', value: totalUsed, icon: <CheckCircle size={20} />, color: 'emerald', page: 'reports' as PartnerPage },
  ];

  const colorMap: Record<string, string> = {
    gray: 'bg-gray-50 border-gray-200 text-gray-600',
    amber: 'bg-amber-50 border-amber-200 text-amber-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    red: 'bg-red-50 border-red-200 text-red-600',
    orange: 'bg-orange-50 border-orange-200 text-orange-600',
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-600',
  };

  const alerts = [
    rejected > 0 && { icon: <AlertCircle size={14} className="text-red-500 flex-shrink-0" />, text: `${rejected} voucher bị từ chối — cần chỉnh sửa và gửi lại`, action: () => onNavigate('vouchers'), urgency: 'high' },
    pending > 0 && { icon: <Clock size={14} className="text-amber-500 flex-shrink-0" />, text: `${pending} voucher đang chờ Admin xét duyệt`, action: () => onNavigate('vouchers'), urgency: 'medium' },
    branchPending > 0 && { icon: <Store size={14} className="text-blue-500 flex-shrink-0" />, text: `${branchPending} yêu cầu chi nhánh đang chờ duyệt`, action: () => onNavigate('branches'), urgency: 'medium' },
    vouchers.find(v => v.publicationStatus === 'selling' && v.quantity - v.soldCount < 20) && { icon: <AlertCircle size={14} className="text-orange-500 flex-shrink-0" />, text: 'Một số voucher sắp hết số lượng', action: () => onNavigate('vouchers'), urgency: 'medium' },
  ].filter(Boolean) as { icon: React.ReactNode; text: string; action: () => void; urgency: string }[];

  const quickActions = [
    { icon: <Tag size={18} />, label: 'Tạo Voucher Mới', action: () => onNavigate('voucher-create'), color: 'emerald' },
    { icon: <Search size={18} />, label: 'Tra cứu Voucher Code', action: () => onNavigate('code-lookup'), color: 'blue' },
    { icon: <BarChart2 size={18} />, label: 'Xem Báo cáo', action: () => onNavigate('reports'), color: 'purple' },
    { icon: <Store size={18} />, label: 'Yêu cầu Chi nhánh', action: () => onNavigate('branches'), color: 'orange' },
  ];

  const recentVouchers = vouchers.slice(0, 4);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
          <p className="text-sm text-gray-500 mt-1">Sushi World Vietnam — Cập nhật: 16/07/2026 09:30</p>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, i) => (
            <button key={i} onClick={alert.action} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-colors hover:opacity-80 ${alert.urgency === 'high' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
              {alert.icon}
              <span className="text-sm text-gray-700 flex-1">{alert.text}</span>
              <ArrowRight size={14} className="text-gray-400" />
            </button>
          ))}
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map(kpi => (
          <button key={kpi.label} onClick={() => onNavigate(kpi.page)} className={`flex flex-col items-start p-4 rounded-xl border cursor-pointer hover:shadow-sm transition-all text-left ${colorMap[kpi.color]}`}>
            <span className="mb-2 opacity-80">{kpi.icon}</span>
            <span className="text-2xl font-bold">{kpi.value.toLocaleString()}</span>
            <span className="text-xs font-medium mt-0.5 opacity-80">{kpi.label}</span>
          </button>
        ))}
      </div>

      {/* Revenue summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 font-medium uppercase mb-1">Doanh thu mô phỏng</p>
          <p className="text-2xl font-bold text-emerald-600">{(revenue / 1000000).toFixed(1)}M₫</p>
          <p className="text-xs text-gray-400 mt-1">Tổng từ đơn đã thanh toán</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 font-medium uppercase mb-1">Tỷ lệ sử dụng</p>
          <p className="text-2xl font-bold text-blue-600">{usageRate}%</p>
          <p className="text-xs text-gray-400 mt-1">Code đã dùng / Tổng đã bán</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 font-medium uppercase mb-1">Chi nhánh hoạt động</p>
          <p className="text-2xl font-bold text-gray-800">{mockPartnerBranches.filter(b => b.status === 'active').length}/{mockPartnerBranches.length}</p>
          <p className="text-xs text-gray-400 mt-1">Đang vận hành</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm">Thao tác nhanh</h3>
          <div className="space-y-2">
            {quickActions.map(qa => (
              <button key={qa.label} onClick={qa.action} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm font-medium text-gray-700 text-left transition-colors">
                <span className={`text-${qa.color}-600`}>{qa.icon}</span>
                {qa.label}
                <ArrowRight size={14} className="ml-auto text-gray-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Recent vouchers */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 text-sm">Voucher gần đây</h3>
            <button onClick={() => onNavigate('vouchers')} className="text-xs text-emerald-600 hover:underline">Xem tất cả</button>
          </div>
          <div className="space-y-2">
            {recentVouchers.map(v => {
              const statusColors: Record<string, string> = {
                draft: 'text-gray-500 bg-gray-100',
                pending: 'text-amber-700 bg-amber-100',
                approved: 'text-blue-700 bg-blue-100',
                rejected: 'text-red-700 bg-red-100',
                selling: 'text-green-700 bg-green-100',
                suspended: 'text-orange-700 bg-orange-100',
                stopped: 'text-red-700 bg-red-100',
                expired: 'text-gray-500 bg-gray-100',
                sold_out: 'text-gray-700 bg-gray-200',
                scheduled: 'text-purple-700 bg-purple-100',
              };
              const statusLabel: Record<string, string> = {
                draft: 'Nháp', pending: 'Chờ duyệt', approved: 'Đã duyệt', rejected: 'Từ chối',
                selling: 'Đang bán', suspended: 'Tạm ngưng', stopped: 'Ngừng bán',
                expired: 'Hết hạn', sold_out: 'Hết SL', scheduled: 'Chờ hiển thị', unpublished: 'Chưa công bố',
              };
              const combinedStatus = v.reviewStatus === 'approved' ? v.publicationStatus : v.reviewStatus;
              return (
                <div key={v.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{v.name}</p>
                    <p className="text-xs text-gray-400">{v.soldCount}/{v.quantity} đã bán · {v.salePrice.toLocaleString()}đ</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ml-2 flex-shrink-0 ${statusColors[combinedStatus] || 'text-gray-500 bg-gray-100'}`}>
                    {statusLabel[combinedStatus] || combinedStatus}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {mode === 'staff' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
          <Users2 size={18} className="text-blue-600 flex-shrink-0" />
          <p className="text-sm text-blue-700">Bạn đang đăng nhập với vai trò <strong>Nhân viên chi nhánh</strong>. Sử dụng chức năng Tra cứu Voucher Code để xác nhận sử dụng tại quầy.</p>
        </div>
      )}
    </div>
  );
}
