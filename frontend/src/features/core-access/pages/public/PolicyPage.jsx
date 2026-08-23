import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ChevronRight,
  FileText,
  Home,
  LogIn,
  ShieldCheck,
  User,
} from "lucide-react";
import { ADMIN_PORTAL_ROLES } from "../../../../shared/constants/admin-roles";
import { contentApi } from "../../../content-feedback/api/contentApi";

function getAccountAction() {
  const token = localStorage.getItem("accessToken") || localStorage.getItem("ec_auth_token");
  if (!token) return { to: "/login", label: "Đăng nhập", Icon: LogIn };

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || localStorage.getItem("ec_auth_user") || "null");
  } catch {
    user = null;
  }

  const role = user?.role || localStorage.getItem("role") || "";
  const to = ADMIN_PORTAL_ROLES.includes(role)
    ? "/admin"
    : role.includes("PARTNER") || role.includes("DOI_TAC")
      ? "/partner"
      : "/customer";

  return { to, label: "Tài khoản", Icon: User };
}

export default function PolicyPage() {
  const { t } = useTranslation();
  const { id } = useParams();

  const [policies, setPolicies] = useState([]);
  const [currentPolicy, setCurrentPolicy] = useState(null);
  const [loading, setLoading] = useState(true);

  const accountAction = getAccountAction();

  useEffect(() => {
    setLoading(true);
    contentApi.list("chinh_sach")
      .then((data) => {
        const rawList = Array.isArray(data) ? data : (data.data || []);
        const visibleList = rawList.filter(p => p.status === 'visible' || p.trang_thai === 'Dang hien thi');
        setPolicies(visibleList);
        if (id) {
          const found = visibleList.find((p) => String(p.id) === String(id));
          if (found) {
            setCurrentPolicy(found);
          } else {
            contentApi.getById(id)
              .then((res) => {
                const item = res.data || res;
                if (item && (item.status === 'visible' || item.trang_thai === 'Dang hien thi')) {
                  setCurrentPolicy(item);
                } else {
                  setCurrentPolicy(null);
                }
              })
              .catch(() => setCurrentPolicy(null));
          }
        } else {
          setCurrentPolicy(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Failed to fetch policies:", err);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2" aria-label="Snow Voucher - về trang chủ">
              <img src="/snowflake.png" alt="" aria-hidden="true" className="h-7 w-7 object-contain" />
              <span className="text-base font-black tracking-tight text-slate-900 sm:text-lg">Snow Voucher</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 sm:text-sm">
              {t("Điều khoản & Chính sách")}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
              <Home size={14} aria-hidden="true" /> <span className="hidden sm:inline">{t("Trang chủ")}</span>
            </Link>
            <Link to={accountAction.to} className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-sky-700 shadow-xs">
              <accountAction.Icon size={14} aria-hidden="true" /> {t(accountAction.label)}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 p-6 text-white shadow-xl sm:p-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold text-cyan-300 backdrop-blur-sm">
              <ShieldCheck size={14} aria-hidden="true" />
              <span>{t("Hệ thống pháp lý & Quy chế sàn giao dịch e-voucher")}</span>
            </div>
            <h1 className="mt-4 text-2xl font-black tracking-tight sm:text-4xl">
              {currentPolicy ? currentPolicy.title : t("Điều khoản & Chính sách Sàn")}
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
              {currentPolicy
                ? t("Chi tiết điều khoản và quy định chính thức được áp dụng.")
                : t("Minh bạch quyền lợi, trách nhiệm và quy trình giải quyết giao dịch cho Khách hàng và Đối tác.")}
            </p>
          </div>
        </div>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Sidebar / Mục lục động từ database */}
          <aside className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="px-3 pb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">
              {t("Mục lục chính sách")}
            </p>
            <nav aria-label={t("Mục lục chính sách")} className="space-y-1">
              <Link
                to="/policy"
                className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                  !id ? "bg-sky-50 text-sky-800 font-bold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <FileText size={16} className="text-sky-600" />
                <span className="flex-1">{t("Tổng quan chính sách sàn")}</span>
              </Link>
              {policies.map((p, index) => (
                <Link
                  key={p.id}
                  to={`/policy/${p.id}`}
                  className={`group flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                    String(id) === String(p.id)
                      ? "bg-sky-50 text-sky-800 font-bold"
                      : "text-slate-600 hover:bg-cyan-50 hover:text-cyan-800"
                  }`}
                >
                  <span className="text-xs font-black text-cyan-600">{String(index + 1).padStart(2, "0")}</span>
                  <span className="flex-1 truncate">{p.title}</span>
                  <ChevronRight size={14} className="opacity-0 transition-opacity group-hover:opacity-100 shrink-0" aria-hidden="true" />
                </Link>
              ))}
            </nav>
            <Link to="/" className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2.5 text-xs font-bold text-white hover:bg-slate-800">
              <Home size={14} aria-hidden="true" /> {t("Về trang chủ")}
            </Link>
          </aside>

          {/* Policy Detail or Dynamic List */}
          <div className="min-w-0 space-y-6">
            {loading ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500">
                Đang tải nội dung chính sách...
              </div>
            ) : currentPolicy ? (
              <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10 space-y-6">
                <div className="border-b pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Chính sách chính thức</span>
                  <h2 className="text-2xl font-black text-slate-900 mt-1">{currentPolicy.title}</h2>
                  {currentPolicy.updatedAt && (
                    <p className="text-xs text-slate-400 mt-1">Cập nhật lần cuối: {new Date(currentPolicy.updatedAt).toLocaleDateString('vi-VN')}</p>
                  )}
                </div>

                {currentPolicy.imageUrl || currentPolicy.hinh_anh_url ? (
                  <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-96">
                    <img src={currentPolicy.imageUrl || currentPolicy.hinh_anh_url} alt={currentPolicy.title} className="w-full h-full object-cover" />
                  </div>
                ) : null}

                <div 
                  className="prose prose-slate max-w-none text-slate-700 leading-7 space-y-4"
                  dangerouslySetInnerHTML={{ __html: currentPolicy.content || currentPolicy.noi_dung || "<p>Chưa có nội dung chi tiết.</p>" }}
                />

                <div className="pt-6 border-t flex justify-between items-center">
                  <Link to="/policy" className="inline-flex items-center gap-2 text-xs font-bold text-sky-700 hover:underline">
                    <ArrowLeft size={14} /> Quay lại danh mục chính sách
                  </Link>
                  <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900">
                    <Home size={14} /> Về trang chủ
                  </Link>
                </div>
              </article>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 space-y-6">
                <div className="border-b pb-4">
                  <h2 className="text-xl font-black text-slate-900">Danh mục Điều khoản & Chính sách Sàn</h2>
                  <p className="text-sm text-slate-500 mt-1">Vui lòng chọn một chính sách bên dưới hoặc từ thanh mục lục để xem chi tiết.</p>
                </div>

                {policies.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {policies.map((p, idx) => (
                      <Link 
                        key={p.id} 
                        to={`/policy/${p.id}`}
                        className="flex items-start gap-3.5 p-5 rounded-2xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50/20 transition-all group shadow-xs"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700 font-extrabold text-sm">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 truncate">{p.title}</h4>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                            {(p.content || p.noi_dung || "").replace(/<[^>]*>/g, "")}
                          </p>
                        </div>
                        <ChevronRight size={16} className="text-slate-400 group-hover:text-sky-600 mt-1 shrink-0" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-400 text-sm">
                    Chưa có chính sách nào được cấu hình trong hệ thống.
                  </div>
                )}
              </div>
            )}

            <div className="rounded-3xl bg-gradient-to-r from-cyan-700 to-blue-700 p-6 text-white shadow-lg sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-black">{t("Cần hỗ trợ về giao dịch?")}</h2>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-cyan-50">
                    {t("Hãy đăng nhập để theo dõi đơn hàng, gửi yêu cầu hủy hoặc khiếu nại kèm thông tin giao dịch chính xác.")}
                  </p>
                </div>
                <Link to={accountAction.to} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-cyan-800 shadow-sm hover:bg-cyan-50">
                  <accountAction.Icon size={16} aria-hidden="true" /> {t(accountAction.label)}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
