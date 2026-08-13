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
  X,
  FileText,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { fetchCategories } from "../shared/api/catalogApi";
import { contentApi } from "../features/content-feedback/api/contentApi";

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

  // Popup & Policies state
  const [popups, setPopups] = useState([]);
  const [currentPopupIndex, setCurrentPopupIndex] = useState(0);
  const [policies, setPolicies] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]));

    // Fetch popups and policies
    contentApi.list("popup")
      .then(res => {
        const active = (res.data || []).filter(p => p.status === 'visible' || !p.status);
        setPopups(active);
      })
      .catch(() => {});

    contentApi.list("chinh_sach")
      .then(res => {
        const active = (res.data || []).filter(p => p.status === 'visible' || !p.status);
        setPolicies(active);
      })
      .catch(() => {});
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

  const activePopup = popups[currentPopupIndex];
  const popupImg = activePopup?.imageUrl || activePopup?.hinh_anh_url;
  const policyImg = selectedPolicy?.imageUrl || selectedPolicy?.hinh_anh_url;

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
                    {typeof user?.name === 'object' && user?.name !== null ? user.name.name || user.name.ho_ten || 'User' : user?.name}
                  </span>
                  <ChevronDown size={11} />
                </button>

                <div className="absolute right-0 top-full pt-1 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
                  <div className="w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
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

          {/* Thanh danh mục dưới Header */}
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

      {/* Footer chứa Chính sách */}
      <footer className="bg-white border-t border-gray-200 mt-auto py-8 px-4 text-gray-600 text-sm">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center gap-2 font-bold text-gray-900 text-base mb-2">
              <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs">🏷️</div>
              EC Voucher Platform
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Nền tảng mua bán và phân phối voucher ưu đãi hàng đầu, kết nối khách hàng với hàng ngàn dịch vụ ẩm thực, giải trí, làm đẹp và du lịch chất lượng.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-xs uppercase tracking-wider">Chính sách & Quy định</h4>
            {policies.length === 0 ? (
              <p className="text-xs text-gray-400">Đang cập nhật chính sách...</p>
            ) : (
              <ul className="space-y-2">
                {policies.map(pol => (
                  <li key={pol.id}>
                    <button
                      onClick={() => setSelectedPolicy(pol)}
                      className="text-xs text-gray-600 hover:text-orange-600 transition-colors text-left flex items-center gap-1.5"
                    >
                      <FileText size={12} className="text-orange-500" /> {pol.title}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-xs uppercase tracking-wider">Hỗ trợ khách hàng</h4>
            <p className="text-xs text-gray-500 mb-1">Hotline: 1900 1234 (8:00 - 22:00)</p>
            <p className="text-xs text-gray-500 mb-1">Email: support@ecvoucher.vn</p>
            <p className="text-xs text-gray-400 mt-3">© 2026 EC Voucher. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Popup Modal hỗ trợ chuyển đổi nhiều popup nếu có */}
      {activePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative border border-gray-100">
            <button
              onClick={() => setPopups(prev => prev.filter((_, i) => i !== currentPopupIndex))}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors backdrop-blur-sm"
              title="Đóng"
            >
              <X size={16} />
            </button>

            {popupImg && (
              <div className="w-full h-56 sm:h-64 bg-gray-100 overflow-hidden relative">
                <img src={popupImg} alt={activePopup.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{activePopup.title}</h3>
              <div className="text-sm text-gray-600 max-h-48 overflow-y-auto leading-relaxed mb-6">
                {activePopup.content}
              </div>
              <div className="flex items-center justify-between">
                {popups.length > 1 ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPopupIndex(prev => (prev - 1 + popups.length) % popups.length)}
                      className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="text-xs text-gray-500 font-medium">
                      {currentPopupIndex + 1} / {popups.length}
                    </span>
                    <button
                      onClick={() => setCurrentPopupIndex(prev => (prev + 1) % popups.length)}
                      className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                ) : <div />}
                <button
                  onClick={() => setPopups(prev => prev.filter((_, i) => i !== currentPopupIndex))}
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors shadow-sm text-sm ml-auto"
                >
                  Đã hiểu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Policy Detail Modal với hỗ trợ ảnh chính sách */}
      {selectedPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative max-h-[85vh] flex flex-col">
            <button
              onClick={() => setSelectedPolicy(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors backdrop-blur-sm"
            >
              <X size={16} />
            </button>

            {policyImg && (
              <div className="w-full h-48 bg-gray-100 overflow-hidden relative flex-shrink-0">
                <img src={policyImg} alt={selectedPolicy.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="p-6 flex-1 overflow-y-auto">
              <div className="flex items-center gap-2 mb-3 text-orange-600">
                <ShieldCheck size={22} />
                <h3 className="text-lg font-bold text-gray-900">{selectedPolicy.title}</h3>
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                {selectedPolicy.content}
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 text-right flex-shrink-0">
              <button
                onClick={() => setSelectedPolicy(null)}
                className="px-5 py-2 bg-gray-900 text-white text-xs font-semibold rounded-xl hover:bg-gray-800 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

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
