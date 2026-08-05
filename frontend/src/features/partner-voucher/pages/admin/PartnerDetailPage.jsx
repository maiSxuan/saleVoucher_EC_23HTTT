import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Tag,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  MapPin,
  Info,
} from "lucide-react";
import Toast from "../../../../shared/components/Toast";
import {
  getPartnerByIdApi,
  approvePartnerApi,
  rejectPartnerApi,
} from "../../../../shared/api/partnerApi";

const rejectReasons = [
  "Giấy phép kinh doanh mờ hoặc không hợp lệ",
  "Mã số thuế không tồn tại trên hệ thống Cục Thuế",
  "Thông tin người đại diện mâu thuẫn",
  "Thiếu thông tin chứng thực pháp lý",
  "Khác",
];

const checklistItems = [
  "Tên doanh nghiệp trùng khớp với đăng ký kinh doanh",
  "Mã số thuế hợp lệ và duy nhất",
  "Địa chỉ trụ sở chính rõ ràng",
  "Thông tin người đại diện đầy đủ (Họ tên, CCCD, Email, SĐT)",
  "Giấy phép kinh doanh còn hiệu lực",
  "Các chi nhánh đăng ký đủ điều kiện",
];

export function PartnerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  const [checklist, setChecklist] = useState({});
  const [approveModal, setApproveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [selectedRejectReason, setSelectedRejectReason] = useState(rejectReasons[0]);
  const [customRejectNote, setCustomRejectNote] = useState("");

  const loadPartner = async () => {
    setLoading(true);
    try {
      const data = await getPartnerByIdApi(id);
      setPartner(data);
    } catch (e) {
      console.error("Error loading partner detail:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartner();
  }, [id]);

  if (loading) {
    return <div className="p-12 text-center text-slate-500">Đang tải hồ sơ đối tác...</div>;
  }

  if (!partner) {
    return <div className="p-12 text-center text-slate-500">Không tìm thấy hồ sơ đối tác.</div>;
  }

  const getPartnerStatusBadge = (status) => {
    if (status === "Dang hoat dong" || status === "Hoat dong" || status === "Da duyet") {
      return { label: "Đang hoạt động", color: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" };
    }
    if (status === "Tu choi") {
      return { label: "Bị từ chối", color: "bg-rose-50 text-rose-700 border-rose-200", dot: "bg-rose-500" };
    }
    if (status === "Tam khoa") {
      return { label: "Tạm khóa", color: "bg-slate-100 text-slate-600 border-slate-200", dot: "bg-slate-400" };
    }
    return { label: "Chờ duyệt", color: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" };
  };

  const sb = getPartnerStatusBadge(partner.trang_thai);

  const toggleCheck = (item) => {
    setChecklist((prev) => ({ ...prev, [item]: !prev[item] }));
  };
  const checkedCount = Object.values(checklist).filter(Boolean).length;

  const handleApprove = async () => {
    setLoading(true);
    try {
      await approvePartnerApi(partner.ma_hs);
      setApproveModal(false);
      setToastMessage("Phê duyệt đối tác thành công!");
      await loadPartner();
    } catch (e) {
      setToastMessage("Phê duyệt thất bại: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    const finalReason = customRejectNote.trim()
      ? `${selectedRejectReason}: ${customRejectNote}`
      : selectedRejectReason;

    setLoading(true);
    try {
      await rejectPartnerApi(partner.ma_hs, finalReason);
      setRejectModal(false);
      setToastMessage("Đã từ chối hồ sơ đối tác.");
      await loadPartner();
    } catch (e) {
      setToastMessage("Từ chối thất bại: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const activeBranches = (partner.branches || []).filter(
    (b) => b.trang_thai === "Dang hoat dong" || b.trang_thai === "Hoat dong" || b.trang_thai === "Da duyet"
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-4">
      {/* Back Button */}
      <button
        onClick={() => navigate("/admin/partners")}
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} /> Quay lại danh sách đối tác
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl border border-blue-100 shrink-0">
              🏢
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{partner.ten_dn}</h2>
              <div className="flex flex-wrap gap-2 mt-1.5 items-center">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${sb.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sb.dot}`} />
                  {sb.label}
                </span>
                <span className="text-xs font-mono text-slate-500 font-medium">MST: {partner.ma_so_thue}</span>
                <span className="text-xs text-slate-400 font-mono">
                  Đăng ký: {partner.ngay_tao ? partner.ngay_tao.slice(0, 10) : "2025-10-21"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setApproveModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
            >
              <CheckCircle size={14} /> Duyệt đối tác
            </button>
            <button
              onClick={() => setRejectModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors cursor-pointer shadow-xs"
            >
              <XCircle size={14} /> Từ chối
            </button>
          </div>
        </div>

        {partner.ly_do_tu_choi && (
          <div className="mt-3 bg-slate-50 rounded-lg px-4 py-2.5 text-sm text-slate-700 border border-slate-200">
            <strong>Ghi chú từ chối:</strong> {partner.ly_do_tu_choi}
          </div>
        )}
      </div>

      {/* Main Grid: Left 2 Cols + Right 1 Col */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Business Legal Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Tag size={16} className="text-blue-600" /> Hồ sơ pháp lý doanh nghiệp
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-400">Tên doanh nghiệp</p>
                <p className="font-bold text-slate-900 mt-0.5">{partner.ten_dn}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Mã số thuế</p>
                <p className="font-mono font-bold text-slate-900 mt-0.5">{partner.ma_so_thue}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-slate-400">Địa chỉ đăng ký ĐKKD</p>
                <p className="text-slate-700 mt-0.5">{partner.dia_chi}</p>
              </div>
            </div>
          </div>

          {/* Representative Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
              <DollarSign size={16} className="text-blue-600" /> Người đại diện pháp luật
            </h3>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-400">Họ và tên</p>
                <p className="font-bold text-slate-900 mt-0.5">{partner.nguoi_dai_dien?.ho_ten || "Chưa cập nhật"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Số điện thoại</p>
                <p className="font-semibold text-slate-800 mt-0.5">{partner.nguoi_dai_dien?.sdt || "Chưa cập nhật"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Email</p>
                <p className="font-medium text-slate-800 mt-0.5">{partner.nguoi_dai_dien?.email || "Chưa cập nhật"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Số CCCD</p>
                <p className="font-mono font-bold text-slate-900 mt-0.5">{partner.nguoi_dai_dien?.cccd || "Chưa cập nhật"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Ngày sinh</p>
                <p className="font-medium text-slate-800 mt-0.5">
                  {partner.nguoi_dai_dien?.ngay_sinh ? partner.nguoi_dai_dien.ngay_sinh.slice(0, 10) : "Chưa cập nhật"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Giới tính</p>
                <p className="font-medium text-slate-800 mt-0.5">
                  {partner.nguoi_dai_dien?.gioi_tinh === "Nu" ? "Nữ" : "Nam"}
                </p>
              </div>
            </div>
          </div>

          {/* Active Branches */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
              <MapPin size={16} className="text-amber-600" /> Danh sách chi nhánh ({activeBranches.length})
            </h3>
            {activeBranches.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">Chưa có chi nhánh nào được kích hoạt.</p>
            ) : (
              <div className="space-y-2 text-sm text-slate-700">
                {activeBranches.map((b) => (
                  <div key={b.ma_chi_nhanh} className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <CheckCircle size={15} className="text-emerald-500 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{b.ten_chi_nhanh}</div>
                      <div className="text-xs text-slate-500">📍 {b.dia_chi} ({b.khu_vuc})</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Checklist & Info */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
              <Info size={16} className="text-blue-600" /> Checklist kiểm tra hồ sơ
            </h3>
            <p className="text-xs text-slate-400 mb-3">Hỗ trợ kiểm định pháp lý đối tác</p>
            <div className="space-y-2">
              {checklistItems.map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:bg-slate-50 rounded p-1.5 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={checklist[item] || false}
                    onChange={() => toggleCheck(item)}
                    className="rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500">Đã kiểm tra</span>
                <span className={checkedCount === checklistItems.length ? "text-emerald-600" : "text-amber-600"}>
                  {checkedCount}/{checklistItems.length}
                </span>
              </div>
              <div className="mt-2 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    checkedCount === checklistItems.length ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                  style={{ width: `${(checkedCount / checklistItems.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 shadow-xs">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Quyền hạn sau khi kích hoạt</h4>
            <ul className="space-y-1.5 text-xs text-blue-800 leading-relaxed">
              <li>• Tự động mở khóa Portal Đối Tác</li>
              <li>• Cho phép đăng ký và đăng bán Voucher mới</li>
              <li>• Cho phép đăng ký mở thêm Chi Nhánh</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Approve Modal */}
      {approveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setApproveModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4 text-slate-800">
            <h3 className="font-bold text-slate-900 text-lg">Phê duyệt hồ sơ đối tác</h3>

            <div className="bg-slate-50 rounded-xl p-3.5 text-xs space-y-2 border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-400">Doanh nghiệp:</span>
                <span className="font-bold text-slate-900">{partner.ten_dn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Mã số thuế:</span>
                <span className="font-mono font-bold text-slate-900">{partner.ma_so_thue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Trạng thái sau duyệt:</span>
                <span className="text-emerald-600 font-bold">Đang hoạt động</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setApproveModal(false)}
                className="px-4 py-2 text-xs font-semibold border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-2 text-xs font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
              >
                Xác nhận phê duyệt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setRejectModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4 text-slate-800">
            <h3 className="font-bold text-slate-900 text-lg">Từ chối hồ sơ đối tác</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Lý do từ chối:</label>
              <select
                value={selectedRejectReason}
                onChange={(e) => setSelectedRejectReason(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-xs border-slate-300 focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white font-medium"
              >
                {rejectReasons.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ghi chú thêm:</label>
              <textarea
                rows="3"
                placeholder="Nhập phản hồi chi tiết cho đối tác..."
                value={customRejectNote}
                onChange={(e) => setCustomRejectNote(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-xs border-slate-300 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              ></textarea>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setRejectModal(false)}
                className="px-4 py-2 text-xs font-semibold border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 text-xs font-bold bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors cursor-pointer shadow-xs"
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toastMessage} onClose={() => setToastMessage("")} />
    </div>
  );
}

export default PartnerDetailPage;
