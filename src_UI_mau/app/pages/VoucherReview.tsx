import { useState, useEffect } from "react";
import { Search, X, ArrowLeft, Tag, CheckCircle, XCircle, Eye, Calendar, Users, DollarSign, MapPin, Info } from "lucide-react";
import { toast } from "sonner";
import { mockVouchers, reviewStatusLabels, publicationStatusLabels, type Voucher, type ReviewStatus, type PublicationStatus } from "../data/mockData";
import { StatusBadge, getReviewStatusBadge, getPublicationStatusBadge } from "../components/ui/StatusBadge";
import { ConfirmModal } from "../components/ui/ConfirmModal";
import type { Page } from "../components/layout/AdminLayout";

interface VoucherReviewProps {
  initialFilters?: Record<string, unknown>;
  onNavigate: (page: Page, filters?: Record<string, unknown>) => void;
}

const rejectReasons = [
  'Thông tin nhận diện gây hiểu nhầm',
  'Thông tin giá không hợp lệ',
  'Thời gian không hợp lệ',
  'Số lượng/tồn kho không hợp lệ',
  'Chi nhánh/phạm vi áp dụng không hợp lệ',
  'Điều kiện sử dụng không nhất quán',
  'Khác',
];

export default function VoucherReview({ initialFilters, onNavigate }: VoucherReviewProps) {
  const [vouchers, setVouchers] = useState<Voucher[]>(mockVouchers);
  const [searchName, setSearchName] = useState('');
  const [filterPartner, setFilterPartner] = useState<string>(String(initialFilters?.partnerId || ''));
  const [filterReview, setFilterReview] = useState<string>('pending');
  const [selected, setSelected] = useState<Voucher | null>(null);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  const [approveModal, setApproveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [hideAfterApprove, setHideAfterApprove] = useState(false);

  useEffect(() => {
    if (initialFilters?.reviewStatus) setFilterReview(String(initialFilters.reviewStatus));
    if (initialFilters?.partnerId) setFilterPartner(String(initialFilters.partnerId));
  }, [initialFilters]);

  const checklistItems = [
    'Tên/mô tả/hình ảnh phù hợp',
    'Voucher gắn đúng đối tác',
    'Giá gốc và giá bán hợp lệ',
    'Giá bán nhỏ hơn giá gốc',
    'Thời gian bán hợp lệ',
    'Số lượng hợp lệ',
    'Chi nhánh thuộc đối tác và đủ điều kiện',
    'Điều kiện sử dụng không mâu thuẫn',
  ];

  const computePublicationStatus = (hide: boolean, v: Voucher): PublicationStatus => {
    if (hide) return 'hidden';
    const now = new Date();
    const start = new Date(v.startDate);
    const end = new Date(v.endDate);
    if (now > end) return 'expired';
    if (v.soldCount >= v.quantity) return 'sold_out';
    if (now >= start) return 'selling';
    return 'scheduled';
  };

  const partners = [...new Set(vouchers.map(v => v.partnerName))];

  const filtered = vouchers.filter(v => {
    const matchName = !searchName || v.name.toLowerCase().includes(searchName.toLowerCase());
    const matchPartner = !filterPartner || v.partnerId === filterPartner || v.partnerName === filterPartner;
    const matchReview = !filterReview || v.reviewStatus === filterReview;
    return matchName && matchPartner && matchReview;
  });

  const doApprove = async () => {
    if (!selected) return;
    const pubStatus = computePublicationStatus(hideAfterApprove, selected);
    const reviewNote = `Đã duyệt. Trạng thái công bố: ${publicationStatusLabels[pubStatus]}.`;
    setVouchers(prev => prev.map(v => v.id === selected.id
      ? { ...v, reviewStatus: 'approved' as ReviewStatus, publicationStatus: pubStatus, reviewedAt: new Date().toISOString().split('T')[0], reviewNote }
      : v));
    setSelected(prev => prev ? { ...prev, reviewStatus: 'approved', publicationStatus: pubStatus, reviewedAt: new Date().toISOString().split('T')[0], reviewNote } : null);
    setApproveModal(false);
    toast.success('Voucher đã được phê duyệt.', { description: `Trạng thái công bố: ${publicationStatusLabels[pubStatus]}` });
  };

  const doReject = async (reason?: string) => {
    if (!selected) return;
    const reviewNote = reason || '';
    setVouchers(prev => prev.map(v => v.id === selected.id
      ? { ...v, reviewStatus: 'rejected' as ReviewStatus, reviewedAt: new Date().toISOString().split('T')[0], reviewNote }
      : v));
    setSelected(prev => prev ? { ...prev, reviewStatus: 'rejected', reviewedAt: new Date().toISOString().split('T')[0], reviewNote } : null);
    setRejectModal(false);
    toast.success('Đã từ chối voucher.', { description: 'Lý do đã được ghi nhận và gửi cho đối tác.' });
  };

  const toggleCheck = (item: string) => setChecklist(prev => ({ ...prev, [item]: !prev[item] }));
  const checkedCount = Object.values(checklist).filter(Boolean).length;

  if (selected) {
    const rb = getReviewStatusBadge(selected.reviewStatus);
    const pb = getPublicationStatusBadge(selected.publicationStatus);
    const discountPct = Math.round((1 - selected.salePrice / selected.originalPrice) * 100);

    return (
      <div className="p-6 max-w-6xl mx-auto">
        <button onClick={() => setSelected(null)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-4">
          <ArrowLeft size={16} /> Quay lại danh sách
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{selected.name}</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                <StatusBadge label={`Kiểm duyệt: ${rb.label}`} variant={rb.variant} dot={rb.dot} />
                <StatusBadge label={`Công bố: ${pb.label}`} variant={pb.variant} dot={pb.dot} />
                <span className="text-xs text-gray-400 self-center">Gửi duyệt: {selected.submittedAt}</span>
              </div>
            </div>
            {selected.reviewStatus === 'pending' && (
              <div className="flex items-center gap-2">
                <button onClick={() => setApproveModal(true)} className="flex items-center gap-1.5 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">
                  <CheckCircle size={14} /> Phê duyệt
                </button>
                <button onClick={() => setRejectModal(true)} className="flex items-center gap-1.5 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">
                  <XCircle size={14} /> Từ chối
                </button>
              </div>
            )}
          </div>
          {selected.reviewNote && (
            <div className="mt-3 bg-gray-50 rounded-lg px-4 py-2 text-sm text-gray-600">
              <strong>Ghi chú kiểm duyệt:</strong> {selected.reviewNote}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main detail */}
          <div className="lg:col-span-2 space-y-4">
            {/* Identification */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Tag size={16} className="text-blue-600" /> Thông tin nhận diện
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-gray-400">Tên voucher</p><p className="font-medium">{selected.name}</p></div>
                <div><p className="text-xs text-gray-400">Danh mục</p><p className="font-medium">{selected.category}</p></div>
                <div className="col-span-2"><p className="text-xs text-gray-400">Mô tả</p><p className="text-gray-700">{selected.description}</p></div>
                <div><p className="text-xs text-gray-400">Đối tác phát hành</p><p className="font-medium text-blue-600">{selected.partnerName}</p></div>
                <div><p className="text-xs text-gray-400">Điều kiện sử dụng</p><p className="text-gray-700">{selected.conditions}</p></div>
              </div>
            </div>

            {/* Price */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <DollarSign size={16} className="text-green-600" /> Thông tin giá
              </h3>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div><p className="text-xs text-gray-400">Giá gốc</p><p className="font-medium text-gray-700">{selected.originalPrice.toLocaleString('vi-VN')}đ</p></div>
                <div><p className="text-xs text-gray-400">Giá bán</p><p className="font-bold text-green-600">{selected.salePrice.toLocaleString('vi-VN')}đ</p></div>
                <div>
                  <p className="text-xs text-gray-400">Mức giảm</p>
                  <p className={`font-bold ${discountPct > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {discountPct > 0 ? `-${discountPct}%` : `+${Math.abs(discountPct)}% ⚠️`}
                  </p>
                </div>
              </div>
              {selected.salePrice >= selected.originalPrice && (
                <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                  <XCircle size={14} /> Giá bán lớn hơn hoặc bằng giá gốc — không hợp lệ!
                </div>
              )}
            </div>

            {/* Time & Quantity */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Calendar size={16} className="text-blue-600" /> Thời gian & Số lượng
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-gray-400">Bắt đầu bán</p><p className="font-medium">{selected.startDate}</p></div>
                <div><p className="text-xs text-gray-400">Kết thúc bán</p><p className="font-medium">{selected.endDate}</p></div>
                <div><p className="text-xs text-gray-400">Số lượng phát hành</p><p className="font-medium">{selected.quantity}</p></div>
                <div><p className="text-xs text-gray-400">Đã bán / Còn lại</p><p className="font-medium">{selected.soldCount} / {selected.quantity - selected.soldCount}</p></div>
                <div><p className="text-xs text-gray-400">Giới hạn sử dụng</p><p className="font-medium">{selected.usageLimit} lần/người</p></div>
              </div>
            </div>

            {/* Branches */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <MapPin size={16} className="text-orange-600" /> Phạm vi áp dụng
              </h3>
              <div className="space-y-1">
                {selected.branches.map((b, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle size={13} className="text-green-500" /> {b}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
                <Info size={16} className="text-blue-600" /> Checklist kiểm tra
              </h3>
              <p className="text-xs text-gray-400 mb-3">Hỗ trợ kiểm tra — không tự phê duyệt</p>
              <div className="space-y-2">
                {checklistItems.map(item => (
                  <label key={item} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 rounded p-1">
                    <input
                      type="checkbox"
                      checked={checklist[item] || false}
                      onChange={() => toggleCheck(item)}
                      className="rounded"
                    />
                    {item}
                  </label>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Đã kiểm tra</span>
                  <span className={`font-medium ${checkedCount === checklistItems.length ? 'text-green-600' : 'text-amber-600'}`}>
                    {checkedCount}/{checklistItems.length}
                  </span>
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full transition-all ${checkedCount === checklistItems.length ? 'bg-green-500' : 'bg-amber-500'}`} style={{ width: `${(checkedCount / checklistItems.length) * 100}%` }} />
                </div>
              </div>
            </div>

            {/* Side info */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Hậu quả khi phê duyệt</h4>
              <ul className="space-y-1 text-xs text-blue-700">
                <li>• Portal đối tác nhận kết quả duyệt</li>
                <li>• Trạng thái công bố sẽ tự động được xác định</li>
                <li>• Khách hàng có thể mua khi trạng thái công bố cho phép</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Approve modal */}
        {approveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setApproveModal(false)} />
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Phê duyệt voucher</h3>
              <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm space-y-1">
                <div className="flex justify-between"><span className="text-gray-500">Voucher:</span><span className="font-medium">{selected.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Đối tác:</span><span>{selected.partnerName}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Giá bán:</span><span className="text-green-600 font-medium">{selected.salePrice.toLocaleString('vi-VN')}đ</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Thời gian:</span><span>{selected.startDate} → {selected.endDate}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Trạng thái kiểm duyệt sau:</span><span className="text-green-600 font-medium">Đã duyệt</span></div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Trạng thái công bố dự kiến:</span>
                  <span className="text-blue-600 font-medium">{publicationStatusLabels[computePublicationStatus(hideAfterApprove, selected)]}</span>
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700 mb-4 cursor-pointer">
                <input type="checkbox" checked={hideAfterApprove} onChange={e => setHideAfterApprove(e.target.checked)} className="rounded" />
                Tạm ẩn sau khi phê duyệt
              </label>
              {!hideAfterApprove && computePublicationStatus(false, selected) === 'scheduled' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-xs text-blue-700">
                  <strong>Lưu ý:</strong> Hệ thống sẽ tự động công bố voucher khi đến thời gian bán ({selected.startDate}) nếu vẫn còn đủ điều kiện.
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button onClick={() => setApproveModal(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Hủy</button>
                <button onClick={doApprove} className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">Xác nhận phê duyệt</button>
              </div>
            </div>
          </div>
        )}

        <ConfirmModal
          open={rejectModal}
          onClose={() => setRejectModal(false)}
          onConfirm={doReject}
          title="Từ chối voucher"
          targetName={selected.name}
          beforeStatus="Chờ duyệt"
          afterStatus="Bị từ chối"
          consequences={['Voucher không được công bố.', 'Portal đối tác nhận kết quả và lý do từ chối.']}
          requireReason
          reasonLabel="Lý do từ chối"
          reasonOptions={rejectReasons}
          confirmLabel="Xác nhận từ chối"
          confirmVariant="danger"
        />
      </div>
    );
  }

  // List view
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Duyệt voucher</h1>
        <p className="text-sm text-gray-500 mt-1">Kiểm tra và phê duyệt voucher do đối tác gửi.</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={searchName} onChange={e => setSearchName(e.target.value)} placeholder="Tên voucher..." className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={filterPartner} onChange={e => setFilterPartner(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Tất cả đối tác</option>
            {partners.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={filterReview} onChange={e => setFilterReview(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Tất cả trạng thái kiểm duyệt</option>
            {Object.entries(reviewStatusLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="text-sm text-gray-500">{filtered.length} voucher</p>
          <button onClick={() => { setSearchName(''); setFilterPartner(''); setFilterReview('pending'); }} className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1">
            <X size={14} /> Đặt lại
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <Tag size={40} className="mb-2" />
            <p className="text-sm">Không có voucher phù hợp</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['Tên voucher', 'Đối tác', 'Danh mục', 'Giá gốc', 'Giá bán', 'Thời gian bán', 'SL', 'Kiểm duyệt', 'Công bố', ''].map(h => (
                    <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(v => {
                  const rb = getReviewStatusBadge(v.reviewStatus);
                  const pb = getPublicationStatusBadge(v.publicationStatus);
                  const isInvalidPrice = v.salePrice >= v.originalPrice;
                  return (
                    <tr key={v.id} onClick={() => setSelected(v)} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          {isInvalidPrice && <XCircle size={14} className="text-red-500 flex-shrink-0" title="Giá không hợp lệ" />}
                          <span className="text-sm font-medium text-gray-900 truncate max-w-[180px]">{v.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-600 truncate max-w-[120px]">{v.partnerName}</td>
                      <td className="px-3 py-3 text-sm text-gray-600">{v.category}</td>
                      <td className="px-3 py-3 text-sm text-gray-600">{v.originalPrice.toLocaleString('vi-VN')}</td>
                      <td className={`px-3 py-3 text-sm font-medium ${isInvalidPrice ? 'text-red-600' : 'text-green-600'}`}>{v.salePrice.toLocaleString('vi-VN')}</td>
                      <td className="px-3 py-3 text-xs text-gray-600">{v.startDate} → {v.endDate}</td>
                      <td className="px-3 py-3 text-sm text-gray-600">{v.quantity}</td>
                      <td className="px-3 py-3"><StatusBadge {...rb} /></td>
                      <td className="px-3 py-3"><StatusBadge {...pb} /></td>
                      <td className="px-3 py-3">
                        <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 whitespace-nowrap">
                          <Eye size={14} /> Chi tiết
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
