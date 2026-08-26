import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useDeferredValue,
} from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Search,
  Tag,
  ShieldCheck,
  LogIn,
  ArrowRight,
  Sparkles,
  Flame,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Gift,
  UserPlus,
  ShoppingBag,
} from "lucide-react";
import {
  fetchSellingVouchers,
  fetchCategories,
} from "../../../../shared/api/catalogApi";
import { contentApi } from "../../../../shared/api/contentApi";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../../../shared/components/LanguageSwitcher";

function cleanImageUrl(url) {
  if (!url || typeof url !== "string") return null;
  let cleaned = url.trim();
  if (cleaned.includes("$0")) {
    cleaned = cleaned.split("$0")[0].trim();
  }
  if (
    cleaned.startsWith("data:") ||
    cleaned.startsWith("http://") ||
    cleaned.startsWith("https://")
  ) {
    return cleaned;
  }
  return cleaned;
}

// Strip Vietnamese accents for accent-insensitive matching
function stripVietnameseAccents(str) {
  if (!str) return "";
  return String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

export default function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const brandScrollRef = useRef(null);
  const voucherScrollRef = useRef(null);

  const [vouchers, setVouchers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const deferredSearchQuery = useDeferredValue(searchQuery);

  // Auto-slide banners every 10 seconds, resets timer on manual index change
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length, currentBannerIndex]);

  useEffect(() => {
    let ignore = false;

    const loadData = () => {
      setLoading(true);
      const lang =
        localStorage.getItem("app_lang") ||
        localStorage.getItem("i18nextLng") ||
        "vi";
      Promise.allSettled([
        fetchSellingVouchers(),
        fetchCategories(),
        contentApi.list("banner", lang),
      ])
        .then(([vRes, cRes, bRes]) => {
          if (ignore) return;
          if (vRes.status === "fulfilled" && Array.isArray(vRes.value)) {
            setVouchers(vRes.value);
          }
          if (cRes.status === "fulfilled" && Array.isArray(cRes.value)) {
            setCategories(cRes.value);
          }
          if (bRes.status === "fulfilled") {
            const list = Array.isArray(bRes.value)
              ? bRes.value
              : bRes.value?.data || [];
            const activeBanners = list.filter((b) => {
              const st = b.status || b.trang_thai;
              return st === "visible" || st === "Dang hien thi";
            });
            setBanners(activeBanners);
          }
        })
        .finally(() => {
          if (!ignore) setLoading(false);
        });
    };

    loadData();

    window.addEventListener("app_language_changed", loadData);
    return () => {
      ignore = true;
      window.removeEventListener("app_language_changed", loadData);
    };
  }, []);

  const scrollBrands = (direction) => {
    if (brandScrollRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      brandScrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollVouchers = (direction) => {
    if (voucherScrollRef.current) {
      const scrollAmount = direction === "left" ? -360 : 360;
      voucherScrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Normalize voucher data across all backend DTO & DB row structures
  const normalizedVouchers = useMemo(() => {
    if (!Array.isArray(vouchers)) return [];
    return vouchers.map((v) => {
      const ma_voucher = v.ma_voucher || v.id;
      const ten_voucher = v.ten_voucher || v.name || "Voucher Ưu Đãi";

      const partnerObj =
        v.partner || (v.voucher_cn && v.voucher_cn[0]?.chinhanh?.hosodn) || {};
      const ten_dn = v.ten_dn || partnerObj.name || partnerObj.ten_dn;
      const logo_dn = v.logo || partnerObj.logo;

      const categoryName =
        v.category || v.ten_danh_muc || v.danh_muc?.ten_danh_muc || "Khác";
      const ma_danh_muc =
        v.ma_danh_muc ||
        v.categoryId ||
        v.danh_muc_id ||
        v.danh_muc?.ma_danh_muc ||
        categoryName;

      const giaGoc = Number(v.gia_goc ?? v.originalPrice ?? 0);
      const giaBan = Number(
        v.gia_ban ?? v.salePrice ?? v.gia_tri_giam ?? giaGoc,
      );

      const hinhAnh =
        v.image ||
        v.hinh_anh ||
        v.hinh_anh_url ||
        "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop";
      const ngayTao =
        v.ngay_tao || v.tg_bat_dau_ban || v.startSaleDate || v.createdAt || "";
      const rawBranches = Array.isArray(v.branches)
        ? v.branches
        : (v.voucher_cn || []).map((item) => item?.chinhanh).filter(Boolean);
      const branches = rawBranches.map((branch) => ({
        id: branch.id || branch.ma_chi_nhanh,
        name: branch.name || branch.ten_chi_nhanh || "Chi nhánh",
        address: branch.address || branch.dia_chi || "",
        region: branch.region || branch.khu_vuc || "",
      }));
      const searchText = stripVietnameseAccents(
        [
          ten_voucher,
          ten_dn,
          categoryName,
          ...branches.flatMap((branch) => [
            branch.name,
            branch.address,
            branch.region,
          ]),
        ].join(" "),
      );

      return {
        raw: v,
        ma_voucher,
        ten_voucher,
        ten_dn,
        logo_dn,
        categoryName,
        ma_danh_muc,
        giaGoc,
        giaBan,
        hinhAnh,
        ngayTao,
        branches,
        searchText,
      };
    });
  }, [vouchers]);

  // Catalog đã chứa đối tác + chi nhánh; không gọi thêm endpoint /partners nặng.
  const brandList = useMemo(() => {
    const map = new Map();

    normalizedVouchers.forEach((v) => {
      if (!v.ten_dn) return;
      const key = v.ten_dn.toLowerCase();
      const current = map.get(key);
      const branchTerms = v.branches.flatMap((branch) => [
        branch.name,
        branch.address,
        branch.region,
      ]);

      if (!current) {
        map.set(key, {
          ma_hs: v.ma_voucher,
          ten_dn: v.ten_dn,
          logo: v.logo_dn,
          searchText: stripVietnameseAccents(
            [v.ten_dn, ...branchTerms].join(" "),
          ),
        });
      } else {
        current.searchText = stripVietnameseAccents(
          `${current.searchText} ${branchTerms.join(" ")}`,
        );
      }
    });

    return Array.from(map.values());
  }, [normalizedVouchers]);

  const visibleBrands = useMemo(() => {
    const query = stripVietnameseAccents(deferredSearchQuery);
    if (!query) return brandList;
    return brandList.filter((brand) => brand.searchText.includes(query));
  }, [brandList, deferredSearchQuery]);

  // Robust category matching function (UUID + exact text + accent-insensitive text match)
  const isVoucherInCategory = (v, target) => {
    if (!target || target === "all") return true;

    const targetStr = String(target).trim().toLowerCase();
    const vId = String(v.ma_danh_muc || "")
      .trim()
      .toLowerCase();
    const vName = String(v.categoryName || "")
      .trim()
      .toLowerCase();

    // 1. UUID Match
    if (vId && vId === targetStr) return true;

    // 2. Exact Text Match
    if (
      vName &&
      (vName === targetStr ||
        vName.includes(targetStr) ||
        targetStr.includes(vName))
    )
      return true;

    // 3. Accent-insensitive Match
    const cleanTarget = stripVietnameseAccents(targetStr);
    const cleanVName = stripVietnameseAccents(vName);
    if (
      cleanVName &&
      cleanTarget &&
      (cleanVName === cleanTarget ||
        cleanVName.includes(cleanTarget) ||
        cleanTarget.includes(cleanVName))
    ) {
      return true;
    }

    return false;
  };

  // Không đếm lại toàn bộ voucher ở mỗi lần gõ tìm kiếm.
  const categoryCounts = useMemo(() => {
    const counts = new Map();
    categories.forEach((cat) => {
      const catId = cat.ma_danh_muc || cat.id;
      const catName = cat.ten_danh_muc || cat.name || "";
      const key = String(catId || catName);
      const count = normalizedVouchers.filter(
        (v) =>
          (catId && isVoucherInCategory(v, catId)) ||
          (catName && isVoucherInCategory(v, catName)),
      ).length;
      counts.set(key, count);
    });
    return counts;
  }, [categories, normalizedVouchers]);

  // Filtered vouchers for landing page showcase
  const latestVouchers = useMemo(() => {
    let filtered = normalizedVouchers.filter((v) =>
      isVoucherInCategory(v, selectedCategory),
    );

    if (deferredSearchQuery.trim()) {
      const query = stripVietnameseAccents(deferredSearchQuery);
      filtered = filtered.filter((v) => v.searchText.includes(query));
    }

    // Sort by newest creation date
    return filtered.sort(
      (a, b) => new Date(b.ngayTao || 0) - new Date(a.ngayTao || 0),
    );
  }, [normalizedVouchers, selectedCategory, deferredSearchQuery]);

  const focusSearchResults = () => {
    document.getElementById("latest-vouchers")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen bg-snow-50 text-snow-800 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-sky-500 via-sky-600 to-cyan-600 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2 shadow-inner">
        <Sparkles size={14} className="text-yellow-300 animate-pulse" />
        <span>
          {t(
            "landing.welcome",
            "Chào mừng đến với Snow Voucher — Tuyết Vàng Ưu Đãi, Săn Deal Đóng Băng Giá Đỉnh Nhất!",
          )}
        </span>
        <Sparkles
          size={14}
          className="text-yellow-300 animate-pulse hidden sm:inline"
        />
      </div>

      {/* Main Top Header Navbar */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Website Title */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 group shrink-0 min-w-0"
          >
            <img
              src="/snowflake.png"
              alt=""
              aria-hidden="true"
              className="w-9 h-9 sm:w-11 sm:h-11 object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-2xl tracking-tight bg-gradient-to-r from-sky-600 via-cyan-600 to-sky-700 bg-clip-text text-transparent truncate">
                  Snow Voucher
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full border border-sky-200 hidden sm:inline-block">
                  OFFICIAL
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-400 tracking-wide hidden sm:block">
                {t("Chạm Tay Voucher Xịn — Săn Deal Giá Băng")}
              </p>
            </div>
          </Link>

          {/* Quick Search Input */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && focusSearchResults()}
                placeholder={t(
                  "nav.searchPlaceholder",
                  "Tìm voucher, đối tác hoặc chi nhánh...",
                )}
                aria-label={t(
                  "nav.searchPlaceholder",
                  "Tìm voucher, đối tác hoặc chi nhánh",
                )}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Right Header Navigation & Auth Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <LanguageSwitcher className="[&>button]:!text-sky-800" />
            <Link
              to="/customer/register"
              className="flex items-center gap-1 px-2.5 sm:px-4 py-2 text-xs font-bold text-sky-800 bg-white hover:bg-sky-50 border border-sky-300 rounded-full shadow-sm transition-all cursor-pointer"
            >
              <UserPlus size={14} className="text-sky-700" />
              <span className="hidden sm:inline text-sky-800">
                {t("Đăng ký")}
              </span>
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-1 px-3 sm:px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-full shadow-md shadow-sky-500/25 hover:shadow-lg transition-all cursor-pointer whitespace-nowrap"
            >
              <LogIn size={14} className="text-white" />
              <span className="text-white">{t("Đăng nhập")}</span>
            </Link>
          </div>
        </div>

        <div className="md:hidden px-4 pb-3">
          <div className="relative max-w-7xl mx-auto">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && focusSearchResults()}
              placeholder={t(
                "nav.searchPlaceholder",
                "Tìm voucher, đối tác hoặc chi nhánh...",
              )}
              aria-label={t(
                "nav.searchPlaceholder",
                "Tìm voucher, đối tác hoặc chi nhánh",
              )}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 focus:bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all"
            />
          </div>
        </div>
      </header>

      {/* Hero Section Banner with Sky Blue Background */}
      <section className="hero-snow-gradient relative overflow-hidden text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-xs font-semibold backdrop-blur-md shadow-xs">
              <Flame
                size={14}
                className="text-brand-accent-soft animate-bounce"
              />
              <span>
                {t("Sàn Thương Mại Điện Tử E-Voucher Hàng Đầu Việt Nam")}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Snow Voucher <br />
              <span className="text-white drop-shadow-xs">
                {t("Tuyết Vàng Ưu Đãi — Săn Deal Băng Giá!")}
              </span>
            </h1>

            <p className="text-sky-50 text-base sm:text-lg max-w-2xl leading-relaxed">
              {t(
                "Khám phá hàng ngàn mã giảm giá trực tuyến độc quyền từ các thương hiệu hàng đầu: Ẩm thực, Cà phê, Giải trí, Mua sắm. Thanh toán siêu tốc, nhận mã QR đổi quà tức thì tại chi nhánh!",
              )}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#latest-vouchers"
                className="px-6 py-3.5 rounded-full bg-white hover:bg-sky-50 text-sky-800 font-extrabold text-sm shadow-xl shadow-sky-900/20 hover:shadow-2xl flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>{t("Săn Deal Hot Ngay")}</span>
                <ArrowRight size={16} />
              </a>
              <a
                href="#brands"
                className="px-6 py-3.5 rounded-full bg-sky-700/30 hover:bg-sky-700/40 text-white border border-white/30 font-bold text-sm backdrop-blur-md transition-all cursor-pointer"
              >
                <span>{t("Xem Thương Hiệu Đồng Hành")}</span>
              </a>
            </div>

            {/* Platform Stats Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20 max-w-md mx-auto lg:mx-0">
              <div>
                <p className="text-2xl font-black text-white">100%</p>
                <p className="text-xs  text-white mt-0.5">
                  {t("Voucher Chính Hãng")}
                </p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">50+</p>
                <p className="text-xs  text-white mt-0.5">
                  {t("Đối Tác Uy Tín")}
                </p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">24/7</p>
                <p className="text-xs  text-white mt-0.5">
                  {t("Hỗ Trợ Siêu Tốc")}
                </p>
              </div>
            </div>
          </div>

          {/* Hero Visual Card Carousel / Dynamic Banners */}
          <div className="lg:col-span-5 relative flex justify-center">
            {banners.length > 0 ? (
              <div className="w-full max-w-md bg-white/95 border border-white rounded-3xl p-6 shadow-card backdrop-blur-xl relative space-y-4 text-snow-900 overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-400" />
                    <span className="w-3 h-3 rounded-full bg-yellow-300" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-brand-accent-foreground bg-brand-accent-soft border border-brand-accent-border px-2.5 py-1 rounded-full">
                      📢 {t("BANNER")} ({currentBannerIndex + 1}/
                      {banners.length})
                    </span>
                  </div>
                </div>

                <div className="space-y-3 relative group">
                  {(() => {
                    const banner = banners[currentBannerIndex] || banners[0];
                    const hasImage = Boolean(
                      banner.imageUrl || banner.hinh_anh_url,
                    );
                    return (
                      <div className="space-y-3 relative">
                        {hasImage && (
                          <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative bg-slate-100">
                            <img
                              src={cleanImageUrl(
                                banner.imageUrl || banner.hinh_anh_url,
                              )}
                              alt={banner.title || banner.tieu_de}
                              className="w-full h-full object-cover transition-opacity duration-500"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </div>
                        )}

                        {/* Navigation arrows positioned over container if multiple banners */}
                        {banners.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                setCurrentBannerIndex((prev) =>
                                  prev === 0 ? banners.length - 1 : prev - 1,
                                )
                              }
                              className="absolute left-1 top-1/3 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/60 hover:bg-slate-900/85 text-white flex items-center justify-center transition-all cursor-pointer shadow-md z-10"
                              title={t("Banner trước")}
                            >
                              <ChevronLeft size={18} />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setCurrentBannerIndex(
                                  (prev) => (prev + 1) % banners.length,
                                )
                              }
                              className="absolute right-1 top-1/3 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/60 hover:bg-slate-900/85 text-white flex items-center justify-center transition-all cursor-pointer shadow-md z-10"
                              title={t("Banner tiếp theo")}
                            >
                              <ChevronRight size={18} />
                            </button>
                          </>
                        )}

                        <div className="cursor-default">
                          <h3 className="font-extrabold text-base text-slate-900">
                            {t(banner.title || banner.tieu_de)}
                          </h3>
                          {(banner.content || banner.noi_dung) && (
                            <div
                              className="text-xs text-slate-600 mt-1 line-clamp-3"
                              dangerouslySetInnerHTML={{
                                __html: banner.content || banner.noi_dung,
                              }}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Pagination Dots */}
                  {banners.length > 1 && (
                    <div className="flex items-center justify-center gap-1.5 pt-2">
                      {banners.map((_, i) => (
                        <button
                          type="button"
                          key={i}
                          onClick={() => setCurrentBannerIndex(i)}
                          className={`h-2 rounded-full transition-all cursor-pointer ${currentBannerIndex === i ? "w-6 bg-sky-600" : "w-2 bg-slate-300 hover:bg-slate-400"}`}
                          title={`Chuyển đến banner ${i + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full max-w-md bg-white/90 border border-white rounded-3xl p-6 shadow-card backdrop-blur-xl relative space-y-5 text-snow-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-400" />
                    <span className="w-3 h-3 rounded-full bg-yellow-300" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-xs font-mono font-bold text-brand-accent-foreground bg-brand-accent-soft border border-brand-accent-border px-2.5 py-1 rounded-full">
                    ⚡ HOT DEAL AT SNOW VOUCHER!
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-snow-600">
                    <span className="flex items-center gap-1.5 text-semantic-success font-semibold">
                      <CheckCircle2 size={14} /> {t("Mã QR Sử Dụng Trực Tiếp")}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 1: Các Thương Hiệu Nổi Bật (< Brand Brand Brand > Horizontal Layout) */}
      <section
        id="brands"
        className="py-14 bg-white border-b border-slate-200 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              {t("landing.partnerTitle", "Đối Tác Đồng Hành")}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
              {t("voucher.featuredBrands", "Thương Hiệu Đối Tác Nổi Bật")}
            </h2>
            <p className="text-sm text-slate-700">
              {t(
                "landing.partnerSub",
                "Các doanh nghiệp & chuỗi cửa hàng chính hãng trên hệ thống Snow Voucher",
              )}
            </p>
          </div>

          {/* Layout: [ < Button ] [ Brand Horizontal Slider ] [ > Button ] */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollBrands("left")}
              className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-sky-50 hover:border-sky-400 text-slate-600 hover:text-sky-700 hidden sm:flex items-center justify-center transition-all shadow-xs shrink-0 cursor-pointer"
              title="Xem thương hiệu trước"
            >
              <ChevronLeft size={22} />
            </button>

            <div
              ref={brandScrollRef}
              className="flex-1 flex items-center gap-4 overflow-x-auto scroll-smooth py-3 px-1"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {visibleBrands.length > 0 ? (
                visibleBrands.map((brand, idx) => {
                  const name = brand.ten_dn || brand.name || "Doanh nghiệp";
                  const logo = cleanImageUrl(brand.logo);

                  return (
                    <button
                      type="button"
                      key={brand.ma_hs || brand.id || idx}
                      onClick={() => {
                        setSearchQuery(name);
                        focusSearchResults();
                      }}
                      className="shrink-0 w-40 sm:w-44 bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 p-3.5 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center text-center shadow-2xs hover:shadow-md hover:-translate-y-1 group cursor-pointer"
                      title={`Xem voucher của ${name}`}
                    >
                      <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 p-2 flex items-center justify-center shadow-xs overflow-hidden mb-2 group-hover:scale-105 transition-transform relative">
                        {logo ? (
                          <img
                            src={logo}
                            alt={name}
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              if (e.currentTarget.nextElementSibling) {
                                e.currentTarget.nextElementSibling.style.display =
                                  "flex";
                              }
                            }}
                          />
                        ) : null}
                        <div
                          className="w-full h-full rounded-xl bg-gradient-to-tr from-sky-500 to-sky-700 text-white font-black text-xl flex items-center justify-center shadow-inner"
                          style={{ display: logo ? "none" : "flex" }}
                        >
                          {brand.icon || name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <h3 className="font-bold text-slate-800 text-xs line-clamp-1 group-hover:text-sky-600 transition-colors">
                        {name}
                      </h3>
                    </button>
                  );
                })
              ) : (
                <div className="flex-1 py-8 text-center text-xs text-slate-400">
                  {deferredSearchQuery.trim()
                    ? "Không tìm thấy đối tác hoặc chi nhánh phù hợp."
                    : "Đang tải đối tác từ catalog..."}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => scrollBrands("right")}
              className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-100 hover:border-sky-400 text-slate-600 hover:text-sky-600 hidden sm:flex items-center justify-center transition-all shadow-xs shrink-0 cursor-pointer"
              title="Xem thương hiệu tiếp theo"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: Các Danh Mục Kèm Số Lượng Voucher Đang Mở Bán */}
      <section className="py-14 bg-slate-100/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-accent-foreground bg-brand-accent-soft px-3 py-1 rounded-full border border-brand-accent-border">
                {t("nav.categoryFilter", "Phân Loại Ưu Đãi")}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
                {t("landing.categoryTitle", "Danh Mục Voucher Đang Mở Bán")}
              </h2>
              <p className="text-sm text-slate-700 mt-1">
                {t(
                  "landing.categorySub",
                  "Xem nhanh số lượng voucher chính hãng đang có sẵn theo từng ngành hàng",
                )}
              </p>
            </div>

            {selectedCategory !== "all" && (
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className="text-xs font-bold text-sky-600 hover:text-sky-700 underline cursor-pointer self-start sm:self-auto"
              >
                {t("landing.showAllCategories", "Hiển thị tất cả danh mục")}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.length > 0 ? (
              categories.map((cat) => {
                const catId = cat.ma_danh_muc || cat.id;
                const catName = cat.ten_danh_muc || cat.name || "";

                const count = categoryCounts.get(String(catId || catName)) || 0;
                const isSelected =
                  (catId && selectedCategory === catId) ||
                  (catName &&
                    isVoucherInCategory(
                      { categoryName: catName, ma_danh_muc: catId },
                      selectedCategory,
                    ));

                return (
                  <div
                    key={catId || catName}
                    onClick={() => {
                      const targetVal = catId || catName;
                      if (isSelected && selectedCategory !== "all") {
                        setSelectedCategory("all");
                      } else {
                        setSelectedCategory(targetVal);
                      }
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-36 ${
                      isSelected
                        ? "bg-gradient-to-br from-sky-500 to-sky-700 text-white border-sky-400 shadow-md shadow-sky-500/20 scale-102"
                        : "bg-white text-slate-800 border-slate-200 hover:border-sky-300 hover:shadow-md hover:-translate-y-0.5"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden ${isSelected ? "bg-white/20 text-white" : "bg-sky-50 text-sky-600"}`}
                      >
                        {cat.imageUrl || cat.hinh_anh_url ? (
                          <img
                            src={cat.imageUrl || cat.hinh_anh_url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          "🏷️"
                        )}
                      </div>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}
                      >
                        {count} deal
                      </span>
                    </div>
                    <div>
                      <h3
                        className={`font-bold text-sm line-clamp-1 ${isSelected ? "text-white" : "text-slate-900"}`}
                      >
                        {t(catName)}
                      </h3>
                      <p
                        className={`text-[11px] mt-0.5 font-medium ${isSelected ? "text-sky-100" : "text-slate-400"}`}
                      >
                        {count > 0 ? t("Đang phát hành") : t("Chờ cập nhật")}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-8 text-center text-xs text-slate-400">
                {t("Đang tải danh mục từ hệ thống...")}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 3: Các Voucher Mới Nhất (< Voucher Voucher Voucher > Horizontal Slider Layout) */}
      <section
        id="latest-vouchers"
        className="py-16 bg-white flex-1 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-accent-foreground bg-brand-accent-soft px-3 py-1 rounded-full border border-brand-accent-border">
                {t("Ưu Đãi Mới Cập Nhật")}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
                {t("Các Voucher Mới Nhất")}
              </h2>
              <p className="text-sm text-slate-700 mt-1">
                {t("Săn deal hot vừa phát hành với chiết khấu hấp dẫn")}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center gap-4 overflow-hidden py-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="shrink-0 w-72 h-72 bg-slate-100 animate-pulse rounded-2xl"
                />
              ))}
            </div>
          ) : latestVouchers.length > 0 ? (
            /* Layout: [ < Button ] [ Voucher Horizontal Slider ] [ > Button ] */
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => scrollVouchers("left")}
                className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-100 hover:border-sky-400 text-slate-600 hover:text-sky-600 hidden sm:flex items-center justify-center transition-all shadow-xs shrink-0 cursor-pointer"
                title="Xem voucher trước"
              >
                <ChevronLeft size={22} />
              </button>

              <div
                ref={voucherScrollRef}
                className="flex-1 flex items-center gap-5 overflow-x-auto scroll-smooth py-3 px-1"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {latestVouchers.map((v) => {
                  const giaBan = v.giaBan;
                  const giaGoc = v.giaGoc > giaBan ? v.giaGoc : giaBan;
                  const discountPercent =
                    giaGoc > giaBan
                      ? Math.round(((giaGoc - giaBan) / giaGoc) * 100)
                      : 0;
                  const vLogo = cleanImageUrl(v.logo_dn);

                  return (
                    <div
                      key={v.ma_voucher}
                      onClick={() => navigate(`/vouchers/${v.ma_voucher}`)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          navigate(`/vouchers/${v.ma_voucher}`);
                        }
                      }}
                      role="link"
                      tabIndex={0}
                      className="shrink-0 w-64 sm:w-72 bg-white rounded-2xl border border-slate-200 hover:border-sky-400 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1 group"
                    >
                      {/* Voucher Image & Discount Badge */}
                      <div className="relative aspect-video bg-slate-100 overflow-hidden">
                        <img
                          src={cleanImageUrl(v.hinhAnh)}
                          alt={v.ten_voucher}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop";
                          }}
                        />
                        <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                          {vLogo ? (
                            <img
                              src={vLogo}
                              alt={v.ten_dn}
                              referrerPolicy="no-referrer"
                              loading="lazy"
                              decoding="async"
                              className="w-3.5 h-3.5 rounded-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <span>🏢</span>
                          )}
                          <span className="truncate max-w-[120px]">
                            {v.ten_dn}
                          </span>
                        </div>
                        {discountPercent > 0 && (
                          <div className="absolute top-2.5 right-2.5 bg-brand-accent text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow-md animate-pulse">
                            -{discountPercent}%
                          </div>
                        )}
                      </div>

                      {/* Voucher Details */}
                      <div className="p-4 space-y-2">
                        <h3 className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-sky-600 transition-colors leading-snug">
                          {t(v.ten_voucher)}
                        </h3>

                        <div className="text-xs text-slate-700 line-clamp-1">
                          {t(v.categoryName)}
                        </div>

                        <div className="pt-2 flex items-baseline gap-2">
                          <span className="text-lg font-black text-sky-600">
                            {giaBan.toLocaleString("vi-VN")} ₫
                          </span>
                          {giaGoc > giaBan && (
                            <span className="text-xs text-slate-400 line-through font-medium">
                              {giaGoc.toLocaleString("vi-VN")} ₫
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Action Button */}
                      <div className="p-4 pt-0">
                        <button
                          type="button"
                          className="w-full py-2.5 rounded-xl bg-sky-50 hover:bg-sky-600 text-sky-700 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ShoppingBag size={14} />
                          <span>{t("Xem chi tiết & Săn Deal")}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => scrollVouchers("right")}
                className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-100 hover:border-sky-400 text-slate-600 hover:text-sky-600 hidden sm:flex items-center justify-center transition-all shadow-xs shrink-0 cursor-pointer"
                title="Xem voucher tiếp theo"
              >
                <ChevronRight size={22} />
              </button>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
              <Gift size={40} className="text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-700">
                {t("Chưa tìm thấy voucher phù hợp")}
              </h3>
              <p className="text-xs text-slate-700">
                {t("Hãy thử tìm kiếm với từ khóa khác hoặc bỏ chọn danh mục.")}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-full hover:bg-slate-800 cursor-pointer"
              >
                {t("Đặt lại bộ lọc")}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
