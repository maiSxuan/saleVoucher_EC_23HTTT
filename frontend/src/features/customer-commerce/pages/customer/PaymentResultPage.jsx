import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import {
  finalizeVnpayReturn,
  finalizePaypalReturn,
} from "../../api/paymentApi";
import { cancelOrder } from "../../api/orderApi";

export default function PaymentResultPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("processing");
  const [orderId, setOrderId] = useState(null);

  // 1. Thêm ref để chặn gọi API trùng lặp
  const isCalledRef = useRef(false);

  useEffect(() => {
    // Nếu đã gọi API 1 lần rồi thì bỏ qua lần chạy thứ 2 của Strict Mode
    if (isCalledRef.current) return;
    isCalledRef.current = true;

    const isPaypal = searchParams.has("token");
    const run = isPaypal
      ? finalizePaypalReturn(searchParams.get("token"))
      : finalizeVnpayReturn(Object.fromEntries(searchParams.entries()));

    run
      .then((res) => {
        setOrderId(res.orderId);
        if (res.status === "success") {
          setStatus("success");
        } else {
          setStatus("failed");
          cancelOrder(res.orderId).catch(() => {});
        }
      })
      .catch(() => setStatus("failed"));
  }, []);

  if (status === "processing") {
    return (
      <div className="flex flex-col items-center py-24">
        <Loader size={40} className="text-orange-500 animate-spin mb-4" />
        <p className="text-lg font-semibold text-gray-800">
          Đang xác nhận thanh toán...
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Đặt mua thành công!
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Mã đơn: <span className="font-mono">{orderId}</span>
        </p>
        <button
          onClick={() => navigate("/customer")}
          className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-orange-600"
        >
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-16 text-center">
      <XCircle size={48} className="text-red-500 mx-auto mb-3" />
      <h2 className="text-xl font-bold text-gray-900 mb-1">
        Thanh toán thất bại
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Giao dịch không thành công. Bạn có thể thử lại từ giỏ hàng.
      </p>
      <button
        onClick={() => navigate("/customer/cart")}
        className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-orange-600"
      >
        Quay lại giỏ hàng
      </button>
    </div>
  );
}
