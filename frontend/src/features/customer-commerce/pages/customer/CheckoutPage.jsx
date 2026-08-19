import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CreditCard, ArrowLeft, Building2, Globe } from "lucide-react";
import { toast } from "sonner";
import {
  reviewOrder,
  createOrder,
  repayOrder,
  fetchCustomerOrderDetail,
} from "../../../../shared/api/orderApi";
import { useTranslation } from "react-i18next";

export default function CheckoutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId || null;
  const voucherIds = location.state?.selectedVoucherIds || [];

  const [payMethod, setPayMethod] = useState("vnpay");
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!orderId && voucherIds.length === 0) {
      navigate("/customer/cart");
      return;
    }

    if (orderId) {
      fetchCustomerOrderDetail(orderId)
        .then((order) => {
          if (order.orderStatus !== "Cho thanh toan") {
            setErrorMsg("Đơn hàng này không còn ở trạng thái Chờ thanh toán.");
            return;
          }
          setReviewData({
            items: order.items.map((item) => ({
              voucherId: item.voucherId,
              name: item.name || item.voucherName || "Voucher",
              image: item.image,
              quantity: item.quantity,
              subtotal: item.subtotal ?? item.unitPrice * item.quantity,
            })),
            total: order.total,
          });
        })
        .catch((err) => {
          setErrorMsg(err.message || "Không thể tải thông tin đơn hàng.");
        })
        .finally(() => setLoading(false));
      return;
    }

    reviewOrder(voucherIds)
      .then(setReviewData)
      .catch((err) => {
        if (err.details?.invalidItems) {
          toast.error(err.message);
          navigate("/customer/cart");
          return;
        }
        setErrorMsg(err.message || "Không thể kiểm tra thông tin đơn hàng.");
      })
      .finally(() => setLoading(false));
  }, [orderId, voucherIds.length, navigate]);

  const handlePay = async () => {
    setRedirecting(true);
    try {
      if (orderId) {
        const res = await repayOrder(orderId, { paymentMethod: payMethod });
        window.location.href = res.redirectUrl;
      } else {
        const res = await createOrder({ voucherIds, paymentMethod: payMethod });
        window.location.href = res.redirectUrl;
      }
    } catch (err) {
      if (err.details?.invalidItems) {
        toast.error(err.message);
        navigate("/customer/cart");
        return;
      }
      toast.error(err.message || "Không thể khởi tạo thanh toán.");
      setRedirecting(false);
    }
  };

  if (loading)
    return (
      <div className="py-16 text-center text-gray-400 text-sm">
        Đang kiểm tra thông tin đơn hàng...
      </div>
    );
  if (errorMsg)
    return (
      <div className="py-16 text-center text-red-500 text-sm">{errorMsg}</div>
    );
  if (!reviewData) return null;

  return (
    <div>
      <button
        onClick={() => navigate("/customer/cart")}
        className="flex items-center gap-1.5 text-sm text-gray-500 mb-4 hover:text-gray-700"
      >
        <ArrowLeft size={16} /> Quay lại giỏ hàng
      </button>
      <h1 className="text-xl font-bold text-gray-900 mb-4">Xác nhận đặt mua</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">
              Voucher đặt mua
            </h3>
            <div className="space-y-3">
              {reviewData.items.map((item) => (
                <div key={item.voucherId} className="flex gap-3 items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
                      {typeof item.name === "object" && item.name !== null
                        ? item.name.name
                        : item.name}
                    </p>
                    <p className="text-xs text-gray-400">× {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-orange-600 flex-shrink-0">
                    {item.subtotal.toLocaleString("vi-VN")}đ
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">
              Phương thức thanh toán
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setPayMethod("vnpay")}
                className={`border rounded-xl p-3 flex flex-col items-center gap-1 text-sm transition-colors ${payMethod === "vnpay" ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-200 text-gray-600"}`}
              >
                <Building2 size={20} />
                <span className="font-medium">VNPay</span>
                <span className="text-xs opacity-70">Nội địa (ATM/QR)</span>
              </button>
              <button
                onClick={() => setPayMethod("paypal")}
                className={`border rounded-xl p-3 flex flex-col items-center gap-1 text-sm transition-colors ${payMethod === "paypal" ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-200 text-gray-600"}`}
              >
                <Globe size={20} />
                <span className="font-medium">PayPal</span>
                <span className="text-xs opacity-70">Quốc tế</span>
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-3">
              Bạn sẽ được chuyển sang trang thanh toán của{" "}
              {payMethod === "vnpay" ? "VNPay" : "PayPal"}.
            </p>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-20">
            <h3 className="font-semibold text-gray-900 mb-3">Tổng đơn hàng</h3>
            {reviewData.items.map((item) => (
              <div
                key={item.voucherId}
                className="flex justify-between text-sm mb-1.5"
              >
                <span className="text-gray-500 truncate max-w-32">
                  {typeof item.name === "object" && item.name !== null
                    ? item.name.name
                    : item.name}{" "}
                  ×{item.quantity}
                </span>
                <span>{item.subtotal.toLocaleString("vi-VN")}đ</span>
              </div>
            ))}
            <div className="border-t border-gray-100 pt-3 mt-3">
              <div className="flex justify-between font-bold">
                <span>Tổng cộng</span>
                <span className="text-orange-600">
                  {reviewData.total.toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>
            <button
              onClick={handlePay}
              disabled={redirecting}
              className="mt-4 w-full bg-orange-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-orange-600 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <CreditCard size={16} />{" "}
              {redirecting ? "Đang chuyển hướng..." : "Xác nhận thanh toán"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
