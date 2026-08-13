import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Search,
  Tag,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  LogIn,
  ArrowRight,
  Sparkles,
  Flame,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Gift,
  User,
  LogOut,
  ShoppingBag,
} from "lucide-react";
import { fetchSellingVouchers, fetchCategories } from "../../../../shared/api/catalogApi";
import { getPartnersApi } from "../../../../shared/api/partnerApi";

function cleanImageUrl(url) {
  if (!url || typeof url !== "string") return null;
  let cleaned = url.trim();
  // Strip trailing $0 or invalid trailing characters
  cleaned = cleaned.replace(/\$0$/, "").trim();
  if (cleaned.startsWith("data:") || cleaned.startsWith("http://") || cleaned.startsWith("https://")) {
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
  const navigate = useNavigate();
  const brandScrollRef = useRef(null);
  const voucherScrollRef = useRef(null);

  const [vouchers, setVouchers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user") || localStorage.getItem("ec_auth_user");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch (e) {}

    let ignore = false;
    setLoading(true);

    Promise.allSettled([
      fetchSellingVouchers(),
      fetchCategories(),
      getPartnersApi(),
    ])
      .then(([vRes, cRes, pRes]) => {
        if (ignore) return;
        if (vRes.status === "fulfilled" && Array.isArray(vRes.value)) {
          setVouchers(vRes.value);
        }
        if (cRes.status === "fulfilled" && Array.isArray(cRes.value)) {
          setCategories(cRes.value);
        }
        if (pRes.status === "fulfilled" && Array.isArray(pRes.value)) {
          setPartners(pRes.value);
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("ec_auth_token");
    localStorage.removeItem("ec_auth_user");
    setCurrentUser(null);
    navigate("/login");
  };

  const scrollBrands = (direction) => {
    if (brandScrollRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      brandScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const scrollVouchers = (direction) => {
    if (voucherScrollRef.current) {
      const scrollAmount = direction === "left" ? -360 : 360;
      voucherScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Normalize voucher data across all backend DTO & DB row structures
  const normalizedVouchers = useMemo(() => {
    if (!Array.isArray(vouchers)) return [];
    return vouchers.map((v) => {
      const ma_voucher = v.ma_voucher || v.id;
      const ten_voucher = v.ten_voucher || v.name || "Voucher Ưu Đãi";

      const partnerObj = v.partner || (v.voucher_cn && v.voucher_cn[0]?.chinhanh?.hosodn) || {};
      const ten_dn = v.ten_dn || partnerObj.name || partnerObj.ten_dn || "Thương hiệu đối tác";
      const logo_dn = v.logo || v.logo_url || partnerObj.logo || partnerObj.logo_url;

      const categoryName = v.category || v.ten_danh_muc || v.danh_muc?.ten_danh_muc || "Khác";
      const ma_danh_muc = v.ma_danh_muc || v.categoryId || v.danh_muc_id || v.danh_muc?.ma_danh_muc || categoryName;

      const giaGoc = Number(v.gia_goc ?? v.originalPrice ?? 0);
      const giaBan = Number(v.gia_ban ?? v.salePrice ?? (giaGoc > 0 && v.gia_tri_giam ? giaGoc - Number(v.gia_tri_giam) : giaGoc));

      const hinhAnh = v.image || v.hinh_anh || v.hinh_anh_url || "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop";
      const ngayTao = v.ngay_tao || v.tg_bat_dau_ban || v.createdAt || "";

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
      };
    });
  }, [vouchers]);

  // Read partner profiles directly from DB table hosodn (column `logo`)
  const brandList = useMemo(() => {
    const map = new Map();

    if (Array.isArray(partners)) {
      partners.forEach((p) => {
        const name = p.ten_dn || p.name;
        if (name && !map.has(name.toLowerCase())) {
          map.set(name.toLowerCase(), {
            ma_hs: p.ma_hs || p.id,
            ten_dn: name,
            logo_url: p.logo || p.logo_url || p.hinh_anh,
          });
        }
      });
    }

    normalizedVouchers.forEach((v) => {
      if (v.ten_dn && !map.has(v.ten_dn.toLowerCase())) {
        map.set(v.ten_dn.toLowerCase(), {
          ma_hs: v.ma_voucher,
          ten_dn: v.ten_dn,
          logo_url: v.logo_dn,
        });
      }
    });

    if (map.size === 0) {
      [
        { name: "CGV Cinemas", icon: "🎬" },
        { name: "Highlands Coffee", icon: "☕" },
        { name: "Starbucks", icon: "🍵" },
        { name: "GrabFood", icon: "🛵" },
        { name: "Shopee", icon: "🛒" },
        { name: "Phúc Long", icon: "🧋" },
        { name: "Haidilao Hotpot", icon: "🍲" },
        { name: "Kichi Kichi", icon: "🍣" },
        { name: "Golden Gate", icon: "🍖" },
        { name: "Lotteria", icon: "🍔" },
      ].forEach((b) => {
        map.set(b.name.toLowerCase(), { ma_hs: b.name, ten_dn: b.name, icon: b.icon });
      });
    }

    return Array.from(map.values());
  }, [partners, normalizedVouchers]);

  // Robust category matching function (UUID + exact text + accent-insensitive text match)
  const isVoucherInCategory = (v, target) => {
    if (!target || target === "all") return true;

    const targetStr = String(target).trim().toLowerCase();
    const vId = String(v.ma_danh_muc || "").trim().toLowerCase();
    const vName = String(v.categoryName || "").trim().toLowerCase();

    // 1. UUID Match
    if (vId && vId === targetStr) return true;

    // 2. Exact Text Match
    if (vName && (vName === targetStr || vName.includes(targetStr) || targetStr.includes(vName))) return true;

    // 3. Accent-insensitive Match
    const cleanTarget = stripVietnameseAccents(targetStr);
    const cleanVName = stripVietnameseAccents(vName);
    if (cleanVName && cleanTarget && (cleanVName === cleanTarget || cleanVName.includes(cleanTarget) || cleanTarget.includes(cleanVName))) {
      return true;
    }

    return false;
  };

  // Helper to count vouchers for a specific category
  const countVouchersForCategory = (cat) => {
    const catId = cat.ma_danh_muc || cat.id;
    const catName = cat.ten_danh_muc || cat.name || "";

    return normalizedVouchers.filter((v) => {
      if (catId && isVoucherInCategory(v, catId)) return true;
      if (catName && isVoucherInCategory(v, catName)) return true;
      return false;
    }).length;
  };

  // Filtered vouchers for landing page showcase
  const latestVouchers = useMemo(() => {
    let filtered = normalizedVouchers.filter((v) => isVoucherInCategory(v, selectedCategory));

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const qClean = stripVietnameseAccents(q);
      filtered = filtered.filter((v) => {
        const titleClean = stripVietnameseAccents(v.ten_voucher);
        const brandClean = stripVietnameseAccents(v.ten_dn);
        const catClean = stripVietnameseAccents(v.categoryName);
        return (
          v.ten_voucher.toLowerCase().includes(q) ||
          v.ten_dn.toLowerCase().includes(q) ||
          v.categoryName.toLowerCase().includes(q) ||
          titleClean.includes(qClean) ||
          brandClean.includes(qClean) ||
          catClean.includes(qClean)
        );
      });
    }

    // Sort by newest creation date
    return filtered.sort((a, b) => new Date(b.ngayTao || 0) - new Date(a.ngayTao || 0));
  }, [normalizedVouchers, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-sky-400 via-sky-500 to-blue-500 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2 shadow-inner">
        <Sparkles size={14} className="text-yellow-300 animate-pulse" />
        <span>Chào mừng đến với <strong>Snow Voucher</strong> — Tuyết Vàng Ưu Đãi, Săn Deal Đóng Băng Giá Đỉnh Nhất 2026!</span>
        <Sparkles size={14} className="text-yellow-300 animate-pulse hidden sm:inline" />
      </div>

      {/* Main Top Header Navbar */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo & Website Title */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-300">
              <span className="text-2xl">❄️</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Snow Voucher
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full border border-sky-200">
                  OFFICIAL
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-400 tracking-wide">
                Chạm Tay Voucher Xịn — Săn Deal Giá Băng
              </p>
            </div>
          </Link>

          {/* Quick Search Input */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm tên Voucher, Thương hiệu, Nhà hàng..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Right Header Navigation & Auth Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (currentUser.vai_tro_he_thong === "ADMIN" || currentUser.vai_tro === "ADMIN") {
                      navigate("/admin/overview");
                    } else if (currentUser.vai_tro_he_thong?.includes("PARTNER") || currentUser.ma_hsdn) {
                      navigate("/partner/reports");
                    } else {
                      navigate("/customer/vouchers/my");
                    }
                  }}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3.5 py-2 rounded-full text-xs font-bold text-slate-700 transition-all cursor-pointer"
                >
                  <User size={15} className="text-sky-600" />
                  <span className="max-w-[120px] truncate">{currentUser.ho_ten || currentUser.ten_dang_nhap || "Tài khoản"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                  title="Đăng xuất"
                >
                  <LogOut size={17} />
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 rounded-full shadow-md shadow-sky-500/25 hover:shadow-lg transition-all cursor-pointer"
                >
                  <LogIn size={15} />
                  <span>Đăng nhập</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section Banner with Sky Blue Background */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-xs font-semibold backdrop-blur-md shadow-xs">
              <Flame size={14} className="text-yellow-300 animate-bounce" />
              <span>Sàn Thương Mại Điện Tử E-Voucher Hàng Đầu Việt Nam</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Snow Voucher <br />
              <span className="bg-gradient-to-r from-yellow-200 via-amber-100 to-yellow-300 bg-clip-text text-transparent drop-shadow-xs">
                Tuyết Vàng Ưu Đãi — Săn Deal Băng Giá!
              </span>
            </h1>

            <p className="text-sky-50 text-base sm:text-lg max-w-2xl leading-relaxed">
              Khám phá hàng ngàn mã giảm giá trực tuyến độc quyền từ các thương hiệu hàng đầu: Ẩm thực, Cà phê, Giải trí, Mua sắm. Thanh toán siêu tốc, nhận mã QR đổi quà tức thì tại chi nhánh!
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#latest-vouchers"
                className="px-6 py-3.5 rounded-full bg-white hover:bg-sky-50 text-sky-800 font-extrabold text-sm shadow-xl shadow-sky-900/20 hover:shadow-2xl flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Săn Deal Hot Ngay</span>
                <ArrowRight size={16} />
              </a>
              <a
                href="#brands"
                className="px-6 py-3.5 rounded-full bg-sky-600/30 hover:bg-sky-600/50 text-white border border-white/30 font-bold text-sm backdrop-blur-md transition-all cursor-pointer"
              >
                <span>Xem Thương Hiệu Đồng Hành</span>
              </a>
            </div>

            {/* Platform Stats Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20 max-w-md mx-auto lg:mx-0">
              <div>
                <p className="text-2xl font-black text-white">100%</p>
                <p className="text-xs text-sky-100 mt-0.5">Voucher Chính Hãng</p>
              </div>
              <div>
                <p className="text-2xl font-black text-yellow-200">500+</p>
                <p className="text-xs text-sky-100 mt-0.5">Đối Tác Uy Tín</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">24/7</p>
                <p className="text-xs text-sky-100 mt-0.5">Hỗ Trợ Siêu Tốc</p>
              </div>
            </div>
          </div>

          {/* Hero Visual Card Carousel Mockup */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="w-full max-w-md bg-white/15 border border-white/30 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative space-y-5 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-yellow-300" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <span className="text-xs font-mono font-bold text-white bg-white/20 border border-white/30 px-2.5 py-1 rounded-full">
                  ⚡ HOT DEAL IN TOWN
                </span>
              </div>

              <div className="aspect-video bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-700 rounded-2xl p-5 text-white relative overflow-hidden flex flex-col justify-between shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-sky-200">Snow Special</p>
                    <p className="text-xl font-black mt-0.5">E-VOUCHER BUFFET LẨU</p>
                  </div>
                  <span className="bg-yellow-400 text-slate-950 font-black text-xs px-2.5 py-1 rounded-lg shadow-sm">
                    GIẢM 40%
                  </span>
                </div>
                <div className="flex justify-between items-end pt-4">
                  <div>
                    <p className="text-[10px] opacity-80">Giá độc quyền Snow Voucher</p>
                    <p className="text-2xl font-black">299.000 ₫</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-xl">
                    🍲
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-sky-100">
                  <span className="flex items-center gap-1.5 text-yellow-300 font-semibold">
                    <CheckCircle2 size={14} /> Mã QR Sử Dụng Trực Tiếp
                  </span>
                  <span className="text-sky-100">Đã bán 1.2k+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: Các Thương Hiệu Nổi Bật (< Brand Brand Brand > Horizontal Layout) */}
      <section id="brands" className="py-14 bg-white border-b border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              Đối Tác Đồng Hành
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
              Thương Hiệu Đối Tác Nổi Bật
            </h2>
            <p className="text-sm text-slate-500">
              Các doanh nghiệp & chuỗi cửa hàng chính hãng trên hệ thống Snow Voucher
            </p>
          </div>

          {/* Layout: [ < Button ] [ Brand Horizontal Slider ] [ > Button ] */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollBrands("left")}
              className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-100 hover:border-sky-400 text-slate-600 hover:text-sky-600 flex items-center justify-center transition-all shadow-xs shrink-0 cursor-pointer"
              title="Xem thương hiệu trước"
            >
              <ChevronLeft size={22} />
            </button>

            <div
              ref={brandScrollRef}
              className="flex-1 flex items-center gap-4 overflow-x-auto scroll-smooth py-3 px-1"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {brandList.map((brand, idx) => {
                const name = brand.ten_dn || brand.name || "Doanh nghiệp";
                const logo = cleanImageUrl(brand.logo_url || brand.logo);

                return (
                  <div
                    key={brand.ma_hs || brand.id || idx}
                    className="shrink-0 w-40 sm:w-44 bg-slate-50 hover:bg-white border border-slate-200 hover:border-sky-400 p-3.5 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center text-center shadow-2xs hover:shadow-md hover:-translate-y-1 group cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 p-2 flex items-center justify-center shadow-xs overflow-hidden mb-2 group-hover:scale-105 transition-transform relative">
                      {logo ? (
                        <img
                          src={logo}
                          alt={name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            if (e.currentTarget.nextElementSibling) {
                              e.currentTarget.nextElementSibling.style.display = "flex";
                            }
                          }}
                        />
                      ) : null}
                      <div
                        className="w-full h-full rounded-xl bg-gradient-to-tr from-sky-400 to-blue-500 text-white font-black text-xl flex items-center justify-center shadow-inner"
                        style={{ display: logo ? "none" : "flex" }}
                      >
                        {brand.icon || name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <h3 className="font-bold text-slate-800 text-xs line-clamp-1 group-hover:text-sky-600 transition-colors">
                      {name}
                    </h3>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => scrollBrands("right")}
              className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-100 hover:border-sky-400 text-slate-600 hover:text-sky-600 flex items-center justify-center transition-all shadow-xs shrink-0 cursor-pointer"
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
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                Phân Loại Ưu Đãi
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
                Danh Mục Voucher Đang Mở Bán
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Xem nhanh số lượng voucher chính hãng đang có sẵn theo từng ngành hàng
              </p>
            </div>

            {selectedCategory !== "all" && (
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className="text-xs font-bold text-sky-600 hover:text-sky-700 underline cursor-pointer self-start sm:self-auto"
              >
                Hiển thị tất cả danh mục
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.length > 0
              ? categories.map((cat) => {
                  const catId = cat.ma_danh_muc || cat.id;
                  const catName = cat.ten_danh_muc || cat.name || "";

                  const count = countVouchersForCategory(cat);
                  const isSelected =
                    (catId && selectedCategory === catId) ||
                    (catName && isVoucherInCategory({ categoryName: catName, ma_danh_muc: catId }, selectedCategory));

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
                          ? "bg-gradient-to-br from-sky-500 to-blue-600 text-white border-sky-400 shadow-md shadow-sky-500/20 scale-102"
                          : "bg-white text-slate-800 border-slate-200 hover:border-sky-300 hover:shadow-md hover:-translate-y-0.5"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${isSelected ? "bg-white/20 text-white" : "bg-sky-50 text-sky-600"}`}>
                          🏷️
                        </div>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
                          {count} deal
                        </span>
                      </div>
                      <div>
                        <h3 className={`font-bold text-sm line-clamp-1 ${isSelected ? "text-white" : "text-slate-900"}`}>
                          {catName}
                        </h3>
                        <p className={`text-[11px] mt-0.5 font-medium ${isSelected ? "text-sky-100" : "text-slate-400"}`}>
                          {count > 0 ? "Đang phát hành" : "Chờ cập nhật"}
                        </p>
                      </div>
                    </div>
                  );
                })
              : [
                  { name: "Ẩm Thực & Nhà Hàng", icon: "🍲" },
                  { name: "Cà Phê & Đồ Uống", icon: "☕" },
                  { name: "Giải Trí & Phim", icon: "🎬" },
                  { name: "Mua Sắm & Siêu Thị", icon: "🛒" },
                  { name: "Du Lịch & Vé Khoang", icon: "✈️" },
                  { name: "Sức Khỏe & Làm Đẹp", icon: "💅" },
                ].map((demoCat) => {
                  const count = countVouchersForCategory(demoCat);
                  const isSelected = isVoucherInCategory({ categoryName: demoCat.name }, selectedCategory);

                  return (
                    <div
                      key={demoCat.name}
                      onClick={() => {
                        setSelectedCategory(isSelected && selectedCategory !== "all" ? "all" : demoCat.name);
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-36 ${
                        isSelected
                          ? "bg-gradient-to-br from-sky-500 to-blue-600 text-white border-sky-400 shadow-md scale-102"
                          : "bg-white border-slate-200 hover:border-sky-300 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${isSelected ? "bg-white/20 text-white" : "bg-sky-50 text-sky-600"}`}>
                          {demoCat.icon}
                        </div>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
                          {count} deal
                        </span>
                      </div>
                      <div>
                        <h3 className={`font-bold text-sm line-clamp-1 ${isSelected ? "text-white" : "text-slate-900"}`}>
                          {demoCat.name}
                        </h3>
                        <p className={`text-[11px] mt-0.5 font-medium ${isSelected ? "text-sky-100" : "text-slate-400"}`}>
                          {count > 0 ? "Đang phát hành" : "Chờ cập nhật"}
                        </p>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </section>

      {/* SECTION 3: Các Voucher Mới Nhất (< Voucher Voucher Voucher > Horizontal Slider Layout) */}
      <section id="latest-vouchers" className="py-16 bg-white flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Ưu Đãi Mới Cập Nhật
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
                Các Voucher Mới Nhất
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Săn deal hot vừa phát hành với chiết khấu hấp dẫn
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center gap-4 overflow-hidden py-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="shrink-0 w-72 h-72 bg-slate-100 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : latestVouchers.length > 0 ? (
            /* Layout: [ < Button ] [ Voucher Horizontal Slider ] [ > Button ] */
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => scrollVouchers("left")}
                className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-100 hover:border-sky-400 text-slate-600 hover:text-sky-600 flex items-center justify-center transition-all shadow-xs shrink-0 cursor-pointer"
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
                  const discountPercent = giaGoc > giaBan ? Math.round(((giaGoc - giaBan) / giaGoc) * 100) : 0;
                  const vLogo = cleanImageUrl(v.logo_dn);

                  return (
                    <div
                      key={v.ma_voucher}
                      onClick={() => navigate(`/customer/vouchers/${v.ma_voucher}`)}
                      className="shrink-0 w-64 sm:w-72 bg-white rounded-2xl border border-slate-200 hover:border-sky-400 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1 group"
                    >
                      {/* Voucher Image & Discount Badge */}
                      <div className="relative aspect-video bg-slate-100 overflow-hidden">
                        <img
                          src={cleanImageUrl(v.hinhAnh)}
                          alt={v.ten_voucher}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop";
                          }}
                        />
                        <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                          {vLogo ? (
                            <img
                              src={vLogo}
                              alt={v.ten_dn}
                              referrerPolicy="no-referrer"
                              className="w-3.5 h-3.5 rounded-full object-cover"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                          ) : (
                            <span>🏢</span>
                          )}
                          <span className="truncate max-w-[120px]">{v.ten_dn}</span>
                        </div>
                        {discountPercent > 0 && (
                          <div className="absolute top-2.5 right-2.5 bg-red-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow-md animate-pulse">
                            -{discountPercent}%
                          </div>
                        )}
                      </div>

                      {/* Voucher Details */}
                      <div className="p-4 space-y-2">
                        <h3 className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-sky-600 transition-colors leading-snug">
                          {v.ten_voucher}
                        </h3>
                        
                        <div className="text-xs text-slate-500 line-clamp-1">
                          {v.categoryName}
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
                          <span>Xem chi tiết & Săn Deal</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => scrollVouchers("right")}
                className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-100 hover:border-sky-400 text-slate-600 hover:text-sky-600 flex items-center justify-center transition-all shadow-xs shrink-0 cursor-pointer"
                title="Xem voucher tiếp theo"
              >
                <ChevronRight size={22} />
              </button>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
              <Gift size={40} className="text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-700">Chưa tìm thấy voucher phù hợp</h3>
              <p className="text-xs text-slate-500">Hãy thử tìm kiếm với từ khóa khác hoặc bỏ chọn danh mục.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-full hover:bg-slate-800 cursor-pointer"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER SECTION: Thông tin liên hệ & Điều khoản chính sách */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-400 to-blue-500 flex items-center justify-center text-white text-sm">
                ❄️
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                Snow Voucher
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug max-w-xs">
              Sàn e-voucher hàng đầu Việt Nam. Cam kết 100% voucher chính hãng & đổi quà trực tiếp.
            </p>
          </div>

          {/* Contact Information Requested */}
          <div className="md:col-span-5 space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Mail size={13} className="text-sky-400 shrink-0" />
              <span><strong className="text-slate-200">Email:</strong> nkngan23@clc.fitus.edu.vn</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={13} className="text-sky-400 shrink-0" />
              <span><strong className="text-slate-200">SĐT:</strong> 0967456832</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={13} className="text-sky-400 shrink-0" />
              <span><strong className="text-slate-200">Địa chỉ:</strong> 227 Nguyễn Văn Cừ, Chợ Quán, TP. Hồ Chí Minh</span>
            </div>
          </div>

          {/* Terms & Policy Link Requested */}
          <div className="md:col-span-3 flex flex-col md:items-end justify-center space-y-1">
            <Link
              to="/policy"
              className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 transition-colors font-bold py-1 cursor-pointer underline decoration-sky-500/40"
            >
              <ArrowRight size={14} />
              <span>Điều khoản & Chính sách sàn</span>
            </Link>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-800/80 py-2.5 px-4 text-center text-[11px] text-slate-500">
          © 2026 Snow Voucher. All rights reserved. EC07-23HTTT-HCMUS.
        </div>
      </footer>
    </div>
  );
}
