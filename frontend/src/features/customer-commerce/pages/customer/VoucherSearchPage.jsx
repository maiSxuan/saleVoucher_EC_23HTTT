import { useState, useEffect, useMemo } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, BookOpen, Calendar } from "lucide-react";
import { fetchSellingVouchers } from "../../../../shared/api/catalogApi";
import { contentApi } from "../../../../features/content-feedback/api/contentApi";
import VoucherCard from "../../components/VoucherCard";

export default function VoucherSearchPage() {
  const navigate = useNavigate();

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
    setSearchValue,
    activeCategory,
    setActiveCategory,
    categories = [],
  } = useOutletContext();

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setErrorMsg("");

    fetchSellingVouchers()
      .then((data) => !ignore && setVouchers(data))
      .catch(
        () =>
          !ignore &&
          setErrorMsg("Không thể tải danh sách voucher. Vui lòng thử lại sau."),
      )
      .finally(() => !ignore && setLoading(false));

    // Fetch active banners and articles from content management
    contentApi.list("banner")
      .then((res) => {
        if (!ignore) {
          const active = (res.data || []).filter(b => b.status === 'visible' || !b.status);
          setBanners(active);
        }
      })
      .catch(() => {});

    contentApi.list("bai_viet")
      .then((res) => {
        if (!ignore) {
          const active = (res.data || []).filter(a => a.status === 'visible' || !a.status);
          setArticles(active);
        }
      })
      .catch(() => {});

    return () => {
      ignore = true;
    };
  }, []);

  // Auto-slide banner every 5 seconds
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const filtered = useMemo(() => {
    return vouchers
      .filter((v) => {
        const kw = searchValue.trim().toLowerCase();
        const partnerStr = typeof v.partner === 'object' && v.partner !== null 
          ? (v.partner.ten_dn || v.partner.name || "")
          : (v.partner || "");

        const matchSearch =
          !kw ||
          (v.name || "").toLowerCase().includes(kw) ||
          partnerStr.toLowerCase().includes(kw);
        const matchCat =
          activeCategory === "Tất cả" || v.category === activeCategory;
        let matchPrice = true;
        if (priceRange === "under200") matchPrice = v.salePrice < 200000;
        else if (priceRange === "200-500")
          matchPrice = v.salePrice >= 200000 && v.salePrice <= 500000;
        else if (priceRange === "over500") matchPrice = v.salePrice > 500000;
        return matchSearch && matchCat && matchPrice;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.salePrice - b.salePrice;
        if (sortBy === "price-desc") return b.salePrice - a.salePrice;
        return 0;
      });
  }, [vouchers, searchValue, activeCategory, priceRange, sortBy]);

  if (loading)
    return (
      <div className="py-24 text-center text-gray-500 text-base font-medium">
        Đang tìm kiếm voucher...
      </div>
    );
  if (errorMsg)
    return (
      <div className="py-24 text-center text-red-500 text-base font-medium">
        {errorMsg}
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
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 opacity-90" />
          )}

          <div className="relative z-10 p-6 sm:p-10 max-w-xl">
            <span className="inline-block px-3 py-1 rounded-full bg-white/25 text-xs font-semibold uppercase tracking-wider mb-3 backdrop-blur-sm shadow-xs">
              ✨ Tin nổi bật
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold mb-3 leading-tight drop-shadow-md">
              {currentBanner.title}
            </h1>
            <p className="text-sm sm:text-base opacity-95 leading-relaxed drop-shadow-md line-clamp-3">
              {currentBanner.content}
            </p>
          </div>

          {/* Carousel Controls (Arrows & Dots) nếu có từ 2 banner trở lên */}
          {banners.length > 1 && (
            <>
              <button
                onClick={() => setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors backdrop-blur-sm z-20"
                title="Banner trước"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setCurrentBannerIndex((prev) => (prev + 1) % banners.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors backdrop-blur-sm z-20"
                title="Banner tiếp"
              >
                <ChevronRight size={20} />
              </button>

              <div className="absolute bottom-4 right-6 flex items-center gap-1.5 z-20">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentBannerIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      currentBannerIndex === idx ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Toolbar Lọc và Sắp xếp */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowFilters((s) => !s)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
            showFilters
              ? "bg-orange-50 border-orange-300 text-orange-700"
              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <SlidersHorizontal size={15} /> Bộ lọc
        </button>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-200 rounded-xl px-3.5 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200"
        >
          <option value="newest">Mới nhất</option>
          <option value="price-asc">Giá tăng dần</option>
          <option value="price-desc">Giá giảm dần</option>
        </select>
        <span className="ml-auto text-sm text-gray-500 font-medium">
          {filtered.length} kết quả
        </span>
      </div>

      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <p className="text-sm font-semibold text-gray-800 mb-2.5">
            Khoảng giá
          </p>
          <div className="flex gap-2.5 flex-wrap">
            {[
              { value: "", label: "Tất cả" },
              { value: "under200", label: "Dưới 200K" },
              { value: "200-500", label: "200K–500K" },
              { value: "over500", label: "Trên 500K" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setPriceRange(opt.value)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  priceRange === opt.value
                    ? "bg-orange-500 text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
        <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center text-gray-400">
          <p className="text-base font-semibold">Không tìm thấy voucher phù hợp.</p>
          <p className="text-sm mt-1">Hãy thử tìm kiếm với từ khóa hoặc danh mục khác.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((voucher) => (
            <VoucherCard 
              key={voucher.id} 
              voucher={voucher} 
              onClick={() => navigate(`/customer/vouchers/${voucher.id}`)} 
            />
          ))}
        </div>
      )}

      {/* Khối Cẩm nang & Bài viết (Có đường dẫn sang trang chi tiết bài viết) */}
      {articles.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="text-orange-500" size={22} />
            <h2 className="text-xl font-bold text-gray-900">Cẩm nang & Mẹo săn voucher</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((art) => {
              const artImg = art.imageUrl || art.hinh_anh_url;
              return (
                <div 
                  key={art.id} 
                  onClick={() => navigate(`/customer/articles/${art.id}`)}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between cursor-pointer group"
                >
                  {artImg && (
                    <div className="w-full h-44 overflow-hidden bg-gray-100">
                      <img src={artImg} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <span className="inline-block px-2.5 py-1 rounded-md bg-orange-50 text-orange-600 text-xs font-semibold mb-2">
                        Bài viết hữu ích
                      </span>
                      <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                        {art.title}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                        {art.content.replace(/<[^>]*>/g, '')}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {art.createdAt ? new Date(art.createdAt).toLocaleDateString("vi-VN") : "Hôm nay"}
                      </span>
                      <span className="text-orange-600 font-semibold group-hover:underline">
                        Đọc tiếp →
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
