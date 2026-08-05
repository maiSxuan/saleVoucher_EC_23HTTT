import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Ticket,
  Users,
  ScrollText,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  LayoutGrid,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const stats = [
    {
      title: 'Quản lý đối tác',
      desc: 'Hồ sơ doanh nghiệp, chi nhánh liên kết',
      icon: Building2,
      path: '/admin/partners',
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      btnText: 'Xem đối tác',
    },
    {
      title: 'Duyệt Voucher',
      desc: 'Yêu cầu phát hành, kiểm tra chính sách & chiết khấu',
      icon: Ticket,
      path: '/admin/vouchers',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      btnText: 'Duyệt ngay',
    },
    {
      title: 'Quản lý người dùng',
      desc: 'Phân quyền nhân viên, khóa/mở khóa tài khoản',
      icon: Users,
      path: '/admin/users',
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      btnText: 'Quản lý user',
    },
      {
        title: 'Nhật ký hệ thống',
        desc: 'Ghi nhận và đối soát toàn bộ thao tác hệ thống (BR-ADM-07)',
        icon: ScrollText,
        path: '/admin/audit-logs',
        color: 'bg-amber-50 text-amber-600 border-amber-200',
        btnText: 'Tra cứu logs',
      },
      {
        title: 'Quản lý nội dung',
        desc: 'Danh mục, Banner, Bài viết, Popup, Chính sách',
        icon: LayoutGrid,
        path: '/admin/contents',
        color: 'bg-orange-50 text-orange-600 border-orange-200',
        btnText: 'Quản lý ngay',
      },
    ];


  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Banner chào mừng */}
      <div className="bg-linear-to-r from-blue-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/30">
              <ShieldCheck size={14} /> Hệ Thống Quản Trị Trung Tâm (Admin Portal)
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
              Tổng quan điều hành hệ thống Voucher
            </h1>
            <p className="text-slate-300 text-sm mt-2 max-w-2xl">
              Chào mừng bạn đến với bảng điều khiển Admin Portal. Hãy lựa chọn các phân hệ bên dưới để quản lý đối tác, duyệt voucher, phân quyền người dùng và kiểm tra nhật ký hệ thống.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-3">
            <div className="px-4 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 text-center">
              <div className="text-xs text-slate-300">Trạng thái</div>
              <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 justify-center mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Đang hoạt động
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid 4 chức năng cốt lõi */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-blue-600" /> Phân hệ quản trị
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.path}
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 border ${item.color}`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-base">{item.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-5 pt-3 border-t border-gray-100">
                  <Link
                    to={item.path}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <span>{item.btnText}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
