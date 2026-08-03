import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { fetchVoucherDetail } from "../../api/catalogApi";
import { addToCart } from "../../api/cartApi";
import { toast } from "sonner";

const unavailableMsg = {
  sold_out: "Voucher này đã hết số lượng.",
  expired: "Voucher này đã hết hạn bán.",
  suspended: "Voucher đang tạm ngưng bán.",
  stopped: "Voucher đã ngừng bán.",
  scheduled: "Voucher chưa đến thời gian bán.",
};

export default function VoucherDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [voucher, setVoucher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [qty, setQty] = useState(1);
  const [addState, setAddState] = useState("idle"); // idle | checking | added | unavailable
  const [addErrorMsg, setAddErrorMsg] = useState("");

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
      setAddState("added"); // Bước 8: sẵn sàng chuyển sang UC-CUS-09
      toast.success("Đã thêm voucher vào giỏ hàng!");
    } catch (err) {
      // A6/E2: voucher không còn khả dụng hoặc lỗi khi kiểm tra
      setAddState("unavailable");
      setAddErrorMsg(err.message);
      toast.error("Lỗi không thể thêm voucher vào giỏ hàng.");
    }
  };

  // const handleBuyNow = async () => {};

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
            <p className="text-xs text-orange-600 font-medium">
              {voucher.partner} · {voucher.category}
            </p>
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
              <div className="flex items-center gap-1 text-gray-400 text-xs mb-0.5">
                <Clock size={11} />
                Thời gian bán
              </div>
              <p className="text-xs font-medium text-gray-700">
                {new Date(voucher.startSaleDate).toLocaleDateString("vi-VN")} –{" "}
                {new Date(voucher.endSaleDate).toLocaleDateString("vi-VN")}
              </p>
            </div>

            {voucher.branches.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                  Chi nhánh áp dụng
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {voucher.branches.map((b) => (
                    <span
                      key={b}
                      className="flex items-center gap-1 text-xs bg-gray-50 border border-gray-100 px-2 py-0.5 rounded"
                    >
                      <MapPin size={10} className="text-gray-400" />
                      {b}
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
                <p className="text-xs text-gray-500 mb-3">
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
                    //   onClick={handleBuyNow}
                    //   disabled={addState === "checking"}
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
