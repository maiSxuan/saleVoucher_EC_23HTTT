import { useState, useEffect, useMemo, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Calendar,
} from "lucide-react";
import { fetchSellingVouchers } from "../../../../shared/api/catalogApi";
import { contentApi } from "../../../../features/content-feedback/api/contentApi";
import VoucherCard from "../../components/VoucherCard";
import { useTranslation } from "react-i18next";

function cleanImageUrl(url) {
  if (!url || typeof url !== "string") return null;
  const cleaned = url.trim();
  return cleaned.includes("$0") ? cleaned.split("$0")[0].trim() : cleaned;
}

export default function VoucherSearchPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const brandScrollRef = useRef(null);

  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [priceRange, setPriceRange] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Dynamic banners & articles state
  const [banners, setBanners] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [articles, setArticles] = useState([]);

  const {
    searchValue,
    activeCategory,
    activePartner = "",
  } = useOutletContext();

  useEffect(() => {
    let ignore = false;

    const loadVouchersData = () => {
      setLoading(true);
      setErrorMsg("");
      fetchSellingVouchers()
        .then((data) => !ignore && setVouchers(data))
        .catch(
          () =>
            !ignore &&
            setErrorMsg(
              "Không thể tải danh sách voucher. Vui lòng thử lại sau.",
            ),
        )
        .finally(() => !ignore && setLoading(false));
    };

    loadVouchersData();

    const loadBannersAndArticles = () => {
      const lang = localStorage.getItem("app_lang") || localStorage.getItem("i18nextLng") || "vi";
      contentApi
        .list("banner", lang)
        .then((res) => {
          if (!ignore) {
            const list = Array.isArray(res) ? res : (res.data || []);
            const active = list.filter(
              (b) => {
                const st = b.status || b.trang_thai;
                return st === "visible" || st === "Dang hien thi" || !st;
              }
            );
            setBanners(active);
          }
        })
        .catch(() => {});

      contentApi
        .list("bai_viet", lang)
        .then((res) => {
          if (!ignore) {
            const list = Array.isArray(res) ? res : (res.data || []);
            const active = list.filter(
              (a) => {
                const st = a.status || a.trang_thai;
                return st === "visible" || st === "Dang hien thi" || !st;
              }
            );
            setArticles(active);
          }
        })
        .catch(() => {});
    };

    loadVouchersData();
    loadBannersAndArticles();

    const handleLangChange = () => {
      loadVouchersData();
      loadBannersAndArticles();
    };

    window.addEventListener("app_language_changed", handleLangChange);

    return () => {
      ignore = true;
      window.removeEventListener("app_language_changed", handleLangChange);
    };
  }, []);

  // Auto-slide banner every 5 seconds, resets timer on manual change
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length, currentBannerIndex]);

  const filtered = useMemo(() => {
    return vouchers
      .filter((v) => {
        const kw = searchValue.trim().toLowerCase();
        const partnerStr =
          typeof v.partner === "object" && v.partner !== null
            ? v.partner.ten_dn || v.partner.name || ""
            : v.partner || "";

        const matchBranch =
          Array.isArray(v.branches) &&
          v.branches.some((b) => (b.name || "").toLowerCase().includes(kw));

        const matchSearch =
          !kw ||
          (v.name || "").toLowerCase().includes(kw) ||
          partnerStr.toLowerCase().includes(kw) ||
          matchBranch;

        const matchCat =
          activeCategory === "Tất cả" || v.category === activeCategory;
        const matchPartner = !activePartner || partnerStr === activePartner;
        let matchPrice = true;
        if (priceRange === "under200") matchPrice = v.salePrice < 200000;
        else if (priceRange === "200-500")
          matchPrice = v.salePrice >= 200000 && v.salePrice <= 500000;
        else if (priceRange === "over500") matchPrice = v.salePrice > 500000;
        return matchSearch && matchCat && matchPartner && matchPrice;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.salePrice - b.salePrice;
        if (sortBy === "price-desc") return b.salePrice - a.salePrice;
        return 0;
      });
  }, [
    vouchers,
    searchValue,
    activeCategory,
    activePartner,
    priceRange,
    sortBy,
  ]);

  const [currentPage, setCurrentPage] = useState(1);

  // Reset page to 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, activeCategory, activePartner, priceRange, sortBy]);

  const pageSize = 12;
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedVouchers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  const brandList = useMemo(() => {
    const brands = new Map();

    vouchers.forEach((voucher) => {
      const partner = voucher.partner;
      const name =
        typeof partner === "object" && partner !== null
          ? partner.name || partner.ten_dn
          : partner || voucher.ten_dn;

      if (!name) return;

      const key = String(partner?.id || name).trim().toLocaleLowerCase("vi");
      const logo = partner?.logo || voucher.logo || voucher.logo_dn || null;
      const current = brands.get(key);

      if (!current) {
        brands.set(key, {
          id: partner?.id || key,
          name,
          logo,
        });
      } else if (!current.logo && logo) {
        current.logo = logo;
      }
    });

    return [...brands.values()];
  }, [vouchers]);

  const scrollBrands = (direction) => {
    brandScrollRef.current?.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  const selectBrand = (name) => {
    setSearchValue(name);
    setActiveCategory("Tất cả");
    requestAnimationFrame(() => {
      document.getElementById("customer-voucher-results")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  if (loading)
    return (
      <div className="py-24 text-center text-snow-600 text-base font-medium">
        {t("Đang tìm kiếm voucher...")}
      </div>
    );
  if (errorMsg)
    return (
      <div className="py-24 text-center text-semantic-error text-base font-medium">
        {t(errorMsg)}
      </div>
    );

  const currentBanner = banners[currentBannerIndex];
  const bannerImg = currentBanner?.imageUrl || currentBanner?.hinh_anh_url;

  return (
    <div className="space-y-6">
      {/* Dynamic Hero Banner Carousel với ảnh nền và lớp phủ tối ưu không che chữ */}
      {banners.length > 0 && currentBanner && (
        <div className="rounded-3xl relative overflow-hidden shadow-lg transition-all duration-500 min-h-[300px] flex items-center bg-gray-900 text-white">
          {bannerImg ? (
            <div className="absolute inset-0 z-0">
              <img
                src={bannerImg}
                alt={currentBanner.title}
                className="w-full h-full object-cover opacity-75 scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
            </div>
          ) : (
            <div className="hero-snow-gradient absolute inset-0 z-0" />
          )}

          <div className="relative z-10 p-6 sm:p-10 max-w-xl">
            <span className="inline-block px-3 py-1 rounded-full bg-white/25 text-xs font-semibold uppercase tracking-wider mb-3 backdrop-blur-sm shadow-xs">
              {t("✨ Tin nổi bật")}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold mb-3 leading-tight drop-shadow-md">
              {t(currentBanner.title)}
            </h1>
            <p className="text-sm sm:text-base opacity-95 leading-relaxed drop-shadow-md line-clamp-3">
              {t(currentBanner.content)}
            </p>
          </div>

          {/* Carousel Controls (Arrows & Dots) nếu có từ 2 banner trở lên */}
          {banners.length > 1 && (
            <>
              <button
                onClick={() =>
                  setCurrentBannerIndex(
                    (prev) => (prev - 1 + banners.length) % banners.length,
                  )
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors backdrop-blur-sm z-20 cursor-pointer"
                title={t("Banner trước")}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() =>
                  setCurrentBannerIndex((prev) => (prev + 1) % banners.length)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors backdrop-blur-sm z-20 cursor-pointer"
                title={t("Banner tiếp")}
              >
                <ChevronRight size={20} />
              </button>

              <div className="absolute bottom-4 right-6 flex items-center gap-1.5 z-20">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentBannerIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentBannerIndex === idx
                        ? "w-6 bg-white"
                        : "w-2 bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Bản sao khối thương hiệu nổi bật từ landing page */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white py-10 shadow-card">
        <div className="space-y-6 px-4 sm:px-6">
          <div className="space-y-1">
            <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-sky-600">
              {t("landing.partnerTitle", "Đối Tác Đồng Hành")}
            </span>
            <h2 className="pt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {t("voucher.featuredBrands", "Thương Hiệu Đối Tác Nổi Bật")}
            </h2>
            <p className="text-sm text-slate-500">
              {t(
                "landing.partnerSub",
                "Các doanh nghiệp & chuỗi cửa hàng chính hãng trên hệ thống Snow Voucher",
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollBrands("left")}
              className="hidden h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-xs transition-all hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700 sm:flex"
              title={t("Xem thương hiệu trước")}
              aria-label={t("Xem thương hiệu trước")}
            >
              <ChevronLeft size={22} />
            </button>

            <div
              ref={brandScrollRef}
              className="flex flex-1 items-center gap-4 overflow-x-auto scroll-smooth px-1 py-3"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {brandList.length > 0 ? (
                brandList.map((brand) => {
                  const logo = cleanImageUrl(brand.logo);
                  return (
                    <button
                      type="button"
                      key={brand.id}
                      onClick={() => selectBrand(brand.name)}
                      className="group flex w-40 shrink-0 cursor-pointer flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-center shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:bg-sky-50 hover:shadow-md sm:w-44"
                      title={`${t("Xem voucher của")} ${brand.name}`}
                    >
                      <div className="relative mb-2 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xs transition-transform group-hover:scale-105">
                        {logo ? (
                          <img
                            src={logo}
                            alt={brand.name}
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-contain"
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                              if (event.currentTarget.nextElementSibling) {
                                event.currentTarget.nextElementSibling.style.display = "flex";
                              }
                            }}
                          />
                        ) : null}
                        <div
                          className="flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-sky-700 text-xl font-black text-white shadow-inner"
                          style={{ display: logo ? "none" : "flex" }}
                        >
                          {brand.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <h3 className="line-clamp-1 text-xs font-bold text-slate-800 transition-colors group-hover:text-sky-600">
                        {brand.name}
                      </h3>
                    </button>
                  );
                })
              ) : (
                <div className="flex-1 py-8 text-center text-xs text-slate-400">
                  {t("Chưa có đối tác nổi bật trong catalog.")}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => scrollBrands("right")}
              className="hidden h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-xs transition-all hover:border-sky-400 hover:bg-slate-100 hover:text-sky-600 sm:flex"
              title={t("Xem thương hiệu tiếp theo")}
              aria-label={t("Xem thương hiệu tiếp theo")}
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </section>

      {/* Toolbar Lọc và Sắp xếp */}
      <div id="customer-voucher-results" className="flex scroll-mt-28 items-center gap-3">
        <button
          onClick={() => setShowFilters((s) => !s)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
            showFilters
              ? "bg-sky-50 border-sky-300 text-sky-800"
              : "bg-white border-slate-200 text-snow-700 hover:bg-sky-50"
          }`}
        >
          <SlidersHorizontal size={15} /> {t("Bộ lọc")}
        </button>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-slate-200 rounded-xl px-3.5 py-2 text-sm bg-white text-snow-700 focus:outline-none focus:ring-2 focus:ring-sky-300"
        >
          <option value="newest">{t("Mới nhất")}</option>
          <option value="price-asc">{t("Giá tăng dần")}</option>
          <option value="price-desc">{t("Giá giảm dần")}</option>
        </select>
        <span className="ml-auto text-sm text-snow-600 font-medium">
          {filtered.length} {t("kết quả")}
        </span>
      </div>

      {showFilters && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-card">
          <p className="text-sm font-semibold text-snow-800 mb-2.5">
            {t("Khoảng giá")}
          </p>
          <div className="flex gap-2.5 flex-wrap">
            {[
              { value: "", label: t("Tất cả") },
              { value: "under200", label: t("Dưới 200K") },
              { value: "200-500", label: t("200K–500K") },
              { value: "over500", label: t("Trên 500K") },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setPriceRange(opt.value)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  priceRange === opt.value
                    ? "bg-sky-600 text-white shadow-soft"
                    : "bg-snow-100 text-snow-600 hover:bg-sky-50 hover:text-sky-800"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Danh sách Voucher */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center text-snow-500 shadow-card">
          <p className="text-base font-semibold">
            {t("Không tìm thấy voucher phù hợp.")}
          </p>
          <p className="text-sm mt-1">
            {t("Hãy thử tìm kiếm với từ khóa hoặc danh mục khác.")}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedVouchers.map((voucher) => (
              <VoucherCard
                key={voucher.id}
                voucher={voucher}
                onClick={() => navigate(`/customer/vouchers/${voucher.id}`)}
              />
            ))}
          </div>

          {/* Phân trang (Pagination) */}
          {totalPages > 1 && (() => {
            const blockSize = 6;
            const currentBlock = Math.floor((currentPage - 1) / blockSize);
            const totalBlocks = Math.ceil(totalPages / blockSize);
            const visiblePages = Array.from(
              { length: Math.min(blockSize, totalPages - currentBlock * blockSize) },
              (_, i) => currentBlock * blockSize + i + 1
            );
            const hasPrevBlock = currentBlock > 0;
            const hasNextBlock = currentBlock < totalBlocks - 1;

            return (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-2 border-t border-slate-200 mt-8">
                <p className="text-sm text-slate-500 font-medium">
                  {t("Hiển thị")} {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filtered.length)} {t("trên tổng số")} {filtered.length} {t("voucher")}
                </p>
                <div className="flex items-center gap-1.5">
                  {/* << Chuyển list page trước */}
                  <button
                    type="button"
                    onClick={() => {
                      if (hasPrevBlock) {
                        const newPage = (currentBlock - 1) * blockSize + 1;
                        setCurrentPage(newPage);
                        document.getElementById("customer-voucher-results")?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    disabled={!hasPrevBlock}
                    className="px-2.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-sky-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all shadow-xs"
                    title={t("Danh sách trang trước (<<)")}
                  >
                    &lt;&lt;
                  </button>

                  {/* < Trang trước */}
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPage((p) => Math.max(1, p - 1));
                      document.getElementById("customer-voucher-results")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    disabled={currentPage <= 1}
                    className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-sky-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all shadow-xs"
                    title={t("Trang trước (<)")}
                  >
                    &lt;
                  </button>
                  
                  {/* Các số trang với 1 ... ở đầu nếu ở block sau và ... N ở cuối */}
                  <div className="flex items-center gap-1">
                    {currentBlock > 0 && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentPage(1);
                            document.getElementById("customer-voucher-results")?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="w-9 h-9 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-sky-50 hover:text-sky-700 cursor-pointer transition-all"
                        >
                          1
                        </button>
                        <span className="px-1 text-slate-400 font-bold">...</span>
                      </>
                    )}

                    {visiblePages.map((page) => (
                      <button
                        type="button"
                        key={page}
                        onClick={() => {
                          setCurrentPage(page);
                          document.getElementById("customer-voucher-results")?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          currentPage === page
                            ? "bg-sky-600 text-white shadow-soft"
                            : "bg-white border border-slate-200 text-slate-700 hover:bg-sky-50 hover:text-sky-700"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    {(currentBlock + 1) * blockSize < totalPages && (
                      <>
                        <span className="px-1 text-slate-400 font-bold">...</span>
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentPage(totalPages);
                            document.getElementById("customer-voucher-results")?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className={`w-9 h-9 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-sky-50 hover:text-sky-700 cursor-pointer transition-all`}
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  {/* > Trang sau */}
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                      document.getElementById("customer-voucher-results")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    disabled={currentPage >= totalPages}
                    className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-sky-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all shadow-xs"
                    title={t("Trang sau (>)")}
                  >
                    &gt;
                  </button>

                  {/* >> Chuyển list page tiếp theo */}
                  <button
                    type="button"
                    onClick={() => {
                      if (hasNextBlock) {
                        const newPage = (currentBlock + 1) * blockSize + 1;
                        setCurrentPage(newPage);
                        document.getElementById("customer-voucher-results")?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    disabled={!hasNextBlock}
                    className="px-2.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-sky-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all shadow-xs"
                    title={t("Danh sách trang tiếp theo (>>)")}
                  >
                    &gt;&gt;
                  </button>
                </div>
              </div>
            );
          })()}
        </>
      )}

      {/* Khối Cẩm nang & Bài viết (Có đường dẫn sang trang chi tiết bài viết) */}
      {articles.length > 0 && (
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="text-brand-accent-foreground" size={22} />
            <h2 className="text-xl font-bold text-snow-900">
              {t("Cẩm nang & Mẹo săn voucher")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((art) => {
              const artImg = art.imageUrl || art.hinh_anh_url;
              return (
                <div
                  key={art.id}
                  onClick={() => navigate(`/customer/articles/${art.id}`)}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-card hover:shadow-soft transition-shadow flex flex-col justify-between cursor-pointer group"
                >
                  {artImg && (
                    <div className="w-full h-44 overflow-hidden bg-gray-100">
                      <img
                        src={artImg}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <span className="inline-block px-2.5 py-1 rounded-md bg-brand-accent-soft text-brand-accent-foreground text-xs font-semibold mb-2">
                        {t("Bài viết hữu ích")}
                      </span>
                      <h3 className="font-bold text-snow-900 text-base mb-2 line-clamp-2 group-hover:text-sky-700 transition-colors">
                        {art.title}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                        {art.content.replace(/<[^>]*>/g, "")}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />{" "}
                        {art.createdAt
                          ? new Date(art.createdAt).toLocaleDateString("vi-VN")
                          : t("Hôm nay")}
                      </span>
                      <span className="text-sky-700 font-semibold group-hover:underline">
                        {t("Đọc tiếp →")}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
