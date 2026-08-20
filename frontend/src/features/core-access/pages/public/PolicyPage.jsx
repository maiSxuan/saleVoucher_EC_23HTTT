import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  FileText,
  Home,
  Info,
  LogIn,
  MessageSquare,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  User,
} from "lucide-react";
import {
  cancellationPolicy,
  complaintPolicy,
  customerPolicy,
  decisionRows,
  partnerPolicy,
  policyNavigation,
  principles,
  refundPolicy,
} from "./policyContent";
import { ADMIN_PORTAL_ROLES } from "../../../../shared/constants/admin-roles";

const sectionThemes = {
  cyan: {
    icon: "bg-sky-50 text-sky-700 ring-sky-100",
    eyebrow: "text-sky-700",
    border: "border-sky-100",
  },
  blue: {
    icon: "bg-sky-50 text-sky-700 ring-sky-100",
    eyebrow: "text-sky-700",
    border: "border-sky-100",
  },
  amber: {
    icon: "bg-amber-50 text-amber-700 ring-amber-100",
    eyebrow: "text-amber-700",
    border: "border-amber-100",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    eyebrow: "text-emerald-700",
    border: "border-emerald-100",
  },
  violet: {
    icon: "bg-violet-50 text-violet-700 ring-violet-100",
    eyebrow: "text-violet-700",
    border: "border-violet-100",
  },
};

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

function BulletList({ items = [], nested = false }) {
  if (!items.length) return null;

  return (
    <ul className={`${nested ? "mt-2 pl-4" : "mt-4"} space-y-2.5`}>
      {items.map((item, index) => {
        const entry = typeof item === "string" ? { text: item } : item;
        return (
          <li key={`${entry.text}-${index}`} className="flex items-start gap-2.5 text-sm leading-6 text-slate-600">
            <CheckCircle2 className={`${nested ? "mt-1.5 h-3.5 w-3.5" : "mt-1 h-4 w-4"} shrink-0 text-sky-600`} />
            <div>
              <span>{entry.text}</span>
              {entry.children ? <BulletList items={entry.children} nested /> : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function CaseCards({ cases = [] }) {
  if (!cases.length) return null;

  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      {cases.map((item) => (
        <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
          {item.text ? <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p> : null}
          {item.intro ? <p className="mt-2 text-sm font-semibold text-slate-700">{item.intro}</p> : null}
          {item.items ? <BulletList items={item.items} /> : null}
        </div>
      ))}
    </div>
  );
}

function PolicyBlock({ block }) {
  const warning = block.tone === "warning";

  return (
    <article className={`rounded-2xl border p-5 sm:p-6 ${warning ? "border-amber-200 bg-amber-50/60" : "border-slate-200 bg-white"}`}>
      <h3 className="text-base font-extrabold text-slate-900 sm:text-lg">{block.title}</h3>
      {block.paragraphs?.map((paragraph) => (
        <p key={paragraph} className="mt-3 text-sm leading-6 text-slate-600">
          {paragraph}
        </p>
      ))}
      {block.intro ? <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">{block.intro}</p> : null}
      {block.items ? <BulletList items={block.items} /> : null}
      {block.cases ? <CaseCards cases={block.cases} /> : null}
      {block.note ? (
        <div className={`mt-4 flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm leading-6 ${warning ? "bg-white/80 text-amber-900" : "bg-sky-50 text-sky-900"}`}>
          <Info className="mt-1 h-4 w-4 shrink-0" />
          <p>{block.note}</p>
        </div>
      ) : null}
    </article>
  );
}

function PolicySection({ id, eyebrow, title, summary, icon: Icon, theme = "cyan", children }) {
  const colors = sectionThemes[theme];

  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`scroll-mt-28 rounded-3xl border bg-white p-5 shadow-sm sm:p-8 ${colors.border}`}>
      <div className="flex items-start gap-4 border-b border-slate-100 pb-5">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-4 ${colors.icon}`}>
          <Icon size={22} aria-hidden="true" />
        </div>
        <div>
          <p className={`text-xs font-extrabold uppercase tracking-[0.18em] ${colors.eyebrow}`}>{eyebrow}</p>
          <h2 id={`${id}-title`} className="mt-1 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
            {title}
          </h2>
          {summary ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{summary}</p> : null}
        </div>
      </div>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

export default function PolicyPage() {
  const accountAction = getAccountAction();
  const AccountIcon = accountAction.Icon;

  return (
    <div className="min-h-screen bg-snow-50 font-sans text-slate-800">
      <div className="bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 px-4 py-2 text-center text-xs font-semibold text-white">
        <span className="inline-flex items-center gap-2">
          <Sparkles size={14} className="text-sky-100" aria-hidden="true" />
          Văn bản chính thức áp dụng thống nhất trên Snow Voucher
        </span>
      </div>

      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-2.5" aria-label="Snow Voucher - về trang chủ">
            <img
              src="/snowflake.png"
              alt=""
              aria-hidden="true"
              className="h-9 w-9 shrink-0 object-contain drop-shadow-sm"
            />
            <span className="truncate text-lg font-black tracking-tight text-slate-900 sm:text-xl">Snow Voucher</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link to="/" className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900">
              <ArrowLeft size={14} aria-hidden="true" />
              <span className="hidden sm:inline">Trang chủ</span>
            </Link>
            <Link to={accountAction.to} className="inline-flex items-center gap-1.5 rounded-full bg-sky-600 px-3.5 py-2 text-xs font-bold text-white shadow-soft transition-colors hover:bg-sky-700">
              <AccountIcon size={14} aria-hidden="true" />
              {accountAction.label}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10">
        <section className="relative overflow-hidden rounded-[2rem] border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-6 py-9 text-slate-800 shadow-card sm:px-10 sm:py-12">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-sky-200/35 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-cyan-200/35 blur-3xl" aria-hidden="true" />
          <div className="relative max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-3 py-1.5 text-xs font-bold text-sky-700">
              <ShieldCheck size={15} aria-hidden="true" />
              Điều khoản minh bạch · Quy trình nhất quán
            </div>
            <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Điều Khoản & Chính Sách Sàn Snow Voucher
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
              Chính sách này quy định quyền, nghĩa vụ và nguyên tắc xử lý giao dịch giữa Sàn, Khách hàng và Đối tác cung cấp voucher.
            </p>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-500 sm:text-base">
              Sàn đóng vai trò trung gian cung cấp nền tảng để Đối tác phát hành voucher và Khách hàng tìm kiếm, mua, nhận và sử dụng voucher.
            </p>
          </div>

          <div className="relative mt-7 grid gap-3 sm:grid-cols-3">
            {[
              [ShoppingBag, "Khách hàng", "Quyền lợi mua và sử dụng voucher"],
              [Store, "Đối tác", "Trách nhiệm cung cấp đúng cam kết"],
              [ShieldCheck, "Snow Voucher", "Kiểm duyệt và xử lý minh bạch"],
            ].map(([Icon, title, text]) => (
              <div key={title} className="rounded-2xl border border-sky-100 bg-white/90 p-4 shadow-sm backdrop-blur-sm">
                <Icon size={19} className="text-sky-600" aria-hidden="true" />
                <p className="mt-2 text-sm font-extrabold text-slate-900">{title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-6 rounded-2xl border border-sky-200 bg-sky-50 px-5 py-4 text-sm leading-6 text-sky-900 shadow-sm">
          <div className="flex items-start gap-3">
            <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" aria-hidden="true" />
            <p>
              <strong>Nguyên tắc ưu tiên:</strong> nếu voucher không quy định, Chính sách Sàn được áp dụng. Nếu chính sách riêng của voucher có lợi hơn cho Khách hàng, điều khoản có lợi hơn đó được ưu tiên.
            </p>
          </div>
        </div>

        <details className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:hidden">
          <summary className="cursor-pointer list-none text-sm font-extrabold text-slate-900">Mục lục chính sách</summary>
          <nav aria-label="Mục lục chính sách" className="mt-3 grid gap-1.5 sm:grid-cols-2">
            {policyNavigation.map((item, index) => (
              <a key={item.id} href={`#${item.id}`} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-cyan-50 hover:text-cyan-800">
                <span className="text-xs font-black text-cyan-600">{String(index + 1).padStart(2, "0")}</span>
                {item.label}
              </a>
            ))}
          </nav>
        </details>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="sticky top-24 hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:block">
            <p className="px-3 pb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">Mục lục</p>
            <nav aria-label="Mục lục chính sách" className="space-y-1">
              {policyNavigation.map((item, index) => (
                <a key={item.id} href={`#${item.id}`} className="group flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-cyan-50 hover:text-cyan-800">
                  <span className="text-xs font-black text-cyan-600">{String(index + 1).padStart(2, "0")}</span>
                  <span className="flex-1">{item.label}</span>
                  <ChevronRight size={14} className="opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                </a>
              ))}
            </nav>
            <Link to="/" className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2.5 text-xs font-bold text-white hover:bg-slate-800">
              <Home size={14} aria-hidden="true" /> Về trang chủ
            </Link>
          </aside>

          <div className="min-w-0 space-y-6">
            <PolicySection
              id="principles"
              eyebrow="Phần I"
              title="Nguyên tắc áp dụng chính sách"
              summary="Cơ sở xác định chính sách nào được áp dụng cho mỗi giao dịch voucher."
              icon={FileText}
            >
              <BulletList items={principles} />
            </PolicySection>

            <PolicySection
              id="customer-policy"
              eyebrow="Khối 1"
              title="Chính sách giữa Khách hàng và Sàn"
              summary="Quyền, nghĩa vụ và trách nhiệm trong quá trình tìm kiếm, mua, nhận và sử dụng voucher."
              icon={ShoppingBag}
              theme="blue"
            >
              {customerPolicy.map((block) => <PolicyBlock key={block.title} block={block} />)}
            </PolicySection>

            <PolicySection
              id="partner-policy"
              eyebrow="Khối 2"
              title="Chính sách giữa Đối tác và Sàn"
              summary="Điều kiện hoạt động và trách nhiệm của Đối tác từ lúc đăng voucher đến khi thực hiện quyền lợi."
              icon={Store}
              theme="violet"
            >
              {partnerPolicy.map((block) => <PolicyBlock key={block.title} block={block} />)}
            </PolicySection>

            <PolicySection
              id="cancellation-policy"
              eyebrow="Hủy"
              title="Chính sách hủy đơn hàng"
              summary="Phân biệt rõ quyền tự hủy trước thanh toán và quy trình xét duyệt sau thanh toán."
              icon={CircleAlert}
              theme="amber"
            >
              {cancellationPolicy.map((block) => <PolicyBlock key={block.title} block={block} />)}
            </PolicySection>

            <PolicySection
              id="refund-policy"
              eyebrow="Hoàn tiền"
              title="Chính sách hoàn tiền"
              summary="Hoàn tiền chỉ được thực hiện sau một quyết định hủy hoặc khiếu nại hợp lệ."
              icon={RefreshCw}
              theme="emerald"
            >
              {refundPolicy.map((block) => <PolicyBlock key={block.title} block={block} />)}
            </PolicySection>

            <PolicySection
              id="complaint-policy"
              eyebrow="Khiếu nại"
              title="Chính sách khiếu nại"
              summary="Snow Voucher ưu tiên khắc phục quyền lợi bằng mã hợp lệ trước khi xem xét hoàn tiền."
              icon={MessageSquare}
              theme="blue"
            >
              {complaintPolicy.map((block) => <PolicyBlock key={block.title} block={block} />)}
            </PolicySection>

            <PolicySection
              id="decision-table"
              eyebrow="Tra cứu nhanh"
              title="Bảng tóm tắt quyết định hủy – hoàn – khiếu nại"
              summary="Đối chiếu nhanh tình huống phổ biến và hướng xử lý tương ứng."
              icon={CheckCircle2}
              theme="cyan"
            >
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                    <caption className="sr-only">Bảng tình huống và cách xử lý hủy, hoàn tiền, khiếu nại</caption>
                    <thead className="bg-slate-900 text-white">
                      <tr>
                        <th scope="col" className="w-[48%] px-5 py-4 font-bold">Tình huống</th>
                        <th scope="col" className="px-5 py-4 font-bold">Cách xử lý</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {decisionRows.map(([situation, action], index) => (
                        <tr key={situation} className={index % 2 ? "bg-slate-50/70" : "bg-white"}>
                          <td className="px-5 py-4 font-semibold leading-6 text-slate-800">{situation}</td>
                          <td className="px-5 py-4 leading-6 text-slate-600">{action}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </PolicySection>

            <div className="rounded-3xl bg-gradient-to-r from-cyan-700 to-blue-700 p-6 text-white shadow-lg sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-black">Cần hỗ trợ về giao dịch?</h2>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-cyan-50">
                    Hãy đăng nhập để theo dõi đơn hàng, gửi yêu cầu hủy hoặc khiếu nại kèm thông tin giao dịch chính xác.
                  </p>
                </div>
                <Link to={accountAction.to} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-cyan-800 shadow-sm hover:bg-cyan-50">
                  <AccountIcon size={16} aria-hidden="true" /> {accountAction.label}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
