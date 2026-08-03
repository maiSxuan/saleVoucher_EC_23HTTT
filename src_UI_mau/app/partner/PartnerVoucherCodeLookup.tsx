import { useState } from "react";
import { Search, QrCode, AlertCircle, CheckCircle, Clock, X, Loader2, ShieldCheck, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { mockVoucherCodes, mockPartnerBranches, type VoucherCodeLookup } from "../data/partnerMockData";

type LookupState = 'idle' | 'loading' | 'valid' | 'used' | 'expired' | 'cancelled' | 'invalid' | 'error';
type ConfirmState = 'idle' | 'processing' | 'success' | 'state_error' | 'log_error' | 'race_error';

const CURRENT_BRANCH_ID = 'PB001';
const CURRENT_BRANCH_NAME = 'Chi nhánh Lý Tự Trọng';

export default function PartnerVoucherCodeLookup({ mode }: { mode: 'owner' | 'staff' }) {
  const [inputCode, setInputCode] = useState('');
  const [lookupState, setLookupState] = useState<LookupState>('idle');
  const [foundCode, setFoundCode] = useState<(VoucherCodeLookup & { id: string }) | null>(null);
  const [confirmState, setConfirmState] = useState<ConfirmState>('idle');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [usedCodes, setUsedCodes] = useState<string[]>([]);

  // Demo simulation options
  const [simError, setSimError] = useState<'none' | 'state' | 'log' | 'race'>('none');

  const handleLookup = () => {
    if (!inputCode.trim()) return;
    setLookupState('loading');
    setFoundCode(null);
    setConfirmState('idle');

    setTimeout(() => {
      // Check if code was already confirmed in this session
      if (usedCodes.includes(inputCode.trim())) {
        const code = mockVoucherCodes.find(c => c.code === inputCode.trim());
        if (code) { setFoundCode({ ...code, status: 'used' }); setLookupState('used'); return; }
      }

      const code = mockVoucherCodes.find(c => c.code.toUpperCase() === inputCode.trim().toUpperCase());
      if (!code) {
        setLookupState('invalid');
        return;
      }
      // Scope check
      if (!code.applicableBranchIds.includes(CURRENT_BRANCH_ID)) {
        setLookupState('invalid');
        setFoundCode({ ...code, code: '[NGOÀI PHẠM VI]' });
        return;
      }
      setFoundCode(code);
      if (code.status === 'unused') setLookupState('valid');
      else if (code.status === 'used') setLookupState('used');
      else if (code.status === 'expired') setLookupState('expired');
      else if (code.status === 'cancelled' || code.status === 'disabled') setLookupState('cancelled');
      else setLookupState('invalid');
    }, 600);
  };

  const handleConfirmUsage = () => {
    setConfirmState('processing');
    setTimeout(() => {
      // Simulate different error scenarios
      if (simError === 'race') {
        // Race condition: code was already used
        setUsedCodes(u => [...u, foundCode!.code]);
        setConfirmState('race_error');
        return;
      }
      if (simError === 'state') {
        setConfirmState('state_error');
        return;
      }
      if (simError === 'log') {
        // Log failed → rollback state
        setConfirmState('log_error');
        return;
      }
      // Success: both state update AND audit log succeed
      setUsedCodes(u => [...u, foundCode!.code]);
      setConfirmState('success');
      toast.success('Xác nhận sử dụng voucher thành công!');
    }, 1200);
  };

  const handleReset = () => {
    setInputCode('');
    setLookupState('idle');
    setFoundCode(null);
    setConfirmState('idle');
    setShowConfirmModal(false);
  };

  const currentBranch = mockPartnerBranches.find(b => b.id === CURRENT_BRANCH_ID);

  const calcDiscountedPrice = (code: VoucherCodeLookup) => {
    if (code.discountType === 'fixed' && code.discountValue && code.originalTransactionValue) {
      return {
        after: code.originalTransactionValue - code.discountValue,
        discount: code.discountValue,
        hasData: true,
      };
    }
    if (code.discountType === 'percent' && code.discountValue && code.originalTransactionValue) {
      const discount = Math.round(code.originalTransactionValue * code.discountValue / 100);
      return {
        after: code.originalTransactionValue - discount,
        discount,
        hasData: true,
      };
    }
    return { hasData: false, after: 0, discount: 0 };
  };

  const sampleCodes = [
    { code: 'SW-BUFF-A1B2C3', label: 'Hợp lệ (có giá)' },
    { code: 'SW-HAPP-N0P1Q2', label: 'Hợp lệ (không có giá)' },
    { code: 'SW-BUFF-X9Y8Z7', label: 'Đã sử dụng' },
    { code: 'SW-LOVE-E1F2G3', label: 'Hết hạn' },
    { code: 'SW-SET1-C4D5E6', label: 'Bị hủy' },
    { code: 'INVALID-CODE', label: 'Không hợp lệ' },
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Tra cứu Voucher Code</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-gray-500">Chi nhánh đang thao tác:</span>
          <span className="text-sm font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">{CURRENT_BRANCH_NAME}</span>
        </div>
      </div>

      {/* Demo helper */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <p className="text-xs font-semibold text-blue-700 mb-2">Demo — Mã thử nhanh:</p>
        <div className="flex flex-wrap gap-1">
          {sampleCodes.map(s => (
            <button key={s.code} onClick={() => { setInputCode(s.code); setLookupState('idle'); setFoundCode(null); }} className="text-xs px-2 py-1 bg-white border border-blue-200 rounded text-blue-700 hover:bg-blue-100">
              {s.label}
            </button>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <p className="text-xs text-blue-600">Mô phỏng lỗi xác nhận:</p>
          {(['none', 'race', 'state', 'log'] as const).map(e => (
            <button key={e} onClick={() => setSimError(e)} className={`text-xs px-2 py-0.5 rounded border ${simError === e ? 'bg-blue-600 text-white border-blue-600' : 'border-blue-300 text-blue-600 hover:bg-blue-100'}`}>
              {e === 'none' ? 'Không lỗi' : e === 'race' ? 'Race condition' : e === 'state' ? 'Lỗi cập nhật' : 'Lỗi ghi log'}
            </button>
          ))}
        </div>
        {simError !== 'none' && <p className="text-xs text-amber-600 mt-1">⚠ Mô phỏng đang bật: {simError === 'race' ? 'Race condition (mã bị dùng trước)' : simError === 'state' ? 'Lỗi cập nhật trạng thái' : 'Lỗi ghi nhật ký → rollback trạng thái'}</p>}
      </div>

      {/* Lookup input */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Nhập mã voucher</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={inputCode}
              onChange={e => setInputCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && handleLookup()}
              placeholder="SW-XXXX-XXXXXX"
              className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button onClick={handleLookup} disabled={lookupState === 'loading' || !inputCode.trim()} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2">
            {lookupState === 'loading' ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            Tra cứu
          </button>
        </div>

        {/* QR mock */}
        <div className="mt-3 border-2 border-dashed border-gray-200 rounded-lg p-4 flex items-center justify-center gap-3 text-gray-400 cursor-pointer hover:border-emerald-300" onClick={() => toast.info('QR camera là mô phỏng — vui lòng nhập mã thủ công.')}>
          <QrCode size={20} />
          <span className="text-sm">Quét QR mô phỏng (nhấn để nhập thủ công)</span>
        </div>
        <p className="text-xs text-gray-400 text-center mt-1">Quét QR là mô phỏng — không bật camera thật</p>
      </div>

      {/* Loading */}
      {lookupState === 'loading' && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 flex items-center justify-center gap-3 text-gray-400">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm">Đang tra cứu...</span>
        </div>
      )}

      {/* Invalid */}
      {(lookupState === 'invalid') && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-700">Mã voucher không hợp lệ</p>
            <p className="text-sm text-red-600 mt-0.5">
              {foundCode?.code === '[NGOÀI PHẠM VI]'
                ? 'Mã này không thuộc phạm vi chi nhánh của bạn.'
                : 'Mã không tồn tại trong hệ thống hoặc không thuộc phạm vi quản lý.'}
            </p>
            <p className="text-xs text-red-400 mt-1">Mã đã nhập: {inputCode}</p>
          </div>
        </div>
      )}

      {/* Used */}
      {lookupState === 'used' && foundCode && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex items-start gap-3">
          <CheckCircle size={20} className="text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-700">Voucher đã được sử dụng</p>
            <p className="text-sm text-gray-600 mt-0.5">{foundCode.voucherName}</p>
            {foundCode.usedAt && <p className="text-xs text-gray-400 mt-1">Sử dụng lúc: {foundCode.usedAt} tại {foundCode.usedBranch || CURRENT_BRANCH_NAME}</p>}
          </div>
        </div>
      )}

      {/* Expired */}
      {lookupState === 'expired' && foundCode && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex items-start gap-3">
          <Clock size={20} className="text-gray-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-700">Voucher đã hết hạn</p>
            <p className="text-sm text-gray-600 mt-0.5">{foundCode.voucherName}</p>
            <p className="text-xs text-gray-400 mt-1">Hạn sử dụng: {foundCode.validUntil}</p>
          </div>
        </div>
      )}

      {/* Cancelled */}
      {lookupState === 'cancelled' && foundCode && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex items-start gap-3">
          <X size={20} className="text-gray-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-700">Voucher đã bị hủy / vô hiệu hóa</p>
            <p className="text-sm text-gray-600 mt-0.5">{foundCode.voucherName} — không thể sử dụng.</p>
          </div>
        </div>
      )}

      {/* Valid */}
      {lookupState === 'valid' && foundCode && (() => {
        const priceInfo = calcDiscountedPrice(foundCode);
        return (
          <div className="bg-white border-2 border-emerald-400 rounded-xl overflow-hidden">
            <div className="bg-emerald-500 px-5 py-3 flex items-center gap-2">
              <CheckCircle size={18} className="text-white" />
              <p className="font-semibold text-white">Voucher hợp lệ — Sẵn sàng xác nhận</p>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-lg font-bold text-gray-900">{foundCode.voucherName}</p>
                <p className="text-sm text-gray-500 mt-0.5">Đối tác: {foundCode.partnerName}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Chi nhánh áp dụng</p>
                  <p className="font-medium text-gray-800">{CURRENT_BRANCH_NAME} ✓</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Hạn sử dụng</p>
                  <p className="font-medium text-gray-800">{foundCode.validUntil}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Trạng thái mã</p>
                  <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded">Chưa sử dụng</span>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Khách hàng</p>
                  <p className="font-medium text-gray-800">{foundCode.customerHint}</p>
                </div>
              </div>

              {/* Price section */}
              <div className="bg-emerald-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-2">Thông tin giá</p>
                {priceInfo.hasData ? (
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Giá trước giảm</span>
                      <span className="text-gray-700">{foundCode.originalTransactionValue!.toLocaleString()}đ</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Số tiền giảm</span>
                      <span>− {priceInfo.discount.toLocaleString()}đ</span>
                    </div>
                    <div className="flex justify-between font-bold text-emerald-700 border-t border-emerald-200 pt-1">
                      <span>Giá sau giảm</span>
                      <span>{priceInfo.after.toLocaleString()}đ</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-amber-600 italic">Không có dữ liệu tính giảm giá</p>
                )}
              </div>

              <div className="text-sm">
                <p className="text-xs text-gray-400 mb-1">Điều kiện sử dụng</p>
                <p className="text-gray-700">{foundCode.conditions}</p>
              </div>

              {/* Confirm button */}
              {confirmState === 'idle' && (
                <button onClick={() => setShowConfirmModal(true)} className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold text-base hover:bg-emerald-700 flex items-center justify-center gap-2">
                  <ShieldCheck size={18} /> Xác nhận sử dụng voucher
                </button>
              )}

              {confirmState === 'success' && (
                <div className="bg-green-50 border border-green-300 rounded-lg p-4 flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-green-700">Xác nhận sử dụng voucher thành công</p>
                    <p className="text-xs text-green-600">Trạng thái đã cập nhật và nhật ký đã được ghi nhận.</p>
                  </div>
                </div>
              )}

              {confirmState === 'state_error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="font-medium text-red-700">Không thể xác nhận sử dụng voucher. Vui lòng thử lại.</p>
                  <button onClick={() => setConfirmState('idle')} className="mt-2 text-sm text-red-600 flex items-center gap-1 hover:underline"><RotateCcw size={13} /> Thử lại</button>
                </div>
              )}

              {confirmState === 'log_error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="font-medium text-red-700">Không thể hoàn tất thao tác do lỗi ghi nhận nhật ký.</p>
                  <p className="text-xs text-red-500 mt-1">Trạng thái voucher code đã được rollback về trước thao tác.</p>
                  <button onClick={() => setConfirmState('idle')} className="mt-2 text-sm text-red-600 flex items-center gap-1 hover:underline"><RotateCcw size={13} /> Thử lại</button>
                </div>
              )}

              {confirmState === 'race_error' && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="font-medium text-amber-700">Mã đã được sử dụng trước đó</p>
                  <p className="text-xs text-amber-600 mt-1">Một phiên khác đã xác nhận mã này. Tải lại trạng thái mới nhất.</p>
                  <button onClick={handleLookup} className="mt-2 text-sm text-amber-700 flex items-center gap-1 hover:underline"><RotateCcw size={13} /> Tải lại trạng thái</button>
                </div>
              )}

              {(confirmState === 'success' || confirmState === 'race_error') && (
                <button onClick={handleReset} className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                  Tra cứu mã khác
                </button>
              )}
            </div>
          </div>
        );
      })()}

      {/* Confirm modal */}
      {showConfirmModal && foundCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => confirmState !== 'processing' && setShowConfirmModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-emerald-600 px-6 py-4">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-white" />
                <h3 className="font-bold text-white text-lg">Xác nhận sử dụng voucher</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2 text-sm">
                <InfoLine label="Voucher" value={foundCode.voucherName} bold />
                <InfoLine label="Chi nhánh thao tác" value={CURRENT_BRANCH_NAME} />
                <InfoLine label="Khách hàng" value={foundCode.customerHint} />
                <InfoLine label="Hạn sử dụng" value={foundCode.validUntil} />
                <InfoLine label="Trạng thái mã" value="Chưa sử dụng" highlight />
              </div>

              {(() => {
                const priceInfo = calcDiscountedPrice(foundCode);
                return priceInfo.hasData ? (
                  <div className="bg-emerald-50 rounded-lg p-3 text-sm space-y-1">
                    <div className="flex justify-between text-gray-600">
                      <span>Giá trước giảm</span>
                      <span>{foundCode.originalTransactionValue!.toLocaleString()}đ</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Số tiền giảm</span>
                      <span>− {priceInfo.discount.toLocaleString()}đ</span>
                    </div>
                    <div className="flex justify-between font-bold text-emerald-700 border-t border-emerald-200 pt-1">
                      <span>Giá sau giảm</span>
                      <span>{priceInfo.after.toLocaleString()}đ</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-amber-600 bg-amber-50 rounded p-2 italic">Không có dữ liệu tính giảm giá</p>
                );
              })()}

              <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
                <p className="font-medium mb-1">Điều kiện: {foundCode.conditions}</p>
              </div>

              {confirmState === 'processing' && (
                <div className="flex items-center justify-center gap-2 py-4 text-emerald-600">
                  <Loader2 size={18} className="animate-spin" />
                  <span className="text-sm font-medium">Đang xử lý — không thực hiện thêm thao tác...</span>
                </div>
              )}

              {confirmState === 'idle' && (
                <div className="flex gap-3">
                  <button onClick={() => setShowConfirmModal(false)} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50">Hủy</button>
                  <button onClick={handleConfirmUsage} className="flex-1 bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-emerald-700">
                    Xác nhận
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoLine({ label, value, bold, highlight }: { label: string; value: string; bold?: boolean; highlight?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className={`${bold ? 'font-semibold text-gray-900' : ''} ${highlight ? 'text-green-700 font-medium' : 'text-gray-700'}`}>{value}</span>
    </div>
  );
}
