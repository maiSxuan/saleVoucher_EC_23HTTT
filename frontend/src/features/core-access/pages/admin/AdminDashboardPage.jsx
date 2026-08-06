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
        <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 mt-auto pt-2 border-t border-slate-100">
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
          <Calendar className="w-3.5 h-3.5 text-blue-400" />
          {data.fullLabel || data.label || data.date}
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-3">
            <span className="text-slate-400">Doanh thu:</span>
            <span className="font-bold text-emerald-400">{formatVndFull(data.revenue)}</span>
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

  const loadSummary = useCallback(async () => {
    setLoading(true);
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
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  // ── User hiện tại ──
  let adminName = 'Admin';
  try {
    const u = JSON.parse(localStorage.getItem('user') || '{}');
    adminName = u.ho_ten || u.name || 'Admin';
  } catch {
    /* empty */
  }

  // ── Thời gian cập nhật ──
  const updatedText = lastUpdated
    ? `Cập nhật lúc ${lastUpdated.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`
    : '';

  // ── 7 Chỉ số tổng quan ──
  const stats = [
    {
      key: 'totalUsers',
      icon: Users,
      label: 'Tổng người dùng',
      value: summary?.totalUsers ?? null,
      sub: 'Tất cả tài khoản trong hệ thống',
      color: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-100' },
      linkTo: '/admin/users',
    },
    {
      key: 'activePartners',
      icon: Building2,
      label: 'Đối tác đang hoạt động',
      value: summary?.activePartners ?? null,
      sub: 'Hồ sơ doanh nghiệp đang hoạt động',
      color: { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-100' },
      linkTo: '/admin/partners',
    },
    {
      key: 'pendingPartners',
      icon: Clock,
      label: 'Đối tác chờ duyệt',
      value: summary?.pendingPartners ?? null,
      sub: 'Hồ sơ đang chờ xét duyệt',
      color: { bg: 'bg-amber-50', icon: 'text-amber-600', border: 'border-amber-100' },
      linkTo: '/admin/partners',
      badge: summary?.pendingPartners > 0 ? 'Cần xử lý' : null,
      badgeColor: 'bg-amber-100 text-amber-700',
    },
    {
      key: 'activeVouchers',
      icon: Ticket,
      label: 'Voucher đang bán',
      value: summary?.activeVouchers ?? null,
      sub: 'Voucher đã duyệt, đang lưu hành',
      color: { bg: 'bg-violet-50', icon: 'text-violet-600', border: 'border-violet-100' },
      linkTo: '/admin/vouchers',
    },
    {
      key: 'pendingVouchers',
      icon: AlertCircle,
      label: 'Voucher chờ duyệt',
      value: summary?.pendingVouchers ?? null,
      sub: 'Yêu cầu phát hành chưa duyệt',
      color: { bg: 'bg-orange-50', icon: 'text-orange-600', border: 'border-orange-100' },
      linkTo: '/admin/vouchers',
      badge: summary?.pendingVouchers > 0 ? 'Cần duyệt' : null,
      badgeColor: 'bg-orange-100 text-orange-700',
    },
    {
      key: 'pendingOrders',
      icon: ShoppingBag,
      label: 'Đơn hàng chờ xử lí',
      value: summary?.pendingOrders ?? null,
      sub: 'Chờ hoàn tiền hoặc lỗi sinh mã',
      color: { bg: 'bg-rose-50', icon: 'text-rose-600', border: 'border-rose-100' },
      badge: summary?.pendingOrders > 0 ? 'Cần xử lý' : null,
      badgeColor: 'bg-rose-100 text-rose-700',
    },
    {
      key: 'totalRevenue',
      icon: DollarSign,
      label: 'Doanh thu tổng',
      value: summary?.totalRevenue != null ? formatVnd(summary.totalRevenue) : null,
      sub: 'Tổng thanh toán thành công',
      color: { bg: 'bg-teal-50', icon: 'text-teal-600', border: 'border-teal-100' },
    },
  ];

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
    return summary?.partnerDistribution?.items || [
      { status: 'Dang hoat dong', label: 'Đang hoạt động', count: 0, fill: '#10b981' },
      { status: 'Cho duyet', label: 'Chờ xét duyệt', count: 0, fill: '#f59e0b' },
      { status: 'Tam khoa', label: 'Tạm khóa', count: 0, fill: '#ef4444' },
      { status: 'Tu choi', label: 'Từ chối', count: 0, fill: '#64748b' },
    ];
  }, [summary]);

  const totalPartners = summary?.partnerDistribution?.total ?? 0;

  // ── Dữ liệu hàng đợi công việc cần xử lý ──
  const workQueue = summary?.workQueue || {
    totalPending: 0,
    pendingPartners: [],
    pendingBranches: [],
    pendingVouchers: [],
    refundOrders: [],
    failedGenOrders: [],
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* ── Header Banner ── */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/30">
              <ShieldCheck className="w-3.5 h-3.5" /> Hệ Thống Quản Trị Trung Tâm
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              Tổng quan hệ thống Voucher
            </h1>
            <p className="text-slate-300 text-sm mt-2">
              Xin chào, <span className="font-semibold text-white">{adminName}</span>. Đây là bảng điều khiển tổng hợp chỉ số vận hành và doanh thu.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-3">
            {updatedText && !loading && (
              <div className="text-[11px] text-slate-400 hidden md:block">{updatedText}</div>
            )}
            <button
              type="button"
              onClick={loadSummary}
              disabled={loading}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white/80 bg-white/10 hover:bg-white/20 transition-colors border border-white/10 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Làm mới
            </button>
            <div className="px-4 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 text-center hidden sm:block">
              <div className="text-[10px] text-slate-300">Trạng thái</div>
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1 justify-center mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Hoạt động
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {error && !loading && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-rose-800">Lỗi tải dữ liệu dashboard</p>
            <p className="text-xs text-rose-600 mt-0.5">{error}</p>
          </div>
          <button
            type="button"
            onClick={loadSummary}
            className="text-xs font-semibold text-rose-700 hover:text-rose-900 underline cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* ── 7 Chỉ số tổng quan ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4.5 h-4.5 text-blue-600" />
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
            {Array.from({ length: 7 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
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

      {/* ── KHU VỰC BIỂU ĐỒ: BIỂU ĐỒ ĐƯỜNG DOANH THU & BIỂU ĐỒ CỘT NẰM NGANG TRẠNG THÁI ĐỐI TÁC ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CỘT TRÁI (8/12): Biểu đồ đường tổng doanh thu */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header biểu đồ & Tab chọn Ngày / Tháng / Năm */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-teal-600" />
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
                      ? 'bg-white text-blue-600 shadow-xs'
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
                      ? 'bg-white text-blue-600 shadow-xs'
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
                      ? 'bg-white text-blue-600 shadow-xs'
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
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
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
                      stroke="#0284c7"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#0284c7', strokeWidth: 2, stroke: '#ffffff' }}
                      activeDot={{
                        r: 6,
                        fill: '#0284c7',
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
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
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
                        <Cell key={`cell-${index}`} fill={entry.fill || '#3b82f6'} />
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

      {/* ── KHỐI "CÔNG VIỆC CẦN XỬ LÍ" (QUEUE CẦN XỬ LÝ) ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        {/* Tiêu đề Queue */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
              <ListTodo className="w-4 h-4 text-indigo-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Công việc cần xử lí
            </h2>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
            {workQueue.totalPending} mục đang chờ
          </span>
        </div>

        <div className="space-y-6 divide-y divide-slate-100">
          {/* 1. Đối tác chờ duyệt */}
          <div className="pt-2 first:pt-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                Đối tác chờ duyệt
              </h3>
              <Link
                to="/admin/partners"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {workQueue.pendingPartners.length === 0 ? (
              <div className="text-xs text-slate-400 py-2 italic">Không có đối tác nào đang chờ duyệt.</div>
            ) : (
              <div className="space-y-2">
                {workQueue.pendingPartners.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 hover:bg-slate-50 border border-slate-100 transition-colors"
                  >
                    <Link
                      to={`/admin/partners/${item.id}`}
                      className="flex items-center gap-2.5 min-w-0 flex-1 hover:text-blue-600 transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                      <span className="text-xs font-semibold text-slate-800 hover:text-blue-600 truncate">{item.name}</span>
                    </Link>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDateDisplay(item.date)}
                      </span>
                      <Link
                        to={`/admin/partners/${item.id}`}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Yêu cầu thay đổi chi nhánh */}
          <div className="pt-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                Yêu cầu thay đổi chi nhánh
              </h3>
              <Link
                to="/admin/partners"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {workQueue.pendingBranches.length === 0 ? (
              <div className="text-xs text-slate-400 py-2 italic">Không có yêu cầu chi nhánh nào đang chờ duyệt.</div>
            ) : (
              <div className="space-y-2">
                {workQueue.pendingBranches.map((item) => {
                  const targetPartnerId = item.partnerId || item.id;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 hover:bg-slate-50 border border-slate-100 transition-colors"
                    >
                      <Link
                        to={`/admin/partners/${targetPartnerId}`}
                        className="flex items-center gap-2.5 min-w-0 flex-1 hover:text-blue-600 transition-colors"
                      >
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                        <span className="text-xs font-semibold text-slate-800 hover:text-blue-600 truncate">{item.name}</span>
                      </Link>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDateDisplay(item.date)}
                        </span>
                        <Link
                          to={`/admin/partners/${targetPartnerId}`}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Voucher chờ duyệt */}
          <div className="pt-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                Voucher chờ duyệt
              </h3>
              <Link
                to="/admin/vouchers"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {workQueue.pendingVouchers.length === 0 ? (
              <div className="text-xs text-slate-400 py-2 italic">Không có voucher nào đang chờ duyệt.</div>
            ) : (
              <div className="space-y-2">
                {workQueue.pendingVouchers.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 hover:bg-slate-50 border border-slate-100 transition-colors"
                  >
                    <Link
                      to={`/admin/vouchers/${item.id}`}
                      className="flex items-center gap-2.5 min-w-0 flex-1 hover:text-blue-600 transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      <span className="text-xs font-semibold text-slate-800 hover:text-blue-600 truncate">{item.name}</span>
                    </Link>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDateDisplay(item.date)}
                      </span>
                      <Link
                        to={`/admin/vouchers/${item.id}`}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. Đơn chờ hoàn tiền */}
          <div className="pt-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                Đơn chờ hoàn tiền
              </h3>
              <Link
                to="/admin/logs"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {workQueue.refundOrders.length === 0 ? (
              <div className="text-xs text-slate-400 py-2 italic">Không có đơn hàng nào chờ hoàn tiền.</div>
            ) : (
              <div className="space-y-2">
                {workQueue.refundOrders.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 hover:bg-slate-50 border border-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                      <span className="text-xs font-semibold text-slate-800 truncate">
                        {item.orderCode} - {item.customerName}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDateDisplay(item.date)}
                      </span>
                      <Link
                        to="/admin/logs"
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 5. Đơn lỗi sinh mã */}
          <div className="pt-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                Đơn lỗi sinh mã
              </h3>
              <Link
                to="/admin/logs"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {workQueue.failedGenOrders.length === 0 ? (
              <div className="text-xs text-slate-400 py-2 italic">Không có đơn hàng nào bị lỗi sinh mã.</div>
            ) : (
              <div className="space-y-2">
                {workQueue.failedGenOrders.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 hover:bg-slate-50 border border-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                      <span className="text-xs font-semibold text-slate-800 truncate">
                        {item.orderCode} - {item.customerName}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDateDisplay(item.date)}
                      </span>
                      <Link
                        to="/admin/logs"
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
