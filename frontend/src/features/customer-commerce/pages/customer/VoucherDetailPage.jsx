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
import { useTranslation } from "react-i18next";

const unavailableMsg = {
  sold_out: "Voucher này đã hết số lượng.",
  expired: "Voucher này đã hết hạn bán.",
  suspended: "Voucher đang tạm ngưng bán.",
  stopped: "Voucher đã ngừng bán.",
  scheduled: "Voucher chưa đến thời gian bán.",
  unavailable: "Voucher này hiện không khả dụng.",
  out_of_stock: "Voucher này đã hết số lượng.",
};

function getBranchAddress(branch) {
  if (typeof branch === "string") return branch;
  return (
    branch?.dia_chi || branch?.address || branch?.diaChi || "Địa chỉ chi nhánh"
  );
}

function getBranchRegion(branch) {
  if (typeof branch === "string") return "";
  return branch?.region || branch?.khu_vuc || branch?.area || "";
}

function renderBulletList(content) {
  const lines = String(content)
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/^(?:[-*•]|\d+[.)])\s+/, ""))
    .filter(Boolean);

  return (
    <ul className="list-disc pl-5 space-y-1">
      {lines.map((line, index) => (
        <li key={`${line}-${index}`}>{line}</li>
      ))}
    </ul>
  );
}

function getBranchKey(branch, index) {
  if (typeof branch === "string") return `${branch}-${index}`;
  return `${branch?.id || branch?.ma_chi_nhanh || getBranchAddress(branch)}-${index}`;
}

function getStoredRole() {
  try {
    const storedUser =
      localStorage.getItem("user") || localStorage.getItem("ec_auth_user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    return user?.role || user?.vai_tro_he_thong || user?.vai_tro || "";
  } catch {
    return "";
  }
}

function isCustomerRole(role) {
  return ["CUSTOMER", "Khach hang", "Khách hàng"].includes(role);
}

export default function VoucherDetailPage({ publicView = false }) {
  const { t } = useTranslation();
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

  const totalReviewPages =
    Math.ceil(filteredReviews.length / reviewPageSize) || 1;
  const paginatedReviews = filteredReviews.slice(
    (reviewCurrentPage - 1) * reviewPageSize,
    reviewCurrentPage * reviewPageSize,
  );

  //Hệ thống tiếp nhận yêu cầu và truy xuất thông tin chi tiết
  useEffect(() => {
    let ignore = false;
    const loadDetail = () => {
      setLoading(true);
      setErrorMsg("");
      fetchVoucherDetail(id)
        .then((data) => {
          if (ignore) return;
          if (!data)
            setErrorMsg(t("voucher.notFound", "Không tìm thấy voucher."));
          else setVoucher(data);
        })
        .catch(
          () =>
            !ignore &&
            setErrorMsg(
              t(
                "voucher.fetchDetailError",
                "Không thể truy xuất chi tiết voucher.",
              ),
            ),
        )
        .finally(() => !ignore && setLoading(false));
    };

    loadDetail();

    window.addEventListener("app_language_changed", loadDetail);

    // Fetch reviews
    setLoadingReviews(true);
    fetchVoucherReviews(id)
      .then((data) => {
        if (!ignore) setReviews(Array.isArray(data) ? data : []);
      })
      .catch(() => {})
      .finally(() => {
        if (!ignore) setLoadingReviews(false);
      });

    return () => {
      ignore = true;
      window.removeEventListener("app_language_changed", loadDetail);
    };
  }, [id, t]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error(t("Vui lòng đăng nhập để thực hiện mua voucher."));
      navigate("/login");
      return;
    }
    const userRole = getStoredRole();
    if (!publicView && userRole && !isCustomerRole(userRole)) {
      toast.error(
        t(
          "voucher.customerOnlyAction",
          "Chức năng mua voucher chỉ dành cho tài khoản Khách hàng.",
        ),
      );
      return;
    }
    setAddState("checking");
    setAddErrorMsg("");
    try {
      await addToCart(voucher.id, qty);
      setAddState("added");
      toast.success(t("cart.addSuccess", "Đã thêm vào giỏ hàng!"));
      setTimeout(() => setAddState("idle"), 2500);
    } catch (err) {
      setAddState("unavailable");
      const msg =
        t(err.message) ||
        t("voucher.statusChangedMsg", "Voucher vừa thay đổi trạng thái.");
      setAddErrorMsg(msg);
      toast.error(msg);
      if (
        err.message?.includes("token") ||
        err.message?.includes("Token") ||
        err.message?.includes("đăng nhập")
      ) {
        setTimeout(() => navigate("/login"), 1500);
      }
    }
  };

  const handleBuyNow = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error(t("Vui lòng đăng nhập để thực hiện mua voucher."));
      navigate("/login");
      return;
    }
    const userRole = getStoredRole();
    if (!publicView && userRole && !isCustomerRole(userRole)) {
      toast.error(
        t(
          "voucher.customerOnlyAction",
          "Chức năng mua voucher chỉ dành cho tài khoản Khách hàng.",
        ),
      );
      return;
    }
    setBuyingNow(true);
    setAddErrorMsg("");
    try {
      await addToCart(voucher.id, qty);
      navigate("/customer/cart");
    } catch (err) {
      setBuyingNow(false);
      setAddState("unavailable");
      const msg =
        t(err.message) ||
        t("voucher.statusChangedMsg", "Voucher vừa thay đổi trạng thái.");
      setAddErrorMsg(msg);
      toast.error(msg);
      if (
        err.message?.includes("token") ||
        err.message?.includes("Token") ||
        err.message?.includes("đăng nhập")
      ) {
        setTimeout(() => navigate("/login"), 1500);
      }
    }
  };

  if (loading)
    return (
      <div className="py-24 text-center text-gray-500 font-medium text-sm">
        {t("common.loading", "Đang tải chi tiết voucher...")}
      </div>
    );
  if (errorMsg || !voucher)
    return (
      <div className="py-24 text-center space-y-3">
        <p className="text-red-500 font-semibold">
          {errorMsg || t("voucher.notFound", "Không tìm thấy voucher.")}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-orange-600 font-medium hover:underline"
        >
          ← {t("common.back", "Quay lại")}
        </button>
      </div>
    );

  const branches = voucher.branches || [];
  const totalQty =
    voucher.totalQty ??
    voucher.totalQuantity ??
    voucher.so_luong_phat_hanh ??
    0;
  const soldQty =
    voucher.soldQty ?? voucher.soldQuantity ?? voucher.so_luong_da_ban ?? 0;
  const remaining = Math.max(0, totalQty - soldQty);
  const isAvailable =
    (voucher.availability === "selling" ||
      voucher.availability === "available") &&
    remaining > 0;
  const discountPct =
    voucher.originalPrice > voucher.salePrice
      ? Math.round(
          ((voucher.originalPrice - voucher.salePrice) /
            voucher.originalPrice) *
            100,
        )
      : 0;

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={16} /> {t("common.back", "Quay lại")}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="relative rounded-xl overflow-hidden">
            <img
              src={voucher.image || voucher.hinh_anh_url}
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
                  {t(unavailableMsg[voucher.availability] || "Không khả dụng")}
                </span>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
            <div className="md:w-1/2 flex flex-col pt-2">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-orange-100 text-orange-700 px-3 py-1 text-sm font-semibold rounded-full shadow-sm">
                  {t(voucher.category)}
                </span>
                <span className="text-sm font-bold text-orange-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Store size={16} />
                  {typeof voucher.partner === "object" &&
                  voucher.partner !== null
                    ? voucher.partner.ten_dn ||
                      voucher.partner.name ||
                      t("partner.partner", "Đối tác")
                    : voucher.partner || t("partner.partner", "Đối tác")}
                </span>
              </div>
            </div>
            <h1 className="text-xl font-bold text-gray-900">{voucher.name}</h1>

            <div className="flex items-end gap-3">
              <span className="text-2xl font-bold text-orange-700">
                {voucher.salePrice.toLocaleString("vi-VN")}đ
              </span>
              <span className="text-sm text-gray-500 line-through">
                {voucher.originalPrice.toLocaleString("vi-VN")}đ
              </span>
              {discountPct > 0 && (
                <span className="text-sm text-red-500 font-medium">
                  {t("Tiết kiệm")}{" "}
                  {(voucher.originalPrice - voucher.salePrice).toLocaleString(
                    "vi-VN",
                  )}
                  đ
                </span>
              )}
            </div>

            <div className="bg-gray-100 rounded-lg p-2.5">
              <div className="flex items-center gap-1 text-gray-800 text-sm mb-0.5">
                <Clock size={12} />
                {t("Thời gian bán: ")}
                <p className="text-sm font-medium text-gray-800">
                  {new Date(voucher.startSaleDate).toLocaleDateString("vi-VN")}{" "}
                  – {new Date(voucher.endSaleDate).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>

            {branches.length > 0 && (
              <div>
                <p className="text-lg font-bold text-gray-900 mb-1 tracking-wide">
                  {t("Chi nhánh áp dụng")}
                </p>

                <div className="flex flex-wrap gap-1.5 bg-gray-100 rounded-lg p-2.5">
                  {branches.map((branch, index) => (
                    <span
                      key={getBranchKey(branch, index)}
                      className="flex items-start gap-1 text-sm bg-gray-100 border border-gray-100 px-2 py-1 rounded"
                    >
                      <span>
                        {getBranchRegion(branch) && (
                          <span className="block text-sm font-semibold text-gray-600">
                            {getBranchRegion(branch)}
                          </span>
                        )}
                        <div className="flex items-start gap-1.5">
                          <MapPin
                            size={14}
                            className="text-gray-900 mt-0.5 shrink-0"
                          />
                          <span className="block text-gray-900">
                            {getBranchAddress(branch)}
                          </span>
                        </div>
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {voucher.description && (
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                {t("Mô tả chi tiết")}
              </h3>
              <div className="text-sm text-gray-900 leading-relaxed">
                {renderBulletList(voucher.description)}
              </div>
            </div>
          )}

          {(voucher.conditions || voucher.cancellationPolicy) && (
            <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-2">
              {voucher.conditions && (
                <>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {t("Điều kiện sử dụng")}
                  </h3>
                  <div className="text-sm text-gray-900 leading-relaxed">
                    {renderBulletList(voucher.conditions)}
                  </div>
                </>
              )}
              {voucher.cancellationPolicy && (
                <>
                  <br />
                  <h3 className="font-semibold text-gray-900 text-lg mt-2">
                    {t("Chính sách hoàn hủy")}
                  </h3>
                  <p className="text-sm text-gray-900">
                    {voucher.cancellationPolicy}
                  </p>
                </>
              )}
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                {t("review.customerReviewsTitle", "Đánh giá từ khách hàng")} (
                {reviews.length})
              </h3>
              {reviews.length > 0 && (
                <span className="text-xs text-gray-500">
                  {t("review.averageLabel", "Trung bình:")}{" "}
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

            {reviews.length > 0 && (
              <div className="flex gap-1.5 mb-3 flex-wrap">
                {[
                  { key: "all", label: t("common.all", "Tất cả") },
                  { key: "5", label: "5 ⭐" },
                  { key: "4", label: "4 ⭐" },
                  { key: "3", label: "3 ⭐" },
                  { key: "2", label: "2 ⭐" },
                  { key: "1", label: "1 ⭐" },
                ].map((btn) => (
                  <button
                    key={btn.key}
                    onClick={() => setSelectedRatingFilter(btn.key)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      selectedRatingFilter === btn.key
                        ? "bg-sky-500 text-white shadow-xs"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            )}

            {loadingReviews ? (
              <p className="text-xs text-gray-400 py-3 text-center">
                {t("review.loadingReviews", "Đang tải đánh giá...")}
              </p>
            ) : reviews.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">
                {t(
                  "review.noReviewsYet",
                  "Chưa có đánh giá nào cho voucher này.",
                )}
              </p>
            ) : filteredReviews.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">
                {t(
                  "review.noFilterMatch",
                  "Không có đánh giá nào phù hợp với bộ lọc sao này.",
                )}
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
                          <span className="text-xs font-semibold text-gray-900 ml-1">
                            {rev.rating} {t("review.stars", "sao")}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400">
                          {rev.createdAt
                            ? new Date(rev.createdAt).toLocaleDateString(
                                "vi-VN",
                              )
                            : ""}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {t(rev.comment || "Không có nội dung.")}
                      </p>
                    </div>
                  ))}
                </div>

                {totalReviewPages > 1 && (
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
                    <span className="text-[11px] text-gray-400">
                      {t("common.page", "Trang")} {reviewCurrentPage} /{" "}
                      {totalReviewPages} ({filteredReviews.length}{" "}
                      {t("review.reviewsSuffix", "đánh giá")})
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          setReviewCurrentPage((p) => Math.max(p - 1, 1))
                        }
                        disabled={reviewCurrentPage === 1}
                        className="px-2.5 py-1 border border-gray-200 rounded text-xs text-gray-600 disabled:opacity-40 hover:bg-gray-100"
                      >
                        {t("common.prev", "Trước")}
                      </button>
                      <button
                        onClick={() =>
                          setReviewCurrentPage((p) =>
                            Math.min(p + 1, totalReviewPages),
                          )
                        }
                        disabled={reviewCurrentPage === totalReviewPages}
                        className="px-2.5 py-1 border border-gray-200 rounded text-xs text-gray-600 disabled:opacity-40 hover:bg-gray-100"
                      >
                        {t("common.next", "Sau")}
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
                    <CheckCircle size={12} />{" "}
                    {t("voucher.remainingLabel", "Còn")} {remaining}{" "}
                    {t("voucher.vouchersLeft", "voucher")}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <label className="text-xs text-gray-900">
                    {t("orders.quantityLabel", "Số lượng:")}
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 text-sm"
                    >
                      −
                    </button>
                    <span className="px-3 py-1 text-sm font-medium">{qty}</span>
                    <button
                      onClick={() => setQty((q) => Math.min(remaining, q + 1))}
                      className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-900 mb-3">
                  {t("common.total", "Tổng:")}{" "}
                  <strong className="text-orange-600">
                    {(voucher.salePrice * qty).toLocaleString("vi-VN")}đ
                  </strong>
                </p>
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={addState === "checking"}
                    className="flex items-center justify-center gap-2 border border-sky-500 bg-sky-50 text-sky-600 hover:bg-sky-100 active:bg-sky-200 py-2.5 px-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart size={18} />
                    <span className="truncate">
                      {addState === "checking"
                        ? t("common.processing", "Đang xử lý...")
                        : t("voucher.addToCart", "Thêm giỏ hàng")}
                    </span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={buyingNow || addState === "checking"}
                    className="flex items-center justify-center gap-2 bg-[#1E9EDB] hover:bg-[#1887BC] text-white py-2.5 px-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <span>{t("voucher.buyNowUpper", "MUA NGAY")}</span>
                  </button>
                </div>
                {addState === "unavailable" && (
                  <div className="mt-2 bg-red-50 border border-red-200 rounded p-2 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle size={12} />{" "}
                    {t(addErrorMsg || "Voucher vừa thay đổi trạng thái.")}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gray-100 rounded-lg p-3 text-center text-sm text-gray-500">
                <AlertCircle size={20} className="mx-auto mb-1 text-gray-400" />
                {t(
                  unavailableMsg[voucher.availability] ||
                    (remaining <= 0
                      ? "Voucher này đã hết số lượng."
                      : "Voucher này hiện không khả dụng."),
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
