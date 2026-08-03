import { useState } from "react";
import { Building2, User, FileText, Clock, Edit2, X, CheckCircle, AlertCircle, Upload } from "lucide-react";
import { toast } from "sonner";
import { mockLegalInfo, mockLegalUpdateRequest, type LegalInfo } from "../data/partnerMockData";

export default function PartnerProfile() {
  const [legalInfo] = useState<LegalInfo>(mockLegalInfo);
  const [pendingRequest, setPendingRequest] = useState(mockLegalUpdateRequest);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState<LegalInfo>({ ...mockLegalInfo });
  const [processing, setProcessing] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const hasPending = pendingRequest.status === 'pending';

  const getChangedFields = () => {
    return Object.keys(editData).filter(k => editData[k as keyof LegalInfo] !== legalInfo[k as keyof LegalInfo]);
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!editData.businessName) errors.businessName = 'Vui lòng nhập tên doanh nghiệp.';
    if (!editData.taxCode) errors.taxCode = 'Vui lòng nhập mã số thuế.';
    if (!editData.representativeCccd || editData.representativeCccd.length !== 12) errors.representativeCccd = 'CCCD phải gồm 12 chữ số.';
    if (!editData.representativeEmail.includes('@')) errors.representativeEmail = 'Email không hợp lệ.';
    if (!getChangedFields().length) errors._global = 'Không có thay đổi nào.';
    return errors;
  };

  const handleSubmitUpdate = () => {
    const errors = validate();
    if (Object.keys(errors).length) { setFormErrors(errors); return; }
    setProcessing(true);
    setTimeout(() => {
      setPendingRequest({ ...pendingRequest, status: 'pending', proposed: editData, requestedAt: new Date().toLocaleDateString('vi-VN') });
      setShowEditForm(false);
      setProcessing(false);
      toast.success('Yêu cầu cập nhật hồ sơ đã được gửi đến Admin.');
    }, 800);
  };

  const diffFields = [
    { key: 'representativeName', label: 'Họ tên đại diện' },
    { key: 'representativePhone', label: 'SĐT đại diện' },
    { key: 'representativeEmail', label: 'Email đại diện' },
    { key: 'businessName', label: 'Tên doanh nghiệp' },
    { key: 'taxCode', label: 'Mã số thuế' },
    { key: 'mainAddress', label: 'Địa chỉ cơ sở' },
  ] as const;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hồ sơ Doanh nghiệp</h1>
          <p className="text-sm text-gray-500 mt-1">Thông tin pháp lý — thay đổi cần Admin phê duyệt</p>
        </div>
        {!hasPending && (
          <button onClick={() => { setShowEditForm(true); setEditData({ ...legalInfo }); setFormErrors({}); }} className="flex items-center gap-2 border border-emerald-600 text-emerald-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-50">
            <Edit2 size={15} /> Cập nhật hồ sơ
          </button>
        )}
      </div>

      {/* Pending update banner */}
      {hasPending && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-amber-600" />
            <p className="font-semibold text-amber-700">Đang có yêu cầu cập nhật chờ duyệt</p>
          </div>
          <p className="text-sm text-amber-600 mb-3">Gửi lúc: {pendingRequest.requestedAt}. Dữ liệu hiện tại vẫn có hiệu lực.</p>
          <div className="border border-amber-200 rounded-lg overflow-hidden">
            <div className="bg-amber-100/50 px-3 py-2 grid grid-cols-3 gap-2 text-xs font-semibold text-amber-800">
              <span>Trường</span><span>Hiện tại</span><span className="text-blue-700">Đề nghị</span>
            </div>
            {diffFields.filter(f => pendingRequest.proposed[f.key] !== pendingRequest.current[f.key]).map(f => (
              <div key={f.key} className="px-3 py-2 grid grid-cols-3 gap-2 text-sm border-t border-amber-100">
                <span className="text-gray-500">{f.label}</span>
                <span className="text-gray-700">{pendingRequest.current[f.key]}</span>
                <span className="text-blue-700 font-medium">{pendingRequest.proposed[f.key]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Business info */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 flex items-center gap-2">
          <Building2 size={15} className="text-gray-500" />
          <h3 className="font-semibold text-gray-800 text-sm">Thông tin doanh nghiệp</h3>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoField label="Tên doanh nghiệp" value={legalInfo.businessName} />
          <InfoField label="Mã số thuế" value={legalInfo.taxCode} />
          <InfoField label="Loại hình" value={legalInfo.businessType} />
          <InfoField label="Địa chỉ cơ sở chính" value={legalInfo.mainAddress} />
          <InfoField label="Danh mục kinh doanh" value={legalInfo.categories.join(', ')} />
          <div>
            <p className="text-xs text-gray-400 mb-1">Giấy phép kinh doanh</p>
            <a className="text-sm text-emerald-600 hover:underline flex items-center gap-1" href="#">
              <FileText size={13} /> {legalInfo.licenseFile}
            </a>
          </div>
        </div>
      </div>

      {/* Representative */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 flex items-center gap-2">
          <User size={15} className="text-gray-500" />
          <h3 className="font-semibold text-gray-800 text-sm">Người đại diện pháp lý</h3>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoField label="Họ tên" value={legalInfo.representativeName} />
          <InfoField label="Chức vụ" value={legalInfo.representativeTitle} />
          <InfoField label="CCCD" value={legalInfo.representativeCccd} />
          <InfoField label="Số điện thoại" value={legalInfo.representativePhone} />
          <InfoField label="Email" value={legalInfo.representativeEmail} />
        </div>
      </div>

      {/* Edit modal */}
      {showEditForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => !processing && setShowEditForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Cập nhật hồ sơ pháp lý</h3>
              <button onClick={() => setShowEditForm(false)}><X size={16} className="text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
                Các thay đổi sẽ được lưu riêng và chờ Admin duyệt. Thông tin hiện tại vẫn có hiệu lực.
              </div>

              {formErrors._global && (
                <div className="bg-red-50 border border-red-200 rounded p-2 text-sm text-red-600 flex items-center gap-2">
                  <AlertCircle size={14} /> {formErrors._global}
                </div>
              )}

              <p className="text-sm font-semibold text-gray-700">Thông tin doanh nghiệp</p>
              <div className="grid grid-cols-2 gap-3">
                <EditField label="Tên doanh nghiệp" value={editData.businessName} onChange={v => setEditData(d => ({ ...d, businessName: v }))} error={formErrors.businessName} current={legalInfo.businessName} />
                <EditField label="Mã số thuế" value={editData.taxCode} onChange={v => setEditData(d => ({ ...d, taxCode: v }))} error={formErrors.taxCode} current={legalInfo.taxCode} />
                <EditField label="Địa chỉ cơ sở chính" value={editData.mainAddress} onChange={v => setEditData(d => ({ ...d, mainAddress: v }))} current={legalInfo.mainAddress} />
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Loại hình doanh nghiệp</label>
                  <select value={editData.businessType} onChange={e => setEditData(d => ({ ...d, businessType: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option>Công ty TNHH</option><option>Công ty Cổ phần</option><option>Doanh nghiệp tư nhân</option><option>Hộ kinh doanh</option>
                  </select>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center text-sm text-gray-500 cursor-pointer hover:border-emerald-400">
                <Upload size={16} className="mx-auto mb-1 text-gray-400" />
                Cập nhật giấy phép kinh doanh (mô phỏng)
              </div>

              <p className="text-sm font-semibold text-gray-700">Người đại diện</p>
              <div className="grid grid-cols-2 gap-3">
                <EditField label="Họ tên" value={editData.representativeName} onChange={v => setEditData(d => ({ ...d, representativeName: v }))} current={legalInfo.representativeName} />
                <EditField label="Chức vụ" value={editData.representativeTitle} onChange={v => setEditData(d => ({ ...d, representativeTitle: v }))} current={legalInfo.representativeTitle} />
                <EditField label="CCCD (12 số)" value={editData.representativeCccd} onChange={v => setEditData(d => ({ ...d, representativeCccd: v }))} error={formErrors.representativeCccd} current={legalInfo.representativeCccd} />
                <EditField label="SĐT" value={editData.representativePhone} onChange={v => setEditData(d => ({ ...d, representativePhone: v }))} current={legalInfo.representativePhone} />
                <EditField label="Email đại diện" value={editData.representativeEmail} onChange={v => setEditData(d => ({ ...d, representativeEmail: v }))} error={formErrors.representativeEmail} current={legalInfo.representativeEmail} />
              </div>

              {getChangedFields().length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
                  Có {getChangedFields().length} trường thay đổi: {getChangedFields().join(', ')}
                </div>
              )}

              <div className="flex gap-2">
                <button onClick={() => setShowEditForm(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm">Hủy</button>
                <button onClick={handleSubmitUpdate} disabled={processing} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60">
                  {processing ? 'Đang gửi...' : 'Gửi yêu cầu cập nhật'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value}</p>
    </div>
  );
}

function EditField({ label, value, onChange, current, error }: {
  label: string; value: string; onChange: (v: string) => void; current?: string; error?: string;
}) {
  const changed = current !== undefined && value !== current;
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label}{changed && <span className="ml-1 text-blue-600 text-xs">(đã thay đổi)</span>}
      </label>
      <input value={value} onChange={e => onChange(e.target.value)}
        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${error ? 'border-red-400' : changed ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}`} />
      {current && changed && <p className="text-xs text-gray-400 mt-0.5">Hiện tại: {current}</p>}
      {error && <p className="text-red-500 text-xs mt-0.5">{error}</p>}
    </div>
  );
}
