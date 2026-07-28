import { useState } from "react";
import { Plus, Search, X, AlertTriangle, Clock, Edit2, PauseCircle, StopCircle, PlayCircle, Send, ArrowLeft, Upload, Tag, ChevronRight, Lock } from "lucide-react";
import { toast } from "sonner";
import { mockPartnerVouchers, mockPartnerBranches, type PartnerVoucher } from "../data/partnerMockData";
import type { PartnerPage } from "./PartnerLayout";

interface PartnerVouchersProps {
  onNavigate: (page: PartnerPage) => void;
  initialView?: 'create';
}

type VoucherFilter = 'all' | 'draft' | 'pending' | 'approved' | 'rejected' | 'selling' | 'suspended' | 'stopped' | 'expired' | 'sold_out';

const filterTabs: { id: VoucherFilter; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'draft', label: 'Nháp' },
  { id: 'pending', label: 'Chờ duyệt' },
  { id: 'approved', label: 'Đã duyệt' },
  { id: 'rejected', label: 'Từ chối' },
  { id: 'selling', label: 'Đang bán' },
  { id: 'suspended', label: 'Tạm ngưng' },
  { id: 'stopped', label: 'Ngừng bán' },
];

function getVoucherCombinedStatus(v: PartnerVoucher): string {
  if (v.reviewStatus === 'draft') return 'draft';
  if (v.reviewStatus === 'pending') return 'pending';
  if (v.reviewStatus === 'rejected') return 'rejected';
  return v.publicationStatus;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  draft: { label: 'Nháp', color: 'bg-gray-100 text-gray-600' },
  pending: { label: 'Chờ duyệt', color: 'bg-amber-100 text-amber-700' },
  approved: { label: 'Đã duyệt', color: 'bg-blue-100 text-blue-700' },
  rejected: { label: 'Từ chối', color: 'bg-red-100 text-red-700' },
  selling: { label: 'Đang bán', color: 'bg-green-100 text-green-700' },
  suspended: { label: 'Tạm ngưng', color: 'bg-orange-100 text-orange-700' },
  stopped: { label: 'Ngừng bán', color: 'bg-red-100 text-red-700' },
  expired: { label: 'Hết hạn', color: 'bg-gray-100 text-gray-500' },
  sold_out: { label: 'Hết số lượng', color: 'bg-gray-200 text-gray-700' },
  scheduled: { label: 'Chờ hiển thị', color: 'bg-purple-100 text-purple-700' },
  unpublished: { label: 'Chưa công bố', color: 'bg-gray-100 text-gray-500' },
};

type EditFormState = {
  name: string; category: string; description: string;
  originalPrice: string; salePrice: string;
  startSaleDate: string; endSaleDate: string;
  startUseDate: string; endUseDate: string;
  branchIds: string[]; quantity: string;
  conditions: string; refundPolicy: string;
};

const EMPTY_FORM: EditFormState = {
  name: '', category: '', description: '', originalPrice: '', salePrice: '',
  startSaleDate: '', endSaleDate: '', startUseDate: '', endUseDate: '',
  branchIds: [], quantity: '', conditions: '', refundPolicy: '',
};

function voucherToForm(v: PartnerVoucher): EditFormState {
  return {
    name: v.name, category: v.category, description: v.description || '',
    originalPrice: String(v.originalPrice), salePrice: String(v.salePrice),
    startSaleDate: v.startSaleDate, endSaleDate: v.endSaleDate,
    startUseDate: v.startUseDate, endUseDate: v.endUseDate,
    branchIds: [...v.branchIds], quantity: String(v.quantity),
    conditions: v.conditions || '', refundPolicy: v.refundPolicy || '',
  };
}

function validateFull(f: EditFormState): Record<string, string> {
  const e: Record<string, string> = {};
  if (!f.name) e.name = 'Vui lòng nhập tên voucher.';
  if (!f.category) e.category = 'Vui lòng chọn danh mục.';
  if (!f.originalPrice) e.originalPrice = 'Vui lòng nhập giá gốc.';
  if (!f.salePrice) e.salePrice = 'Vui lòng nhập giá bán.';
  if (parseFloat(f.salePrice) >= parseFloat(f.originalPrice)) e.salePrice = 'Giá bán phải nhỏ hơn giá gốc.';
  if (parseFloat(f.salePrice) <= 0) e.salePrice = 'Giá bán phải lớn hơn 0.';
  if (!f.startSaleDate) e.startSaleDate = 'Chọn ngày bắt đầu bán.';
  if (!f.endSaleDate) e.endSaleDate = 'Chọn ngày kết thúc bán.';
  if (f.startSaleDate && f.endSaleDate && f.endSaleDate <= f.startSaleDate) e.endSaleDate = 'Ngày kết thúc phải sau ngày bắt đầu.';
  if (!f.startUseDate) e.startUseDate = 'Chọn ngày bắt đầu sử dụng.';
  if (!f.endUseDate) e.endUseDate = 'Chọn ngày kết thúc sử dụng.';
  if (!f.branchIds.length) e.branchIds = 'Chọn ít nhất một chi nhánh.';
  if (!f.quantity || parseInt(f.quantity) <= 0) e.quantity = 'Số lượng phải là số nguyên dương.';
  if (!f.conditions) e.conditions = 'Vui lòng nhập điều kiện áp dụng.';
  return e;
}

function validateRestricted(f: EditFormState, orig: PartnerVoucher): Record<string, string> {
  const e: Record<string, string> = {};
  const qty = parseInt(f.quantity);
  if (!f.quantity || isNaN(qty) || qty <= 0) e.quantity = 'Số lượng phải là số nguyên dương.';
  else if (qty < orig.quantity) e.quantity = `Không được giảm số lượng (hiện tại: ${orig.quantity}).`;
  else if (qty < orig.soldCount) e.quantity = `Không được nhỏ hơn số đã bán (${orig.soldCount}).`;
  return e;
}

function inputCls(error?: string) {
  return `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${error ? 'border-red-400' : 'border-gray-300'}`;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-100">
        <p className="text-sm font-semibold text-gray-700">{title}</p>
      </div>
      <div className="p-4 space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-0.5">{error}</p>}
    </div>
  );
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className={`font-medium ${highlight ? 'text-emerald-700' : 'text-gray-900'}`}>{value}</p>
    </div>
  );
}

export default function PartnerVouchers({ onNavigate, initialView }: PartnerVouchersProps) {
  const [vouchers, setVouchers] = useState<PartnerVoucher[]>(mockPartnerVouchers);
  const [activeFilter, setActiveFilter] = useState<VoucherFilter>('all');
  const [search, setSearch] = useState('');
  const [selectedVoucher, setSelectedVoucher] = useState<PartnerVoucher | null>(null);
  const [showCreate, setShowCreate] = useState(initialView === 'create');
  const [confirmModal, setConfirmModal] = useState<{ type: 'submit' | 'suspend' | 'stop' | 'resume' | null; voucherId?: string }>({ type: null });
  const [processingAction, setProcessingAction] = useState(false);

  // Edit state
  const [editVoucher, setEditVoucher] = useState<PartnerVoucher | null>(null);
  const [editMode, setEditMode] = useState<'full' | 'restricted'>('full');
  const [editForm, setEditForm] = useState<EditFormState>(EMPTY_FORM);
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  // Create form state
  const [form, setForm] = useState<EditFormState>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const activeBranches = mockPartnerBranches.filter(b => b.status === 'active');

  const filtered = vouchers.filter(v => {
    const status = getVoucherCombinedStatus(v);
    const matchFilter = activeFilter === 'all' || status === activeFilter;
    const matchSearch = !search || v.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const filterCounts = filterTabs.map(t => ({
    ...t,
    count: t.id === 'all' ? vouchers.length : vouchers.filter(v => getVoucherCombinedStatus(v) === t.id).length,
  }));

  const openEdit = (v: PartnerVoucher, mode: 'full' | 'restricted') => {
    setEditVoucher(v);
    setEditMode(mode);
    setEditForm(voucherToForm(v));
    setEditErrors({});
    setSelectedVoucher(null);
  };

  const handleSaveEdit = () => {
    if (!editVoucher) return;
    const errors = editMode === 'full' ? validateFull(editForm) : validateRestricted(editForm, editVoucher);
    if (Object.keys(errors).length) { setEditErrors(errors); return; }

    const isRejected = editVoucher.reviewStatus === 'rejected';
    const ts = new Date().toLocaleString('vi-VN');
    const updated: PartnerVoucher = {
      ...editVoucher,
      description: editForm.description,
      conditions: editForm.conditions,
      refundPolicy: editForm.refundPolicy,
      quantity: parseInt(editForm.quantity),
      ...(editMode === 'full' ? {
        name: editForm.name, category: editForm.category,
        originalPrice: parseFloat(editForm.originalPrice),
        salePrice: parseFloat(editForm.salePrice),
        startSaleDate: editForm.startSaleDate, endSaleDate: editForm.endSaleDate,
        startUseDate: editForm.startUseDate, endUseDate: editForm.endUseDate,
        branchIds: editForm.branchIds,
      } : {}),
      ...(isRejected ? { reviewStatus: 'draft' as const, reviewNote: undefined, rejectionGroup: undefined } : {}),
      timeline: [...editVoucher.timeline, {
        ts,
        action: isRejected ? 'Sửa sau khi bị từ chối → Nháp' : editMode === 'restricted' ? 'Cập nhật (chỉnh sửa hạn chế)' : 'Cập nhật thông tin',
        actor: 'Trần Minh Tú',
      }],
    };

    setVouchers(vs => vs.map(v => v.id === updated.id ? updated : v));
    setEditVoucher(null);
    setEditErrors({});
    setSelectedVoucher(updated);
    if (isRejected) {
      toast.success('Đã lưu chỉnh sửa. Voucher về trạng thái Nháp — bạn có thể gửi duyệt lại.');
    } else {
      toast.success('Đã cập nhật voucher thành công.');
    }
  };

  const handleSaveDraft = () => {
    const errors = validateFull(form);
    if (Object.keys(errors).length) { setFormErrors(errors); return; }
    const newV: PartnerVoucher = {
      id: `PV${Date.now()}`, partnerId: 'P002',
      name: form.name, category: form.category, image: '', description: form.description,
      originalPrice: parseFloat(form.originalPrice), salePrice: parseFloat(form.salePrice),
      startSaleDate: form.startSaleDate, endSaleDate: form.endSaleDate,
      startUseDate: form.startUseDate, endUseDate: form.endUseDate,
      branchIds: form.branchIds, quantity: parseInt(form.quantity),
      soldCount: 0, usedCount: 0, conditions: form.conditions, refundPolicy: form.refundPolicy,
      reviewStatus: 'draft', publicationStatus: 'unpublished',
      timeline: [{ ts: new Date().toLocaleString('vi-VN'), action: 'Tạo nháp', actor: 'Trần Minh Tú' }],
    };
    setVouchers(v => [newV, ...v]);
    setShowCreate(false);
    setForm(EMPTY_FORM);
    setFormErrors({});
    toast.success('Đã lưu nháp voucher thành công.');
    setSelectedVoucher(newV);
  };

  const handleSubmitForReview = (voucherId: string) => {
    setProcessingAction(true);
    setTimeout(() => {
      const ts = new Date().toLocaleString('vi-VN');
      setVouchers(vs => vs.map(v => v.id === voucherId ? { ...v, reviewStatus: 'pending', submittedAt: ts, timeline: [...v.timeline, { ts, action: 'Gửi duyệt', actor: 'Trần Minh Tú' }] } : v));
      setConfirmModal({ type: null });
      setSelectedVoucher(v => v?.id === voucherId ? { ...v!, reviewStatus: 'pending' } : v);
      setProcessingAction(false);
      toast.success('Voucher đã được gửi đến Admin để xét duyệt.');
    }, 800);
  };

  const handleSuspend = (voucherId: string) => {
    setProcessingAction(true);
    setTimeout(() => {
      const ts = new Date().toLocaleString('vi-VN');
      setVouchers(vs => vs.map(v => v.id === voucherId ? { ...v, publicationStatus: 'suspended', timeline: [...v.timeline, { ts, action: 'Tạm ngưng bán', actor: 'Trần Minh Tú' }] } : v));
      setConfirmModal({ type: null });
      setSelectedVoucher(v => v?.id === voucherId ? { ...v!, publicationStatus: 'suspended' } : v);
      setProcessingAction(false);
      toast.success('Voucher đã được tạm ngưng bán.');
    }, 600);
  };

  const handleResume = (voucherId: string) => {
    setProcessingAction(true);
    setTimeout(() => {
      const ts = new Date().toLocaleString('vi-VN');
      setVouchers(vs => vs.map(v => v.id === voucherId ? { ...v, publicationStatus: 'selling', timeline: [...v.timeline, { ts, action: 'Mở bán lại', actor: 'Trần Minh Tú' }] } : v));
      setConfirmModal({ type: null });
      setSelectedVoucher(v => v?.id === voucherId ? { ...v!, publicationStatus: 'selling' } : v);
      setProcessingAction(false);
      toast.success('Voucher đã được mở bán lại.');
    }, 600);
  };

  const handleStop = (voucherId: string) => {
    setProcessingAction(true);
    setTimeout(() => {
      const ts = new Date().toLocaleString('vi-VN');
      setVouchers(vs => vs.map(v => v.id === voucherId ? { ...v, publicationStatus: 'stopped', timeline: [...v.timeline, { ts, action: 'Ngừng bán vĩnh viễn', actor: 'Trần Minh Tú' }] } : v));
      setConfirmModal({ type: null });
      setSelectedVoucher(v => v?.id === voucherId ? { ...v!, publicationStatus: 'stopped' } : v);
      setProcessingAction(false);
      toast.success('Voucher đã ngừng bán vĩnh viễn.');
    }, 600);
  };

  // ── EDIT FORM VIEW ─────────────────────────────────────────────────────────
  if (editVoucher) {
    const isRestricted = editMode === 'restricted';
    const f = editForm;
    const setF = (patch: Partial<EditFormState>) => setEditForm(prev => ({ ...prev, ...patch }));

    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => { setEditVoucher(null); setSelectedVoucher(editVoucher); }} className="p-1.5 rounded hover:bg-gray-100 text-gray-500">
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {editVoucher.reviewStatus === 'rejected' ? 'Sửa và gửi lại' : isRestricted ? 'Chỉnh sửa hạn chế' : 'Chỉnh sửa Voucher'}
            </h1>
            <p className="text-xs text-gray-400">{editVoucher.name}</p>
          </div>
        </div>

        {editVoucher.reviewStatus === 'rejected' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-5">
            <p className="text-xs font-semibold text-red-700 mb-1">Lý do từ chối{editVoucher.rejectionGroup ? ` — ${editVoucher.rejectionGroup}` : ''}</p>
            <p className="text-sm text-red-600">{editVoucher.reviewNote}</p>
            <p className="text-xs text-red-400 mt-1">Sau khi lưu, voucher về trạng thái <strong>Nháp</strong>. Bạn có thể gửi duyệt lại.</p>
          </div>
        )}
        {isRestricted && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 flex items-start gap-2">
            <Lock size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-amber-700 mb-0.5">Chế độ chỉnh sửa hạn chế (Tạm ngưng)</p>
              <p className="text-xs text-amber-600">Chỉ được chỉnh sửa: Mô tả, Ảnh, Điều kiện áp dụng, Chính sách hoàn hủy, Số lượng phát hành (chỉ tăng, không giảm dưới số đã bán: {editVoucher.soldCount}).</p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <Section title="Thông tin cơ bản">
            {!isRestricted ? (
              <>
                <Field label="Tên voucher" required error={editErrors.name}>
                  <input value={f.name} onChange={e => setF({ name: e.target.value })} className={inputCls(editErrors.name)} />
                </Field>
                <Field label="Danh mục" required error={editErrors.category}>
                  <select value={f.category} onChange={e => setF({ category: e.target.value })} className={inputCls(editErrors.category)}>
                    <option value="">Chọn danh mục...</option>
                    <option>Ẩm thực</option><option>Spa & Làm đẹp</option><option>Du lịch</option><option>Giải trí</option>
                  </select>
                </Field>
              </>
            ) : (
              <div className="flex items-center gap-3 pb-1">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                  <Lock size={14} className="text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{editVoucher.name}</p>
                  <p className="text-xs text-gray-400">{editVoucher.category} · Không thể thay đổi</p>
                </div>
              </div>
            )}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-sm text-gray-500 cursor-pointer hover:border-emerald-400">
              <Upload size={18} className="mx-auto mb-1 text-gray-400" />
              <p>Tải ảnh voucher (JPG, PNG — tối đa 5MB)</p>
            </div>
            <Field label="Mô tả">
              <textarea value={f.description} onChange={e => setF({ description: e.target.value })} rows={3} className={inputCls()} />
            </Field>
          </Section>

          {!isRestricted ? (
            <Section title="Giá">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Giá gốc (đ)" required error={editErrors.originalPrice}>
                  <input type="number" value={f.originalPrice} onChange={e => setF({ originalPrice: e.target.value })} className={inputCls(editErrors.originalPrice)} />
                </Field>
                <Field label="Giá bán (đ)" required error={editErrors.salePrice}>
                  <input type="number" value={f.salePrice} onChange={e => setF({ salePrice: e.target.value })} className={inputCls(editErrors.salePrice)} />
                </Field>
              </div>
              {f.originalPrice && f.salePrice && parseFloat(f.salePrice) > 0 && parseFloat(f.originalPrice) > parseFloat(f.salePrice) && (
                <p className="text-emerald-600 text-sm">Giảm {Math.round((1 - parseFloat(f.salePrice) / parseFloat(f.originalPrice)) * 100)}%</p>
              )}
            </Section>
          ) : (
            <Section title="Giá">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Giá gốc</p>
                  <p className="text-sm font-medium text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">{editVoucher.originalPrice.toLocaleString()}đ</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Giá bán</p>
                  <p className="text-sm font-medium text-emerald-700 bg-gray-50 px-3 py-2 rounded-lg">{editVoucher.salePrice.toLocaleString()}đ</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-1"><Lock size={11} /> Giá không thể thay đổi khi voucher đang tạm ngưng.</p>
            </Section>
          )}

          {!isRestricted ? (
            <Section title="Thời gian">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Bắt đầu bán" required error={editErrors.startSaleDate}>
                  <input type="date" value={f.startSaleDate} onChange={e => setF({ startSaleDate: e.target.value })} className={inputCls(editErrors.startSaleDate)} />
                </Field>
                <Field label="Kết thúc bán" required error={editErrors.endSaleDate}>
                  <input type="date" value={f.endSaleDate} onChange={e => setF({ endSaleDate: e.target.value })} className={inputCls(editErrors.endSaleDate)} />
                </Field>
                <Field label="Bắt đầu sử dụng" required error={editErrors.startUseDate}>
                  <input type="date" value={f.startUseDate} onChange={e => setF({ startUseDate: e.target.value })} className={inputCls(editErrors.startUseDate)} />
                </Field>
                <Field label="Kết thúc sử dụng" required error={editErrors.endUseDate}>
                  <input type="date" value={f.endUseDate} onChange={e => setF({ endUseDate: e.target.value })} className={inputCls(editErrors.endUseDate)} />
                </Field>
              </div>
            </Section>
          ) : (
            <Section title="Thời gian">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Bán</p>
                  <p className="text-xs text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">{editVoucher.startSaleDate} → {editVoucher.endSaleDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Sử dụng</p>
                  <p className="text-xs text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">{editVoucher.startUseDate} → {editVoucher.endUseDate}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-1"><Lock size={11} /> Ngày không thể thay đổi khi tạm ngưng.</p>
            </Section>
          )}

          <Section title="Chi nhánh & Số lượng">
            {!isRestricted ? (
              <Field label="Chi nhánh áp dụng" required error={editErrors.branchIds}>
                <div className="space-y-2">
                  {activeBranches.map(b => (
                    <label key={b.id} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={f.branchIds.includes(b.id)} onChange={e => setF({ branchIds: e.target.checked ? [...f.branchIds, b.id] : f.branchIds.filter(id => id !== b.id) })} className="rounded border-gray-300 text-emerald-600" />
                      <span className="text-sm text-gray-700">{b.name} — {b.address}</span>
                    </label>
                  ))}
                </div>
              </Field>
            ) : (
              <div>
                <p className="text-xs text-gray-400 mb-1">Chi nhánh áp dụng</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {editVoucher.branchIds.map(bid => {
                    const b = mockPartnerBranches.find(b => b.id === bid);
                    return <span key={bid} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">{b?.name || bid}</span>;
                  })}
                </div>
                <p className="text-xs text-gray-400 flex items-center gap-1"><Lock size={11} /> Chi nhánh không thể thay đổi.</p>
              </div>
            )}
            <Field label="Số lượng phát hành" required error={editErrors.quantity}>
              <input type="number" value={f.quantity} onChange={e => setF({ quantity: e.target.value })} min={isRestricted ? editVoucher.quantity : 1} className={inputCls(editErrors.quantity)} />
              {isRestricted && (
                <p className="text-xs text-gray-400 mt-0.5">Đã bán: {editVoucher.soldCount} · Hiện tại: {editVoucher.quantity} · Chỉ được tăng</p>
              )}
            </Field>
          </Section>

          <Section title="Điều kiện & Chính sách">
            <Field label="Điều kiện áp dụng" required={!isRestricted} error={editErrors.conditions}>
              <textarea value={f.conditions} onChange={e => setF({ conditions: e.target.value })} rows={3} className={inputCls(editErrors.conditions)} />
            </Field>
            <Field label="Chính sách hoàn hủy">
              <textarea value={f.refundPolicy} onChange={e => setF({ refundPolicy: e.target.value })} rows={2} className={inputCls()} />
            </Field>
          </Section>

          <div className="flex gap-3">
            <button onClick={() => { setEditVoucher(null); setSelectedVoucher(editVoucher); }} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Hủy</button>
            <button onClick={handleSaveEdit} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-semibold text-sm hover:bg-emerald-700">
              {editVoucher.reviewStatus === 'rejected' ? 'Lưu → Về nháp' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── CREATE FORM VIEW ────────────────────────────────────────────────────────
  if (showCreate) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => setShowCreate(false)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500"><ArrowLeft size={16} /></button>
          <h1 className="text-xl font-bold text-gray-900">Tạo Voucher Mới</h1>
        </div>
        <div className="space-y-6">
          <Section title="Thông tin cơ bản">
            <Field label="Tên voucher" required error={formErrors.name}>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="VD: Sushi Set A cho 2 người" className={inputCls(formErrors.name)} />
            </Field>
            <Field label="Danh mục" required error={formErrors.category}>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={inputCls(formErrors.category)}>
                <option value="">Chọn danh mục...</option>
                <option>Ẩm thực</option><option>Spa & Làm đẹp</option><option>Du lịch</option><option>Giải trí</option>
              </select>
            </Field>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-sm text-gray-500 cursor-pointer hover:border-emerald-400">
              <Upload size={18} className="mx-auto mb-1 text-gray-400" />
              <p>Tải ảnh voucher (JPG, PNG — tối đa 5MB)</p>
            </div>
            <Field label="Mô tả">
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Mô tả chi tiết voucher..." className={inputCls()} />
            </Field>
          </Section>
          <Section title="Giá">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Giá gốc (đ)" required error={formErrors.originalPrice}>
                <input type="number" value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))} placeholder="0" className={inputCls(formErrors.originalPrice)} />
              </Field>
              <Field label="Giá bán (đ)" required error={formErrors.salePrice}>
                <input type="number" value={form.salePrice} onChange={e => setForm(f => ({ ...f, salePrice: e.target.value }))} placeholder="0" className={inputCls(formErrors.salePrice)} />
              </Field>
            </div>
            {form.originalPrice && form.salePrice && parseFloat(form.salePrice) > 0 && parseFloat(form.originalPrice) > parseFloat(form.salePrice) && (
              <p className="text-emerald-600 text-sm">Giảm {Math.round((1 - parseFloat(form.salePrice) / parseFloat(form.originalPrice)) * 100)}%</p>
            )}
          </Section>
          <Section title="Thời gian">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Bắt đầu bán" required error={formErrors.startSaleDate}>
                <input type="date" value={form.startSaleDate} onChange={e => setForm(f => ({ ...f, startSaleDate: e.target.value }))} className={inputCls(formErrors.startSaleDate)} />
              </Field>
              <Field label="Kết thúc bán" required error={formErrors.endSaleDate}>
                <input type="date" value={form.endSaleDate} onChange={e => setForm(f => ({ ...f, endSaleDate: e.target.value }))} className={inputCls(formErrors.endSaleDate)} />
              </Field>
              <Field label="Bắt đầu sử dụng" required error={formErrors.startUseDate}>
                <input type="date" value={form.startUseDate} onChange={e => setForm(f => ({ ...f, startUseDate: e.target.value }))} className={inputCls(formErrors.startUseDate)} />
              </Field>
              <Field label="Kết thúc sử dụng" required error={formErrors.endUseDate}>
                <input type="date" value={form.endUseDate} onChange={e => setForm(f => ({ ...f, endUseDate: e.target.value }))} className={inputCls(formErrors.endUseDate)} />
              </Field>
            </div>
          </Section>
          <Section title="Chi nhánh & Số lượng">
            <Field label="Chi nhánh áp dụng" required error={formErrors.branchIds}>
              <div className="space-y-2">
                {activeBranches.length === 0 ? (
                  <p className="text-sm text-amber-600">Không có chi nhánh đang hoạt động.</p>
                ) : activeBranches.map(b => (
                  <label key={b.id} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.branchIds.includes(b.id)} onChange={e => setForm(f => ({ ...f, branchIds: e.target.checked ? [...f.branchIds, b.id] : f.branchIds.filter(id => id !== b.id) }))} className="rounded border-gray-300 text-emerald-600" />
                    <span className="text-sm text-gray-700">{b.name} — {b.address}</span>
                  </label>
                ))}
              </div>
            </Field>
            <Field label="Số lượng phát hành" required error={formErrors.quantity}>
              <input type="number" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} placeholder="100" className={inputCls(formErrors.quantity)} />
            </Field>
          </Section>
          <Section title="Điều kiện & Chính sách">
            <Field label="Điều kiện áp dụng" required error={formErrors.conditions}>
              <textarea value={form.conditions} onChange={e => setForm(f => ({ ...f, conditions: e.target.value }))} rows={3} placeholder="Mô tả điều kiện sử dụng voucher..." className={inputCls(formErrors.conditions)} />
            </Field>
            <Field label="Chính sách hoàn hủy">
              <textarea value={form.refundPolicy} onChange={e => setForm(f => ({ ...f, refundPolicy: e.target.value }))} rows={2} placeholder="Chính sách hoàn/hủy..." className={inputCls()} />
            </Field>
          </Section>
          <div className="flex gap-3">
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Hủy</button>
            <button onClick={handleSaveDraft} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-semibold text-sm hover:bg-emerald-700">Lưu nháp</button>
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN LIST VIEW ──────────────────────────────────────────────────────────
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Voucher</h1>
          <p className="text-sm text-gray-500 mt-1">{vouchers.length} voucher tổng cộng</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700">
          <Plus size={16} /> Tạo voucher mới
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
        {filterCounts.map(t => (
          <button key={t.id} onClick={() => setActiveFilter(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === t.id ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {t.label}
            <span className={`text-xs px-1.5 rounded-full ${activeFilter === t.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>{t.count}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-3 mb-4 flex items-center gap-2">
        <Search size={15} className="text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo tên voucher..." className="flex-1 text-sm focus:outline-none" />
        {search && <button onClick={() => setSearch('')}><X size={14} className="text-gray-400" /></button>}
        <span className="text-xs text-gray-400">{filtered.length} kết quả</span>
      </div>

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
                  {['Tên voucher', 'Trạng thái duyệt', 'Trạng thái công bố', 'Giá bán', 'Đã bán', 'Thời gian bán', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(v => {
                  const revCfg = statusConfig[v.reviewStatus] || statusConfig.draft;
                  const pubCfg = statusConfig[v.publicationStatus] || statusConfig.unpublished;
                  return (
                    <tr key={v.id} onClick={() => setSelectedVoucher(v)} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{v.name}</p>
                        <p className="text-xs text-gray-400">{v.category}</p>
                      </td>
                      <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded font-medium ${revCfg.color}`}>{revCfg.label}</span></td>
                      <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded font-medium ${pubCfg.color}`}>{pubCfg.label}</span></td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{v.salePrice.toLocaleString()}đ</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{v.soldCount}/{v.quantity}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{v.startSaleDate} → {v.endSaleDate}</td>
                      <td className="px-4 py-3"><button className="text-emerald-600 hover:text-emerald-800"><ChevronRight size={16} /></button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail drawer */}
      {selectedVoucher && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSelectedVoucher(null)} />
          <div className="relative w-full max-w-xl bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Chi tiết Voucher</h3>
              <button onClick={() => setSelectedVoucher(null)} className="p-1 rounded hover:bg-gray-100"><X size={16} className="text-gray-400" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{selectedVoucher.name}</h4>
                  <p className="text-sm text-gray-500">{selectedVoucher.category}</p>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${(statusConfig[selectedVoucher.reviewStatus] || statusConfig.draft).color}`}>
                    Duyệt: {(statusConfig[selectedVoucher.reviewStatus] || statusConfig.draft).label}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${(statusConfig[selectedVoucher.publicationStatus] || statusConfig.unpublished).color}`}>
                    Công bố: {(statusConfig[selectedVoucher.publicationStatus] || statusConfig.unpublished).label}
                  </span>
                </div>
              </div>

              {selectedVoucher.reviewStatus === 'rejected' && selectedVoucher.reviewNote && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-xs font-medium text-red-700 mb-1">Lý do từ chối{selectedVoucher.rejectionGroup ? ` — ${selectedVoucher.rejectionGroup}` : ''}</p>
                  <p className="text-sm text-red-600">{selectedVoucher.reviewNote}</p>
                </div>
              )}

              {selectedVoucher.reviewStatus === 'pending' && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2 text-sm text-amber-700">
                  <Clock size={14} /> Voucher đang chờ Admin xét duyệt. Không thể chỉnh sửa trong thời gian này.
                </div>
              )}

              {selectedVoucher.publicationStatus === 'suspended' && selectedVoucher.reviewStatus === 'approved' && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2 text-sm text-amber-700">
                  <Lock size={14} className="mt-0.5 flex-shrink-0" />
                  <span>Voucher đang tạm ngưng. Chỉ được chỉnh sửa một số trường hạn chế.</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-sm">
                <InfoRow label="Giá gốc" value={`${selectedVoucher.originalPrice.toLocaleString()}đ`} />
                <InfoRow label="Giá bán" value={`${selectedVoucher.salePrice.toLocaleString()}đ`} highlight />
                <InfoRow label="Đã bán" value={`${selectedVoucher.soldCount}/${selectedVoucher.quantity}`} />
                <InfoRow label="Đã sử dụng" value={`${selectedVoucher.usedCount}`} />
                <InfoRow label="Bắt đầu bán" value={selectedVoucher.startSaleDate} />
                <InfoRow label="Kết thúc bán" value={selectedVoucher.endSaleDate} />
              </div>

              <div className="text-sm">
                <p className="text-xs text-gray-400 mb-1">Chi nhánh áp dụng</p>
                <div className="flex flex-wrap gap-1">
                  {selectedVoucher.branchIds.map(bid => {
                    const b = mockPartnerBranches.find(b => b.id === bid);
                    return <span key={bid} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">{b?.name || bid}</span>;
                  })}
                </div>
              </div>

              <div className="text-sm">
                <p className="text-xs text-gray-400 mb-1">Điều kiện áp dụng</p>
                <p className="text-gray-700 bg-gray-50 rounded p-2">{selectedVoucher.conditions}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-2">Lịch sử thay đổi</p>
                <div className="space-y-2">
                  {[...selectedVoucher.timeline].reverse().map((t, i) => (
                    <div key={i} className="flex gap-2 text-xs">
                      <span className="text-gray-400 whitespace-nowrap">{t.ts}</span>
                      <span className="text-gray-600">{t.action}</span>
                      <span className="text-gray-400">— {t.actor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-gray-100 pt-4 space-y-2">
                {/* DRAFT */}
                {selectedVoucher.reviewStatus === 'draft' && (
                  <>
                    <button onClick={() => openEdit(selectedVoucher, 'full')}
                      className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                      <Edit2 size={14} /> Chỉnh sửa
                    </button>
                    <button onClick={() => setConfirmModal({ type: 'submit', voucherId: selectedVoucher.id })}
                      className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700">
                      <Send size={14} /> Gửi duyệt
                    </button>
                    <p className="text-xs text-gray-400 text-center">Sau khi gửi, bạn không thể chỉnh sửa cho đến khi có kết quả duyệt.</p>
                  </>
                )}

                {/* REJECTED: edit → draft → resubmit */}
                {selectedVoucher.reviewStatus === 'rejected' && (
                  <button onClick={() => openEdit(selectedVoucher, 'full')}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700">
                    <Edit2 size={14} /> Sửa và gửi lại
                  </button>
                )}

                {/* SELLING */}
                {selectedVoucher.publicationStatus === 'selling' && selectedVoucher.reviewStatus === 'approved' && (
                  <div className="flex gap-2">
                    <button onClick={() => setConfirmModal({ type: 'suspend', voucherId: selectedVoucher.id })} className="flex-1 flex items-center justify-center gap-1 border border-orange-400 text-orange-700 py-2 rounded-lg text-sm font-medium hover:bg-orange-50">
                      <PauseCircle size={14} /> Tạm ngưng
                    </button>
                    <button onClick={() => setConfirmModal({ type: 'stop', voucherId: selectedVoucher.id })} className="flex-1 flex items-center justify-center gap-1 border border-red-400 text-red-700 py-2 rounded-lg text-sm font-medium hover:bg-red-50">
                      <StopCircle size={14} /> Ngừng bán
                    </button>
                  </div>
                )}

                {/* SUSPENDED: restricted edit + resume/stop */}
                {selectedVoucher.publicationStatus === 'suspended' && selectedVoucher.reviewStatus === 'approved' && (
                  <>
                    <button onClick={() => openEdit(selectedVoucher, 'restricted')}
                      className="w-full flex items-center justify-center gap-2 border border-emerald-500 text-emerald-700 py-2 rounded-lg text-sm font-medium hover:bg-emerald-50">
                      <Edit2 size={14} /> Chỉnh sửa (hạn chế)
                    </button>
                    <div className="flex gap-2">
                      <button onClick={() => setConfirmModal({ type: 'resume', voucherId: selectedVoucher.id })} className="flex-1 flex items-center justify-center gap-1 bg-green-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-700">
                        <PlayCircle size={14} /> Mở bán lại
                      </button>
                      <button onClick={() => setConfirmModal({ type: 'stop', voucherId: selectedVoucher.id })} className="flex-1 flex items-center justify-center gap-1 border border-red-400 text-red-700 py-2 rounded-lg text-sm font-medium hover:bg-red-50">
                        <StopCircle size={14} /> Ngừng bán
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm modals */}
      {confirmModal.type && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => !processingAction && setConfirmModal({ type: null })} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            {confirmModal.type === 'submit' && (
              <>
                <h3 className="font-bold text-gray-900 mb-2">Gửi duyệt voucher</h3>
                <p className="text-sm text-gray-600 mb-3">Bạn có chắc muốn gửi <strong>{selectedVoucher?.name}</strong> để Admin xét duyệt?</p>
                <div className="bg-amber-50 border border-amber-200 rounded p-2 text-xs text-amber-700 mb-4">
                  Sau khi gửi, bạn không thể chỉnh sửa voucher cho đến khi Admin xử lý.
                </div>
              </>
            )}
            {confirmModal.type === 'suspend' && (
              <>
                <h3 className="font-bold text-gray-900 mb-2">Tạm ngưng bán</h3>
                <p className="text-sm text-gray-600 mb-3">Voucher sẽ biến mất khỏi trang bán. Đơn hàng và voucher code đã phát hành vẫn hợp lệ. Bạn có thể mở bán lại sau.</p>
              </>
            )}
            {confirmModal.type === 'resume' && (
              <>
                <h3 className="font-bold text-gray-900 mb-2">Mở bán lại</h3>
                <p className="text-sm text-gray-600 mb-3">Voucher sẽ hiển thị lại trên trang bán. Không cần Admin duyệt lại.</p>
              </>
            )}
            {confirmModal.type === 'stop' && (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={20} className="text-red-600" />
                  <h3 className="font-bold text-gray-900">Ngừng bán vĩnh viễn</h3>
                </div>
                <div className="bg-red-50 border border-red-200 rounded p-2 text-sm text-red-700 mb-3">
                  Thao tác này <strong>không thể hoàn tác</strong>. Voucher sẽ ngừng bán vĩnh viễn. Voucher code đã phát hành tiếp tục theo vòng đời riêng.
                </div>
              </>
            )}
            <div className="flex gap-2">
              <button onClick={() => setConfirmModal({ type: null })} disabled={processingAction} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">Hủy</button>
              <button
                onClick={() => {
                  if (!confirmModal.voucherId) return;
                  if (confirmModal.type === 'submit') handleSubmitForReview(confirmModal.voucherId);
                  else if (confirmModal.type === 'suspend') handleSuspend(confirmModal.voucherId);
                  else if (confirmModal.type === 'resume') handleResume(confirmModal.voucherId);
                  else if (confirmModal.type === 'stop') handleStop(confirmModal.voucherId);
                }}
                disabled={processingAction}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold text-white transition-colors ${confirmModal.type === 'stop' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'} disabled:opacity-60`}
              >
                {processingAction ? 'Đang xử lý...' : confirmModal.type === 'submit' ? 'Xác nhận gửi duyệt' : confirmModal.type === 'suspend' ? 'Xác nhận tạm ngưng' : confirmModal.type === 'resume' ? 'Xác nhận mở bán lại' : 'Xác nhận ngừng bán'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
