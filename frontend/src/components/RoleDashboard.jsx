const roles = [
  {
    key: "admin",
    title: "Admin",
    description: "Trang quản trị hệ thống, phân quyền và monitoring.",
    accent: "from-rose-500 to-orange-500",
  },
  {
    key: "staff",
    title: "Nhân viên",
    description: "Theo dõi hoạt động và xử lý các tác vụ vận hành.",
    accent: "from-cyan-500 to-blue-500",
  },
  {
    key: "seller",
    title: "Người bán",
    description: "Quản lý voucher, promo và các chiến dịch bán hàng.",
    accent: "from-emerald-500 to-teal-500",
  },
  {
    key: "customer",
    title: "Khách hàng",
    description: "Mua voucher, xem lịch sử và theo dõi đơn hàng.",
    accent: "from-violet-500 to-fuchsia-500",
  },
];

function RoleCard({ role }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20 backdrop-blur">
      <div
        className={`mb-4 h-2 w-24 rounded-full bg-gradient-to-r ${role.accent}`}
      />
      <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">
        Role panel
      </p>
      <h2 className="mt-3 text-2xl font-bold text-white">{role.title}</h2>
      <p className="mt-2 text-sm text-slate-300">{role.description}</p>
      <div className="mt-4 rounded-xl bg-slate-900/70 px-3 py-2 text-xs text-slate-200">
        File placeholder: src/pages/{role.key}.jsx
      </div>
    </div>
  );
}

function RoleDashboard() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-slate-950 p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">
          SaleVoucher EC
        </p>
        <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">
          Khởi tạo giao diện thương mại điện tử thành công
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-200">
          Đây là nền tảng frontend React + Vite + Tailwind cho nhóm phát triển.
          Các màn hình theo vai trò đã được tạo làm file placeholder để mở rộng
          dần.
        </p>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {roles.map((role) => (
          <RoleCard key={role.key} role={role} />
        ))}
      </section>
    </main>
  );
}

export default RoleDashboard;
