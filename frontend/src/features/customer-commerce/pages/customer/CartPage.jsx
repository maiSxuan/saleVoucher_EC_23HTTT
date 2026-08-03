import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Trash2,
  AlertCircle,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import {
  fetchCart,
  updateCartItemQuantity,
  removeCartItems,
} from "../../api/cartApi";

export default function CartPage() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);

  // 💡 STATE MỚI: Quản lý danh sách voucherId được chọn & Modal xóa
  const [selectedIds, setSelectedIds] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function loadCart() {
    setLoading(true);

    fetchCart()
      .then((cartData) => {
        setCart(currentCart);

        const validIds = currentCart.items
          .filter((i) => i && i.status !== "unavailable")
          .map((i) => i.voucherId);

        setSelectedIds(validIds);
      })
      .catch((err) => {
        console.error("Lỗi loadCart:", err);
        toast.error("Không thể tải giỏ hàng. Vui lòng thử lại");
      })
      .finally(() => setLoading(false));
  }
  useEffect(loadCart, []);

  // --- LOGIC XỬ LÝ CHECKBOX ---
  const isAllSelected =
    cart?.items?.length > 0 && selectedIds.length === cart.items.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cart.items.map((i) => i.voucherId));
    }
  };

  const handleToggleItem = (voucherId) => {
    setSelectedIds((prev) =>
      prev.includes(voucherId)
        ? prev.filter((id) => id !== voucherId)
        : [...prev, voucherId],
    );
  };

  // --- LOGIC ĐỔI SỐ LƯỢNG ---
  const handleQtyChange = async (voucherId, newQty) => {
    if (newQty < 1) return;
    setUpdatingId(voucherId);
    try {
      const updated = await updateCartItemQuantity(voucherId, newQty);
      setCart(updated);
    } catch (err) {
      console.error("Lỗi handleQtyChange:", err);
      toast.error("Không thể cập nhật số lượng");
    } finally {
      setUpdatingId(null);
    }
  };

  // --- LOGIC XÓA SẢN PHẨM ĐÃ CHỌN ---
  const handleConfirmDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    setDeleting(true);
    try {
      const updated = await removeCartItems(selectedIds);
      setCart(updated);
      toast.success(`Đã xóa ${selectedIds.length} sản phẩm khỏi giỏ hàng.`);
      setSelectedIds([]);
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Lỗi handleQtyChange:", err);
      toast.error("Có lỗi xảy ra khi xóa sản phẩm.");
    } finally {
      setDeleting(false);
    }
  };

  // --- LOGIC TÍNH TỔNG TIỀN THEO MÓN ĐÃ CHỌN ---
  const selectedItems =
    cart?.items?.filter((i) => selectedIds.includes(i.voucherId)) || [];

  const selectedSubtotal = selectedItems.reduce(
    (sum, i) => sum + i.salePrice * i.quantity,
    0,
  );
  const selectedTotalQty = selectedItems.reduce(
    (sum, i) => sum + i.quantity,
    0,
  );

  const handleCheckout = () => {
    if (selectedIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 voucher để thanh toán.");
      return;
    }
    const hasSelectedInvalid = selectedItems.some(
      (i) => i.status === "unavailable",
    );
    if (hasSelectedInvalid) {
      toast.error("Vui lòng bỏ chọn các voucher không khả dụng.");
      return;
    }

    setCheckingOut(true);
    setTimeout(() => {
      setCheckingOut(false);
      // Chuyển sang checkout truyền kèm danh sách voucherId đã chọn
      navigate("/customer/checkout", {
        state: { selectedVoucherIds: selectedIds },
      });
    }, 400);
  };

  if (loading)
    return (
      <div className="py-16 text-center text-gray-400 text-sm">
        Đang tải giỏ hàng...
      </div>
    );
  if (errorMsg)
    return (
      <div className="py-16 text-center text-red-500 text-sm">{errorMsg}</div>
    );
  if (!cart) return null;

  if (cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 text-gray-400">
        <ShoppingBag size={48} className="mb-3" />
        <p className="text-lg font-medium text-gray-600 mb-1">Giỏ hàng trống</p>
        <p className="text-sm mb-5">
          Thêm voucher yêu thích để bắt đầu mua sắm
        </p>
        <button
          onClick={() => navigate("/customer")}
          className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-orange-600"
        >
          Khám phá voucher
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* HEADER GIỎ HÀNG & THAO TÁC HÀNG LOẠT */}
      <div className="flex items-center justify-between mb-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={handleToggleSelectAll}
            className="w-4 h-4 accent-orange-500 rounded cursor-pointer"
          />
          <h1 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart size={18} /> Chọn tất cả ({cart.items.length} voucher)
          </h1>
        </div>

        <button
          onClick={() => setShowDeleteModal(true)}
          disabled={selectedIds.length === 0}
          className="text-sm text-red-500 hover:text-red-700 disabled:text-gray-300 disabled:cursor-not-allowed flex items-center gap-1 font-medium transition-colors"
        >
          <Trash2 size={15} /> Xóa mục đã chọn ({selectedIds.length})
        </button>
      </div>

      {cart.hasInvalidItems && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-start gap-2">
          <AlertCircle
            size={16}
            className="text-amber-600 mt-0.5 flex-shrink-0"
          />
          <p className="text-sm text-amber-700">
            Một số voucher trong giỏ đã thay đổi trạng thái. Vui lòng kiểm tra
            trước khi thanh toán.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* DANH SÁCH SẢN PHẨM */}
        <div className="lg:col-span-2 space-y-3">
          {cart.items.map((item) => {
            const isChecked = selectedIds.includes(item.voucherId);
            return (
              <div
                key={item.voucherId}
                className={`bg-white rounded-xl border p-3 flex items-center gap-3 transition-all ${
                  item.status === "unavailable"
                    ? "border-red-200 opacity-70 bg-gray-50"
                    : item.status === "qty_exceeded"
                      ? "border-amber-200"
                      : isChecked
                        ? "border-orange-300 bg-orange-50/20 shadow-sm"
                        : "border-gray-100"
                }`}
              >
                {/* CHECKBOX CHỌN TỪNG MÓN */}
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggleItem(item.voucherId)}
                  className="w-4 h-4 accent-orange-500 rounded cursor-pointer flex-shrink-0"
                />

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <button
                    onClick={() =>
                      navigate(`/customer/vouchers/${item.voucherId}`)
                    }
                    className="text-sm font-semibold text-gray-900 hover:text-orange-600 text-left line-clamp-1"
                  >
                    {item.name}
                  </button>
                  <p className="text-xs text-gray-400 mb-1">{item.partner}</p>
                  <p className="text-sm font-bold text-orange-600">
                    {item.salePrice.toLocaleString("vi-VN")}đ
                  </p>
                  {item.status === "unavailable" && (
                    <span className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
                      <AlertCircle size={11} />
                      Không khả dụng
                    </span>
                  )}
                  {item.status === "qty_exceeded" && (
                    <span className="text-xs text-amber-600 flex items-center gap-1 mt-0.5">
                      <AlertCircle size={11} />
                      Chỉ còn {item.remaining}
                    </span>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() =>
                        handleQtyChange(item.voucherId, item.quantity - 1)
                      }
                      disabled={!!updatingId}
                      className="px-2 py-0.5 text-gray-600 hover:bg-gray-50 text-sm"
                    >
                      −
                    </button>
                    <span className="px-2 py-0.5 text-sm min-w-6 text-center">
                      {updatingId === item.voucherId ? "..." : item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleQtyChange(item.voucherId, item.quantity + 1)
                      }
                      disabled={!!updatingId}
                      className="px-2 py-0.5 text-gray-600 hover:bg-gray-50 text-sm"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {(item.salePrice * item.quantity).toLocaleString("vi-VN")}đ
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CỘT TỔNG TIỀN (CHỈ TÍNH ITEM ĐƯỢC CHỌN) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-20 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">
              Tóm tắt đơn hàng
            </h3>
            <div className="space-y-2 mb-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Đã chọn:</span>
                <span className="font-medium">
                  {selectedTotalQty} voucher ({selectedIds.length} mục)
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tạm tính:</span>
                <span className="font-semibold">
                  {selectedSubtotal.toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-3 mb-4">
              <div className="flex justify-between font-bold text-base">
                <span>Tổng thanh toán</span>
                <span className="text-orange-600">
                  {selectedSubtotal.toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={selectedIds.length === 0 || checkingOut}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-2.5 rounded-xl font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {checkingOut ? (
                "Đang kiểm tra..."
              ) : (
                <>
                  <span>Tiến hành đặt mua ({selectedIds.length})</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
            <button
              onClick={() => navigate("/customer")}
              className="w-full text-center text-sm text-gray-500 hover:text-orange-500 mt-2"
            >
              ← Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>

      {/* MODAL POPUP XÁC NHẬN XÓA CÁC SẢN PHẨM ĐÃ CHỌN */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => !deleting && setShowDeleteModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-5 text-center transform transition-all">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 text-red-500">
              <Trash2 size={24} />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">
              Xóa {selectedIds.length} sản phẩm?
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              Bạn có chắc chắn muốn bỏ {selectedIds.length} voucher đã chọn khỏi
              giỏ hàng không?
            </p>
            <div className="flex gap-3">
              <button
                disabled={deleting}
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                disabled={deleting}
                onClick={handleConfirmDeleteSelected}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {deleting ? "Đang xóa..." : "Xóa ngay"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
