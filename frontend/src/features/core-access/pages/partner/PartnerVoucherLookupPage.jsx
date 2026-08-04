import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Camera,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Clock,
  Ban,
  Building2,
  Calendar,
  User,
  Tag,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Sparkles,
  History,
  ShieldCheck,
  CreditCard,
  FileText,
  Store,
  LogOut,
  X,
  Check,
  ChevronDown,
  QrCode,
  Zap,
  Info,
  DollarSign,
  Ticket,
} from 'lucide-react';
import {
  verifyVoucherCode,
  redeemVoucherCode,
  fetchUsageHistory,
  fetchSampleCodes,
  fetchBranches,
} from '../../api/voucherCodeApi';
import QrScannerModal from '../../component/QrScannerModal';
import QrCodeDisplay from '../../component/QRCodeDisplay';

export default function PartnerVoucherLookupPage() {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // 1. Lấy thông tin user hiện tại từ localStorage
  const userStr = localStorage.getItem('user');
  let currentUser = null;
  try {
    currentUser = userStr ? JSON.parse(userStr) : null;
  } catch {
    currentUser = null;
  }

  const userName =
    currentUser?.name ||
    currentUser?.ho_ten ||
    currentUser?.thong_tin_dang_nhap ||
    currentUser?.email ||
    'Nhân viên quầy';
  const userEmail = currentUser?.email || '';
  const userRole =
    currentUser?.vai_tro_he_thong ||
    (currentUser?.role === 'PARTNER_STAFF'
      ? 'Nhân viên bán hàng'
      : currentUser?.role === 'PARTNER_OWNER'
        ? 'Người đại diện'
        : 'Nhân viên đối tác');

  const canAccessManagement =
    currentUser?.vai_tro_he_thong !== 'Nhan vien ban hang' &&
    currentUser?.role !== 'PARTNER_STAFF' &&
    currentUser?.role !== 'CUSTOMER';

  // Chi nhánh của nhân viên
  const staffBranchId = currentUser?.ma_chi_nhanh || null;
  const isBranchStaff = Boolean(
    staffBranchId && (
      currentUser?.role === 'PARTNER_STAFF' ||
      currentUser?.vai_tro_he_thong === 'Nhan vien ban hang'
    )
  );

  // 2. States
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState(staffBranchId || '');
  const [isLoadingBranches, setIsLoadingBranches] = useState(true);

  // State Tra cứu
  const [inputCode, setInputCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // State Modals
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redemptionSuccess, setRedemptionSuccess] = useState(null);
  const [redemptionNote, setRedemptionNote] = useState('');

  // State Dữ liệu phụ & Tab
  const [sampleCodes, setSampleCodes] = useState([]);
  const [showSampleCodes, setShowSampleCodes] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [activeViewTab, setActiveViewTab] = useState('lookup'); // 'lookup' | 'history'

  // 3. Load chi nhánh & mã mẫu ban đầu
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

  // Tra cứu mã voucher
  const handleVerify = async (codeToVerify) => {
    const code = (codeToVerify || inputCode).trim().toUpperCase();
    if (!code) {
      if (searchInputRef.current) searchInputRef.current.focus();
      return;
    }

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

  // Nhận mã từ camera
  const handleCameraScanSuccess = (scannedCode) => {
    setInputCode(scannedCode);
    handleVerify(scannedCode);
  };

  // Xác nhận đổi voucher (BR-PAR-06)
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
      setRedemptionNote('');
      // Refresh dữ liệu
      handleVerify(verificationResult.data.code);
    } catch (err) {
      setErrorMessage(err.message || 'Không thể xác nhận sử dụng voucher. Vui lòng thử lại.');
      setIsConfirmModalOpen(false);
    } finally {
      setIsRedeeming(false);
    }
  };

  const voucherData = verificationResult?.data;

  // Xác định chi nhánh hiện tại
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
    'Đang kết nối';

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('ec_auth_token');
    localStorage.removeItem('ec_auth_user');
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100/70 font-sans text-slate-800 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* 1. TOP GLOBAL NAVBAR (Clean, HCI standard) */}
      <header className="bg-white border-b border-slate-200/90 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand & Context */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xs font-black text-base shrink-0">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-slate-900 text-base leading-tight">
                  Quầy Đối Soát Voucher
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  POS Quầy Thu Ngân
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Hệ thống xác thực mã & đối soát sử dụng tại quầy chi nhánh
              </p>
            </div>
          </div>

          {/* Right Controls: Branch, User Badge & Actions */}
          <div className="flex items-center gap-3">
            {/* Branch Selector Pill */}
            <div className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100/80 px-3 py-1.5 rounded-xl border border-slate-200 text-xs transition-colors">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block font-medium leading-none mb-0.5">
                  Chi nhánh:
                </span>
                {isBranchStaff || staffBranchId ? (
                  <span className="font-bold text-slate-800 truncate max-w-[150px] sm:max-w-[200px] block leading-tight">
                    {displayBranchName}
                  </span>
                ) : (
                  <select
                    value={selectedBranchId}
                    onChange={(e) => {
                      setSelectedBranchId(e.target.value);
                      if (verificationResult) setVerificationResult(null);
                    }}
                    className="bg-transparent font-bold text-slate-800 text-xs focus:outline-none cursor-pointer pr-2 leading-tight"
                  >
                    {isLoadingBranches ? (
                      <option value="">Đang tải...</option>
                    ) : branches.length === 0 ? (
                      <option value="">{displayBranchName}</option>
                    ) : (
                      branches.map((b) => (
                        <option key={b.ma_chi_nhanh} value={b.ma_chi_nhanh}>
                          {b.ten_chi_nhanh}
                        </option>
                      ))
                    )}
                  </select>
                )}
              </div>
            </div>

            {/* Back to Management portal if permitted */}
            {canAccessManagement && (
              <button
                type="button"
                onClick={() => navigate('/partner/reports')}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
                title="Quay lại Cổng Quản Lý Đối Tác"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Trang quản lý</span>
              </button>
            )}

            {/* User Profile Pill */}
            <div className="flex items-center gap-2.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-200">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="text-left hidden lg:block">
                <div className="text-xs font-bold text-slate-800 leading-tight">
                  {userName}
                </div>
                <div className="text-[10px] text-emerald-700 font-medium leading-none mt-0.5">
                  {userRole}
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border border-rose-200 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
              title="Đăng xuất khỏi hệ thống"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. SUB-HEADER BAR (Navigation Tabs & Secondary Actions) */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Tabs */}
          <nav className="flex space-x-1" aria-label="Tabs">
            <button
              type="button"
              onClick={() => setActiveViewTab('lookup')}
              className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeViewTab === 'lookup'
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/40'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Tra cứu & Quét mã</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveViewTab('history')}
              className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeViewTab === 'history'
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/40'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Lịch sử đổi tại quầy</span>
              {historyList.length > 0 && (
                <span className="px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded-full text-[10px] font-bold">
                  {historyList.length}
                </span>
              )}
            </button>
          </nav>

          {/* Quick toggle sample codes (for testing) */}
          <button
            type="button"
            onClick={() => setShowSampleCodes(!showSampleCodes)}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-700 py-1.5 px-3 rounded-lg hover:bg-slate-50 font-medium transition-colors cursor-pointer border border-dashed border-slate-300 hover:border-emerald-300"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Mã kiểm thử mẫu:</span>
            <span className="font-semibold text-slate-700">
              {showSampleCodes ? 'Ẩn mã mẫu ▲' : 'Hiện mã mẫu ▼'}
            </span>
          </button>
        </div>
      </div>

      {/* SAMPLE CODES DRAWER (Clean interactive chip bar when expanded) */}
      {showSampleCodes && sampleCodes.length > 0 && (
        <div className="bg-slate-50 border-b border-slate-200 py-3 px-4 sm:px-8 animate-in slide-in-from-top duration-150">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 mr-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Nhấp để kiểm thử nhanh:</span>
            </span>
            {sampleCodes.map((s) => (
              <button
                key={s.code}
                type="button"
                onClick={() => {
                  setInputCode(s.code);
                  handleVerify(s.code);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 rounded-lg text-xs font-mono font-medium transition-all shadow-2xs cursor-pointer group"
              >
                <span className="font-bold text-slate-900 group-hover:text-emerald-700">
                  {s.code}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-sans font-bold ${
                    s.status === 'Chua su dung'
                      ? 'bg-emerald-100 text-emerald-800'
                      : s.status === 'Da su dung'
                        ? 'bg-slate-200 text-slate-600'
                        : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {s.status === 'Chua su dung' ? 'Mới' : s.status === 'Da su dung' ? 'Đã dùng' : 'Hết hạn'}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. MAIN WORKSPACE CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full">
        {activeViewTab === 'lookup' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: Search & Camera Input Card (5 columns on large screens) */}
            <div className="lg:col-span-5 space-y-5">
              {/* Primary Search / Scan Card */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Nhập mã Voucher
                    </h2>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Nhấn Enter để kiểm tra
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Quét camera thời gian thực hoặc nhập ký tự in trên voucher
                  </p>
                </div>

                {/* Form Input */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleVerify();
                  }}
                  className="space-y-3"
                >
                  <div className="relative">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                      placeholder="VD: EC26-FOOD-A1B2C3D4"
                      className="w-full h-13 pl-11 pr-10 bg-slate-50 focus:bg-white border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-xl text-base font-mono font-bold tracking-wider text-slate-900 transition-all placeholder:font-sans placeholder:normal-case placeholder:font-normal placeholder:text-slate-400"
                    />
                    <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    {inputCode && (
                      <button
                        type="button"
                        onClick={() => {
                          setInputCode('');
                          if (searchInputRef.current) searchInputRef.current.focus();
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Camera QR Button */}
                    <button
                      type="button"
                      onClick={() => setIsCameraOpen(true)}
                      className="h-11 flex items-center justify-center gap-2 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Quét Camera</span>
                    </button>

                    {/* Lookup Button */}
                    <button
                      type="submit"
                      disabled={isVerifying || !inputCode.trim()}
                      className="h-11 flex items-center justify-center gap-2 px-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed active:scale-[0.98] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                    >
                      {isVerifying ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      ) : (
                        <ArrowRight className="w-4 h-4" />
                      )}
                      <span>{isVerifying ? 'Đang kiểm tra...' : 'Tra cứu mã'}</span>
                    </button>
                  </div>
                </form>

                {/* Alerts / Error Feedback */}
                {errorMessage && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 animate-in fade-in duration-150">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Thông báo lỗi:</span>
                      <span className="text-rose-700">{errorMessage}</span>
                    </div>
                  </div>
                )}

                {/* Success Banner */}
                {redemptionSuccess && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-900 animate-in fade-in duration-150">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">{redemptionSuccess.message || 'Xác nhận thành công!'}</span>
                      <span className="text-emerald-700">
                        Voucher đã được đổi và ghi nhận vào lịch sử giao dịch chi nhánh.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Instructions / Quick Policy Card */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Quy tắc đối soát tại quầy (RB-07 & RB-09)</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-1.5 leading-relaxed list-disc list-inside">
                  <li>Chỉ xác nhận khi hệ thống báo nhãn xanh <strong className="text-emerald-700">"HỢP LỆ"</strong>.</li>
                  <li>Mỗi voucher chỉ được đổi một lần duy nhất.</li>
                  <li>Khách hàng được bảo vệ thông tin cá nhân (ẩn danh NFR-02).</li>
                  <li>Mọi thao tác đổi voucher đều được lưu vết kiểm toán (RB-12).</li>
                </ul>
              </div>
            </div>

            {/* RIGHT COLUMN: Voucher Result Ticket (7 columns on large screens) */}
            <div className="lg:col-span-7">
              {/* State 1: Chưa tra cứu */}
              {!verificationResult && !isVerifying && (
                <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-10 flex flex-col items-center justify-center text-center min-h-[380px] shadow-2xs">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-3.5">
                    <QrCode className="w-8 h-8 stroke-1" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">
                    Sẵn sàng kiểm tra mã Voucher
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
                    Sử dụng <strong>Quét Camera</strong> hoặc nhập mã voucher vào ô bên trái để kiểm tra giá trị và áp dụng giảm giá cho khách.
                  </p>
                </div>
              )}

              {/* State 2: Đang tải */}
              {isVerifying && (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center justify-center text-center min-h-[380px] shadow-2xs">
                  <RefreshCw className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
                  <h3 className="text-base font-bold text-slate-800">
                    Đang đối soát dữ liệu trên hệ thống...
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Kiểm tra chi nhánh áp dụng, trạng thái sử dụng và hạn dùng.
                  </p>
                </div>
              )}

              {/* State 3: Có kết quả tra cứu (Thiết kế dạng Vé Voucher Đẳng Cấp) */}
              {verificationResult && !isVerifying && (
                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  {/* Digital Ticket Container */}
                  <div
                    className={`bg-white rounded-2xl border shadow-md overflow-hidden transition-all ${
                      verificationResult.status === 'valid'
                        ? 'border-emerald-300 ring-2 ring-emerald-500/20'
                        : verificationResult.status === 'used'
                          ? 'border-slate-300'
                          : verificationResult.status === 'expired'
                            ? 'border-amber-300'
                            : 'border-rose-300'
                    }`}
                  >
                    {/* 1. Status Banner Top */}
                    <div
                      className={`px-6 py-4 flex items-center justify-between text-white ${
                        verificationResult.status === 'valid'
                          ? 'bg-emerald-600'
                          : verificationResult.status === 'used'
                            ? 'bg-slate-700'
                            : verificationResult.status === 'expired'
                              ? 'bg-amber-600'
                              : 'bg-rose-600'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {verificationResult.status === 'valid' ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : verificationResult.status === 'used' ? (
                          <Clock className="w-5 h-5" />
                        ) : verificationResult.status === 'expired' ? (
                          <Calendar className="w-5 h-5" />
                        ) : (
                          <Ban className="w-5 h-5" />
                        )}
                        <span className="font-bold text-sm tracking-wider uppercase">
                          {verificationResult.status === 'valid' && 'HỢP LỆ — SẴN SÀNG SỬ DỤNG'}
                          {verificationResult.status === 'used' && 'VOUCHER ĐÃ ĐƯỢC SỬ DỤNG'}
                          {verificationResult.status === 'expired' && 'VOUCHER ĐÃ HẾT HẠN'}
                          {verificationResult.status === 'cancelled' && 'VOUCHER BỊ HỦY / KHÓA'}
                          {verificationResult.status === 'invalid_branch' && 'KHÔNG THUỘC CHI NHÁNH NÀY (RB-09)'}
                          {verificationResult.status === 'invalid' && 'MÃ VOUCHER KHÔNG TỒN TẠI'}
                        </span>
                      </div>

                      <span className="font-mono text-xs font-extrabold px-3 py-1 bg-black/20 backdrop-blur-xs rounded-lg tracking-wider">
                        {verificationResult.code}
                      </span>
                    </div>

                    {/* 2. Ticket Body Content */}
                    {voucherData ? (
                      <div className="p-6 space-y-6">
                        {/* Title & Partner */}
                        <div className="border-b border-slate-100 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 uppercase tracking-wide">
                              {voucherData.partnerName || 'Đối tác'}
                            </span>
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs text-slate-500">Mã chương trình: #{voucherData.code.substring(0, 8)}</span>
                          </div>
                          <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
                            {voucherData.voucherName}
                          </h3>
                          {voucherData.description && (
                            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                              {voucherData.description}
                            </p>
                          )}
                        </div>

                        {/* Financial Breakdown (Bill Calculation) */}
                        <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                          <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-2xs">
                            <span className="text-[11px] text-slate-400 block font-medium">Giá gốc:</span>
                            <span className="text-sm font-bold text-slate-500 line-through">
                              {Number(voucherData.originalPrice).toLocaleString('vi-VN')} đ
                            </span>
                          </div>
                          <div className="p-2 bg-emerald-50/70 rounded-lg border border-emerald-200/80 shadow-2xs">
                            <span className="text-[11px] text-emerald-700 font-bold block">Mức giảm giá:</span>
                            <span className="text-base font-extrabold text-emerald-600">
                              -{Number(voucherData.discountValue).toLocaleString('vi-VN')} đ
                            </span>
                          </div>
                          <div className="p-2 bg-indigo-50/70 rounded-lg border border-indigo-200/80 shadow-2xs">
                            <span className="text-[11px] text-indigo-900 font-bold block">Khách cần trả:</span>
                            <span className="text-base font-extrabold text-indigo-700">
                              {Number(
                                Math.max(0, voucherData.originalPrice - voucherData.discountValue)
                              ).toLocaleString('vi-VN')}{' '}
                              đ
                            </span>
                          </div>
                        </div>

                        {/* Customer & Validity Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                          {/* Khách hàng sở hữu */}
                          <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                              <User className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px] font-medium">Khách hàng sở hữu (ẩn danh NFR-02):</span>
                              <span className="font-bold text-slate-800">{voucherData.customerMaskedName}</span>
                            </div>
                          </div>

                          {/* Hạn sử dụng */}
                          <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl">
                            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                              <Calendar className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px] font-medium">Hạn sử dụng:</span>
                              <span className="font-bold text-slate-800">
                                {voucherData.validUntil
                                  ? new Date(voucherData.validUntil).toLocaleDateString('vi-VN')
                                  : 'Không giới hạn thời gian'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Applicable Branches */}
                        <div className="space-y-2">
                          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-500" />
                            <span>Chi nhánh được phép áp dụng ({voucherData.applicableBranches.length}):</span>
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {voucherData.applicableBranches.map((b) => (
                              <span
                                key={b.branchId}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                                  b.branchId === selectedBranchId
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {b.branchName}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Đã sử dụng trước đó (nếu có) */}
                        {voucherData.status === 'Da su dung' && (
                          <div className="p-3.5 bg-slate-100 rounded-xl border border-slate-200 text-xs space-y-1">
                            <span className="font-bold text-slate-800 block">Thông tin giao dịch trước:</span>
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

                        {/* Primary Action Button (BR-PAR-06 - Fitts's Law) */}
                        {verificationResult.status === 'valid' && (
                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={() => setIsConfirmModalOpen(true)}
                              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <CheckCircle2 className="w-5 h-5" />
                              <span>Xác nhận Đổi Voucher ngay</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-xs text-rose-600 font-medium">
                        {verificationResult.message}
                      </div>
                    )}
                  </div>

                  {/* QR Code thật đính kèm (collapsible view để đối soát chéo) */}
                  {voucherData && (
                    <div className="mt-4">
                      <QrCodeDisplay
                        value={voucherData.qrValue || `ECQR:${voucherData.code}`}
                        title="Mã QR Code Thật (Dùng để kiểm thử quét Camera)"
                        subtitle="Mã QR này sinh theo chuẩn ISO/IEC, có thể dùng camera điện thoại quét trực tiếp"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* TAB 2: LỊCH SỬ SỬ DỤNG TẠI QUẦY */
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Nhật ký Voucher đã xác nhận tại quầy
                </h3>
                <p className="text-xs text-slate-500">
                  Danh sách các giao dịch sử dụng voucher thành công tại chi nhánh {displayBranchName}
                </p>
              </div>
              <button
                type="button"
                onClick={loadHistory}
                disabled={isLoadingHistory}
                className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingHistory ? 'animate-spin' : ''}`} />
                <span>Làm mới danh sách</span>
              </button>
            </div>

            {isLoadingHistory ? (
              <div className="py-16 text-center text-slate-500 text-xs">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                <span>Đang tải nhật ký giao dịch...</span>
              </div>
            ) : historyList.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-xs">
                <History className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <span>Chưa có giao dịch sử dụng voucher nào tại chi nhánh này</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
                      <th className="py-3 px-4 font-bold">Mã Voucher</th>
                      <th className="py-3 px-4 font-bold">Tên Voucher</th>
                      <th className="py-3 px-4 font-bold">Thời gian đổi</th>
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
                          {item.nhanvien?.nguoidung?.ho_ten ||
                            item.nhanvien?.thong_tin_dang_nhap ||
                            'Nhân viên quầy'}
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
      </main>

      {/* 4. MODAL QUÉT CAMERA THẬT */}
      <QrScannerModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onScanSuccess={handleCameraScanSuccess}
      />

      {/* 5. MODAL XÁC NHẬN SỬ DỤNG VOUCHER (BR-PAR-06) */}
      {isConfirmModalOpen && voucherData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-slate-100 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Xác nhận sử dụng voucher?
                </h3>
                <p className="text-xs text-slate-500">
                  Voucher sẽ được chuyển sang trạng thái <strong>Đã sử dụng</strong>
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Mã voucher:</span>
                <span className="font-mono font-bold text-slate-900">{voucherData.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Chương trình:</span>
                <span className="font-bold text-slate-900 text-right line-clamp-1">{voucherData.voucherName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mức giảm:</span>
                <span className="font-bold text-emerald-700">
                  -{Number(voucherData.discountValue).toLocaleString('vi-VN')} đ
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200/80 pt-2">
                <span className="text-slate-500">Chi nhánh đối soát:</span>
                <span className="font-semibold text-slate-800">
                  {currentBranchObj?.ten_chi_nhanh || 'Chi nhánh hiện tại'}
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Ghi chú giao dịch (Tùy chọn):
              </label>
              <input
                type="text"
                value={redemptionNote}
                onChange={(e) => setRedemptionNote(e.target.value)}
                placeholder="VD: Bàn 04, hóa đơn #1029..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                disabled={isRedeeming}
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={isRedeeming}
                onClick={handleConfirmRedemption}
                className="px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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
