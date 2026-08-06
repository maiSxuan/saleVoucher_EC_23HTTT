import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Search,
  Home,
  Tag,
  User,
  ChevronDown,
  LogOut,
  Package,
} from "lucide-react";
import { fetchCategories } from "../shared/api/catalogApi";

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

const MAX_VISIBLE_CATEGORIES = 8;

export default function CustomerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getStoredUser();
  const isLoggedIn = !!localStorage.getItem("accessToken");

  const [searchValue, setSearchValue] = useState("");
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const cartCount = 0;

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const visibleCategories = categories.slice(0, MAX_VISIBLE_CATEGORIES);
  const overflowCategories = categories.slice(MAX_VISIBLE_CATEGORIES);

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("ec_auth_token");
    localStorage.removeItem("ec_auth_user");
    navigate("/login", { replace: true });
  }

  function selectCategory(name) {
    setActiveCategory(name);
    setShowMoreCategories(false);
    if (location.pathname !== "/customer") navigate("/customer");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-orange-500 text-white shadow-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 h-14">
            <button
              onClick={() => navigate("/customer")}
              className="flex items-center gap-2 flex-shrink-0"
            >
              <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                <Tag size={14} className="text-orange-500" />
              </div>
              <span className="font-bold text-base hidden sm:block">
                EC Voucher
              </span>
            </button>

            <div className="flex-1 relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && navigate("/customer")}
                placeholder="Tìm voucher ưu đãi..."
                className="w-full pl-9 pr-3 py-1.5 rounded-full text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>

            <button
              onClick={() => navigate("/customer/cart")}
              className="relative flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2.5 py-1.5 rounded-full transition-colors"
            >
              <ShoppingCart size={15} />
              <span className="text-sm hidden sm:block">Giỏ hàng</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-sm rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {isLoggedIn ? (
              <div className="relative group flex-shrink-0">
                <button className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-2.5 py-1.5 rounded-full text-base transition-colors">
                  <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                    <User size={11} className="text-orange-500" />
                  </div>
                  <span className="hidden sm:block text-sm max-w-20 truncate">
                    {user?.name}
                  </span>
                  <ChevronDown size={11} />
                </button>
                <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
                  <MenuLink
                    icon={User}
                    label="Hồ sơ"
                    onClick={() => navigate("/customer/profile")}
                  />
                  <MenuLink
                    icon={Package}
                    label="Đơn hàng"
                    onClick={() => navigate("/customer/orders")}
                  />
                  <MenuLink
                    icon={Tag}
                    label="Voucher của tôi"
                    onClick={() => navigate("/customer/vouchers/my")}
                  />
                  <hr className="my-1 border-gray-100" />
                  <MenuLink
                    icon={LogOut}
                    label="Đăng xuất"
                    onClick={handleLogout}
                    danger
                  />
                </div>
              </div>
            ) : (
              <div className="flex gap-1.5 flex-shrink-0">
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm bg-white text-orange-600 px-2.5 py-1.5 rounded-full font-semibold hover:bg-orange-50"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => navigate("/customer/register")}
                  className="text-sm bg-white/20 hover:bg-white/30 px-2.5 py-1.5 rounded-full hidden sm:block"
                >
                  Đăng ký
                </button>
              </div>
            )}
          </div>

          {/* Thanh danh mục dưới Header - Đã tăng cỡ chữ & khoảng cách hài hòa */}
          <div className="flex items-center gap-6 overflow-x-auto pb-2.5 pt-1 scrollbar-none text-base font-medium">
            <button
              onClick={() => selectCategory("Tất cả")}
              className={`whitespace-nowrap py-1 border-b-2 transition-all ${
                activeCategory === "Tất cả"
                  ? "border-white text-white font-semibold"
                  : "border-transparent text-white/80 hover:text-white"
              }`}
            >
              Tất cả
            </button>

            {visibleCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => selectCategory(cat.name)}
                className={`whitespace-nowrap py-1 border-b-2 transition-all ${
                  activeCategory === cat.name
                    ? "border-white text-white font-semibold"
                    : "border-transparent text-white/80 hover:text-white"
                }`}
              >
                {cat.name}
              </button>
            ))}

            {overflowCategories.length > 0 && (
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setShowMoreCategories((s) => !s)}
                  className="whitespace-nowrap flex items-center gap-1.5 py-1 text-white/80 hover:text-white font-medium"
                >
                  Danh mục khác <ChevronDown size={14} />
                </button>

                {showMoreCategories && (
                  <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 max-h-64 overflow-y-auto">
                    {overflowCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => selectCategory(cat.name)}
                        className="w-full text-left px-4 py-2 text-base text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-4">
        <Outlet
          context={{
            searchValue,
            setSearchValue,
            activeCategory,
            setActiveCategory,
            categories,
          }}
        />
      </main>

      <nav className="sm:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-30 flex">
        {[
          { path: "/customer", icon: Home, label: "Trang chủ" },
          {
            path: "/customer/cart",
            icon: ShoppingCart,
            label: "Giỏ hàng",
            badge: cartCount,
          },
          { path: "/customer/vouchers", icon: Tag, label: "Của tôi" },
          { path: "/customer/profile", icon: User, label: "Tài khoản" },
        ].map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex-1 flex flex-col items-center py-2 gap-0.5 relative ${active ? "text-orange-500" : "text-gray-400"}`}
            >
              <div className="relative">
                <Icon size={18} />
                {item.badge ? (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-sm rounded-full w-3.5 h-3.5 flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="sm:hidden h-16" />
    </div>
  );
}

function MenuLink({ icon: Icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-2 text-base hover:bg-gray-50 ${danger ? "text-red-600" : "text-gray-700"}`}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}
