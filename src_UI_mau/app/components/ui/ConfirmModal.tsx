import { useState, useEffect } from "react";
import { X, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

export interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void | Promise<void>;
  title: string;
  description?: string;
  targetName?: string;
  beforeStatus?: string;
  afterStatus?: string;
  consequences?: string[];
  requireReason?: boolean;
  reasonLabel?: string;
  reasonOptions?: string[];
  confirmLabel?: string;
  confirmVariant?: 'danger' | 'primary';
  isProcessing?: boolean;
  warning?: string;
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  targetName,
  beforeStatus,
  afterStatus,
  consequences = [],
  requireReason = false,
  reasonLabel = 'Lý do',
  reasonOptions,
  confirmLabel = 'Xác nhận',
  confirmVariant = 'primary',
  warning,
}: ConfirmModalProps) {
  const [reason, setReason] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setReason('');
      setSelectedGroup('');
      setError('');
      setProcessing(false);
    }
  }, [open]);

  if (!open) return null;

  const handleConfirm = async () => {
    if (requireReason && !reason.trim()) {
      setError(`${reasonLabel} là bắt buộc.`);
      return;
    }
    setError('');
    setProcessing(true);
    try {
      await onConfirm(reason.trim() || undefined);
    } finally {
      setProcessing(false);
    }
  };

  const btnConfirm = confirmVariant === 'danger'
    ? 'bg-red-600 hover:bg-red-700 text-white'
    : 'bg-blue-600 hover:bg-blue-700 text-white';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={() => !processing && onClose()} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${confirmVariant === 'danger' ? 'bg-red-100' : 'bg-blue-100'}`}>
            <AlertTriangle size={18} className={confirmVariant === 'danger' ? 'text-red-600' : 'text-blue-600'} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            {targetName && <p className="text-sm text-gray-500 truncate">{targetName}</p>}
          </div>
          {!processing && (
            <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 text-gray-400">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}

          {(beforeStatus || afterStatus) && (
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              {beforeStatus && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500 w-28 flex-shrink-0">Trạng thái hiện tại:</span>
                  <span className="text-gray-900 font-medium">{beforeStatus}</span>
                </div>
              )}
              {afterStatus && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500 w-28 flex-shrink-0">Trạng thái sau:</span>
                  <span className="text-blue-700 font-medium">{afterStatus}</span>
                </div>
              )}
            </div>
          )}

          {warning && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2">
              <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700">{warning}</p>
            </div>
          )}

          {consequences.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Hậu quả dự kiến:</p>
              <ul className="space-y-1">
                {consequences.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {requireReason && (
            <div>
              {reasonOptions && (
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nhóm lý do
                  </label>
                  <select
                    value={selectedGroup}
                    onChange={e => { setSelectedGroup(e.target.value); if (!reason) setReason(e.target.value); }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Chọn nhóm lý do --</option>
                    {reasonOptions.map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              )}
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {reasonLabel} <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={e => { setReason(e.target.value); setError(''); }}
                rows={3}
                placeholder={`Nhập ${reasonLabel.toLowerCase()}...`}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={processing}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            disabled={processing}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg font-medium disabled:opacity-60 ${btnConfirm}`}
          >
            {processing && <Loader2 size={14} className="animate-spin" />}
            {processing ? 'Đang xử lý...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
