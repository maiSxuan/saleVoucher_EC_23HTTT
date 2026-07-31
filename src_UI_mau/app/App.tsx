import { useState } from "react";
import { Toaster } from "sonner";
import { Building2, ShieldCheck, ShoppingBag } from "lucide-react";

// Admin
import AdminAuth from "./admin/AdminAuth";
import AdminLayout, { type Page } from "./components/layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Partners from "./pages/Partners";
import VoucherReview from "./pages/VoucherReview";
import Orders from "./pages/Orders";
import Content from "./pages/Content";
import SystemLogs from "./pages/SystemLogs";

// Partner
import PartnerAuth from "./partner/PartnerAuth";
import PartnerLayout, { type PartnerPage, type PartnerMode } from "./partner/PartnerLayout";
import PartnerDashboard from "./partner/PartnerDashboard";
import PartnerVouchers from "./partner/PartnerVouchers";
import PartnerBranches from "./partner/PartnerBranches";
import PartnerProfile from "./partner/PartnerProfile";
import PartnerVoucherCodeLookup from "./partner/PartnerVoucherCodeLookup";
import PartnerReports from "./partner/PartnerReports";
import PartnerStaff from "./partner/PartnerStaff";
import PartnerStaffAccount from "./partner/PartnerStaffAccount";

// Customer
import CustomerAuth from "./customer/CustomerAuth";
import CustomerLayout, { type CustomerPage } from "./customer/CustomerLayout";
import CustomerHome from "./customer/CustomerHome";
import CustomerVoucherDetail from "./customer/CustomerVoucherDetail";
import CustomerCart from "./customer/CustomerCart";
import CustomerCheckout from "./customer/CustomerCheckout";
import CustomerOrders from "./customer/CustomerOrders";
import CustomerVouchers from "./customer/CustomerVouchers";
import CustomerProfile from "./customer/CustomerProfile";
import type { CartItem } from "./customer/customerMockData";

type Portal = 'admin' | 'partner' | 'customer';

export default function App() {
  const [portal, setPortal] = useState<Portal>('admin');

  // Admin state
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [filterContext, setFilterContext] = useState<Record<string, unknown>>({});

  // Partner state
  const [partnerAuthed, setPartnerAuthed] = useState(false);
  const [partnerPage, setPartnerPage] = useState<PartnerPage>('dashboard');
  const [partnerMode, setPartnerMode] = useState<PartnerMode>('owner');

  // Customer state
  const [customerAuthed, setCustomerAuthed] = useState(false);
  const [customerPage, setCustomerPage] = useState<CustomerPage>('home');
  const [customerPageCtx, setCustomerPageCtx] = useState<Record<string, unknown>>({});
  const [customerName, setCustomerName] = useState('Khách hàng Demo');
  const [customerProfile, setCustomerProfile] = useState({
    fullName: 'Nguyễn Thị Lan',
    email: 'lan@demo.com',
    phone: '0901234567',
    birthdate: '1995-03-20',
    gender: 'female',
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchValue, setSearchValue] = useState('');

  // ----- Admin -----
  const navigateTo = (page: Page, filters?: Record<string, unknown>) => {
    setCurrentPage(page);
    setFilterContext(filters || {});
  };

  const renderAdminPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard onNavigate={navigateTo} />;
      case 'users': return <Users initialFilters={filterContext} onNavigate={navigateTo} />;
      case 'partners': return <Partners initialFilters={filterContext} onNavigate={navigateTo} />;
      case 'vouchers': return <VoucherReview initialFilters={filterContext} onNavigate={navigateTo} />;
      case 'orders': return <Orders initialFilters={filterContext} onNavigate={navigateTo} />;
      case 'content': return <Content />;
      case 'logs': return <SystemLogs initialFilters={filterContext} />;
      default: return <Dashboard onNavigate={navigateTo} />;
    }
  };

  // ----- Partner -----
  const navigatePartner = (page: PartnerPage) => setPartnerPage(page);

  const renderPartnerPage = () => {
    if (partnerMode === 'staff') {
      switch (partnerPage) {
        case 'code-lookup': return <PartnerVoucherCodeLookup />;
        case 'account': return <PartnerStaffAccount />;
        default: return <PartnerVoucherCodeLookup />;
      }
    }
    switch (partnerPage) {
      case 'dashboard': return <PartnerDashboard onNavigate={navigatePartner} />;
      case 'vouchers': return <PartnerVouchers />;
      case 'voucher-create': return <PartnerVouchers />;
      case 'branches': return <PartnerBranches />;
      case 'profile': return <PartnerProfile />;
      case 'code-lookup': return <PartnerVoucherCodeLookup />;
      case 'reports': return <PartnerReports />;
      case 'staff': return <PartnerStaff />;
      default: return <PartnerDashboard onNavigate={navigatePartner} />;
    }
  };

  // ----- Customer -----
  const navigateCustomer = (page: CustomerPage, ctx?: Record<string, unknown>) => {
    setCustomerPage(page);
    setCustomerPageCtx(ctx || {});
  };

  const renderCustomerPage = () => {
    switch (customerPage) {
      case 'home':
        return (
          <CustomerHome
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onVoucherSelect={(id) => navigateCustomer('voucher-detail', { voucherId: id })}
          />
        );
      case 'voucher-detail':
        return (
          <CustomerVoucherDetail
            voucherId={customerPageCtx.voucherId as string}
            cart={cart}
            onCartChange={setCart}
            onBack={() => navigateCustomer('home')}
            onGoCart={() => navigateCustomer('cart')}
            isLoggedIn={customerAuthed}
            onLoginRequired={() => navigateCustomer('profile')}
          />
        );
      case 'cart':
        return (
          <CustomerCart
            cart={cart}
            onCartChange={setCart}
            onCheckout={() => navigateCustomer('checkout')}
            onContinueShopping={() => navigateCustomer('home')}
            onVoucherSelect={(id) => navigateCustomer('voucher-detail', { voucherId: id })}
          />
        );
      case 'checkout':
        return (
          <CustomerCheckout
            cart={cart}
            onSuccess={(orderId) => {
              setCart([]);
              navigateCustomer('orders', { orderId });
            }}
            onCancel={() => navigateCustomer('home')}
            customerName={customerProfile.fullName}
          />
        );
      case 'orders':
        return (
          <CustomerOrders
            onNavigate={(page, ctx) => navigateCustomer(page as CustomerPage, ctx)}
          />
        );
      case 'vouchers':
        return (
          <CustomerVouchers
            onGoOrders={() => navigateCustomer('orders')}
          />
        );
      case 'profile':
      case 'change-password':
        return (
          <CustomerProfile
            initialData={customerProfile}
            onDataChange={(data) => {
              setCustomerProfile(data);
              setCustomerName(data.fullName);
            }}
          />
        );
      default:
        return (
          <CustomerHome
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onVoucherSelect={(id) => navigateCustomer('voucher-detail', { voucherId: id })}
          />
        );
    }
  };

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  // ----- Portal switcher -----
  const switchPortal = (p: Portal) => setPortal(p);

  const portals = [
    { key: 'admin' as Portal, label: 'Admin', icon: ShieldCheck, authed: adminAuthed, activeColor: 'bg-blue-600', hoverColor: 'hover:bg-blue-50', textColor: 'text-blue-600' },
    { key: 'partner' as Portal, label: 'Partner', icon: Building2, authed: partnerAuthed, activeColor: 'bg-emerald-600', hoverColor: 'hover:bg-emerald-50', textColor: 'text-emerald-600' },
    { key: 'customer' as Portal, label: 'Mua sắm', icon: ShoppingBag, authed: customerAuthed, activeColor: 'bg-orange-500', hoverColor: 'hover:bg-orange-50', textColor: 'text-orange-500' },
  ];

  const PortalSwitcher = () => (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-white rounded-2xl shadow-lg border border-gray-200 px-2.5 py-2 flex items-center gap-1">
      <span className="text-xs text-gray-400 font-medium px-1 hidden sm:block">Portal:</span>
      {portals.map(p => {
        const Icon = p.icon;
        const active = portal === p.key;
        return (
          <button
            key={p.key}
            onClick={() => switchPortal(p.key)}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${active ? `${p.activeColor} text-white shadow` : `${p.textColor} ${p.hoverColor}`}`}
          >
            <Icon size={13} />
            <span>{p.label}</span>
            {p.authed && (
              <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-white ${active ? 'bg-green-300' : 'bg-green-500'}`} />
            )}
          </button>
        );
      })}
    </div>
  );

  const isCustomer = portal === 'customer';

  return (
    <div className={isCustomer ? 'min-h-screen' : 'h-screen overflow-hidden'}>
      <Toaster position="top-right" richColors expand={false} />

      {portal === 'admin' && (
        <>
          {!adminAuthed ? (
            <AdminAuth onLoginSuccess={() => setAdminAuthed(true)} />
          ) : (
            <AdminLayout
              currentPage={currentPage}
              onNavigate={navigateTo}
              onLogout={() => { setAdminAuthed(false); setCurrentPage('dashboard'); }}
            >
              {renderAdminPage()}
            </AdminLayout>
          )}
        </>
      )}

      {portal === 'partner' && (
        <>
          {!partnerAuthed ? (
            <PartnerAuth
              onLoginSuccess={(mode) => {
                setPartnerAuthed(true);
                setPartnerMode(mode as PartnerMode);
                setPartnerPage(mode === 'staff' ? 'code-lookup' : 'dashboard');
              }}
            />
          ) : (
            <PartnerLayout
              currentPage={partnerPage}
              onNavigate={navigatePartner}
              mode={partnerMode}
              onModeChange={(m) => { setPartnerMode(m); setPartnerPage(m === 'staff' ? 'code-lookup' : 'dashboard'); }}
              onLogout={() => { setPartnerAuthed(false); setPartnerPage('dashboard'); }}
            >
              {renderPartnerPage()}
            </PartnerLayout>
          )}
        </>
      )}

      {portal === 'customer' && (
        <>
          {!customerAuthed ? (
            <CustomerAuth onLoginSuccess={() => {
              setCustomerAuthed(true);
              setCustomerName(customerProfile.fullName);
            }} />
          ) : (
            <CustomerLayout
              currentPage={customerPage}
              onNavigate={navigateCustomer}
              cartCount={cartCount}
              isLoggedIn={customerAuthed}
              customerName={customerName}
              onLogout={() => {
                setCustomerAuthed(false);
                setCart([]);
                setCustomerPage('home');
              }}
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              onSearchSubmit={() => navigateCustomer('home')}
            >
              {renderCustomerPage()}
            </CustomerLayout>
          )}
        </>
      )}

      <PortalSwitcher />
    </div>
  );
}
