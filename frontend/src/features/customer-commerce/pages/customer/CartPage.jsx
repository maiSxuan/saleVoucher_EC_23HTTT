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
import { useTranslation } from "react-i18next";
import {
  fetchCart,
  updateCartItemQuantity,
  removeCartItems,
} from "../../../../shared/api/cartApi";

export default function CartPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [removingIds, setRemovingIds] = useState([]);

  const validItems =
    cart?.items?.filter((i) => i && i.status !== "unavailable") || [];
  const validIds = validItems.map((i) => i.voucherId);

  // Xóa 1 item không hợp lệ — cập nhật local, không gọi lại loadCart toàn trang
  const handleRemoveInvalidItem = async (voucherId) => {
    setRemovingIds((prev) => [...prev, voucherId]);
    try {
      const updated = await removeCartItems([voucherId]);
      setCart(updated); // dùng luôn response từ server để đồng bộ, khỏi phải loadCart lại
      setSelectedIds((prev) => prev.filter((id) => id !== voucherId));
      toast.success(t("cart.removeInvalidSuccess", "Đã xóa voucher không khả dụng khỏi giỏ hàng."));
    } catch (err) {
      console.error("Lỗi handleRemoveInvalidItem:", err);
      toast.error(t("cart.removeError", "Không thể xóa voucher. Vui lòng thử lại."));
    } finally {
      setRemovingIds((prev) => prev.filter((id) => id !== voucherId));
    }
  };

  function loadCart() {
    setLoading(true);
    setErrorMsg("");
    fetchCart()
      .then((cartData) => {
        // 1. Kiểm tra nếu cartData bị null/undefined thì gán fallback
        const currentCart = cartData || { items: [] };
        setCart(currentCart);

        // 2. Ép kiểm tra items là mảng an toàn trước khi gọi .filter() / .map()
        const items = Array.isArray(currentCart.items) ? currentCart.items : [];

        const validIds = items
          .filter((i) => i && i.status !== "unavailable")
          .map((i) => i.voucherId);

        setSelectedIds(validIds);
      })
      .catch((err) => {
        console.error("Lỗi loadCart:", err);
        setErrorMsg(t("cart.fetchError", "Không thể tải giỏ hàng. Vui lòng thử lại sau."));
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadCart();

    window.addEventListener("app_language_changed", loadCart);
    return () => window.removeEventListener("app_language_changed", loadCart);
  }, []);

  // --- LOGIC XỬ LÝ CHECKBOX ---
  const isAllSelected =
    validItems.length > 0 &&
    selectedIds.length === validItems.length &&
    validIds.every((id) => selectedIds.includes(id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(validIds);
    }
  };

  const handleToggleItem = (voucherId, status) => {
    if (status === "unavailable") return; // chặn toggle item không hợp lệ
    setSelectedIds((prev) =>
      prev.includes(voucherId)
        ? prev.filter((id) => id !== voucherId)
        : [...prev, voucherId],
    );
  };

  // --- LOGIC ĐỔI SỐ LƯỢNG ---
  const handleQtyChange = async (voucherId, newQty) => {
    if (newQty < 1) return;

    //state cũ
    const previousCart = structuredClone(cart);

    // cập nhật UI ngay lập tức
    setCart((prevCart) => {
      if (!prevCart) return prevCart;
      return {
        ...prevCart,
        items: prevCart.items.map((item) =>
          item.voucherId === voucherId ? { ...item, quantity: newQty } : item,
        ),
      };
    });

    try {
      await updateCartItemQuantity(voucherId, newQty);
    } catch (err) {
      setCart(previousCart);
      console.error("Lỗi handleQtyChange:", err);
      setErrorMsg(t("cart.updateQtyError", "Không thể cập nhật số lượng"));
    }
  };

  // --- LOGIC XÓA SẢN PHẨM ĐÃ CHỌN ---
  const handleConfirmDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    setDeleting(true);
    try {
      const updated = await removeCartItems(selectedIds);
      setCart(updated);
      toast.success(t("cart.deleteSelectedSuccess", `Đã xóa ${selectedIds.length} sản phẩm khỏi giỏ hàng.`));
      setSelectedIds([]);
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Lỗi handleConfirmDeleteSelected:", err);
      setErrorMsg(t("cart.deleteError", "Có lỗi xảy ra khi xóa sản phẩm."));
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
      toast.error(t("cart.selectAtLeastOne", "Vui lòng chọn ít nhất 1 voucher để thanh toán."));
      return;
    }
    const hasSelectedInvalid = selectedItems.some(
      (i) => i.status === "unavailable",
    );
    if (hasSelectedInvalid) {
      toast.error(t("cart.uncheckInvalid", "Vui lòng bỏ chọn các voucher không khả dụng."));
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
        {t("cart.loadingCart", "Đang tải giỏ hàng...")}
      </div>
    );
  if (errorMsg)
    return (
      <div className="py-16 text-center text-red-500 text-sm">{t(errorMsg)}</div>
    );
  if (!cart) return null;

  if (cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 text-gray-400">
        <ShoppingBag size={48} className="mb-3" />
        <p className="text-lg font-medium text-gray-600 mb-1">{t("cart.emptyTitle", "Giỏ hàng trống")}</p>
        <p className="text-sm mb-5">
          {t("cart.emptySubtitle", "Thêm voucher yêu thích để bắt đầu mua sắm")}
        </p>
        <button
          onClick={() => navigate("/customer")}
          className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-orange-600"
        >
          {t("cart.exploreVouchers", "Khám phá voucher")}
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
            <ShoppingCart size={17} /> {t("cart.selectAll", "Chọn tất cả")} ({selectedIds.length}/
            {validItems.length} {t("cart.validVouchersSuffix", "voucher hợp lệ")})
          </h1>
        </div>

        <button
          onClick={() => setShowDeleteModal(true)}
          disabled={selectedIds.length === 0}
          className="text-sm text-red-500 hover:text-red-700 disabled:text-gray-300 disabled:cursor-not-allowed flex items-center gap-1 font-medium transition-colors"
        >
          <Trash2 size={15} /> {t("cart.deleteSelected", "Xóa mục đã chọn")} ({selectedIds.length})
        </button>
      </div>

      {cart.hasInvalidItems && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-start gap-2">
          <AlertCircle
            size={16}
            className="text-amber-600 mt-0.5 flex-shrink-0"
          />
          <p className="text-sm text-amber-700">
            {t("cart.invalidItemsWarning", "Một số voucher trong giỏ đã thay đổi trạng thái. Vui lòng kiểm tra trước khi thanh toán.")}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* DANH SÁCH SẢN PHẨM */}
        <div className="lg:col-span-2 space-y-3">
          {cart.items?.map((item) => {
            const isChecked = selectedIds.includes(item.voucherId);
            return (
              <div
                key={item.voucherId}
                className={`bg-white rounded-xl border p-3 flex items-center gap-3 transition-all ${item.status === "unavailable"
                    ? "border-red-200 bg-gray-50 opacity-70"
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
                  onChange={() => handleToggleItem(item.voucherId, item.status)}
                  className={`w-4 h-4 rounded flex-shrink-0 ${item.status === "unavailable"
                      ? "accent-gray-300 cursor-not-allowed"
                      : "accent-orange-500 cursor-pointer"
                    }`}
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
                    {typeof item.name === 'object' && item.name !== null ? item.name.name : item.name}
                  </button>
                  <p className="text-xs text-gray-400 mb-1">
                    {typeof item.partner === 'object' && item.partner !== null ? (item.partner.ten_dn || item.partner.name || t("partner.partner", "Đối tác")) : item.partner}
                  </p>
                  <p className="text-sm font-bold text-orange-600">
                    {item.salePrice.toLocaleString("vi-VN")}đ
                  </p>
                  {item.status === "unavailable" && (
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle size={11} />
                        {t("voucher.unavailable", "Không khả dụng")}
                      </span>
                      <button
                        onClick={() => handleRemoveInvalidItem(item.voucherId)}
                        disabled={removingIds.includes(item.voucherId)}
                        className="text-xs font-medium text-white bg-red-500 hover:bg-red-600 active:bg-red-700 px-2.5 py-1 rounded-md transition-colors disabled:bg-red-300 disabled:cursor-wait"
                      >
                        {removingIds.includes(item.voucherId)
                          ? t("common.deleting", "Đang xóa...")
                          : t("cart.removeFromCart", "Xóa khỏi giỏ")}
                      </button>
                    </div>
                  )}
                  {item.status === "qty_exceeded" && (
                    <span className="text-xs text-amber-600 flex items-center gap-1 mt-0.5">
                      <AlertCircle size={11} />
                      {t("cart.onlyLeft", "Chỉ còn")} {item.remaining}
                    </span>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                    <button
                      disabled={item.status === "unavailable"}
                      onClick={() =>
                        handleQtyChange(item.voucherId, item.quantity - 1)
                      }
                      className={`px-2 py-0.5 text-gray-600 hover:bg-gray-50 text-sm
                       ${item.status === "unavailable" ? "cursor-not-allowed disabled" : "cursor-pointer"}`}
                    >
                      −
                    </button>
                    <span className="px-2 py-0.5 text-sm min-w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      disabled={item.status === "unavailable"}
                      onClick={() =>
                        handleQtyChange(item.voucherId, item.quantity + 1)
                      }
                      className={`px-2 py-0.5 text-gray-600 hover:bg-gray-50 text-sm ${item.status === "unavailable" ? "cursor-not-allowed disabled" : "cursor-pointer"}`}
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
              {t("cart.orderSummaryTitle", "Tóm tắt đơn hàng")}
            </h3>
            <div className="space-y-2 mb-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t("cart.selectedLabel", "Đã chọn:")}</span>
                <span className="font-medium">
                  {selectedTotalQty} voucher ({selectedIds.length} {t("cart.itemsSuffix", "mục")})
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t("cart.subtotalLabel", "Tạm tính:")}</span>
                <span className="font-semibold">
                  {selectedSubtotal.toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-3 mb-4">
              <div className="flex justify-between font-bold text-base">
                <span>{t("cart.totalPaymentLabel", "Tổng thanh toán")}</span>
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
                t("common.checking", "Đang kiểm tra...")
              ) : (
                <>
                  <span>{t("cart.proceedToPurchase", "Tiến hành đặt mua")}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
            <button
              onClick={() => navigate("/customer")}
              className="w-full text-center text-sm text-gray-500 hover:text-orange-500 mt-2"
            >
              ← {t("cart.continueShopping", "Tiếp tục mua sắm")}
            </button>
          </div>
        </div>
      </div>

      {/* MODAL POPUP XÁC NHẬN XÓA CÁC SẢN PHẨM ĐÃ CHỌN */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 "
            onClick={() => !deleting && setShowDeleteModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-5 text-center transform transition-all">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 text-red-500">
              <Trash2 size={24} />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">
              {t("cart.deleteSelectedTitle", `Xóa ${selectedIds.length} sản phẩm?`)}
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              {t("cart.deleteSelectedBody", `Bạn có chắc chắn muốn bỏ ${selectedIds.length} voucher đã chọn khỏi giỏ hàng không?`)}
            </p>
            <div className="flex gap-3">
              <button
                disabled={deleting}
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {t("common.cancel", "Hủy")}
              </button>
              <button
                disabled={deleting}
                onClick={handleConfirmDeleteSelected}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {deleting ? t("common.deleting", "Đang xóa...") : t("cart.deleteNow", "Xóa ngay")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
