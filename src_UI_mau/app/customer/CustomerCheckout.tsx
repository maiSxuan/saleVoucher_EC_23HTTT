import { useState } from "react";
import { CheckCircle, XCircle, Loader, QrCode, CreditCard, AlertCircle, ArrowLeft, Copy } from "lucide-react";
import { toast } from "sonner";
import { mockCustomerVouchers, type CartItem } from "./customerMockData";

interface CheckoutOrder {
  id: string;
  items: Array<{ voucher: ReturnType<typeof mockCustomerVouchers.find>; quantity: number; subtotal: number }>;
  total: number;
  orderStatus: 'pending_payment' | 'paid' | 'cancelled';
  paymentStatus: 'pending' | 'success' | 'failed';
  codes: Array<{ voucherId: string; code: string; codeStatus: 'pending_issue' | 'issued_unused' | 'error' }>;
  createdAt: string;
}

interface Props {
  cart: CartItem[];
  onSuccess: (orderId: string) => void;
  onCancel: () => void;
  customerName: string;
}

type CheckoutStep = 'review' | 'paying' | 'success' | 'failed';

function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 12 }, (_, i) => i % 4 === 0 && i !== 0 ? '-' + chars[Math.floor(Math.random() * chars.length)] : chars[Math.floor(Math.random() * chars.length)]).join('');
}

export default function CustomerCheckout({ cart, onSuccess, onCancel, customerName }: Props) {
  const [step, setStep] = useState<CheckoutStep>('review');
  const [payMethod, setPayMethod] = useState<'qr' | 'card'>('qr');
  const [order, setOrder] = useState<CheckoutOrder | null>(null);
  const [simulateFail, setSimulateFail] = useState(false);

  const enrichedItems = cart.map(item => {
    const voucher = mockCustomerVouchers.find(v => v.id === item.voucherId);
    const subtotal = (voucher?.salePrice || 0) * item.quantity;
    return { voucher, quantity: item.quantity, subtotal };
  }).filter(i => i.voucher);

  const total = enrichedItems.reduce((s, i) => s + i.subtotal, 0);

  const handlePay = () => {
    setStep('paying');
    setTimeout(() => {
      if (simulateFail) {
        const failedOrder: CheckoutOrder = {
          id: 'ORD-' + Date.now(),
          items: enrichedItems as any,
          total,
          orderStatus: 'pending_payment',
          paymentStatus: 'failed',
          codes: [],
          createdAt: new Date().toISOString(),
        };
        setOrder(failedOrder);
        setStep('failed');
        return;
      }
      // Success path
      const codes = enrichedItems.flatMap(i =>
        Array.from({ length: i.quantity }, () => ({
          voucherId: i.voucher!.id,
          code: generateCode(),
          codeStatus: 'issued_unused' as const,
        }))
      );
      const successOrder: CheckoutOrder = {
        id: 'ORD-' + Date.now(),
        items: enrichedItems as any,
        total,
        orderStatus: 'paid',
        paymentStatus: 'success',
        codes,
        createdAt: new Date().toISOString(),
      };
      setOrder(successOrder);
      setStep('success');
    }, 2500);
  };

  if (step === 'review') return (
    <div>
      <button onClick={onCancel} className="flex items-center gap-1.5 text-sm text-gray-500 mb-4 hover:text-gray-700">
        <ArrowLeft size={16} /> Quay lại giỏ hàng
      </button>
      <h1 className="text-xl font-bold text-gray-900 mb-4">Xác nhận đặt mua</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          {/* Items */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Voucher đặt mua</h3>
            <div className="space-y-3">
              {enrichedItems.map((item, idx) => {
                const v = item.voucher!;
                return (
                  <div key={idx} className="flex gap-3 items-center">
                    <img src={v.image} alt={v.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{v.name}</p>
                      <p className="text-xs text-gray-400">{v.partner} × {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-orange-600 flex-shrink-0">{item.subtotal.toLocaleString('vi-VN')}đ</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Buyer info */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">Thông tin người mua</h3>
            <p className="text-sm text-gray-700">{customerName}</p>
            <p className="text-xs text-gray-400">Mã voucher sẽ gửi qua email sau khi thanh toán thành công</p>
          </div>

          {/* Payment method */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Phương thức thanh toán (mô phỏng)</h3>
            <div className="grid grid-cols-2 gap-2">
              {([
                { key: 'qr', label: 'QR Code', icon: QrCode, desc: 'Quét mã QR' },
                { key: 'card', label: 'Thẻ ngân hàng', icon: CreditCard, desc: 'Visa/Mastercard' },
              ] as const).map(m => (
                <button key={m.key} onClick={() => setPayMethod(m.key)}
                  className={`border rounded-xl p-3 flex flex-col items-center gap-1 text-sm transition-colors ${payMethod === m.key ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-600'}`}>
                  <m.icon size={20} />
                  <span className="font-medium">{m.label}</span>
                  <span className="text-xs opacity-70">{m.desc}</span>
                </button>
              ))}
            </div>

            {payMethod === 'qr' && (
              <div className="mt-4 bg-gray-50 rounded-xl p-4 text-center">
                <div className="w-32 h-32 mx-auto bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center mb-2">
                  <div className="grid grid-cols-5 gap-0.5">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div key={i} className={`w-3.5 h-3.5 ${Math.random() > 0.5 ? 'bg-gray-900' : 'bg-white'} rounded-sm`} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500">[Mô phỏng] Quét mã QR để thanh toán</p>
                <p className="text-xs text-orange-600 font-semibold mt-1">{total.toLocaleString('vi-VN')}đ</p>
              </div>
            )}

            {payMethod === 'card' && (
              <div className="mt-4 space-y-2">
                <input readOnly value="**** **** **** 1234" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-gray-50" />
                <div className="grid grid-cols-2 gap-2">
                  <input readOnly value="12/28" className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-gray-50" />
                  <input readOnly value="***" className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-gray-50" />
                </div>
                <p className="text-xs text-gray-400 text-center">[Mô phỏng] Thẻ demo — không tính phí thật</p>
              </div>
            )}
          </div>

          {/* Fail simulation toggle */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-800">Demo: Mô phỏng thanh toán thất bại</p>
              <p className="text-xs text-amber-600">Bật để test luồng lỗi</p>
            </div>
            <button onClick={() => setSimulateFail(s => !s)}
              className={`w-10 h-5 rounded-full transition-colors relative ${simulateFail ? 'bg-red-500' : 'bg-gray-300'}`}>
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${simulateFail ? 'right-0.5' : 'left-0.5'}`} />
            </button>
          </div>
        </div>

        {/* Order summary */}
        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-20">
            <h3 className="font-semibold text-gray-900 mb-3">Tổng đơn hàng</h3>
            {enrichedItems.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-500 truncate max-w-32">{item.voucher!.name} ×{item.quantity}</span>
                <span>{item.subtotal.toLocaleString('vi-VN')}đ</span>
              </div>
            ))}
            <div className="border-t border-gray-100 pt-3 mt-3">
              <div className="flex justify-between font-bold">
                <span>Tổng cộng</span>
                <span className="text-orange-600">{total.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
            <button onClick={handlePay} className="mt-4 w-full bg-orange-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-orange-600 flex items-center justify-center gap-2">
              <CreditCard size={16} /> Xác nhận thanh toán
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">Thanh toán mô phỏng — không tính phí thật</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (step === 'paying') return (
    <div className="flex flex-col items-center py-24">
      <Loader size={40} className="text-orange-500 animate-spin mb-4" />
      <p className="text-lg font-semibold text-gray-800">Đang xử lý thanh toán...</p>
      <p className="text-sm text-gray-400 mt-1">[Mô phỏng] Vui lòng không đóng trang</p>
    </div>
  );

  if (step === 'failed' && order) return (
    <div className="max-w-md mx-auto py-10 text-center">
      <XCircle size={48} className="text-red-500 mx-auto mb-3" />
      <h2 className="text-xl font-bold text-gray-900 mb-1">Thanh toán thất bại</h2>
      <p className="text-sm text-gray-500 mb-2">Mã đơn: <span className="font-mono text-gray-700">{order.id}</span></p>
      <p className="text-sm text-gray-500 mb-6">Giao dịch không thành công. Vui lòng thử lại hoặc chọn phương thức khác.</p>
      <div className="space-y-2">
        <button onClick={() => { setSimulateFail(false); setStep('review'); }} className="w-full bg-orange-500 text-white py-2.5 rounded-xl font-semibold hover:bg-orange-600">
          Thử lại
        </button>
        <button onClick={onCancel} className="w-full border border-gray-300 text-gray-700 py-2.5 rounded-xl">
          Hủy đơn hàng
        </button>
      </div>
    </div>
  );

  if (step === 'success' && order) return (
    <div className="max-w-xl mx-auto py-6">
      <div className="text-center mb-6">
        <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-900 mb-1">Đặt mua thành công!</h2>
        <p className="text-sm text-gray-500">Mã đơn: <span className="font-mono text-gray-700 font-semibold">{order.id}</span></p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm flex items-center gap-2">
          <QrCode size={14} className="text-orange-500" /> Mã voucher của bạn
        </h3>
        <div className="space-y-2">
          {order.codes.map((codeObj, idx) => {
            const v = mockCustomerVouchers.find(x => x.id === codeObj.voucherId);
            return (
              <div key={idx} className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-0.5">{v?.name}</p>
                  <p className="font-mono text-sm font-bold text-gray-900 tracking-wider">{codeObj.code}</p>
                  <p className="text-xs text-green-600 mt-0.5">Chưa sử dụng · Hết hạn {v?.endUseDate}</p>
                </div>
                <button onClick={() => { navigator.clipboard.writeText(codeObj.code); toast.success('Đã sao chép mã!'); }}
                  className="text-gray-400 hover:text-orange-500">
                  <Copy size={15} />
                </button>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
          <AlertCircle size={11} />Mã đã được gửi qua email (mô phỏng) — lưu lại để sử dụng
        </p>
      </div>

      <div className="flex gap-2">
        <button onClick={() => onSuccess(order.id)} className="flex-1 bg-orange-500 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-orange-600">
          Xem đơn hàng
        </button>
        <button onClick={onCancel} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm">
          Tiếp tục mua sắm
        </button>
      </div>
    </div>
  );

  return null;
}
