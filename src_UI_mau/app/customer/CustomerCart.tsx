import { useState } from "react";
import { ShoppingCart, Trash2, AlertCircle, ArrowRight, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { mockCustomerVouchers, type CartItem } from "./customerMockData";

interface Props {
  cart: CartItem[];
  onCartChange: (cart: CartItem[]) => void;
  onCheckout: () => void;
  onContinueShopping: () => void;
  onVoucherSelect: (id: string) => void;
}

export default function CustomerCart({ cart, onCartChange, onCheckout, onContinueShopping, onVoucherSelect }: Props) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);

  const getVoucher = (id: string) => mockCustomerVouchers.find(v => v.id === id);

  const enrichedCart = cart.map(item => {
    const v = getVoucher(item.voucherId);
    const remaining = v ? v.totalQty - v.soldQty : 0;
    let status: CartItem['status'] = 'valid';
    if (!v || v.availability !== 'selling') status = 'unavailable';
    else if (item.quantity > remaining) status = 'qty_exceeded';
    return { ...item, voucher: v, remaining, status };
  });

  const hasInvalidItems = enrichedCart.some(i => i.status !== 'valid');
  const validItems = enrichedCart.filter(i => i.status === 'valid');
  const subtotal = validItems.reduce((sum, i) => sum + (i.voucher?.salePrice || 0) * i.quantity, 0);
  const totalQty = validItems.reduce((sum, i) => sum + i.quantity, 0);

  const handleQtyChange = (voucherId: string, newQty: number) => {
    if (newQty < 1) return;
    const item = enrichedCart.find(i => i.voucherId === voucherId);
    if (item && newQty > item.remaining) {
      toast.error(`Chỉ còn ${item.remaining} voucher.`);
      return;
    }
    setUpdating(voucherId);
    setTimeout(() => {
      onCartChange(cart.map(c => c.voucherId === voucherId ? { ...c, quantity: newQty } : c));
      setUpdating(null);
    }, 300);
  };

  const handleClearCart = () => {
    onCartChange([]);
    setShowClearConfirm(false);
    toast.success('Đã xóa toàn bộ giỏ hàng.');
  };

  const handleCheckout = () => {
    if (hasInvalidItems) { toast.error('Vui lòng xử lý các voucher không khả dụng trước khi thanh toán.'); return; }
    if (cart.length === 0) return;
    setCheckingOut(true);
    setTimeout(() => {
      setCheckingOut(false);
      onCheckout();
    }, 600);
  };

  if (cart.length === 0) return (
    <div className="flex flex-col items-center py-20 text-gray-400">
      <ShoppingBag size={48} className="mb-3" />
      <p className="text-lg font-medium text-gray-600 mb-1">Giỏ hàng trống</p>
      <p className="text-sm mb-5">Thêm voucher yêu thích để bắt đầu mua sắm</p>
      <button onClick={onContinueShopping} className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-orange-600">
        Khám phá voucher
      </button>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <ShoppingCart size={20} /> Giỏ hàng ({cart.length} voucher)
        </h1>
        <button onClick={() => setShowClearConfirm(true)} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1">
          <Trash2 size={14} /> Xóa tất cả
        </button>
      </div>

      {hasInvalidItems && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-start gap-2">
          <AlertCircle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-700">Một số voucher trong giỏ đã thay đổi trạng thái. Vui lòng kiểm tra trước khi thanh toán.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Items list */}
        <div className="lg:col-span-2 space-y-3">
          {enrichedCart.map(item => {
            if (!item.voucher) return null;
            const v = item.voucher;
            return (
              <div key={item.voucherId}
                className={`bg-white rounded-xl border p-3 flex gap-3 ${item.status === 'unavailable' ? 'border-red-200 opacity-70' : item.status === 'qty_exceeded' ? 'border-amber-200' : 'border-gray-100'}`}>
                <img src={v.image} alt={v.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <button onClick={() => onVoucherSelect(v.id)} className="text-sm font-semibold text-gray-900 hover:text-orange-600 text-left line-clamp-1">
                    {v.name}
                  </button>
                  <p className="text-xs text-gray-400 mb-1">{v.partner}</p>
                  <p className="text-sm font-bold text-orange-600">{v.salePrice.toLocaleString('vi-VN')}đ</p>
                  {item.status === 'unavailable' && (
                    <span className="text-xs text-red-500 flex items-center gap-1 mt-0.5"><AlertCircle size={11} />Không khả dụng</span>
                  )}
                  {item.status === 'qty_exceeded' && (
                    <span className="text-xs text-amber-600 flex items-center gap-1 mt-0.5"><AlertCircle size={11} />Chỉ còn {item.remaining}</span>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button onClick={() => handleQtyChange(item.voucherId, item.quantity - 1)} disabled={!!updating} className="px-2 py-0.5 text-gray-600 hover:bg-gray-50 text-sm">−</button>
                    <span className="px-2 py-0.5 text-sm min-w-6 text-center">{updating === item.voucherId ? '...' : item.quantity}</span>
                    <button onClick={() => handleQtyChange(item.voucherId, item.quantity + 1)} disabled={!!updating} className="px-2 py-0.5 text-gray-600 hover:bg-gray-50 text-sm">+</button>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{(v.salePrice * item.quantity).toLocaleString('vi-VN')}đ</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-20">
            <h3 className="font-semibold text-gray-900 mb-3">Tóm tắt đơn hàng</h3>
            <div className="space-y-2 mb-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Số lượng:</span>
                <span>{totalQty} voucher</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tạm tính:</span>
                <span className="font-semibold">{subtotal.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-3 mb-4">
              <div className="flex justify-between font-bold text-base">
                <span>Tổng cộng</span>
                <span className="text-orange-600">{subtotal.toLocaleString('vi-VN')}đ</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">(Thanh toán mô phỏng — không tính phí thật)</p>
            </div>
            <button onClick={handleCheckout} disabled={hasInvalidItems || checkingOut || cart.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-2.5 rounded-xl font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed">
              {checkingOut ? 'Đang kiểm tra...' : <><span>Tiến hành đặt mua</span><ArrowRight size={16} /></>}
            </button>
            <button onClick={onContinueShopping} className="w-full text-center text-sm text-gray-500 hover:text-orange-500 mt-2">
              ← Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>

      {/* Clear confirm modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowClearConfirm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-xs w-full p-5 text-center">
            <Trash2 size={24} className="mx-auto text-red-500 mb-2" />
            <h3 className="font-bold text-gray-900 mb-1">Xóa toàn bộ giỏ hàng?</h3>
            <p className="text-sm text-gray-500 mb-4">Tất cả {cart.length} voucher trong giỏ sẽ bị xóa.</p>
            <div className="flex gap-2">
              <button onClick={() => setShowClearConfirm(false)} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm">Hủy</button>
              <button onClick={handleClearCart} className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-semibold">Xóa tất cả</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
