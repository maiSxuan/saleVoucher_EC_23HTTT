import { useState, useEffect } from "react";
import { Search, X, ArrowLeft, ShoppingCart, AlertTriangle, RefreshCw, Eye, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { mockOrders, orderStatusLabels, paymentStatusLabels, voucherCodeStatusLabels, type Order, type OrderStatus, type PaymentStatus, type VoucherCodeStatus } from "../data/mockData";
import { StatusBadge, getOrderStatusBadge, getPaymentStatusBadge, getVoucherCodeStatusBadge } from "../components/ui/StatusBadge";
import { ConfirmModal } from "../components/ui/ConfirmModal";
import type { Page } from "../components/layout/AdminLayout";

interface OrdersProps {
  initialFilters?: Record<string, unknown>;
  onNavigate: (page: Page, filters?: Record<string, unknown>) => void;
}

export default function Orders({ initialFilters, onNavigate }: OrdersProps) {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchId, setSearchId] = useState('');
  const [filterOrderStatus, setFilterOrderStatus] = useState<string>(String(initialFilters?.orderStatus || ''));
  const [filterPayment, setFilterPayment] = useState('');
  const [filterCode, setFilterCode] = useState<string>(String(initialFilters?.voucherCodeStatus || ''));
  const [selected, setSelected] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const [refundModal, setRefundModal] = useState(false);
  const [rejectRefundModal, setRejectRefundModal] = useState(false);
  const [reissueModal, setReissueModal] = useState(false);

  useEffect(() => {
    if (initialFilters?.orderStatus) setFilterOrderStatus(String(initialFilters.orderStatus));
    if (initialFilters?.voucherCodeStatus) setFilterCode(String(initialFilters.voucherCodeStatus));
  }, [initialFilters]);

  const filtered = orders.filter(o => {
    const matchId = !searchId || o.id.toLowerCase().includes(searchId.toLowerCase()) || o.customerName.toLowerCase().includes(searchId.toLowerCase());
    const matchStatus = !filterOrderStatus || o.orderStatus === filterOrderStatus;
    const matchPayment = !filterPayment || o.paymentStatus === filterPayment;
    const matchCode = !filterCode || o.voucherCodeStatus === filterCode;
    return matchId && matchStatus && matchPayment && matchCode;
  });

  const updateOrder = (id: string, changes: Partial<Order>) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...changes } : o));
    setSelected(prev => prev?.id === id ? { ...prev, ...changes } : prev);
  };

  const doRefund = async (reason?: string) => {
    if (!selected) return;
    const newCode = [...(selected.codeHistory || []), {
      id: `CODE_R${Date.now()}`, timestamp: new Date().toLocaleString('vi-VN'),
      action: 'Vô hiệu hóa mã (hoàn tiền)', code: selected.voucherCode, status: 'disabled', note: `Admin ghi nhận hoàn tiền mô phỏng. Lý do: ${reason}`
    }];
    const newPay = [...selected.paymentHistory, {
      id: `PAY_R${Date.now()}`, timestamp: new Date().toLocaleString('vi-VN'),
      action: 'Hoàn tiền mô phỏng', amount: selected.total, status: 'refunded_sim', note: reason || ''
    }];
    updateOrder(selected.id, {
      orderStatus: 'refunded' as OrderStatus,
      paymentStatus: 'refunded_sim' as PaymentStatus,
      voucherCodeStatus: 'disabled' as VoucherCodeStatus,
      codeHistory: newCode,
      paymentHistory: newPay,
    });
    setRefundModal(false);
    toast.success('Đã ghi nhận hoàn tiền mô phỏng.', { description: 'Voucher code liên quan đã bị vô hiệu hóa.' });
  };

  const doRejectRefund = async (reason?: string) => {
    if (!selected) return;
    updateOrder(selected.id, { orderStatus: 'refund_rejected' as OrderStatus });
    setRejectRefundModal(false);
    toast.success('Đã từ chối yêu cầu hoàn tiền.', { description: reason });
  };

  const doReissue = async () => {
    if (!selected) return;
    const newCode = `NEW-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const codeHistory = [...selected.codeHistory, {
      id: `CODE_NEW${Date.now()}`, timestamp: new Date().toLocaleString('vi-VN'),
      action: 'Vô hiệu hóa mã cũ', oldCode: selected.voucherCode, status: 'disabled', note: 'Vô hiệu hóa mã lỗi trước khi cấp lại'
    }, {
      id: `CODE_RI${Date.now()}`, timestamp: new Date().toLocaleString('vi-VN'),
      action: 'Cấp lại mã mới', code: newCode, status: 'issued', note: 'Mã mới đã được sinh. Gửi email mô phỏng đến khách hàng.'
    }];
    updateOrder(selected.id, {
      voucherCode: newCode,
      voucherCodeStatus: 'issued' as VoucherCodeStatus,
      codeHistory,
    });
    setReissueModal(false);
    toast.success(`Đã cấp lại mã mới: ${newCode}`, { description: 'Email mô phỏng đã được gửi đến khách hàng.' });
  };

  if (selected) {
    const ob = getOrderStatusBadge(selected.orderStatus);
    const pb = getPaymentStatusBadge(selected.paymentStatus);
    const cb = getVoucherCodeStatusBadge(selected.voucherCodeStatus);

    const hasInconsistency = selected.paymentStatus === 'success' && selected.voucherCodeStatus === 'generation_error';
    const canRefund = selected.orderStatus === 'pending_refund';
    const canRejectRefund = selected.orderStatus === 'pending_refund';
    const canReissue = selected.paymentStatus === 'success' && (selected.voucherCodeStatus === 'generation_error' || selected.voucherCodeStatus === 'not_issued');

    return (
      <div className="p-6 max-w-6xl mx-auto">
        <button onClick={() => setSelected(null)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-4">
          <ArrowLeft size={16} /> Quay lại danh sách
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Đơn hàng {selected.id}</h2>
              <p className="text-sm text-gray-500 mt-0.5">Tạo lúc {selected.createdAt}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <StatusBadge label={`Đơn hàng: ${ob.label}`} variant={ob.variant} dot={ob.dot} />
                <StatusBadge label={`Thanh toán: ${pb.label}`} variant={pb.variant} />
                <StatusBadge label={`Mã voucher: ${cb.label}`} variant={cb.variant} dot={cb.dot} />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {canRefund && (
                <button onClick={() => setRefundModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <RefreshCw size={14} /> Ghi nhận hoàn tiền mô phỏng
                </button>
              )}
              {canRejectRefund && (
                <button onClick={() => setRejectRefundModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">
                  <X size={14} /> Từ chối hoàn tiền
                </button>
              )}
              {canReissue && (
                <button onClick={() => setReissueModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600">
                  Cấp lại mã mới
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Inconsistency alert */}
        {hasInconsistency && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 flex items-start gap-3">
            <AlertTriangle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Phát hiện dữ liệu cần kiểm tra</p>
              <p className="text-sm text-red-700 mt-1">Đơn hàng đã thanh toán thành công nhưng chưa có mã voucher hợp lệ (lỗi sinh mã). Cần cấp lại mã hoặc xử lý hủy đơn.</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-white rounded-t-xl border border-b-0 px-4 overflow-x-auto">
          {[
            { id: 'overview', label: 'Tổng quan' },
            { id: 'payment', label: 'Lịch sử thanh toán' },
            { id: 'codes', label: 'Lịch sử mã voucher' },
            { id: 'refund', label: 'Yêu cầu hủy/hoàn tiền' },
            { id: 'log', label: 'Nhật ký quản trị' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-b-xl border border-gray-200 border-t-0 p-5">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700">Thông tin đơn hàng</h4>
                {[
                  { label: 'Mã đơn', value: selected.id },
                  { label: 'Khách hàng', value: selected.customerName },
                  { label: 'Voucher', value: selected.voucherName },
                  { label: 'Đối tác', value: selected.partnerName },
                  { label: 'Tổng tiền', value: `${selected.total.toLocaleString('vi-VN')}đ` },
                ].map(f => (
                  <div key={f.label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{f.label}:</span>
                    <span className="font-medium text-gray-900">{f.value}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700">Trạng thái</h4>
                <div className="space-y-2">
                  {[
                    { label: 'Trạng thái đơn', badge: ob },
                    { label: 'Thanh toán', badge: pb },
                    { label: 'Mã voucher', badge: cb },
                  ].map(({ label, badge }) => (
                    <div key={label} className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{label}:</span>
                      <StatusBadge {...badge} />
                    </div>
                  ))}
                  {selected.voucherCode && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Mã voucher:</span>
                      <code className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-800 text-xs">{selected.voucherCode}</code>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-2">
              {selected.paymentHistory.map(p => (
                <div key={p.id} className="flex items-center gap-3 border border-gray-200 rounded-lg p-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{p.action}</p>
                    <p className="text-xs text-gray-500">{p.timestamp}{p.note ? ` — ${p.note}` : ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{p.amount.toLocaleString('vi-VN')}đ</p>
                    <StatusBadge label={p.status === 'success' ? 'Thành công' : p.status === 'refunded_sim' ? 'Đã hoàn' : 'Chờ'} variant={p.status === 'success' ? 'green' : p.status === 'refunded_sim' ? 'blue' : 'amber'} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'codes' && (
            <div className="space-y-2">
              {selected.codeHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-sm">Chưa có lịch sử phát hành mã.</p>
                </div>
              ) : (
                selected.codeHistory.map(c => (
                  <div key={c.id} className={`border rounded-lg p-3 ${c.status === 'generation_error' ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900">{c.action}</p>
                      <StatusBadge
                        label={c.status === 'issued' ? 'Đã phát hành' : c.status === 'generation_error' ? 'Lỗi sinh mã' : c.status === 'disabled' ? 'Vô hiệu hóa' : c.status === 'used' ? 'Đã sử dụng' : c.status}
                        variant={c.status === 'issued' ? 'blue' : c.status === 'generation_error' ? 'red' : c.status === 'disabled' ? 'gray' : 'green'}
                      />
                    </div>
                    <p className="text-xs text-gray-500">{c.timestamp}</p>
                    {c.code && <code className="mt-1 block text-xs font-mono bg-gray-100 px-2 py-0.5 rounded">{c.code}</code>}
                    {c.oldCode && <code className="mt-1 block text-xs font-mono bg-red-100 px-2 py-0.5 rounded line-through text-gray-400">{c.oldCode}</code>}
                    {c.note && <p className="text-xs text-gray-500 mt-1">{c.note}</p>}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'refund' && (
            <div>
              {!selected.refundRequest ? (
                <div className="text-center py-8 text-gray-400">
                  <CheckCircle size={36} className="mx-auto mb-2" />
                  <p className="text-sm">Không có yêu cầu hủy/hoàn tiền.</p>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-900">Yêu cầu hoàn tiền</h5>
                    <span className="text-xs text-gray-500">{selected.refundRequest.requestedAt}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2"><strong>Lý do:</strong> {selected.refundRequest.reason}</p>
                  {selected.refundRequest.rejectedReason && (
                    <p className="text-sm text-red-600 mt-2"><strong>Lý do từ chối:</strong> {selected.refundRequest.rejectedReason}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'log' && (
            <div className="text-center py-8 text-gray-400">
              <Clock size={36} className="mx-auto mb-2" />
              <p className="text-sm">Nhật ký quản trị được ghi vào module Nhật ký hệ thống.</p>
              <button onClick={() => onNavigate('logs')} className="mt-2 text-sm text-blue-600 hover:text-blue-800">Xem nhật ký</button>
            </div>
          )}
        </div>

        {/* Modals */}
        <ConfirmModal
          open={refundModal}
          onClose={() => setRefundModal(false)}
          onConfirm={doRefund}
          title="Ghi nhận hoàn tiền mô phỏng"
          targetName={`Đơn hàng ${selected.id}`}
          description={`Số tiền dự kiến hoàn: ${selected.total.toLocaleString('vi-VN')}đ`}
          warning="Voucher code liên quan sẽ bị vô hiệu hóa. Đây là hoàn tiền mô phỏng — không phải giao dịch thật."
          consequences={['Trạng thái đơn → Đã hoàn tiền', 'Thanh toán → Đã hoàn tiền mô phỏng', 'Mã voucher → Vô hiệu hóa']}
          requireReason
          reasonLabel="Lý do hoàn tiền"
          confirmLabel="Ghi nhận hoàn tiền mô phỏng"
        />

        <ConfirmModal
          open={rejectRefundModal}
          onClose={() => setRejectRefundModal(false)}
          onConfirm={doRejectRefund}
          title="Từ chối yêu cầu hoàn tiền"
          targetName={`Đơn hàng ${selected.id}`}
          requireReason
          reasonLabel="Lý do từ chối hoàn tiền"
          confirmLabel="Xác nhận từ chối"
          confirmVariant="danger"
        />

        {reissueModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setReissueModal(false)} />
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Cấp lại voucher code</h3>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm text-amber-700 space-y-1">
                <p><strong>Đơn hàng:</strong> {selected.id}</p>
                <p><strong>Khách hàng:</strong> {selected.customerName}</p>
                {selected.voucherCode && <p><strong>Mã cũ sẽ vô hiệu hóa:</strong> <code className="font-mono">{selected.voucherCode}</code></p>}
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-700">
                Hệ thống sẽ: vô hiệu hóa mã cũ → sinh mã mới → liên kết với đơn và khách hàng → gửi <strong>email mô phỏng</strong>.
              </div>
              <p className="text-xs text-gray-500 mb-4">Lưu ý: Đây là gửi email mô phỏng, không phải tích hợp email thật.</p>
              <div className="flex justify-end gap-2">
                <button onClick={() => setReissueModal(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Hủy</button>
                <button onClick={doReissue} className="px-4 py-2 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600">Xác nhận cấp lại mã</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // List view
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
        <p className="text-sm text-gray-500 mt-1">Tra cứu, theo dõi và xử lý các vấn đề liên quan đến đơn hàng.</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={searchId} onChange={e => setSearchId(e.target.value)} placeholder="Mã đơn / tên khách..." className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={filterOrderStatus} onChange={e => setFilterOrderStatus(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Tất cả trạng thái đơn</option>
            {Object.entries(orderStatusLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <select value={filterPayment} onChange={e => setFilterPayment(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Tất cả thanh toán</option>
            {Object.entries(paymentStatusLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <select value={filterCode} onChange={e => setFilterCode(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Tất cả trạng thái mã</option>
            {Object.entries(voucherCodeStatusLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="text-sm text-gray-500">{filtered.length} đơn hàng</p>
          <button onClick={() => { setSearchId(''); setFilterOrderStatus(''); setFilterPayment(''); setFilterCode(''); }} className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1">
            <X size={14} /> Đặt lại
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <ShoppingCart size={40} className="mb-2" />
            <p className="text-sm">Không tìm thấy đơn hàng phù hợp</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['Mã đơn', 'Khách hàng', 'Voucher', 'Đối tác', 'Tổng tiền', 'Trạng thái đơn', 'Thanh toán', 'Mã voucher', 'Thời gian', ''].map(h => (
                    <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(o => {
                  const ob = getOrderStatusBadge(o.orderStatus);
                  const pb = getPaymentStatusBadge(o.paymentStatus);
                  const cb = getVoucherCodeStatusBadge(o.voucherCodeStatus);
                  const hasIssue = o.voucherCodeStatus === 'generation_error' || o.orderStatus === 'pending_refund';
                  return (
                    <tr key={o.id} onClick={() => setSelected(o)} className={`hover:bg-gray-50 cursor-pointer ${hasIssue ? 'bg-amber-50/50' : ''}`}>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1.5">
                          {hasIssue && <AlertTriangle size={13} className="text-amber-500" />}
                          <code className="text-xs font-mono text-gray-800">{o.id}</code>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-700">{o.customerName}</td>
                      <td className="px-3 py-3 text-sm text-gray-600 max-w-[160px] truncate">{o.voucherName}</td>
                      <td className="px-3 py-3 text-sm text-gray-600 truncate max-w-[120px]">{o.partnerName}</td>
                      <td className="px-3 py-3 text-sm font-medium text-gray-900">{o.total.toLocaleString('vi-VN')}đ</td>
                      <td className="px-3 py-3"><StatusBadge {...ob} /></td>
                      <td className="px-3 py-3"><StatusBadge {...pb} /></td>
                      <td className="px-3 py-3"><StatusBadge {...cb} /></td>
                      <td className="px-3 py-3 text-xs text-gray-400">{o.createdAt.split(' ')[0]}</td>
                      <td className="px-3 py-3">
                        <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800">
                          <Eye size={14} /> Xem
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
