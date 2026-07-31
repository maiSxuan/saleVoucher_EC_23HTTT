import { useState, useEffect, useMemo } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, Clock } from "lucide-react";
import { fetchSellingVouchers, fetchCategories } from "../../api/catalogApi";

export default function HomePage() {
  const { searchValue, setSearchValue } = useOutletContext();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [priceRange, setPriceRange] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const categoryTabs = ["Tất cả", ...categories.map((c) => c.name)];

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  // Bước 2-3 luồng cơ bản: hệ thống tiếp nhận yêu cầu, đối chiếu voucher đang bán
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
      ) // E1
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, []);

  // Bước 4: áp dụng điều kiện tìm kiếm và lọc
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
      <div className="py-16 text-center text-gray-400 text-sm">
        Đang tìm kiếm...
      </div>
    );
  if (errorMsg)
    return (
      <div className="py-16 text-center text-red-500 text-sm">{errorMsg}</div>
    ); // E1/E2

  return (
    <div>
      <div className="bg-gradient-to-r from-orange-500 to-amber-400 rounded-2xl p-5 mb-5 text-white relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/10" />
        <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10" />
        <p className="text-xs font-medium opacity-80 mb-1">🔥 Ưu đãi hôm nay</p>
        <h1 className="text-lg font-bold mb-2">
          Voucher giảm giá đặc biệt
          <br />
          đến 60%
        </h1>
        <div className="flex gap-3">
          <div className="bg-white/20 rounded-lg px-3 py-1.5 text-center">
            <p className="text-sm font-bold">{filtered.length}</p>
            <p className="text-xs opacity-80">Voucher đang bán</p>
          </div>
          <div className="bg-white/20 rounded-lg px-3 py-1.5 text-center">
            <p className="text-sm font-bold">{categoryTabs.length - 1}</p>
            <p className="text-xs opacity-80">Danh mục</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {categoryTabs.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium flex-shrink-0 transition-colors ${activeCategory === cat ? "bg-orange-500 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-orange-50"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setShowFilters((s) => !s)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-colors ${showFilters ? "bg-orange-50 border-orange-300 text-orange-700" : "bg-white border-gray-200 text-gray-600"}`}
        >
          <SlidersHorizontal size={13} /> Bộ lọc
        </button>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs bg-white text-gray-600 focus:outline-none"
        >
          <option value="newest">Mới nhất</option>
          <option value="price-asc">Giá tăng dần</option>
          <option value="price-desc">Giá giảm dần</option>
        </select>
        <span className="ml-auto text-xs text-gray-400">
          {filtered.length} kết quả
        </span>
      </div>

      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-xl p-3 mb-4">
          <p className="text-xs font-semibold text-gray-700 mb-2">Khoảng giá</p>
          <div className="flex gap-2 flex-wrap">
            {[
              { value: "", label: "Tất cả" },
              { value: "under200", label: "Dưới 200K" },
              { value: "200-500", label: "200K–500K" },
              { value: "over500", label: "Trên 500K" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setPriceRange(opt.value)}
                className={`px-2.5 py-1 rounded text-xs border ${priceRange === opt.value ? "bg-orange-500 text-white border-orange-500" : "border-gray-200 text-gray-600"}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        // A4: Không tìm thấy voucher phù hợp
        <div className="flex flex-col items-center py-16 text-gray-400">
          <Search size={36} className="mb-2" />
          <p className="text-sm">Không tìm thấy voucher phù hợp</p>
          <button
            onClick={() => {
              setSearchValue("");
              setActiveCategory("Tất cả");
              setPriceRange("");
            }}
            className="mt-3 text-orange-500 text-sm hover:underline"
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <div className="mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">
            {searchValue ? "Kết quả tìm kiếm" : "Voucher đang bán"}
            <span className="ml-2 text-xs font-normal text-gray-400">
              ({filtered.length})
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-left hover:shadow-md transition-shadow group"
    >
      <div className="relative">
        <img
          src={v.image}
          alt={v.name}
          className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discountPct > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded font-bold">
            -{discountPct}%
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs text-orange-600 font-medium mb-0.5">
          {v.partner}
        </p>
        <p className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">
          {v.name}
        </p>
        <div className="flex items-end gap-2 mb-2">
          <p className="text-base font-bold text-orange-600">
            {v.salePrice.toLocaleString("vi-VN")}đ
          </p>
          <p className="text-xs text-gray-400 line-through">
            {v.originalPrice.toLocaleString("vi-VN")}đ
          </p>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-400">
          {remaining <= 20 && remaining > 0 && (
            <span className="text-red-500 font-medium">Còn {remaining}</span>
          )}
          {remaining > 20 && <span>Còn {remaining}</span>}
        </div>
        <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-400">
          <Clock size={10} />
          <span>
            Bán đến {new Date(v.endSaleDate).toLocaleDateString("vi-VN")}
          </span>
        </div>
      </div>
    </button>
  );
}
