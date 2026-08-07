import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CheckCircle,
  XCircle,
  MapPin,
  FileText,
  Clock,
  UserCheck,
  Tag,
  DollarSign,
  Info,
  Lock,
  Unlock,
} from "lucide-react";
import Toast from "../../../../shared/components/Toast";
import Modal from "../../../../shared/components/Modal";
import Badge from "../../../../shared/components/Badge";
import {
  getPartnerByIdApi,
  approvePartnerApi,
  rejectPartnerApi,
  lockPartnerApi,
  getBranchesByPartnerApi,
  getBranchRequestsApi,
  approveBranchRequestApi,
  rejectBranchRequestApi,
  getPendingPartnerProfileRequestApi,
  approvePartnerProfileRequestApi,
  rejectPartnerProfileRequestApi,
} from "../../../../shared/api/partnerApi";

export function PartnerDetailPage({ partnerId, onNavigate }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [partner, setPartner] = useState(null);
  const [pendingProfileReq, setPendingProfileReq] = useState(null);
  const [activeBranches, setActiveBranches] = useState([]);
  const [branchRequests, setBranchRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  const [activeTab, setActiveTab] = useState("overview");

  // Modals state for Partner Approve/Reject/Lock/Unlock
  const [approveModal, setApproveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [showLockConfirmModal, setShowLockConfirmModal] = useState(false);
  const [showUnlockConfirmModal, setShowUnlockConfirmModal] = useState(false);

  const [rejectReason, setRejectReason] = useState("Giấy phép kinh doanh không hợp lệ");

  // Modal state for Branch Request Reject
  const [selectedBranchReqForReject, setSelectedBranchReqForReject] = useState(null);
  const [branchRejectNote, setBranchRejectNote] = useState("Thông tin địa chỉ chi nhánh không phù hợp");

  const loadPartnerData = async () => {
    setLoading(true);
    try {
      const pId = partnerId || id || "hs-001";
      const [pData, bData, rData, profReq] = await Promise.all([
        getPartnerByIdApi(pId),
        getBranchesByPartnerApi(pId),
        getBranchRequestsApi(pId),
        getPendingPartnerProfileRequestApi(pId),
      ]);
      setPartner(pData);
      setActiveBranches(bData || []);
      setBranchRequests(rData || []);
      setPendingProfileReq(profReq);
    } catch (e) {
      console.error("Error loading partner detail:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartnerData();
  }, [partnerId, id]);

  const handleApprovePartner = async () => {
    if (!partner) return;
    await approvePartnerApi(partner.ma_hs);
    setApproveModal(false);
    setToastMessage("Đã phê duyệt hồ sơ đối tác thành công!");
    await loadPartnerData();
  };

  const handleRejectPartner = async () => {
    if (!partner) return;
    await rejectPartnerApi(partner.ma_hs, rejectReason);
    setRejectModal(false);
    setToastMessage("Đã từ chối hồ sơ đối tác.");
    await loadPartnerData();
  };

  const confirmLockPartner = async () => {
    if (!partner) return;
    await lockPartnerApi(partner.ma_hs, true);
    setShowLockConfirmModal(false);
    setToastMessage("Đã khóa tài khoản đối tác thành công!");
    await loadPartnerData();
  };

  const confirmUnlockPartner = async () => {
    if (!partner) return;
    await lockPartnerApi(partner.ma_hs, false);
    setShowUnlockConfirmModal(false);
    setToastMessage("Đã mở khóa tài khoản đối tác thành công!");
    await loadPartnerData();
  };

  const handleApproveBranchReq = async (reqId) => {
    await approveBranchRequestApi(reqId);
    setToastMessage("Đã duyệt yêu cầu chi nhánh thành công!");
    await loadPartnerData();
  };

  const handleRejectBranchReq = async () => {
    if (!selectedBranchReqForReject) return;
    await rejectBranchRequestApi(selectedBranchReqForReject.ma_yeu_cau, branchRejectNote);
    setSelectedBranchReqForReject(null);
    setToastMessage("Đã từ chối yêu cầu chi nhánh.");
    await loadPartnerData();
  };

  const handleApproveProfileReq = async (reqId) => {
    await approvePartnerProfileRequestApi(reqId);
    setToastMessage("Đã phê duyệt Cập nhật Hồ sơ Doanh nghiệp thành công!");
    await loadPartnerData();
  };

  const handleRejectProfileReq = async (reqId) => {
    await rejectPartnerProfileRequestApi(reqId, "Thông tin hồ sơ mới không phù hợp quy định");
    setToastMessage("Đã từ chối Yêu cầu Cập nhật Hồ sơ Doanh nghiệp.");
    await loadPartnerData();
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400">
        Đang tải thông tin chi tiết đối tác...
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="p-12 text-center text-slate-400">
        Không tìm thấy thông tin đối tác.
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Cho duyet":
        return { label: "Chờ duyệt", color: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" };
      case "Dang hoat dong":
        return { label: "Đang hoạt động", color: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" };
      case "Tu choi":
        return { label: "Bị từ chối", color: "bg-rose-50 text-rose-700 border-rose-200", dot: "bg-rose-500" };
      case "Tam khoa":
        return { label: "Tạm khóa", color: "bg-slate-100 text-slate-700 border-slate-300", dot: "bg-slate-400" };
      default:
        return { label: status, color: "bg-slate-50 text-slate-700 border-slate-200", dot: "bg-slate-400" };
    }
  };

  const sb = getStatusBadge(partner.trang_thai);
  const pendingRequestsCount = branchRequests.filter((r) => r.trang_thai === "Cho duyet").length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Top Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => (onNavigate ? onNavigate("partner-management") : navigate("/admin/partners"))}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Quay lại danh sách đối tác"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-slate-900">{partner.ten_dn}</h1>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${sb.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sb.dot}`} />
                  {sb.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                Mã số thuế: {partner.ma_so_thue} | Đăng ký: {partner.ngay_tao ? partner.ngay_tao.slice(0, 10) : "2025-10-21"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Status Cho duyet: Duyet + Tu choi */}
            {partner.trang_thai === "Cho duyet" && (
              <>
                <button
                  onClick={() => setApproveModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
                >
                  <CheckCircle size={15} /> Phê duyệt đối tác
                </button>
                <button
                  onClick={() => setRejectModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors cursor-pointer shadow-xs"
                >
                  <XCircle size={15} /> Từ chối
                </button>
              </>
            )}

            {/* Status Tu choi: Giu lai nut Duyet */}
            {partner.trang_thai === "Tu choi" && (
              <button
                onClick={() => setApproveModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
              >
                <CheckCircle size={15} /> Phê duyệt đối tác
              </button>
            )}

            {/* Status Dang hoat dong: Khoa doi tac */}
            {partner.trang_thai === "Dang hoat dong" && (
              <button
                onClick={() => setShowLockConfirmModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold border border-amber-300 bg-amber-50 text-amber-800 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer shadow-xs"
              >
                <Lock size={15} /> Khóa đối tác
              </button>
            )}

            {/* Status Tam khoa: Mo khoa */}
            {partner.trang_thai === "Tam khoa" && (
              <button
                onClick={() => setShowUnlockConfirmModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold border border-emerald-300 bg-emerald-50 text-emerald-800 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer shadow-xs"
              >
                <Unlock size={15} /> Mở khóa
              </button>
            )}
          </div>
        </div>

        {partner.ly_do_tu_choi && (
          <div className="mt-3 bg-rose-50 rounded-lg p-3 text-xs text-rose-800 border border-rose-200">
            <strong>Lý do từ chối:</strong> {partner.ly_do_tu_choi}
          </div>
        )}
      </div>

      {/* Navigation Tabs Header matching prototype */}
      <div className="flex items-center gap-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === "overview"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Building2 size={16} /> Thông tin chung
        </button>

        <button
          onClick={() => setActiveTab("branches")}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === "branches"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <MapPin size={16} /> Chi nhánh chính thức ({activeBranches.length})
        </button>

        <button
          onClick={() => setActiveTab("requests")}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "requests"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Clock size={16} /> Yêu cầu chi nhánh 
          {pendingRequestsCount > 0 && (
            <span className="px-2 py-0.5 text-xs bg-amber-500 text-white font-bold rounded-full animate-pulse">
              {pendingRequestsCount} chờ duyệt
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === "history"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileText size={16} /> Lịch sử tác vụ
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Pending Profile Update Request Comparison Card */}
            {pendingProfileReq && (
              <div className="bg-amber-50/80 border-2 border-amber-300 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-base">
                    <span>📋</span>
                    <span>Đề xuất Cập nhật Hồ sơ Doanh nghiệp mới (Đang chờ duyệt)</span>
                  </div>
                  <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-500 text-white rounded-full">
                    Chờ duyệt
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <p className="text-gray-600 font-medium">So sánh thông tin hiện tại vs Đề xuất thay đổi mới:</p>
                  
                  <div className="bg-white p-3.5 rounded-lg border border-amber-200 space-y-2">
                    {pendingProfileReq.ten_dn_moi && (
                      <div className="flex justify-between items-center py-1 border-b border-gray-100">
                        <span className="text-gray-500">Tên doanh nghiệp:</span>
                        <span className="font-bold text-slate-900">
                          {partner.ten_dn} <span className="text-amber-600">➔</span> <span className="text-emerald-700">{pendingProfileReq.ten_dn_moi}</span>
                        </span>
                      </div>
                    )}

                    {pendingProfileReq.ma_so_thue_moi && (
                      <div className="flex justify-between items-center py-1 border-b border-gray-100">
                        <span className="text-gray-500">Mã số thuế:</span>
                        <span className="font-mono font-bold text-slate-900">
                          {partner.ma_so_thue} <span className="text-amber-600">➔</span> <span className="text-emerald-700">{pendingProfileReq.ma_so_thue_moi}</span>
                        </span>
                      </div>
                    )}

                    {pendingProfileReq.dia_chi_moi && (
                      <div className="flex justify-between items-center py-1 border-b border-gray-100">
                        <span className="text-gray-500">Địa chỉ trụ sở:</span>
                        <span className="font-medium text-slate-900">
                          {partner.dia_chi} <span className="text-amber-600">➔</span> <span className="text-emerald-700">{pendingProfileReq.dia_chi_moi}</span>
                        </span>
                      </div>
                    )}

                    {pendingProfileReq.ho_ten_nguoi_dai_dien_moi && (
                      <div className="flex justify-between items-center py-1 border-b border-gray-100">
                        <span className="text-gray-500">Người đại diện:</span>
                        <span className="font-bold text-slate-900">
                          {partner.nguoi_dai_dien?.ho_ten || "Chưa có"} <span className="text-amber-600">➔</span> <span className="text-emerald-700">{pendingProfileReq.ho_ten_nguoi_dai_dien_moi}</span>
                        </span>
                      </div>
                    )}

                    {pendingProfileReq.sdt_nguoi_dai_dien_moi && (
                      <div className="flex justify-between items-center py-1">
                        <span className="text-gray-500">SĐT người đại diện:</span>
                        <span className="font-medium text-slate-900">
                          {partner.nguoi_dai_dien?.sdt || "Chưa có"} <span className="text-amber-600">➔</span> <span className="text-emerald-700">{pendingProfileReq.sdt_nguoi_dai_dien_moi}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => handleRejectProfileReq(pendingProfileReq.ma_yc || pendingProfileReq.ma_req)}
                    className="px-3.5 py-1.5 text-xs font-semibold border border-rose-300 text-rose-700 bg-white hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    Từ chối đề xuất
                  </button>
                  <button
                    onClick={() => handleApproveProfileReq(pendingProfileReq.ma_yc || pendingProfileReq.ma_req)}
                    className="px-4 py-1.5 text-xs font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
                  >
                    Phê duyệt cập nhật hồ sơ
                  </button>
                </div>
              </div>
            )}

            {/* Legal Business Info */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Tag size={16} className="text-blue-600" /> Hồ sơ pháp lý doanh nghiệp
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Tên doanh nghiệp</p>
                  <p className="font-bold text-slate-900 mt-0.5">{partner.ten_dn}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Mã số thuế / ĐKKD</p>
                  <p className="font-mono font-bold text-slate-900 mt-0.5">{partner.ma_so_thue}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-400 font-medium">Địa chỉ đăng ký kinh doanh</p>
                  <p className="text-slate-700 mt-0.5">{partner.dia_chi}</p>
                </div>
              </div>
            </div>

            {/* Representative Info */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                <UserCheck size={16} className="text-blue-600" /> Người đại diện pháp luật
              </h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Họ và tên</p>
                  <p className="font-bold text-slate-900 mt-0.5">{partner.nguoi_dai_dien?.ho_ten || "Chưa cập nhật"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Số điện thoại</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{partner.nguoi_dai_dien?.sdt || "Chưa cập nhật"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Email liên hệ</p>
                  <p className="font-medium text-slate-800 mt-0.5">{partner.nguoi_dai_dien?.email || "Chưa cập nhật"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Số CCCD / CMND</p>
                  <p className="font-mono font-bold text-slate-900 mt-0.5">{partner.nguoi_dai_dien?.cccd || "Chưa cập nhật"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Ngày sinh</p>
                  <p className="font-medium text-slate-800 mt-0.5">
                    {partner.nguoi_dai_dien?.ngay_sinh ? partner.nguoi_dai_dien.ngay_sinh.slice(0, 10) : "Chưa cập nhật"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Giới tính</p>
                  <p className="font-medium text-slate-800 mt-0.5">
                    {partner.nguoi_dai_dien?.gioi_tinh === "Nu" ? "Nữ" : "Nam"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Business License Document */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <FileText size={16} className="text-blue-600" /> Giấy phép kinh doanh
            </h3>
            {partner.giay_phep_kinh_doanh ? (
              <div className="space-y-3">
                <img
                  src={partner.giay_phep_kinh_doanh}
                  alt="Giấy phép kinh doanh"
                  className="w-full h-64 object-cover rounded-lg border border-slate-200 shadow-xs"
                />
                <a
                  href={partner.giay_phep_kinh_doanh}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center text-xs text-blue-600 font-semibold hover:underline"
                >
                  🔍 Xem bản full kích thước gốc
                </a>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs italic">
                Chưa đăng tải giấy phép kinh doanh.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: OFFICIAL BRANCHES */}
      {activeTab === "branches" && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          {activeBranches.length === 0 ? (
            <div className="p-12 text-center text-slate-400">Không có chi nhánh chính thức nào.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {activeBranches.map((b) => (
                <div key={b.ma_chi_nhanh} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-bold text-slate-900">{b.ten_chi_nhanh}</h4>
                      <Badge status={b.trang_thai} size="sm" />
                    </div>
                    <p className="text-xs text-slate-600 flex items-center gap-1">
                      <MapPin size={13} className="text-amber-500 shrink-0" />
                      {b.dia_chi} ({b.khu_vuc})
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: BRANCH REQUESTS */}
      {activeTab === "requests" && (
        <div className="space-y-6">
          {/* Pending Branch Requests Section */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs p-5 space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center justify-between border-b border-slate-100 pb-3">
              <span>📋 Yêu cầu chi nhánh đang chờ xử lý</span>
              <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full font-bold">
                {branchRequests.filter((r) => r.trang_thai === "Cho duyet" || r.trang_thai === "Cho xu ly").length} yêu cầu
              </span>
            </h3>

            {branchRequests.filter((r) => r.trang_thai === "Cho duyet" || r.trang_thai === "Cho xu ly").length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-sm bg-slate-50 rounded-lg border border-slate-100 italic">
                ✓ Chưa có yêu cầu thay đổi chi nhánh nào đang chờ xử lý từ đối tác này.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {branchRequests
                  .filter((r) => r.trang_thai === "Cho duyet" || r.trang_thai === "Cho xu ly")
                  .map((req) => (
                    <div key={req.ma_yeu_cau} className="py-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              req.loai_yeu_cau === "Them moi"
                                ? "bg-blue-100 text-blue-800"
                                : req.loai_yeu_cau === "Cap nhat"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {req.loai_yeu_cau === "Them moi"
                              ? "Thêm mới chi nhánh"
                              : req.loai_yeu_cau === "Cap nhat"
                              ? "Cập nhật thông tin chi nhánh"
                              : "Yêu cầu xóa chi nhánh"}
                          </span>
                          <h4 className="font-bold text-slate-900 text-base">{req.ten_chi_nhanh}</h4>
                        </div>
                        <Badge status={req.trang_thai} />
                      </div>

                      {req.loai_yeu_cau === "Cap nhat" && req.du_lieu_de_xuat && (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs space-y-1.5 text-slate-800">
                          <div className="font-bold text-amber-900 flex items-center gap-1">
                            <Info size={14} /> Thông tin đề xuất cập nhật mới (Đang chờ duyệt):
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div><strong>Tên đề xuất:</strong> {req.du_lieu_de_xuat.ten_chi_nhanh}</div>
                            <div><strong>Khu vực đề xuất:</strong> {req.du_lieu_de_xuat.khu_vuc}</div>
                            <div className="col-span-2"><strong>Địa chỉ đề xuất:</strong> {req.du_lieu_de_xuat.dia_chi}</div>
                          </div>
                        </div>
                      )}

                      <div className="text-xs text-slate-600 grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div><strong>Địa chỉ:</strong> {req.dia_chi} ({req.khu_vuc})</div>
                        <div><strong>Thời gian gửi:</strong> {new Date(req.ngay_tao).toLocaleString("vi-VN")}</div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setSelectedBranchReqForReject(req);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <XCircle size={14} /> Từ chối yêu cầu
                        </button>
                        <button
                          onClick={() => handleApproveBranchReq(req.ma_yeu_cau)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-xs"
                        >
                          <CheckCircle size={14} /> Phê duyệt yêu cầu
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Processed History Section */}
          {branchRequests.filter((r) => r.trang_thai !== "Cho duyet" && r.trang_thai !== "Cho xu ly").length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs p-5 space-y-4">
              <h3 className="font-bold text-slate-700 text-sm border-b border-slate-100 pb-3">
                📜 Lịch sử các yêu cầu chi nhánh đã xử lý ({branchRequests.filter((r) => r.trang_thai !== "Cho duyet" && r.trang_thai !== "Cho xu ly").length})
              </h3>
              <div className="divide-y divide-slate-100">
                {branchRequests
                  .filter((r) => r.trang_thai !== "Cho duyet" && r.trang_thai !== "Cho xu ly")
                  .map((req) => (
                    <div key={req.ma_yeu_cau} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{req.ten_chi_nhanh}</span>
                        <span className="text-slate-400 ml-2">
                          ({req.loai_yeu_cau === "Them moi" ? "Thêm mới" : req.loai_yeu_cau === "Cap nhat" ? "Cập nhật" : "Xóa"})
                        </span>
                        <p className="text-slate-500 mt-0.5">📍 {req.dia_chi} ({req.khu_vuc})</p>
                      </div>
                      <Badge status={req.trang_thai} />
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: HISTORY */}
      {activeTab === "history" && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 text-slate-500 text-sm text-center">
          Lịch sử tác vụ của doanh nghiệp {partner.ten_dn}. Chưa có nhật ký thao tác nâng cao.
        </div>
      )}

      {/* Modal Partner Approve */}
      <Modal
        isOpen={approveModal}
        onClose={() => setApproveModal(false)}
        onConfirm={handleApprovePartner}
        title="Xác Nhận Phê Duyệt Hồ Sơ Đối Tác"
        confirmText="Phê duyệt ngay"
        confirmVariant="success"
        cancelText="Hủy"
      >
        <p className="text-sm text-slate-700 text-left">
          Xác nhận phê duyệt hồ sơ đối tác <strong>"{partner.ten_dn}"</strong>? Sau khi duyệt, doanh nghiệp có thể chính thức phát hành Voucher trên hệ thống.
        </p>
      </Modal>

      {/* Modal Partner Reject */}
      <Modal
        isOpen={rejectModal}
        onClose={() => setRejectModal(false)}
        onConfirm={handleRejectPartner}
        title="Từ Chối Hồ Sơ Đối Tác"
        confirmText="Xác nhận từ chối"
        confirmVariant="danger"
        cancelText="Hủy"
      >
        <div className="space-y-3 text-left">
          <label className="block text-xs font-semibold text-slate-700">Lý do từ chối *</label>
          <select
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white"
          >
            <option value="Giấy phép kinh doanh không hợp lệ">Giấy phép kinh doanh không hợp lệ</option>
            <option value="Thông tin doanh nghiệp không trùng khớp">Thông tin doanh nghiệp không trùng khớp</option>
            <option value="Mã số thuế không tồn tại">Mã số thuế không tồn tại</option>
          </select>
        </div>
      </Modal>

      {/* Modal Lock Confirmation */}
      <Modal
        isOpen={showLockConfirmModal}
        onClose={() => setShowLockConfirmModal(false)}
        onConfirm={confirmLockPartner}
        title="Xác Nhận Khóa Tài Khoản Đối Tác"
        confirmText="Xác nhận khóa"
        confirmVariant="danger"
        cancelText="Hủy"
      >
        <div className="space-y-3 text-left">
          <p className="text-sm text-slate-700">
            Bạn có chắc chắn muốn khóa tài khoản đối tác <strong>"{partner.ten_dn}"</strong>?
          </p>
          <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
            ⚠️ Khi bị khóa, tài khoản đối tác sẽ tạm thời không thể phát hành, chỉnh sửa hoặc quản lý Voucher trên hệ thống.
          </p>
        </div>
      </Modal>

      {/* Modal Unlock Confirmation */}
      <Modal
        isOpen={showUnlockConfirmModal}
        onClose={() => setShowUnlockConfirmModal(false)}
        onConfirm={confirmUnlockPartner}
        title="Xác Nhận Mở Khóa Tài Khoản Đối Tác"
        confirmText="Xác nhận mở khóa"
        confirmVariant="success"
        cancelText="Hủy"
      >
        <div className="space-y-3 text-left">
          <p className="text-sm text-slate-700">
            Xác nhận mở khóa tài khoản cho đối tác <strong>"{partner.ten_dn}"</strong>? Trạng thái sẽ được khôi phục về "Đang hoạt động".
          </p>
        </div>
      </Modal>

      {/* Modal Branch Request Reject */}
      {selectedBranchReqForReject && (
        <Modal
          isOpen={!!selectedBranchReqForReject}
          onClose={() => setSelectedBranchReqForReject(null)}
          onConfirm={handleRejectBranchReq}
          title="Từ Chối Yêu Cầu Chi Nhánh"
          confirmText="Từ chối yêu cầu"
          confirmVariant="danger"
          cancelText="Hủy"
        >
          <div className="space-y-3 text-left">
            <p className="text-sm text-slate-700">
              Từ chối yêu cầu <strong>"{selectedBranchReqForReject.ten_chi_nhanh}"</strong>?
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ghi chú lý do *</label>
              <input
                type="text"
                value={branchRejectNote}
                onChange={(e) => setBranchRejectNote(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>
          </div>
        </Modal>
      )}

      <Toast message={toastMessage} onClose={() => setToastMessage("")} />
    </div>
  );
}

export default PartnerDetailPage;
