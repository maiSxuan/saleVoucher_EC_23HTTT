import { useState } from "react";
import { ArrowLeft, ShoppingCart, MapPin, Clock, Star, CheckCircle, AlertCircle, Info, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { mockCustomerVouchers, type CustomerVoucher } from "./customerMockData";
import type { CartItem } from "./customerMockData";

interface Props {
  voucherId: string;
  cart: CartItem[];
  onCartChange: (cart: CartItem[]) => void;
  onBack: () => void;
  onGoCart: () => void;
  isLoggedIn: boolean;
  onLoginRequired: () => void;
}

export default function CustomerVoucherDetail({ voucherId, cart, onCartChange, onBack, onGoCart, isLoggedIn, onLoginRequired }: Props) {
  const [qty, setQty] = useState(1);
  const [addState, setAddState] = useState<'idle' | 'checking' | 'added' | 'unavailable'>('idle');

  const voucher = mockCustomerVouchers.find(v => v.id === voucherId);
  if (!voucher) return <div className="py-16 text-center text-gray-400">Không tìm thấy voucher.</div>;

  const isAvailable = voucher.availability === 'selling';
  const remaining = voucher.totalQty - voucher.soldQty;
  const discountPct = Math.round((1 - voucher.salePrice / voucher.originalPrice) * 100);
  const cartItem = cart.find(c => c.voucherId === voucherId);

  const handleAddToCart = () => {
    if (!isLoggedIn) { onLoginRequired(); return; }
    if (!isAvailable) { toast.error('Voucher này hiện không khả dụng.'); return; }

    setAddState('checking');
    setTimeout(() => {
      // Recheck availability
      if (voucher.availability !== 'selling' || remaining <= 0) {
        setAddState('unavailable');
        toast.error('Voucher vừa hết số lượng hoặc đã ngừng bán.');
        return;
      }
      const totalInCart = (cartItem?.quantity || 0) + qty;
      if (totalInCart > remaining) {
        setAddState('idle');
        toast.error(`Chỉ còn ${remaining} voucher. Trong giỏ đã có ${cartItem?.quantity || 0}.`);
        return;
      }
      const newCart = cartItem
        ? cart.map(c => c.voucherId === voucherId ? { ...c, quantity: c.quantity + qty } : c)
        : [...cart, { voucherId, quantity: qty, status: 'valid' as const }];
      onCartChange(newCart);
      setAddState('added');
      toast.success(`Đã thêm ${qty} voucher vào giỏ hàng.`);
    }, 600);
  };

  const unavailableMsg: Record<string, string> = {
    sold_out: 'Voucher này đã hết số lượng.',
    expired: 'Voucher này đã hết hạn bán.',
    suspended: 'Voucher đang tạm ngưng bán.',
    stopped: 'Voucher đã ngừng bán.',
    scheduled: 'Voucher chưa đến thời gian bán.',
  };

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 mb-4 hover:text-gray-700">
        <ArrowLeft size={16} /> Quay lại
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Image + Info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative rounded-xl overflow-hidden">
            <img src={voucher.image} alt={voucher.name} className="w-full h-56 object-cover" />
            {discountPct > 0 && (
              <span className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">-{discountPct}%</span>
            )}
            {!isAvailable && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold text-sm">
                  {unavailableMsg[voucher.availability] || 'Không khả dụng'}
                </span>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
            <p className="text-xs text-orange-600 font-medium">{voucher.partner} · {voucher.category}</p>
            <h1 className="text-xl font-bold text-gray-900">{voucher.name}</h1>

            {voucher.rating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} className={i < Math.round(voucher.rating!) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                  ))}
                </div>
                <span className="text-sm text-gray-600">{voucher.rating} ({voucher.reviewCount} đánh giá)</span>
              </div>
            )}

            <div className="flex items-end gap-3">
              <span className="text-2xl font-bold text-orange-600">{voucher.salePrice.toLocaleString('vi-VN')}đ</span>
              <span className="text-sm text-gray-400 line-through">{voucher.originalPrice.toLocaleString('vi-VN')}đ</span>
              {discountPct > 0 && <span className="text-sm text-red-500 font-medium">Tiết kiệm {(voucher.originalPrice - voucher.salePrice).toLocaleString('vi-VN')}đ</span>}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <InfoBlock icon={Clock} label="Thời gian bán" value={`${voucher.startSaleDate} – ${voucher.endSaleDate}`} />
              <InfoBlock icon={Clock} label="Thời hạn sử dụng" value={`${voucher.startUseDate} – ${voucher.endUseDate}`} />
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Chi nhánh áp dụng</p>
              <div className="flex flex-wrap gap-1.5">
                {voucher.branches.map(b => (
                  <span key={b} className="flex items-center gap-1 text-xs bg-gray-50 border border-gray-100 px-2 py-0.5 rounded">
                    <MapPin size={10} className="text-gray-400" />{b}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">Mô tả ưu đãi</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{voucher.description}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-2">
            <h3 className="font-semibold text-gray-900 text-sm">Điều kiện sử dụng</h3>
            <p className="text-sm text-gray-600">{voucher.conditions}</p>
            <h3 className="font-semibold text-gray-900 text-sm mt-2">Chính sách hủy/hoàn tiền</h3>
            <p className="text-sm text-gray-600">{voucher.cancellationPolicy}</p>
          </div>

          {/* Reviews */}
          {voucher.reviews && voucher.reviews.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm flex items-center gap-2">
                <MessageSquare size={14} /> Đánh giá từ khách hàng ({voucher.reviews.length})
              </h3>
              <div className="space-y-3">
                {voucher.reviews.map(r => (
                  <div key={r.id} className="border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-600">
                        {r.authorName[0]}
                      </div>
                      <p className="text-sm font-medium text-gray-900">{r.authorName}</p>
                      <p className="text-xs text-gray-400 ml-auto">{r.createdAt}</p>
                    </div>
                    <p className="text-sm text-gray-600 pl-8">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Buy box */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sticky top-20">
            <div className="flex items-end gap-2 mb-3">
              <p className="text-xl font-bold text-orange-600">{voucher.salePrice.toLocaleString('vi-VN')}đ</p>
              <p className="text-sm text-gray-400 line-through">{voucher.originalPrice.toLocaleString('vi-VN')}đ</p>
            </div>

            {isAvailable ? (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex items-center gap-1 text-xs text-green-600"><CheckCircle size={12} /> Còn {remaining} voucher</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <label className="text-xs text-gray-600">Số lượng:</label>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-2.5 py-1 text-gray-600 hover:bg-gray-50 text-sm">−</button>
                    <span className="px-3 py-1 text-sm font-medium">{qty}</span>
                    <button onClick={() => setQty(q => Math.min(remaining, q + 1))} className="px-2.5 py-1 text-gray-600 hover:bg-gray-50 text-sm">+</button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-3">Tổng: <strong className="text-orange-600">{(voucher.salePrice * qty).toLocaleString('vi-VN')}đ</strong></p>

                {cartItem && <p className="text-xs text-amber-600 mb-2 flex items-center gap-1"><Info size={12} />Đã có {cartItem.quantity} trong giỏ</p>}

                <button onClick={handleAddToCart} disabled={addState === 'checking'}
                  className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-orange-600 disabled:opacity-60 mb-2">
                  <ShoppingCart size={16} />
                  {addState === 'checking' ? 'Đang kiểm tra...' : 'Thêm vào giỏ hàng'}
                </button>

                {cartItem && (
                  <button onClick={onGoCart} className="w-full border border-orange-500 text-orange-600 py-2 rounded-lg font-semibold text-sm hover:bg-orange-50">
                    Xem giỏ hàng ({cartItem.quantity})
                  </button>
                )}

                {addState === 'unavailable' && (
                  <div className="mt-2 bg-red-50 border border-red-200 rounded p-2 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle size={12} /> Voucher vừa thay đổi trạng thái.
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gray-50 rounded-lg p-3 text-center text-sm text-gray-500">
                <AlertCircle size={20} className="mx-auto mb-1 text-gray-400" />
                {unavailableMsg[voucher.availability]}
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-500">
              <p className="flex items-center gap-1.5"><CheckCircle size={11} className="text-green-500" />Thanh toán mô phỏng an toàn</p>
              <p className="flex items-center gap-1.5"><CheckCircle size={11} className="text-green-500" />Nhận mã ngay sau thanh toán</p>
              <p className="flex items-center gap-1.5"><CheckCircle size={11} className="text-green-500" />Hỗ trợ 24/7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-2.5">
      <div className="flex items-center gap-1 text-gray-400 text-xs mb-0.5"><Icon size={11} />{label}</div>
      <p className="text-xs font-medium text-gray-700">{value}</p>
    </div>
  );
}
