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
  ChevronLeft,
  ChevronRight,
  Store,
} from "lucide-react";
import {
  fetchCategories,
  fetchSellingVouchers,
} from "../shared/api/catalogApi";
import { contentApi } from "../features/content-feedback/api/contentApi";

import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../shared/components/LanguageSwitcher";

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

const MAX_VISIBLE_CATEGORIES = 8;

export default function CustomerLayout() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const user = getStoredUser();
  const isLoggedIn = !!localStorage.getItem("accessToken");

  const [searchValue, setSearchValue] = useState("");
  const [categories, setCategories] = useState([]);
  const [partnersByCategory, setPartnersByCategory] = useState({});
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [activePartner, setActivePartner] = useState("");
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const cartCount = 0;

  // Popup state
  const [popups, setPopups] = useState([]);
  const [currentPopupIndex, setCurrentPopupIndex] = useState(0);

  const loadCategories = () => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  };

  useEffect(() => {
    loadCategories();

    window.addEventListener("app_language_changed", loadCategories);

    fetchSellingVouchers()
      .then((vouchers) => {
        const groupedPartners = {};

        vouchers.forEach((voucher) => {
          const categoryName = voucher.category;
          const partner = voucher.partner;
          const partnerName =
            typeof partner === "object" && partner !== null
              ? partner.name || partner.ten_dn
              : partner;

          if (!categoryName || !partnerName) return;

          if (!groupedPartners[categoryName]) {
            groupedPartners[categoryName] = new Map();
          }

          const partnerKey =
            partner?.id || partnerName.trim().toLocaleLowerCase("vi");
          groupedPartners[categoryName].set(partnerKey, {
            id: partnerKey,
            name: partnerName,
            logo: partner?.logo || null,
          });
        });

        setPartnersByCategory(
          Object.fromEntries(
            Object.entries(groupedPartners).map(([categoryName, partners]) => [
              categoryName,
              [...partners.values()].sort((a, b) =>
                a.name.localeCompare(b.name, "vi"),
              ),
            ]),
          ),
        );
      })
      .catch(() => setPartnersByCategory({}));

    // Fetch popups
    contentApi.list("popup")
      .then(res => {
        const active = (res.data || []).filter(p => p.status === 'visible' || !p.status);
        setPopups(active);
      })
      .catch(() => { });

    return () => {
      window.removeEventListener("app_language_changed", loadCategories);
    };
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
    setActivePartner("");
    setShowMoreCategories(false);
    if (location.pathname !== "/customer") navigate("/customer");
  }

  function selectPartner(categoryName, partnerName) {
    setActiveCategory(categoryName);
    setActivePartner(partnerName);
    setShowMoreCategories(false);
    if (location.pathname !== "/customer") navigate("/customer");
  }

  const activePopup = popups[currentPopupIndex];
  const popupImg = activePopup?.imageUrl || activePopup?.hinh_anh_url;

  return (
    <div className="theme-snow min-h-screen bg-snow-50 flex flex-col">
      <header className="bg-gradient-to-r from-sky-500 via-sky-600 to-sky-700 text-white shadow-soft sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 h-14">
            <button
              onClick={() => navigate("/customer")}
              className="flex items-center gap-2 flex-shrink-0"
            >
              <img
                src="/snowflake.png"
                alt=""
                aria-hidden="true"
                className="w-8 h-8 object-contain drop-shadow-sm"
              />
              <span className="font-extrabold text-base hidden sm:block text-white">
                Snow Voucher
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
                placeholder={t("Tìm voucher ưu đãi...")}
                className="w-full pl-9 pr-3 py-1.5 rounded-full text-base text-snow-900 bg-white focus:outline-none focus:ring-2 focus:ring-sky-300"
              />
            </div>

            <LanguageSwitcher />

            <button
              onClick={() => navigate("/customer/cart")}
              className="relative flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2.5 py-1.5 rounded-full transition-colors"
            >
              <ShoppingCart size={15} />
              <span className="text-sm hidden sm:block">{t("Giỏ hàng")}</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-semantic-error text-white text-sm rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {isLoggedIn ? (
              <div className="relative group flex-shrink-0">
                <button className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-2.5 py-1.5 rounded-full text-base transition-colors">
                  <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                    <User size={11} className="text-sky-600" />
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
                      label={t("Hồ sơ")}
                      onClick={() => navigate("/customer/profile")}
                    />
                    <MenuLink
                      icon={Package}
                      label={t("Đơn hàng")}
                      onClick={() => navigate("/customer/orders")}
                    />
                    <MenuLink
                      icon={Tag}
                      label={t("Voucher của tôi")}
                      onClick={() => navigate("/customer/vouchers/my")}
                    />
                    <hr className="my-1 border-gray-100" />
                    <MenuLink
                      icon={LogOut}
                      label={t("Đăng xuất")}
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
                  className="text-sm bg-white text-sky-700 px-2.5 py-1.5 rounded-full font-semibold hover:bg-sky-50"
                >
                  {t("Đăng nhập")}
                </button>
                <button
                  onClick={() => navigate("/customer/register")}
                  className="text-sm bg-white/20 hover:bg-white/30 px-2.5 py-1.5 rounded-full hidden sm:block"
                >
                  {t("Đăng ký")}
                </button>
              </div>
            )}
          </div>

          {/* Desktop: mỗi danh mục có dropdown đối tác khi hover/focus */}
          <div className="hidden lg:flex items-center gap-6 pb-2.5 pt-1 text-base font-medium">
            <button
              onClick={() => selectCategory("Tất cả")}
              className={`whitespace-nowrap py-1 border-b-2 transition-all ${activeCategory === "Tất cả"
                  ? "border-white text-white font-semibold"
                  : "border-transparent text-white/80 hover:text-white"
                }`}
            >
              {t("Tất cả danh mục")}
            </button>

            {visibleCategories.map((cat) => {
              const partners = partnersByCategory[cat.name] || [];

              return (
                <div
                  key={cat.id}
                  className="group/category relative flex-shrink-0"
                >
                  <button
                    onClick={() => selectCategory(cat.name)}
                    className={`flex items-center gap-1 whitespace-nowrap py-1 border-b-2 transition-all ${activeCategory === cat.name
                        ? "border-white text-white font-semibold"
                        : "border-transparent text-white/80 hover:text-white"
                      }`}
                    aria-haspopup="menu"
                  >
                    {t(cat.name)}
                    <ChevronDown
                      size={13}
                      className="opacity-70 transition-transform group-hover/category:rotate-180 group-focus-within/category:rotate-180"
                    />
                  </button>

                  <PartnerDropdown
                    categoryName={cat.name}
                    partners={partners}
                    onSelect={selectPartner}
                  />
                </div>
              );
            })}

            {overflowCategories.length > 0 && (
              <div className="group/more relative flex-shrink-0">
                <button
                  onClick={() => setShowMoreCategories((s) => !s)}
                  className="whitespace-nowrap flex items-center gap-1.5 py-1 text-white/80 hover:text-white font-medium"
                  aria-haspopup="menu"
                  aria-expanded={showMoreCategories}
                >
                  {t("Danh mục khác")} 
                  <ChevronDown
                    size={14}
                    className="transition-transform group-hover/more:rotate-180"
                  />
                </button>

                <div
                  className={`absolute right-0 top-full z-50 pt-2 transition-all duration-150 ${showMoreCategories
                      ? "visible translate-y-0 opacity-100 pointer-events-auto"
                      : "invisible translate-y-1 opacity-0 pointer-events-none group-hover/more:visible group-hover/more:translate-y-0 group-hover/more:opacity-100 group-hover/more:pointer-events-auto group-focus-within/more:visible group-focus-within/more:translate-y-0 group-focus-within/more:opacity-100 group-focus-within/more:pointer-events-auto"
                    }`}
                >
                  <div className="w-60 rounded-xl border border-sky-100 bg-white py-1.5 text-snow-900 shadow-xl">
                    {overflowCategories.map((cat) => (
                      <div
                        key={cat.id}
                        className="group/category relative"
                      >
                        <button
                          onClick={() => selectCategory(cat.name)}
                          className="flex w-full items-center justify-between gap-3 px-4 py-2 text-left text-base text-gray-700 transition-colors hover:bg-sky-50 hover:text-sky-700"
                          aria-haspopup="menu"
                        >
                          <span>{t(cat.name)}</span>
                          <ChevronRight size={14} className="text-sky-400" />
                        </button>
                        <PartnerDropdown
                          categoryName={cat.name}
                          partners={partnersByCategory[cat.name] || []}
                          onSelect={selectPartner}
                          side="left"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile/tablet: giữ thanh danh mục cuộn ngang, không phụ thuộc hover */}
          <div className="flex lg:hidden items-center gap-6 overflow-x-auto pb-2.5 pt-1 scrollbar-none text-base font-medium">
            <button
              onClick={() => selectCategory("Tất cả")}
              className={`whitespace-nowrap py-1 border-b-2 transition-all ${activeCategory === "Tất cả"
                  ? "border-white text-white font-semibold"
                  : "border-transparent text-white/80"
                }`}
            >
              {t("Tất cả")}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => selectCategory(cat.name)}
                className={`whitespace-nowrap py-1 border-b-2 transition-all ${activeCategory === cat.name
                    ? "border-white text-white font-semibold"
                    : "border-transparent text-white/80"
                  }`}
              >
                {t(cat.name)}
              </button>
            ))}
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
            activePartner,
            categories,
          }}
        />
      </main>

      {/* Popup Modal hỗ trợ chuyển đổi nhiều popup nếu có */}
      {activePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative border border-gray-100">
            <button
              onClick={() => setPopups([])}
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
<<<<<<< HEAD
                  onClick={() => setPopups([])}
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors shadow-sm text-sm ml-auto"
=======
                  onClick={() => setPopups(prev => prev.filter((_, i) => i !== currentPopupIndex))}
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-colors shadow-sm text-sm ml-auto"
>>>>>>> 2f8ba53ba4433aeee9b2c010e11feb068aafd6cc
                >
                  {t("Đã hiểu")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="sm:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-30 flex">
        {[
          { path: "/customer", icon: Home, label: t("Trang chủ") },
          {
            path: "/customer/cart",
            icon: ShoppingCart,
            label: t("Giỏ hàng"),
            badge: cartCount,
          },
          {
            path: "/customer/vouchers/my",
            icon: Tag,
            label: t("Của tôi"),
            activePrefixes: [
              "/customer/vouchers/my",
              "/customer/vouchers/issued/",
            ],
          },
          { path: "/customer/profile", icon: User, label: t("Tài khoản") },
        ].map((item) => {
          const Icon = item.icon;
          const active = item.activePrefixes
            ? item.activePrefixes.some((prefix) =>
                location.pathname.startsWith(prefix),
              )
            : location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex-1 flex flex-col items-center py-2 gap-0.5 relative ${active ? "text-sky-600" : "text-gray-400"}`}
            >
              <div className="relative">
                <Icon size={18} />
                {item.badge ? (
                  <span className="absolute -top-1 -right-2 bg-semantic-error text-white text-sm rounded-full w-3.5 h-3.5 flex items-center justify-center">
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

function PartnerDropdown({
  categoryName,
  partners,
  onSelect,
  side = "bottom",
}) {
  const { t } = useTranslation();
  const positionClassName =
    side === "left"
      ? "right-full top-0 pr-2"
      : "left-1/2 top-full -translate-x-1/2 pt-2";

  return (
    <div
      className={`absolute ${positionClassName} z-50 invisible translate-y-1 opacity-0 pointer-events-none transition-all duration-150 group-hover/category:visible group-hover/category:translate-y-0 group-hover/category:opacity-100 group-hover/category:pointer-events-auto group-focus-within/category:visible group-focus-within/category:translate-y-0 group-focus-within/category:opacity-100 group-focus-within/category:pointer-events-auto`}
      role="menu"
      aria-label={`${t("Đối tác trong danh mục")} ${t(categoryName)}`}
    >
      <div className="w-72 overflow-hidden rounded-2xl border border-sky-100 bg-white text-snow-900 shadow-[0_18px_45px_rgba(15,23,42,0.16)]">
        <div className="border-b border-sky-100 bg-sky-50/80 px-4 py-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
            {t("Đối tác trong danh mục")}
          </p>
          <p className="mt-0.5 truncate text-base font-bold text-snow-900">
            {t(categoryName)}
          </p>
        </div>

        <div className="max-h-72 overflow-y-auto p-2">
          {partners.length > 0 ? (
            partners.map((partner) => (
              <button
                key={partner.id}
                onClick={() => onSelect(categoryName, partner.name)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-base font-medium text-snow-700 transition-colors hover:bg-sky-50 hover:text-sky-700 focus:bg-sky-50 focus:text-sky-700 focus:outline-none"
                role="menuitem"
                title={`${t("Xem voucher của")} ${partner.name}`}
              >
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-sky-100 bg-sky-50 text-sky-600">
                  {partner.logo ? (
                    <img
                      src={partner.logo}
                      alt=""
                      aria-hidden="true"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Store size={17} />
                  )}
                </span>
                <span className="min-w-0 flex-1 truncate">{partner.name}</span>
                <ChevronRight size={14} className="flex-shrink-0 text-sky-400" />
              </button>
            ))
          ) : (
            <p className="px-3 py-4 text-center text-sm text-snow-500">
              {t("Chưa có đối tác đang bán voucher.")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function MenuLink({ icon: Icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-2 text-base hover:bg-snow-50 ${danger ? "text-rose-600 font-semibold" : "text-snow-700"}` }
    >
      <Icon size={14} />
      {label}
    </button>
  );
}
