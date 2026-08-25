/**
 * FILE: frontend/src/features/core-access/pages/admin/AdminDashboardPage.jsx
 * PURPOSE: Admin Dashboard tổng quan hệ thống, Biểu đồ doanh thu, Biểu đồ trạng thái đối tác & Queue công việc cần xử lý (BR_ADM_06).
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Building2,
  Clock,
  Ticket,
  AlertCircle,
  ShoppingBag,
  TrendingUp,
  RefreshCw,
  ShieldCheck,
  ArrowRight,
  DollarSign,
  Calendar,
  Layers,
  Activity,
  BarChart3,
  ListTodo,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { fetchDashboardSummary } from '../../../../shared/api/adminDashboardApi';
import { ADMIN_ROLES, getAdminRole } from '../../../../shared/constants/admin-roles';

const DASHBOARD_CONFIG = {
  [ADMIN_ROLES.SYSTEM]: {
    eyebrow: 'Hệ Thống Quản Trị Trung Tâm',
    title: 'Tổng quan hệ thống Voucher',
    description: 'Đây là bảng điều khiển tổng hợp chỉ số hệ thống và doanh thu.',
    statKeys: ['totalUsers', 'activePartners', 'activeVouchers', 'totalRevenue'],
    showSystemCharts: true,
    showPartnerQueue: false,
    showCustomerQueue: false,
  },
  [ADMIN_ROLES.MODERATION]: {
    eyebrow: 'Trung Tâm Kiểm Duyệt',
    title: 'Tổng quan kiểm duyệt',
    description: 'Đây là bảng điều khiển các hồ sơ đối tác và voucher đang chờ kiểm duyệt.',
    statKeys: ['pendingPartners', 'branchChangeRequests', 'profileChangeRequests', 'pendingVouchers'],
    showSystemCharts: false,
    showPartnerQueue: true,
    showCustomerQueue: false,
  },
  [ADMIN_ROLES.OPERATION]: {
    eyebrow: 'Trung Tâm Vận Hành',
    title: 'Tổng quan vận hành',
    description: 'Đây là bảng điều khiển các yêu cầu từ khách hàng và đơn hàng cần xử lý.',
    statKeys: ['pendingOrders', 'complaintOrders'],
    showSystemCharts: false,
    showPartnerQueue: false,
    showCustomerQueue: true,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper: định dạng số tiền VND
// ─────────────────────────────────────────────────────────────────────────────
function formatVnd(amount) {
  if (amount == null) return '—';
  if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(2)} tỷ ₫`;
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(2)} tr ₫`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}k ₫`;
  return `${amount.toLocaleString('vi-VN')} ₫`;
}

function formatVndFull(amount) {
  if (amount == null) return '0 ₫';
  return `${Number(amount).toLocaleString('vi-VN')} ₫`;
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return 'Vừa xong';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch {
    return dateStr;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton card khi loading
// ─────────────────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-slate-100" />
        <div className="w-16 h-4 rounded-md bg-slate-100" />
      </div>
      <div className="w-20 h-7 rounded-md bg-slate-100 mb-1.5" />
      <div className="w-32 h-3 rounded-md bg-slate-100" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// StatCard: mỗi ô chỉ số
// ─────────────────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color, linkTo, badge, badgeColor }) {
  const inner = (
    <div
      className={`bg-white rounded-2xl border shadow-xs p-5 flex flex-col gap-3 h-full transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
        color?.border || 'border-slate-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color?.bg || 'bg-slate-100'}`}>
          <Icon className={`w-5 h-5 ${color?.icon || 'text-slate-600'}`} />
        </div>
        {badge != null && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor || 'bg-slate-100 text-slate-600'}`}>
            {badge}
          </span>
        )}
      </div>
      <div>
        <div className={`text-2xl font-extrabold ${value == null ? 'text-slate-300' : 'text-slate-900'}`}>
          {value ?? '—'}
        </div>
        <div className="text-xs font-semibold text-slate-600 mt-0.5">{label}</div>
        {sub && <div className="text-[11px] text-slate-400 mt-0.5">{sub}</div>}
      </div>
      {linkTo && (
        <div className="flex items-center gap-1 text-xs font-semibold text-sky-700 mt-auto pt-2 border-t border-slate-100">
          <span>Xem chi tiết</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      )}
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="block h-full">
        {inner}
      </Link>
    );
  }
  return <div className="h-full">{inner}</div>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Custom Tooltip cho biểu đồ doanh thu
// ─────────────────────────────────────────────────────────────────────────────
function CustomChartTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-xl shadow-xl border border-slate-700/60 text-xs min-w-[170px]">
        <div className="font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-sky-400" />
          {data.fullLabel || data.label || data.date}
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-3">
            <span className="text-slate-400">Doanh thu:</span>
            <span className="font-bold text-brand-accent-soft">{formatVndFull(data.revenue)}</span>
          </div>
          {data.count != null && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-400">Số đơn/giao dịch:</span>
              <span className="font-semibold text-slate-200">{data.count} GD</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Custom Tooltip cho biểu đồ đối tác
// ─────────────────────────────────────────────────────────────────────────────
function CustomPartnerTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-xl shadow-xl border border-slate-700/60 text-xs min-w-[150px]">
        <div className="font-semibold text-slate-200 mb-1 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.fill }} />
          {data.label}
        </div>
        <div className="text-slate-400">
          Số lượng: <span className="font-bold text-white">{data.count} đối tác</span>
        </div>
      </div>
    );
  }
  return null;
}

function WorkQueueGroup({ title, items, total, emptyText, allLink, dotClass, getDetailLink }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className="text-sm font-bold text-slate-800">
          {title} <span className="ml-1 text-xs font-semibold text-slate-400">({total ?? items.length})</span>
        </h4>
        <Link to={allLink} className="flex items-center gap-1 text-xs font-semibold text-sky-700 hover:text-sky-800">
          Xem tất cả <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="py-2 text-xs italic text-slate-400">{emptyText}</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => {
            const detailLink = getDetailLink(item);
            return (
              <div key={item.id} className="flex flex-col gap-2 rounded-lg border border-slate-100 bg-slate-50/70 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${dotClass}`} />
                    <p className="truncate text-xs font-semibold text-slate-800">{item.name}</p>
                  </div>
                  {item.description && <p className="mt-1 line-clamp-2 pl-4 text-[11px] text-slate-500">{item.description}</p>}
                </div>
                <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="h-3 w-3" /> {formatDateDisplay(item.date)}
                  </span>
                  <Link to={detailLink} className="text-xs font-semibold text-sky-700 hover:text-sky-800 hover:underline">
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Chế độ xem biểu đồ doanh thu: 'day' | 'month' | 'year'
  const [timelineMode, setTimelineMode] = useState('day');

  const loadSummary = useCallback(async ({ showLoader = true } = {}) => {
    if (showLoader) setLoading(true);
    setError(null);
    try {
      const data = await fetchDashboardSummary();
      setSummary(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('[AdminDashboard] load error:', err);
      if (err.status === 401 || err.status === 403) {
        navigate('/login', { replace: true });
        return;
      }
      setError(err.message || 'Không thể tải dữ liệu dashboard');
    } finally {
      if (showLoader) setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadSummary();
    const refreshInterval = window.setInterval(() => loadSummary({ showLoader: false }), 60000);
    const refreshOnFocus = () => loadSummary({ showLoader: false });
    window.addEventListener('focus', refreshOnFocus);
    return () => {
      window.clearInterval(refreshInterval);
      window.removeEventListener('focus', refreshOnFocus);
    };
  }, [loadSummary]);

  // ── User và cấu hình dashboard theo role hiện tại ──
  let currentUser = {};
  try {
    currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    /* empty */
  }
  const adminName = currentUser.ho_ten || currentUser.name || 'Quản trị viên';
  const adminRole = getAdminRole(currentUser);
  const dashboardConfig = DASHBOARD_CONFIG[adminRole] || {
    eyebrow: 'Cổng Quản Trị',
    title: 'Tổng quan',
    description: 'Bảng điều khiển theo quyền quản trị được cấp.',
    statKeys: [],
    showSystemCharts: false,
    showPartnerQueue: false,
    showCustomerQueue: false,
  };

  // ── Thời gian cập nhật ──
  const updatedText = lastUpdated
    ? `Cập nhật lúc ${lastUpdated.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`
    : '';

  // ── Chỉ số tổng quan — giữ nguyên dữ liệu, chỉ lọc theo quyền sở hữu ──
  const stats = [
    {
      key: 'totalUsers',
      icon: Users,
      label: 'Tổng người dùng',
      value: summary?.totalUsers ?? null,
      sub: 'Tất cả tài khoản trong hệ thống',
       color: { bg: 'bg-sky-50', icon: 'text-sky-700', border: 'border-sky-200' },
      linkTo: '/admin/users',
    },
    {
      key: 'activePartners',
      icon: Building2,
      label: 'Đối tác đang hoạt động',
      value: summary?.activePartners ?? null,
      sub: 'Hồ sơ doanh nghiệp đang hoạt động',
      color: { bg: 'bg-semantic-success-soft', icon: 'text-semantic-success', border: 'border-semantic-success-border' },
    },
    {
      key: 'pendingPartners',
      icon: Clock,
      label: 'Đối tác chờ duyệt',
      value: summary?.pendingPartners ?? null,
      sub: 'Hồ sơ đang chờ xét duyệt',
      color: { bg: 'bg-semantic-warning-soft', icon: 'text-semantic-warning', border: 'border-semantic-warning-border' },
      linkTo: '/admin/partners',
      badge: summary?.pendingPartners > 0 ? 'Cần xử lý' : null,
      badgeColor: 'bg-semantic-warning-soft text-semantic-warning border border-semantic-warning-border',
    },
    {
      key: 'branchChangeRequests',
      icon: Building2,
      label: 'Yêu cầu thêm/thay đổi chi nhánh',
      value: summary?.workQueue?.partnerManagement?.counts?.branchChangeRequests ?? null,
      sub: 'Chi nhánh mới, cập nhật hoặc xóa đang chờ duyệt',
      color: { bg: 'bg-cyan-50', icon: 'text-cyan-700', border: 'border-cyan-200' },
      linkTo: '/admin/partners',
      badge: summary?.workQueue?.partnerManagement?.counts?.branchChangeRequests > 0 ? 'Cần xử lý' : null,
      badgeColor: 'bg-cyan-50 text-cyan-700 border border-cyan-200',
    },
    {
      key: 'profileChangeRequests',
      icon: Building2,
      label: 'Yêu cầu thay đổi hồ sơ doanh nghiệp',
      value: summary?.workQueue?.partnerManagement?.counts?.profileChangeRequests ?? null,
      sub: 'Yêu cầu cập nhật thông tin đang chờ duyệt',
      color: { bg: 'bg-sky-50', icon: 'text-sky-700', border: 'border-sky-200' },
      linkTo: '/admin/partners',
      badge: summary?.workQueue?.partnerManagement?.counts?.profileChangeRequests > 0 ? 'Cần xử lý' : null,
      badgeColor: 'bg-sky-50 text-sky-700 border border-sky-200',
    },
    {
      key: 'activeVouchers',
      icon: Ticket,
      label: 'Voucher đang bán',
      value: summary?.activeVouchers ?? null,
      sub: 'Voucher đã duyệt, đang lưu hành',
      color: { bg: 'bg-brand-accent-soft', icon: 'text-brand-accent-foreground', border: 'border-brand-accent-border' },
    },
    {
      key: 'pendingVouchers',
      icon: AlertCircle,
      label: 'Voucher chờ duyệt',
      value: summary?.pendingVouchers ?? null,
      sub: 'Yêu cầu phát hành chưa duyệt',
      color: { bg: 'bg-semantic-warning-soft', icon: 'text-semantic-warning', border: 'border-semantic-warning-border' },
      linkTo: '/admin/vouchers',
      badge: summary?.pendingVouchers > 0 ? 'Cần duyệt' : null,
      badgeColor: 'bg-semantic-warning-soft text-semantic-warning border border-semantic-warning-border',
    },
    {
      key: 'pendingOrders',
      icon: ShoppingBag,
      label: 'Đơn hàng chờ xử lí',
      value: summary?.pendingOrders ?? null,
      sub: 'Chờ hoàn tiền hoặc lỗi sinh mã',
      color: { bg: 'bg-semantic-error-soft', icon: 'text-semantic-error', border: 'border-semantic-error-border' },
      badge: summary?.pendingOrders > 0 ? 'Cần xử lý' : null,
      badgeColor: 'bg-semantic-error-soft text-semantic-error border border-semantic-error-border',
      linkTo: '/admin/orders',
    },
    {
      key: 'complaintOrders',
      icon: AlertCircle,
      label: 'Đơn hàng đang khiếu nại',
      value: summary?.complaintOrders ?? null,
      sub: 'Khách hàng yêu cầu hỗ trợ',
      color: { bg: 'bg-semantic-error-soft', icon: 'text-semantic-error', border: 'border-semantic-error-border' },
      badge: summary?.complaintOrders > 0 ? 'Cần xử lý' : null,
      badgeColor: 'bg-semantic-error-soft text-semantic-error border border-semantic-error-border',
      linkTo: '/admin/orders',
    },
    {
      key: 'totalRevenue',
      icon: DollarSign,
      label: 'Doanh thu tổng',
      value: summary?.totalRevenue != null ? formatVnd(summary.totalRevenue) : null,
      sub: 'Tổng thanh toán thành công',
      color: { bg: 'bg-sky-50', icon: 'text-sky-700', border: 'border-sky-200' },
    },
  ];
  const visibleStats = stats.filter((stat) => dashboardConfig.statKeys.includes(stat.key));

  // ── Dữ liệu biểu đồ doanh thu theo tab đã chọn ──
  const chartData = useMemo(() => {
    const tl = summary?.revenueTimeline;
    if (!tl) return [];
    if (timelineMode === 'day') return tl.daily || [];
    if (timelineMode === 'month') return tl.monthly || [];
    if (timelineMode === 'year') return tl.yearly || [];
    return [];
  }, [summary, timelineMode]);

  // ── Dữ liệu phân bố đối tác ──
  const partnerStatusData = useMemo(() => {
    const statusColors = {
      'Dang hoat dong': 'var(--brand-success)',
      'Cho duyet': 'var(--brand-warning)',
      'Tam khoa': 'var(--brand-error)',
      'Tu choi': 'var(--brand-text-muted)',
    };
    const items = summary?.partnerDistribution?.items || [
      { status: 'Dang hoat dong', label: 'Đang hoạt động', count: 0 },
      { status: 'Cho duyet', label: 'Chờ xét duyệt', count: 0 },
      { status: 'Tam khoa', label: 'Tạm khóa', count: 0 },
      { status: 'Tu choi', label: 'Từ chối', count: 0 },
    ];
    return items.map((item) => ({
      ...item,
      fill: statusColors[item.status] || 'var(--brand-text-muted)',
    }));
  }, [summary]);

  const totalPartners = summary?.partnerDistribution?.total ?? 0;

  // ── Dữ liệu hàng đợi công việc cần xử lý ──
  const workQueue = summary?.workQueue || {
    totalPending: 0,
    partnerManagement: {
      counts: { pendingPartners: 0, branchChangeRequests: 0, profileChangeRequests: 0, pendingVouchers: 0 },
      pendingPartners: [],
      branchChangeRequests: [],
      profileChangeRequests: [],
      pendingVouchers: [],
    },
    customerRequests: {
      counts: { cancelRequests: 0, complaints: 0, refundOrders: 0, failedGenOrders: 0 },
      cancelRequests: [],
      complaints: [],
      refundOrders: [],
      failedGenOrders: [],
    },
  };
  const partnerWork = workQueue.partnerManagement || {};
  const customerWork = workQueue.customerRequests || {};

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* ── Header Banner ── */}
      <div className="bg-gradient-to-r from-sky-50 via-white to-snow-100 text-snow-900 rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold mb-3 border border-sky-200">
              <ShieldCheck className="w-3.5 h-3.5" /> {dashboardConfig.eyebrow}
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              {dashboardConfig.title}
            </h1>
            <p className="text-snow-600 text-sm mt-2">
              Xin chào, <span className="font-semibold text-snow-900">{adminName}</span>. {dashboardConfig.description}
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-3">
            {updatedText && !loading && (
              <div className="text-[11px] text-snow-500 hidden md:block">{updatedText}</div>
            )}
            <button
              type="button"
              onClick={() => loadSummary()}
              disabled={loading}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-sky-700 bg-white hover:bg-sky-50 transition-colors border border-slate-200 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Làm mới
            </button>
            <div className="px-4 py-3 bg-white rounded-xl border border-slate-200 text-center hidden sm:block">
              <div className="text-[10px] text-snow-500">Trạng thái</div>
              <div className="text-xs font-bold text-semantic-success flex items-center gap-1 justify-center mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-semantic-success animate-pulse" /> Hoạt động
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {error && !loading && (
        <div className="bg-semantic-error-soft border border-semantic-error-border rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-semantic-error shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-semantic-error">Lỗi tải dữ liệu dashboard</p>
            <p className="text-xs text-semantic-error mt-0.5">{error}</p>
          </div>
          <button
            type="button"
            onClick={loadSummary}
            className="text-xs font-semibold text-semantic-error hover:brightness-90 underline cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* ── Chỉ số tổng quan theo role ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4.5 h-4.5 text-sky-700" />
            Chỉ số tổng quan
          </h2>
          {!loading && summary?.generatedAt && (
            <span className="text-[11px] text-slate-400">
              Dữ liệu tại {new Date(summary.generatedAt).toLocaleTimeString('vi-VN')}
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: visibleStats.length }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {visibleStats.map((s) => (
              <StatCard
                key={s.key}
                icon={s.icon}
                label={s.label}
                value={s.value}
                sub={s.sub}
                color={s.color}
                linkTo={s.linkTo}
                badge={s.badge}
                badgeColor={s.badgeColor}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Biểu đồ hệ thống: chỉ Admin hệ thống sở hữu ── */}
      {dashboardConfig.showSystemCharts && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CỘT TRÁI (8/12): Biểu đồ đường tổng doanh thu */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header biểu đồ & Tab chọn Ngày / Tháng / Năm */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-accent-soft border border-brand-accent-border flex items-center justify-center">
                    <Activity className="w-4 h-4 text-brand-accent-foreground" />
                  </div>
                  <h2 className="text-base font-bold text-slate-900">
                    Biểu đồ tổng doanh thu
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Biến động doanh thu thanh toán thành công theo thời gian
                </p>
              </div>

              {/* Tab Switcher: Ngày / Tháng / Năm */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0 border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setTimelineMode('day')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    timelineMode === 'day'
                      ? 'bg-white text-sky-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Theo ngày
                </button>
                <button
                  type="button"
                  onClick={() => setTimelineMode('month')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    timelineMode === 'month'
                      ? 'bg-white text-sky-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Theo tháng
                </button>
                <button
                  type="button"
                  onClick={() => setTimelineMode('year')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    timelineMode === 'year'
                      ? 'bg-white text-sky-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Theo năm
                </button>
              </div>
            </div>

            {/* Khung vẽ biểu đồ Recharts */}
            <div className="h-72 w-full pt-1">
              {loading ? (
                <div className="h-full flex items-center justify-center bg-slate-50 rounded-xl border border-slate-100 animate-pulse">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Đang tải dữ liệu biểu đồ...
                  </div>
                </div>
              ) : chartData.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center bg-slate-50 rounded-xl border border-slate-100 text-center p-6">
                  <Layers className="w-8 h-8 text-slate-300 mb-2" />
                  <p className="text-sm font-semibold text-slate-600">Chưa có dữ liệu doanh thu</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Không tìm thấy giao dịch thanh toán thành công trong mốc thời gian này.
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--brand-primary)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--brand-primary)" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

                    <XAxis
                      dataKey="label"
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#e2e8f0' }}
                      dy={4}
                    />

                    <YAxis
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => {
                        if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(1)}B`;
                        if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
                        if (val >= 1_000) return `${(val / 1_000).toFixed(0)}k`;
                        return val;
                      }}
                      dx={-2}
                    />

                    <Tooltip content={<CustomChartTooltip />} />

                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="none"
                      fill="url(#revenueGradient)"
                    />

                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="var(--brand-primary)"
                      strokeWidth={3}
                      dot={{ r: 4, fill: 'var(--brand-primary)', strokeWidth: 2, stroke: '#ffffff' }}
                      activeDot={{
                        r: 6,
                        fill: 'var(--brand-primary)',
                        strokeWidth: 3,
                        stroke: '#bae6fd',
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI (4/12): Biểu đồ cột nằm ngang cho trạng thái đối tác */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-sky-700" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Trạng thái đối tác</h2>
                  <p className="text-xs text-slate-500">Phân bổ hồ sơ doanh nghiệp</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                {totalPartners} đối tác
              </span>
            </div>

            {/* Khung vẽ biểu đồ cột ngang Recharts */}
            <div className="h-44 w-full mt-3">
              {loading ? (
                <div className="h-full flex items-center justify-center animate-pulse">
                  <div className="text-xs text-slate-400">Đang tải dữ liệu...</div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={partnerStatusData}
                    margin={{ top: 5, right: 25, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis
                      type="category"
                      dataKey="label"
                      stroke="#475569"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      width={90}
                    />
                    <Tooltip content={<CustomPartnerTooltip />} />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                      {partnerStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill || 'var(--brand-primary)'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Chi tiết từng trạng thái & % */}
            <div className="mt-3 space-y-2 pt-3 border-t border-slate-100">
              {partnerStatusData.map((item) => {
                const percent = totalPartners > 0 ? Math.round((item.count / totalPartners) * 100) : 0;
                return (
                  <div key={item.status} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.fill }} />
                      <span className="text-slate-600">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{item.count}</span>
                      <span className="text-[11px] text-slate-400">({percent}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      )}

      {/* ── Queue nghiệp vụ được chuyển nguyên vẹn về role sở hữu ── */}
      {(dashboardConfig.showPartnerQueue || dashboardConfig.showCustomerQueue) && (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        {/* Tiêu đề Queue */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center">
              <ListTodo className="w-4 h-4 text-sky-700" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Công việc cần xử lí
            </h2>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
            {workQueue.totalPending} mục đang chờ
          </span>
        </div>

        <div className="grid gap-5">
          {dashboardConfig.showPartnerQueue && (
          <section className="rounded-2xl border border-sky-200 bg-sky-50/50 p-4">
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-800">
                <Building2 className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Quản lý đối tác</h3>
                <p className="mt-0.5 text-xs text-slate-500">Hồ sơ, chi nhánh và voucher cần quản trị viên xét duyệt.</p>
              </div>
            </div>
            <div className="space-y-3">
              <WorkQueueGroup
                title="Đối tác chờ duyệt"
                items={partnerWork.pendingPartners || []}
                total={partnerWork.counts?.pendingPartners}
                emptyText="Không có đối tác chờ duyệt."
                allLink="/admin/partners"
                dotClass="bg-sky-600"
                getDetailLink={(item) => `/admin/partners/${item.partnerId || item.id}`}
              />
              <WorkQueueGroup
                title="Yêu cầu thêm/thay đổi chi nhánh"
                items={partnerWork.branchChangeRequests || []}
                total={partnerWork.counts?.branchChangeRequests}
                emptyText="Không có yêu cầu thêm hoặc thay đổi chi nhánh."
                allLink="/admin/partners"
                dotClass="bg-cyan-500"
                getDetailLink={(item) => `/admin/partners/${item.partnerId}`}
              />
              <WorkQueueGroup
                title="Yêu cầu thay đổi hồ sơ doanh nghiệp"
                items={partnerWork.profileChangeRequests || []}
                total={partnerWork.counts?.profileChangeRequests}
                emptyText="Không có yêu cầu thay đổi hồ sơ."
                allLink="/admin/partners"
                dotClass="bg-sky-700"
                getDetailLink={(item) => `/admin/partners/${item.partnerId}`}
              />
              <WorkQueueGroup
                title="Voucher chờ duyệt"
                items={partnerWork.pendingVouchers || []}
                total={partnerWork.counts?.pendingVouchers}
                emptyText="Không có voucher chờ duyệt."
                allLink="/admin/vouchers"
                dotClass="bg-semantic-warning"
                getDetailLink={(item) => `/admin/vouchers/${item.id}`}
              />
            </div>
          </section>
          )}

          {dashboardConfig.showCustomerQueue && (
          <section className="rounded-2xl border border-semantic-error-border bg-semantic-error-soft/50 p-4">
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-semantic-error-soft text-semantic-error">
                <ShoppingBag className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Yêu cầu từ khách hàng</h3>
                <p className="mt-0.5 text-xs text-slate-500">Đơn hàng, hủy đơn, khiếu nại và sự cố cần xử lý.</p>
              </div>
            </div>
            <div className="space-y-3">
              <WorkQueueGroup
                title="Yêu cầu hủy đơn"
                items={customerWork.cancelRequests || []}
                total={customerWork.counts?.cancelRequests}
                emptyText="Không có yêu cầu hủy đơn chờ xử lý."
                allLink="/admin/orders"
                dotClass="bg-semantic-error"
                getDetailLink={(item) => `/admin/orders?orderId=${encodeURIComponent(item.orderId)}&tab=refund`}
              />
              <WorkQueueGroup
                title="Khiếu nại chờ xử lý"
                items={customerWork.complaints || []}
                total={customerWork.counts?.complaints}
                emptyText="Không có khiếu nại chờ xử lý."
                allLink="/admin/orders"
                dotClass="bg-semantic-error"
                getDetailLink={(item) => `/admin/orders?orderId=${encodeURIComponent(item.orderId)}&tab=complaints`}
              />
              <WorkQueueGroup
                title="Đơn chờ hoàn tiền"
                items={customerWork.refundOrders || []}
                total={customerWork.counts?.refundOrders}
                emptyText="Không có đơn chờ hoàn tiền."
                allLink="/admin/orders"
                dotClass="bg-semantic-warning"
                getDetailLink={(item) => `/admin/orders?orderId=${encodeURIComponent(item.orderId)}&tab=refund`}
              />
              <WorkQueueGroup
                title="Đơn lỗi sinh mã"
                items={customerWork.failedGenOrders || []}
                total={customerWork.counts?.failedGenOrders}
                emptyText="Không có đơn lỗi sinh mã."
                allLink="/admin/orders"
                dotClass="bg-semantic-error"
                getDetailLink={(item) => `/admin/orders?orderId=${encodeURIComponent(item.orderId)}&tab=codes`}
              />
            </div>
          </section>
          )}
        </div>
      </div>
      )}
    </div>
  );
}
