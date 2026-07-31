import { useState, useEffect, useMemo } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, Clock } from "lucide-react";
import { fetchSellingVouchers, fetchCategories } from "../../api/catalogApi";

export default function HomePage() {
  const navigate = useNavigate();

  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [priceRange, setPriceRange] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const { searchValue, setSearchValue, activeCategory, setActiveCategory } =
    useOutletContext();

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
    return () => {
      ignore = true;
    };
  }, []);

  const filtered = useMemo(() => {
    return vouchers
      .filter((v) => {
        const kw = searchValue.trim().toLowerCase();
        const matchSearch =
          !kw ||
          v.name.toLowerCase().includes(kw) ||
          v.partner.toLowerCase().includes(kw);
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

  const discountPct = (v) =>
    Math.round((1 - v.salePrice / v.originalPrice) * 100);
  const remaining = (v) => v.totalQty - v.soldQty;

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

  return (
    <div className="space-y-6">
      {/* Banner lớn hơn, font chữ to & rõ nét */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-md">
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -right-4 -bottom-6 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
        <p className="text-sm sm:text-base font-medium tracking-wide opacity-90 mb-1">
          🔥 Ưu đãi hot hôm nay
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-4 leading-tight">
          Voucher giảm giá đặc biệt <br className="hidden sm:block" />
          lên đến 60%
        </h1>
        <div className="flex gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2.5 text-center min-w-[100px]">
            <p className="text-lg sm:text-xl font-bold">{filtered.length}</p>
            <p className="text-xs sm:text-sm opacity-90">Voucher đang bán</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2.5 text-center min-w-[100px]">
            <p className="text-lg sm:text-xl font-bold">
              {activeCategory.length - 1}
            </p>
            <p className="text-xs sm:text-sm opacity-90">Danh mục</p>
          </div>
        </div>
      </div>

      {/* Filter and Sort Toolbar - Cỡ chữ & nút to chuẩn */}
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
                className={`px-3.5 py-1.5 rounded-lg text-sm border font-medium transition-all ${
                  priceRange === opt.value
                    ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-gray-400">
          <Search size={48} className="mb-3 stroke-1" />
          <p className="text-base font-medium text-gray-600">
            Không tìm thấy voucher phù hợp
          </p>
          <button
            onClick={() => {
              setSearchValue("");
              setActiveCategory("Tất cả");
              setPriceRange("");
            }}
            className="mt-3 text-orange-600 font-semibold text-sm hover:underline"
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            {searchValue ? "Kết quả tìm kiếm" : "Voucher đang bán"}
            <span className="text-sm font-normal text-gray-500">
              ({filtered.length})
            </span>
          </h2>

          {/* Tăng từ 3 cột lên 4 cột ở màn hình XL để tận dụng độ rộng màn hình */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((v) => (
              <VoucherCard
                key={v.id}
                voucher={v}
                onClick={() => navigate(`/customer/vouchers/${v.id}`)}
                discountPct={discountPct(v)}
                remaining={remaining(v)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function VoucherCard({ voucher: v, onClick, discountPct, remaining }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden text-left transition-all duration-200 group flex flex-col h-full"
    >
      <div className="relative overflow-hidden">
        {/* Tăng độ cao ảnh từ h-36 lên h-44 */}
        <img
          src={v.image}
          alt={v.name}
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discountPct > 0 && (
          <span className="absolute top-2.5 right-2.5 bg-red-500 text-white text-xs px-2.5 py-1 rounded-md font-bold shadow">
            -{discountPct}%
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <p className="text-xs text-orange-600 font-semibold uppercase tracking-wider mb-1">
            {v.partner}
          </p>
          {/* Tăng kích thước tên voucher từ text-sm lên text-base */}
          <p className="text-base font-bold text-gray-900 line-clamp-2 mb-3 group-hover:text-orange-600 transition-colors">
            {v.name}
          </p>
        </div>

        <div>
          <div className="flex items-baseline gap-2 mb-2">
            <p className="text-lg font-extrabold text-orange-600">
              {v.salePrice.toLocaleString("vi-VN")}đ
            </p>
            <p className="text-xs text-gray-400 line-through font-medium">
              {v.originalPrice.toLocaleString("vi-VN")}đ
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-50">
            {remaining <= 20 && remaining > 0 ? (
              <span className="text-red-500 font-semibold">
                Còn lại {remaining}
              </span>
            ) : (
              <span>Còn lại {remaining}</span>
            )}
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{new Date(v.endSaleDate).toLocaleDateString("vi-VN")}</span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
