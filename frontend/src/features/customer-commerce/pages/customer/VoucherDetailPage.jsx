import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Store,
  Star,
} from "lucide-react";
import {
  fetchVoucherDetail,
  fetchVoucherReviews,
} from "../../../../shared/api/catalogApi";
import { addToCart } from "../../../../shared/api/cartApi";
import { toast } from "sonner";

const unavailableMsg = {
  sold_out: "Voucher này đã hết số lượng.",
  expired: "Voucher này đã hết hạn bán.",
  suspended: "Voucher đang tạm ngưng bán.",
  stopped: "Voucher đã ngừng bán.",
  scheduled: "Voucher chưa đến thời gian bán.",
};

function getBranchName(branch) {
  if (typeof branch === "string") return branch;
  return branch?.name || branch?.ten_chi_nhanh || "Chi nhánh";
}

function getBranchKey(branch, index) {
  if (typeof branch === "string") return `${branch}-${index}`;
  return `${branch?.id || branch?.ma_chi_nhanh || getBranchName(branch)}-${index}`;
}

export default function VoucherDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [voucher, setVoucher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [qty, setQty] = useState(1);
  const [addState, setAddState] = useState("idle"); // idle | checking | added | unavailable
  const [addErrorMsg, setAddErrorMsg] = useState("");
  const [buyingNow, setBuyingNow] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState("all");
  const [reviewCurrentPage, setReviewCurrentPage] = useState(1);
  const reviewPageSize = 20;

  useEffect(() => {
    setReviewCurrentPage(1);
  }, [selectedRatingFilter]);

  const filteredReviews = reviews.filter((r) => {
    if (selectedRatingFilter === "all") return true;
    return r.rating === parseInt(selectedRatingFilter, 10);
  });

  const totalReviewPages = Math.ceil(filteredReviews.length / reviewPageSize) || 1;
  const paginatedReviews = filteredReviews.slice(
    (reviewCurrentPage - 1) * reviewPageSize,
    reviewCurrentPage * reviewPageSize
  );

  // Bước 2-3: hệ thống tiếp nhận yêu cầu và truy xuất thông tin chi tiết
  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setErrorMsg("");
    fetchVoucherDetail(id)
      .then((data) => {
        if (ignore) return;
        if (!data) setErrorMsg("Không tìm thấy voucher.");
        else setVoucher(data);
      })
      .catch(
        () =>
          !ignore &&
          setErrorMsg("Không thể tải thông tin voucher. Vui lòng thử lại sau."),
      ) // E1
      .finally(() => !ignore && setLoading(false));

    // Fetch reviews
    setLoadingReviews(true);
    fetchVoucherReviews(id)
      .then((res) => {
        if (!ignore) setReviews(res || []);
      })
      .catch(() => {
        if (!ignore) setReviews([]);
      })
      .finally(() => {
        if (!ignore) setLoadingReviews(false);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading)
    return (
      <div className="py-16 text-center text-gray-400 text-sm">Đang tải...</div>
    );
  if (errorMsg)
    return (
      <div className="py-16 text-center text-red-500 text-sm">{errorMsg}</div>
    );
  if (!voucher) return null;

  const isAvailable = voucher.availability === "selling";
  const branches = Array.isArray(voucher.branches) ? voucher.branches : [];
  const remaining = voucher.totalQty - voucher.soldQty;
  const discountPct = Math.round(
    (1 - voucher.salePrice / voucher.originalPrice) * 100,
  );

  // Bước 5-7: thêm vào giỏ hàng + kiểm tra trạng thái tại thời điểm bấm
  const handleAddToCart = async () => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
      return;
    }
    if (!isAvailable) {
      setAddState("unavailable");
      return;
    }
    setAddState("checking");
    setAddErrorMsg("");
    try {
      await addToCart(voucher.id, qty);
      setAddState("added");
      toast.success("Đã thêm voucher vào giỏ hàng!");
    } catch (err) {
      setAddState("unavailable");
      setAddErrorMsg(err.message);
      toast.error("Lỗi không thể thêm voucher vào giỏ hàng.");
    }
  };

  const handleBuyNow = async () => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
      return;
    }
    if (!isAvailable) {
      setAddState("unavailable");
      return;
    }
    setBuyingNow(true);
    try {
      await addToCart(voucher.id, qty); // đảm bảo item có trong giỏ trước khi qua checkout
      navigate("/customer/checkout", {
        state: { selectedVoucherIds: [voucher.id] },
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBuyingNow(false);
    }
  };
  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 mb-4 hover:text-gray-700"
      >
        <ArrowLeft size={16} /> Quay lại
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="relative rounded-xl overflow-hidden">
            <img
              src={voucher.image}
              alt={voucher.name}
              className="w-full h-56 object-cover"
            />
            {discountPct > 0 && (
              <span className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                -{discountPct}%
              </span>
            )}
            {!isAvailable && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold text-sm">
                  {unavailableMsg[voucher.availability] || "Không khả dụng"}
                </span>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
            <div className="md:w-1/2 flex flex-col pt-2">
              {/* Tag Category + Tên đối tác */}
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-orange-100 text-orange-700 px-3 py-1 text-sm font-semibold rounded-full shadow-sm">
                  {voucher.category}
                </span>
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Store size={16} />
                  {typeof voucher.partner === "object" &&
                  voucher.partner !== null
                    ? voucher.partner.ten_dn ||
                      voucher.partner.name ||
                      "Đối tác"
                    : voucher.partner || "Đối tác"}
                </span>
              </div>
            </div>
            <h1 className="text-xl font-bold text-gray-900">{voucher.name}</h1>

            <div className="flex items-end gap-3">
              <span className="text-2xl font-bold text-orange-600">
                {voucher.salePrice.toLocaleString("vi-VN")}đ
              </span>
              <span className="text-sm text-gray-400 line-through">
                {voucher.originalPrice.toLocaleString("vi-VN")}đ
              </span>
              {discountPct > 0 && (
                <span className="text-sm text-red-500 font-medium">
                  Tiết kiệm{" "}
                  {(voucher.originalPrice - voucher.salePrice).toLocaleString(
                    "vi-VN",
                  )}
                  đ
                </span>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-2.5">
              <div className="flex items-center gap-1 text-gray-400 text-sm mb-0.5">
                <Clock size={11} />
                Thời gian bán
              </div>
              <p className="text-sm font-medium text-gray-700">
                {new Date(voucher.startSaleDate).toLocaleDateString("vi-VN")} –{" "}
                {new Date(voucher.endSaleDate).toLocaleDateString("vi-VN")}
              </p>
            </div>

            {branches.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                  Chi nhánh áp dụng
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {branches.map((branch, index) => (
                    <span
                      key={getBranchKey(branch, index)}
                      className="flex items-center gap-1 text-xs bg-gray-50 border border-gray-100 px-2 py-0.5 rounded"
                    >
                      <MapPin size={10} className="text-gray-400" />
                      {getBranchName(branch)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {voucher.description && (
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                Mô tả ưu đãi
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {voucher.description}
              </p>
            </div>
          )}

          {(voucher.conditions || voucher.cancellationPolicy) && (
            <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-2">
              {voucher.conditions && (
                <>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    Điều kiện sử dụng
                  </h3>
                  <p className="text-sm text-gray-600">{voucher.conditions}</p>
                </>
              )}
              {voucher.cancellationPolicy && (
                <>
                  <h3 className="font-semibold text-gray-900 text-sm mt-2">
                    Chính sách hủy/hoàn tiền
                  </h3>
                  <p className="text-sm text-gray-600">
                    {voucher.cancellationPolicy}
                  </p>
                </>
              )}
            </div>
          )}

          {/* Vùng đọc dữ liệu review cho từng voucher */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                Đánh giá từ khách hàng ({reviews.length})
              </h3>
              {reviews.length > 0 && (
                <span className="text-xs text-gray-500">
                  Trung bình:{" "}
                  <strong className="text-orange-600 font-bold">
                    {(
                      reviews.reduce((acc, r) => acc + (r.rating || 0), 0) /
                      reviews.length
                    ).toFixed(1)}{" "}
                    / 5
                  </strong>
                </span>
              )}
            </div>

            {/* Filter by star rating */}
            {reviews.length > 0 && (
              <div className="flex gap-1.5 mb-3 flex-wrap">
                {[
                  { key: 'all', label: 'Tất cả' },
                  { key: '5', label: '5 ⭐' },
                  { key: '4', label: '4 ⭐' },
                  { key: '3', label: '3 ⭐' },
                  { key: '2', label: '2 ⭐' },
                  { key: '1', label: '1 ⭐' },
                ].map(btn => (
                  <button
                    key={btn.key}
                    onClick={() => setSelectedRatingFilter(btn.key)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      selectedRatingFilter === btn.key
                        ? 'bg-orange-500 text-white shadow-xs'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            )}

            {loadingReviews ? (
              <p className="text-xs text-gray-400 py-3 text-center">
                Đang tải đánh giá...
              </p>
            ) : reviews.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">
                Chưa có đánh giá nào cho voucher này.
              </p>
            ) : filteredReviews.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">
                Không có đánh giá nào phù hợp với bộ lọc sao này.
              </p>
            ) : (
              <>
                <div className="space-y-3 divide-y divide-gray-100">
                  {paginatedReviews.map((rev, idx) => (
                    <div key={rev.id || idx} className={idx > 0 ? "pt-3" : ""}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={12}
                              className={
                                star <= (rev.rating || 5)
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                          <span className="text-xs font-semibold text-gray-700 ml-1">
                            {rev.rating} sao
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400">
                          {rev.createdAt
                            ? new Date(rev.createdAt).toLocaleDateString("vi-VN")
                            : ""}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {rev.comment || "Không có nội dung."}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Pagination footer */}
                {totalReviewPages > 1 && (
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
                    <span className="text-[11px] text-gray-400">
                      Trang {reviewCurrentPage} / {totalReviewPages} ({filteredReviews.length} đánh giá)
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setReviewCurrentPage(p => Math.max(p - 1, 1))}
                        disabled={reviewCurrentPage === 1}
                        className="px-2.5 py-1 border border-gray-200 rounded text-xs text-gray-600 disabled:opacity-40 hover:bg-gray-50"
                      >
                        Trước
                      </button>
                      <button
                        onClick={() => setReviewCurrentPage(p => Math.min(p + 1, totalReviewPages))}
                        disabled={reviewCurrentPage === totalReviewPages}
                        className="px-2.5 py-1 border border-gray-200 rounded text-xs text-gray-600 disabled:opacity-40 hover:bg-gray-50"
                      >
                        Sau
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sticky top-20">
            <div className="flex items-end gap-2 mb-3">
              <p className="text-xl font-bold text-orange-600">
                {voucher.salePrice.toLocaleString("vi-VN")}đ
              </p>
              <p className="text-sm text-gray-400 line-through">
                {voucher.originalPrice.toLocaleString("vi-VN")}đ
              </p>
            </div>

            {isAvailable ? (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle size={12} /> Còn {remaining} voucher
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <label className="text-xs text-gray-600">Số lượng:</label>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="px-2.5 py-1 text-gray-600 hover:bg-gray-50 text-sm"
                    >
                      −
                    </button>
                    <span className="px-3 py-1 text-sm font-medium">{qty}</span>
                    <button
                      onClick={() => setQty((q) => Math.min(remaining, q + 1))}
                      className="px-2.5 py-1 text-gray-600 hover:bg-gray-50 text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-3">
                  Tổng:{" "}
                  <strong className="text-orange-600">
                    {(voucher.salePrice * qty).toLocaleString("vi-VN")}đ
                  </strong>
                </p>
                <div className="grid grid-cols-2 gap-3 mb-2">
                  {/* Nút 1: Thêm vào giỏ hàng - Style Viền/Nền nhạt */}
                  <button
                    onClick={handleAddToCart}
                    disabled={addState === "checking"}
                    className="flex items-center justify-center gap-2 border border-orange-500 bg-orange-50 text-orange-600 hover:bg-orange-100 active:bg-orange-200 py-2.5 px-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart size={18} />
                    <span className="truncate">
                      {addState === "checking"
                        ? "Đang xử lý..."
                        : "Thêm giỏ hàng"}
                    </span>
                  </button>

                  {/* Nút 2: Mua ngay - Style Nổi bật (Call to Action) */}
                  <button
                    onClick={handleBuyNow}
                    disabled={buyingNow || addState === "checking"}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-2.5 px-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <span>MUA NGAY</span>
                  </button>
                </div>
                {addState === "unavailable" && (
                  <div className="mt-2 bg-red-50 border border-red-200 rounded p-2 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle size={12} />{" "}
                    {addErrorMsg || "Voucher vừa thay đổi trạng thái."}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gray-50 rounded-lg p-3 text-center text-sm text-gray-500">
                <AlertCircle size={20} className="mx-auto mb-1 text-gray-400" />
                {unavailableMsg[voucher.availability]}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
