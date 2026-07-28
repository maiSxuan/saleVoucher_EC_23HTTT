import { useState } from "react";
import { Tag, QrCode, Copy, AlertCircle, Package } from "lucide-react";
import { toast } from "sonner";
import {
  mockCustomerOrders, mockCustomerVouchers, codeStatusLabels,
  type VoucherCode,
} from "./customerMockData";

interface Props {
  onGoOrders: () => void;
}

const codeStatusColor: Record<string, string> = {
  pending_issue: 'bg-amber-100 text-amber-700',
  issued_unused: 'bg-green-100 text-green-700',
  used: 'bg-gray-100 text-gray-500',
  expired: 'bg-gray-100 text-gray-400',
  cancelled: 'bg-gray-100 text-gray-400',
  disabled: 'bg-red-100 text-red-500',
  error: 'bg-red-100 text-red-600',
};

// Flatten all codes across all orders
function getAllCodes(): Array<VoucherCode & { orderId: string }> {
  return mockCustomerOrders.flatMap(order =>
    order.codes.map(code => ({ ...code, orderId: order.id }))
  );
}

export default function CustomerVouchers({ onGoOrders }: Props) {
  const [filter, setFilter] = useState<string>('all');
  const allCodes = getAllCodes();

  const filtered = allCodes.filter(c => filter === 'all' || c.status === filter);

  const getVoucher = (id: string) => mockCustomerVouchers.find(v => v.id === id);

  if (allCodes.length === 0) return (
    <div className="flex flex-col items-center py-20 text-gray-400">
      <Tag size={48} className="mb-3" />
      <p className="text-lg font-medium text-gray-600 mb-1">Chưa có voucher nào</p>
      <p className="text-sm mb-5">Mua voucher để nhận mã tại đây</p>
    </div>
  );

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Tag size={20} /> Mã voucher của tôi
      </h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {[
          { key: 'all', label: 'Tất cả' },
          { key: 'issued_unused', label: 'Chưa dùng' },
          { key: 'used', label: 'Đã dùng' },
          { key: 'expired', label: 'Hết hạn' },
          { key: 'error', label: 'Lỗi cấp mã' },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium flex-shrink-0 ${filter === f.key ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-gray-400">
          <Tag size={32} className="mb-2" />
          <p className="text-sm">Không có mã trong danh mục này</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((codeObj, idx) => {
            const v = getVoucher(codeObj.voucherId);
            const isUsable = codeObj.status === 'issued_unused' && codeObj.code;
            const hasError = codeObj.status === 'error';

            return (
              <div key={idx} className={`bg-white border rounded-xl overflow-hidden ${hasError ? 'border-red-200' : 'border-gray-100'}`}>
                {/* Ticket header */}
                <div className="flex items-center gap-3 p-3 border-b border-dashed border-gray-100">
                  {v && <img src={v.image} alt={v.name} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 line-clamp-1">{v?.name || codeObj.voucherId}</p>
                    <p className="text-xs text-gray-400">{v?.partner}</p>
                    {v?.endUseDate && <p className="text-xs text-gray-400">Hết hạn sử dụng: {v.endUseDate}</p>}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium flex-shrink-0 ${codeStatusColor[codeObj.status]}`}>
                    {codeStatusLabels[codeObj.status]}
                  </span>
                </div>

                {/* Ticket body */}
                <div className="p-3">
                  {hasError ? (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle size={16} />
                      <div>
                        <p className="text-sm font-medium">Lỗi cấp mã</p>
                        <p className="text-xs text-red-400">Vui lòng liên hệ Admin để được hỗ trợ</p>
                      </div>
                    </div>
                  ) : codeObj.code ? (
                    <div className="flex items-center gap-3">
                      {/* Simulated QR */}
                      <div className="w-16 h-16 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <div className="grid grid-cols-4 gap-0.5">
                          {Array.from({ length: 16 }).map((_, i) => (
                            <div key={i} className={`w-2.5 h-2.5 ${(i + idx) % 3 !== 0 ? 'bg-gray-900' : 'bg-white'} rounded-sm`} />
                          ))}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-400 mb-0.5">Mã voucher</p>
                        <p className="font-mono text-base font-bold text-gray-900 tracking-wider">{codeObj.code}</p>
                        {codeObj.usedBranch && <p className="text-xs text-gray-400 mt-0.5">Dùng tại: {codeObj.usedBranch}</p>}
                      </div>
                      {isUsable && (
                        <button onClick={() => { navigator.clipboard.writeText(codeObj.code!); toast.success('Đã sao chép mã!'); }}
                          className="text-gray-400 hover:text-orange-500 p-1">
                          <Copy size={15} />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-amber-600">
                      <QrCode size={16} />
                      <p className="text-sm">Đang xử lý cấp mã...</p>
                    </div>
                  )}

                  {/* Applicable branches */}
                  {v?.branches && isUsable && (
                    <div className="mt-2 pt-2 border-t border-gray-50">
                      <p className="text-xs text-gray-400 mb-1">Áp dụng tại:</p>
                      <p className="text-xs text-gray-600">{v.branches.join(' · ')}</p>
                    </div>
                  )}

                  {/* Link to order */}
                  <div className="mt-2 flex items-center justify-between">
                    <button onClick={onGoOrders} className="text-xs text-orange-500 hover:underline flex items-center gap-1">
                      <Package size={11} /> Xem đơn hàng {codeObj.orderId}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
