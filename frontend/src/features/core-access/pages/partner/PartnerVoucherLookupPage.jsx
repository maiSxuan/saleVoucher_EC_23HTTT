import React, { useState, useEffect } from 'react';
import {
  Search,
  Camera,
  CheckCircle2,
  AlertCircle,
  Clock,
  Ban,
  Building2,
  Calendar,
  User,
  Tag,
  ArrowRight,
  RefreshCw,
  Sparkles,
  History,
  ShieldCheck,
  CreditCard,
  FileText,
  Store,
} from 'lucide-react';
import {
  verifyVoucherCode,
  redeemVoucherCode,
  fetchUsageHistory,
  fetchSampleCodes,
  fetchBranches,
} from '../../api/voucherCodeApi';
import QrScannerModal from '../../component/QrScannerModal';
import QrCodeDisplay from '../../component/QrCodeDisplay';

export default function PartnerVoucherLookupPage() {
  // Lấy thông tin user hiện tại
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  // Xác định chi nhánh của nhân viên:
  // Nếu là Nhân viên bán hàng hoặc tài khoản có ma_chi_nhanh thì cố định chi nhánh làm việc
  const staffBranchId = currentUser?.ma_chi_nhanh || null;
  const isBranchStaff = Boolean(
    staffBranchId ||
    currentUser?.role === 'PARTNER_STAFF' ||
    currentUser?.vai_tro_he_thong === 'Nhan vien ban hang'
  );

  // State quản lý chi nhánh
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState(staffBranchId || '');
  const [isLoadingBranches, setIsLoadingBranches] = useState(true);

  // State tra cứu
  const [inputCode, setInputCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // State Modal Camera & Modal Xác nhận
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redemptionSuccess, setRedemptionSuccess] = useState(null);
  const [redemptionNote, setRedemptionNote] = useState('');

  // State danh sách mã mẫu & Lịch sử
  const [sampleCodes, setSampleCodes] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [activeViewTab, setActiveViewTab] = useState('lookup'); // 'lookup' | 'history'

  // Load danh sách chi nhánh và mã mẫu ban đầu
  useEffect(() => {
    async function initData() {
      setIsLoadingBranches(true);
      try {
        const branchRes = await fetchBranches();
        if (branchRes?.data && Array.isArray(branchRes.data)) {
          setBranches(branchRes.data);
          if (staffBranchId) {
            setSelectedBranchId(staffBranchId);
          } else if (!selectedBranchId && branchRes.data.length > 0) {
            setSelectedBranchId(branchRes.data[0].ma_chi_nhanh);
          }
        }
      } catch (err) {
        console.warn('Lỗi lấy danh sách chi nhánh:', err);
      } finally {
        setIsLoadingBranches(false);
      }

      try {
        const sampleRes = await fetchSampleCodes();
        if (sampleRes?.data) {
          setSampleCodes(sampleRes.data);
        }
      } catch (err) {
        console.warn('Lỗi lấy danh sách mã mẫu:', err);
      }
    }

    initData();
  }, [staffBranchId]);

  // Load lịch sử khi chuyển tab
  useEffect(() => {
    if (activeViewTab === 'history') {
      loadHistory();
    }
  }, [activeViewTab, selectedBranchId]);

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const res = await fetchUsageHistory({ branchId: selectedBranchId });
      if (res?.data) {
        setHistoryList(res.data);
      }
    } catch (err) {
      console.error('Lỗi tải lịch sử:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Thực hiện tra cứu voucher
  const handleVerify = async (codeToVerify) => {
    const code = (codeToVerify || inputCode).trim().toUpperCase();
    if (!code) return;

    setIsVerifying(true);
    setErrorMessage(null);
    setRedemptionSuccess(null);

    try {
      const res = await verifyVoucherCode({
        code,
        branchId: selectedBranchId || staffBranchId || null,
      });

      setVerificationResult(res);
      setInputCode(code);
    } catch (err) {
      setErrorMessage(err.message || 'Lỗi hệ thống khi tra cứu mã voucher.');
      setVerificationResult(null);
    } finally {
      setIsVerifying(false);
    }
  };

  // Callback khi camera quét được mã
  const handleCameraScanSuccess = (scannedCode) => {
    setInputCode(scannedCode);
    handleVerify(scannedCode);
  };

  // Xác nhận sử dụng voucher (BR-PAR-06)
  const handleConfirmRedemption = async () => {
    if (!verificationResult?.data?.code) return;

    setIsRedeeming(true);
    setErrorMessage(null);

    try {
      const res = await redeemVoucherCode({
        code: verificationResult.data.code,
        branchId: selectedBranchId || staffBranchId || null,
        note: redemptionNote,
      });

      setRedemptionSuccess(res);
      setIsConfirmModalOpen(false);
      // Tải lại trạng thái voucher sau khi đổi
      handleVerify(verificationResult.data.code);
    } catch (err) {
      setErrorMessage(err.message || 'Không thể xác nhận sử dụng voucher. Vui lòng thử lại.');
      setIsConfirmModalOpen(false);
    } finally {
      setIsRedeeming(false);
    }
  };

  const voucherData = verificationResult?.data;

  // Xác định chi nhánh hoạt động hiện tại
  const currentBranchObj =
    branches.find((b) => b.ma_chi_nhanh === (staffBranchId || selectedBranchId)) ||
    (staffBranchId ? branches.find((b) => b.ma_chi_nhanh === staffBranchId) : null) ||
    (branches.length > 0 ? branches[0] : null);

  const displayBranchName =
    currentBranchObj?.ten_chi_nhanh ||
    currentUser?.ten_chi_nhanh ||
    (staffBranchId ? `Chi nhánh (${staffBranchId.substring(0, 8)})` : 'Chi nhánh đang hoạt động');

  const displayBranchAddress =
    currentBranchObj?.dia_chi ||
    currentBranchObj?.khu_vuc ||
    currentUser?.dia_chi_chi_nhanh ||
    currentUser?.khu_vuc_chi_nhanh ||
    'Đang kết nối hệ thống chi nhánh';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white border-b border-emerald-900/40 py-8 px-4 sm:px-8 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Đối tác & Chi nhánh • BR-PAR-05 & BR-PAR-06</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Tra cứu & Xác nhận Sử dụng Voucher
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Quét mã QR qua Camera thời gian thực hoặc nhập mã để đối soát tại quầy chi nhánh
            </p>
          </div>

          {/* Branch Context - Hiển thị chi nhánh mà nhân viên đang làm việc */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15 shadow-inner">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
              <Store className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-xs">
              <div className="flex items-center gap-1.5 text-slate-300 font-medium mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Chi nhánh đang làm việc:</span>
              </div>

              {isBranchStaff || staffBranchId ? (
                <div>
                  <div className="font-bold text-white text-sm">
                    {displayBranchName}
                  </div>
                  <div className="text-[11px] text-emerald-300 font-normal truncate max-w-[280px]">
                    📍 {displayBranchAddress}
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="relative">
                    <select
                      value={selectedBranchId}
                      onChange={(e) => {
                        setSelectedBranchId(e.target.value);
                        if (verificationResult) setVerificationResult(null);
                      }}
                      className="bg-slate-800/95 text-white font-bold text-xs py-1.5 px-3 pr-8 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer appearance-none min-w-[220px]"
                    >
                      {isLoadingBranches ? (
                        <option value="" className="text-slate-900">
                          Đang tải danh sách chi nhánh...
                        </option>
                      ) : branches.length === 0 ? (
                        <option value="" className="text-slate-900">
                          {displayBranchName}
                        </option>
                      ) : (
                        branches.map((b) => (
                          <option key={b.ma_chi_nhanh} value={b.ma_chi_nhanh} className="text-slate-900">
                            {b.ten_chi_nhanh} {b.khu_vuc ? `(${b.khu_vuc})` : ''}
                          </option>
                        ))
                      )}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-emerald-400">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                  {currentBranchObj && (
                    <div className="text-[11px] text-emerald-300 font-medium truncate max-w-[220px]">
                      📍 {currentBranchObj.dia_chi || currentBranchObj.khu_vuc}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 mt-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-6">
          <button
            type="button"
            onClick={() => setActiveViewTab('lookup')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${activeViewTab === 'lookup'
                ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
          >
            <Search className="w-4 h-4" />
            <span>Tra cứu & Quét mã</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveViewTab('history')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${activeViewTab === 'history'
                ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
          >
            <History className="w-4 h-4" />
            <span>Lịch sử sử dụng tại quầy</span>
          </button>
        </div>

        {activeViewTab === 'lookup' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Input Bar & Fast Samples (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Box Tra cứu & Quét Camera */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="text-base font-bold text-slate-900 mb-2">Nhập mã hoặc Quét QR</h2>
                <p className="text-xs text-slate-500 mb-4">
                  Sử dụng Camera thiết bị để quét trực tiếp mã QR trên điện thoại khách hàng hoặc gõ mã thủ công.
                </p>

                {/* Form input */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleVerify();
                  }}
                  className="space-y-3"
                >
                  <div className="relative">
                    <input
                      type="text"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                      placeholder="Ví dụ: EC26-FOOD-A1B2C3D4"
                      className="w-full px-4 py-3.5 pl-11 bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-2xl text-sm font-mono font-bold tracking-wider uppercase text-slate-900 transition-all placeholder:font-sans placeholder:normal-case placeholder:font-normal"
                    />
                    <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    {/* Nút Quét Camera THẬT */}
                    <button
                      type="button"
                      onClick={() => setIsCameraOpen(true)}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-2xl shadow-md hover:shadow-lg transition-all"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Quét Camera</span>
                    </button>

                    {/* Nút Tra cứu */}
                    <button
                      type="submit"
                      disabled={isVerifying || !inputCode.trim()}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold rounded-2xl transition-all shadow-sm"
                    >
                      {isVerifying ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <ArrowRight className="w-4 h-4" />
                      )}
                      <span>{isVerifying ? 'Đang kiểm tra...' : 'Tra cứu mã'}</span>
                    </button>
                  </div>
                </form>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-700 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Thông báo:</span>
                      <span>{errorMessage}</span>
                    </div>
                  </div>
                )}

                {/* Success Banner sau khi đổi mã */}
                {redemptionSuccess && (
                  <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-800 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                    <div>
                      <span className="font-bold block">{redemptionSuccess.message}</span>
                      <span>Mã voucher đã được cập nhật thành "Đã sử dụng" và ghi nhận nhật ký hệ thống.</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Sample Codes List (Thử nghiệm nhanh) */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Mã mẫu có sẵn trong DB (Nhấp để thử nhanh):</span>
                </div>
                <div className="space-y-2 mt-3">
                  {sampleCodes.map((s) => (
                    <button
                      key={s.code}
                      type="button"
                      onClick={() => handleVerify(s.code)}
                      className="w-full flex items-center justify-between p-2.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-left transition-all group"
                    >
                      <div>
                        <span className="font-mono text-xs font-bold text-slate-800 group-hover:text-emerald-700 block">
                          {s.code}
                        </span>
                        <span className="text-[10px] text-slate-500 line-clamp-1">{s.voucherName}</span>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${s.status === 'Chua su dung'
                            ? 'bg-emerald-100 text-emerald-800'
                            : s.status === 'Da su dung'
                              ? 'bg-slate-200 text-slate-700'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                      >
                        {s.status}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Detailed Result Card (7 cols) */}
            <div className="lg:col-span-7">
              {!verificationResult && !isVerifying ? (
                <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                  <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-slate-700">Chưa có thông tin tra cứu</h3>
                  <p className="text-xs text-slate-500 max-w-sm mt-1">
                    Nhập mã voucher hoặc bấm <strong>"Quét Camera"</strong> để kiểm tra tính hợp lệ và xác nhận sử dụng tại quầy.
                  </p>
                </div>
              ) : null}

              {isVerifying && (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                  <RefreshCw className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
                  <h3 className="text-base font-bold text-slate-800">Đang đối soát dữ liệu trên hệ thống...</h3>
                  <p className="text-xs text-slate-500 mt-1">Kiểm tra chi nhánh, trạng thái sử dụng và hạn dùng.</p>
                </div>
              )}

              {verificationResult && !isVerifying && (
                <div className="space-y-6">
                  {/* Card Kết quả */}
                  <div
                    className={`bg-white rounded-3xl border shadow-md overflow-hidden transition-all ${verificationResult.status === 'valid'
                        ? 'border-emerald-300 ring-2 ring-emerald-500/10'
                        : verificationResult.status === 'used'
                          ? 'border-slate-300 bg-slate-50/50'
                          : verificationResult.status === 'expired'
                            ? 'border-amber-300'
                            : 'border-rose-300'
                      }`}
                  >
                    {/* Status Header Banner */}
                    <div
                      className={`px-6 py-4 flex items-center justify-between border-b ${verificationResult.status === 'valid'
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : verificationResult.status === 'used'
                            ? 'bg-slate-700 text-white border-slate-600'
                            : verificationResult.status === 'expired'
                              ? 'bg-amber-600 text-white border-amber-500'
                              : 'bg-rose-600 text-white border-rose-500'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        {verificationResult.status === 'valid' ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : verificationResult.status === 'used' ? (
                          <Clock className="w-5 h-5" />
                        ) : verificationResult.status === 'expired' ? (
                          <Calendar className="w-5 h-5" />
                        ) : (
                          <Ban className="w-5 h-5" />
                        )}
                        <span className="font-bold text-sm tracking-wide uppercase">
                          {verificationResult.status === 'valid' && 'HỢP LỆ — SẴN SÀNG SỬ DỤNG'}
                          {verificationResult.status === 'used' && 'VOUCHER ĐÃ ĐƯỢC SỬ DỤNG'}
                          {verificationResult.status === 'expired' && 'VOUCHER ĐÃ HẾT HẠN'}
                          {verificationResult.status === 'cancelled' && 'VOUCHER BỊ HỦY / KHÓA'}
                          {verificationResult.status === 'invalid_branch' && 'KHÔNG THUỘC CHI NHÁNH NÀY (RB-09)'}
                          {verificationResult.status === 'invalid' && 'MÃ KHÔNG HỢP LỆ'}
                        </span>
                      </div>

                      <span className="font-mono text-xs font-extrabold px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg">
                        {verificationResult.code}
                      </span>
                    </div>

                    {/* Voucher Details Body */}
                    {voucherData ? (
                      <div className="p-6 space-y-6">
                        {/* Title & Description */}
                        <div>
                          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                            {voucherData.partnerName || 'Đối tác'}
                          </span>
                          <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                            {voucherData.voucherName}
                          </h3>
                          {voucherData.description && (
                            <p className="text-xs text-slate-600 mt-1">{voucherData.description}</p>
                          )}
                        </div>

                        {/* Price Calculation Box */}
                        <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                          <div>
                            <span className="text-[11px] text-slate-500 block">Giá niêm yết:</span>
                            <span className="text-sm font-bold text-slate-600 line-through">
                              {Number(voucherData.originalPrice).toLocaleString('vi-VN')} đ
                            </span>
                          </div>
                          <div>
                            <span className="text-[11px] text-emerald-600 font-semibold block">Mức giảm:</span>
                            <span className="text-sm font-extrabold text-emerald-600">
                              -{Number(voucherData.discountValue).toLocaleString('vi-VN')} đ
                            </span>
                          </div>
                          <div>
                            <span className="text-[11px] text-slate-900 font-bold block">Khách cần trả:</span>
                            <span className="text-base font-extrabold text-indigo-700">
                              {Number(
                                Math.max(0, voucherData.originalPrice - voucherData.discountValue)
                              ).toLocaleString('vi-VN')}{' '}
                              đ
                            </span>
                          </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          {/* Khách hàng (ẩn danh NFR-02) */}
                          <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                              <User className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px]">Khách hàng sở hữu (ẩn danh NFR-02):</span>
                              <span className="font-bold text-slate-800">{voucherData.customerMaskedName}</span>
                            </div>
                          </div>

                          {/* Hạn sử dụng */}
                          <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl">
                            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                              <Calendar className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px]">Hạn sử dụng:</span>
                              <span className="font-bold text-slate-800">
                                {voucherData.validUntil
                                  ? new Date(voucherData.validUntil).toLocaleDateString('vi-VN')
                                  : 'Không thời hạn'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Chi nhánh áp dụng */}
                        <div>
                          <span className="text-xs font-bold text-slate-700 block mb-2 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-500" />
                            <span>Chi nhánh được phép áp dụng ({voucherData.applicableBranches.length}):</span>
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {voucherData.applicableBranches.map((b) => (
                              <span
                                key={b.branchId}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${b.branchId === selectedBranchId
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-slate-100 text-slate-700'
                                  }`}
                              >
                                {b.branchName}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Thông tin đã sử dụng (nếu đã dùng) */}
                        {voucherData.status === 'Da su dung' && (
                          <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 text-xs space-y-1">
                            <span className="font-bold text-slate-800 block">Thông tin sử dụng trước đó:</span>
                            <p className="text-slate-600">
                              Thời gian: <strong>{new Date(voucherData.usedAt).toLocaleString('vi-VN')}</strong>
                            </p>
                            {voucherData.usedBranchName && (
                              <p className="text-slate-600">
                                Chi nhánh xác nhận: <strong>{voucherData.usedBranchName}</strong>
                              </p>
                            )}
                          </div>
                        )}

                        {/* Action Buttons (BR-PAR-06) */}
                        {verificationResult.status === 'valid' && (
                          <div className="pt-2 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => setIsConfirmModalOpen(true)}
                              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                            >
                              <CheckCircle2 className="w-5 h-5" />
                              <span>Xác nhận sử dụng voucher ngay</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-xs text-rose-600">
                        {verificationResult.message}
                      </div>
                    )}
                  </div>

                  {/* QR Code Thật tương ứng để đối soát hoặc kiểm thử chéo */}
                  {voucherData && (
                    <div className="mt-4">
                      <QrCodeDisplay
                        value={voucherData.code}
                        title="Mã QR Code Thật (Dùng để kiểm thử quét Camera)"
                        subtitle="Mã QR này được sinh theo chuẩn ISO/IEC, bạn có thể dùng điện thoại quét trực tiếp"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Tab Lịch sử sử dụng */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">Nhật ký voucher đã xác nhận tại quầy</h3>
                <p className="text-xs text-slate-500">Danh sách các giao dịch sử dụng voucher thành công</p>
              </div>
              <button
                type="button"
                onClick={loadHistory}
                disabled={isLoadingHistory}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingHistory ? 'animate-spin' : ''}`} />
                <span>Làm mới</span>
              </button>
            </div>

            {isLoadingHistory ? (
              <div className="py-16 text-center text-slate-500 text-xs">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                <span>Đang tải danh sách lịch sử...</span>
              </div>
            ) : historyList.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-xs">
                <History className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <span>Chưa có lịch sử voucher sử dụng tại chi nhánh này</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
                      <th className="py-3 px-4 font-bold">Mã Voucher</th>
                      <th className="py-3 px-4 font-bold">Tên Voucher</th>
                      <th className="py-3 px-4 font-bold">Thời gian sử dụng</th>
                      <th className="py-3 px-4 font-bold">Chi nhánh</th>
                      <th className="py-3 px-4 font-bold">Nhân viên xác nhận</th>
                      <th className="py-3 px-4 font-bold text-right">Mức giảm</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {historyList.map((item) => (
                      <tr key={item.ma_voucher_mua} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                          {item.voucher_code}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {item.voucher?.ten_voucher || 'Voucher'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {item.ngay_su_dung
                            ? new Date(item.ngay_su_dung).toLocaleString('vi-VN')
                            : '—'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {item.chinhanh?.ten_chi_nhanh || 'Chi nhánh'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {item.nhanvien?.nguoidung?.ho_ten || item.nhanvien?.thong_tin_dang_nhap || 'Hệ thống'}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-emerald-600">
                          -{Number(item.voucher?.gia_tri_giam || 0).toLocaleString('vi-VN')} đ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Quét Camera Thật */}
      <QrScannerModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onScanSuccess={handleCameraScanSuccess}
      />

      {/* Modal Xác nhận Sử dụng (BR-PAR-06) */}
      {isConfirmModalOpen && voucherData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">Xác nhận sử dụng voucher?</h3>
            <p className="text-xs text-slate-500 mt-1">
              Thao tác này sẽ chuyển trạng thái voucher sang <strong>Đã sử dụng</strong> và ghi nhận vào nhật ký hệ thống (RB-12). Voucher sẽ không thể sử dụng lại (RB-07).
            </p>

            <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Mã voucher:</span>
                <span className="font-mono font-bold text-slate-900">{voucherData.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Chương trình:</span>
                <span className="font-bold text-slate-900 text-right line-clamp-1">{voucherData.voucherName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Chi nhánh áp dụng:</span>
                <span className="font-semibold text-emerald-700">
                  {currentBranchObj?.ten_chi_nhanh || 'Chi nhánh hiện tại'}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Ghi chú thêm (Tùy chọn):
              </label>
              <input
                type="text"
                value={redemptionNote}
                onChange={(e) => setRedemptionNote(e.target.value)}
                placeholder="VD: Bàn 12, khách dùng bữa tối..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                type="button"
                disabled={isRedeeming}
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={isRedeeming}
                onClick={handleConfirmRedemption}
                className="px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                {isRedeeming ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}
                <span>{isRedeeming ? 'Đang xử lý...' : 'Xác nhận ngay'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
