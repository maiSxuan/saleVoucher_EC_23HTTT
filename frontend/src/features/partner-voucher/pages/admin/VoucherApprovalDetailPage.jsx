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
  Image as ImageIcon,
} from "lucide-react";
import Toast from "../../../../shared/components/Toast";
import {
  getVoucherByIdApi,
  approveVoucherApi,
  rejectVoucherApi,
  getBranchesByPartnerApi,
} from "../../../../shared/api/partnerApi";

const rejectReasons = [
  "Thông tin nhận diện gây hiểu nhầm",
  "Thông tin giá không hợp lệ",
  "Thời gian không hợp lệ",
  "Số lượng/tồn kho không hợp lệ",
  "Chi nhánh/phạm vi áp dụng không hợp lệ",
  "Điều kiện sử dụng không nhất quán",
  "Khác",
];

const checklistItems = [
  "Tên/mô tả/hình ảnh phù hợp",
  "Voucher gắn đúng đối tác",
  "Giá gốc và giá bán hợp lệ",
  "Giá bán nhỏ hơn giá gốc",
  "Thời gian bán hợp lệ",
  "Số lượng hợp lệ",
  "Chi nhánh thuộc đối tác và đủ điều kiện",
  "Điều kiện sử dụng không mâu thuẫn",
];

export function VoucherApprovalDetailPage({ voucherId, onNavigate }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [voucher, setVoucher] = useState(null);
  const [branchesList, setBranchesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  const [checklist, setChecklist] = useState({});
  const [approveModal, setApproveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);

  const [selectedRejectReason, setSelectedRejectReason] = useState(rejectReasons[0]);
  const [customRejectNote, setCustomRejectNote] = useState("");

  const loadVoucher = async () => {
    setLoading(true);
    try {
      const vId = voucherId || id || "v-001";
      const data = await getVoucherByIdApi(vId);
      setVoucher(data);
      if (data?.ma_hs) {
        const bData = await getBranchesByPartnerApi(data.ma_hs);
        setBranchesList(bData || []);
      }
    } catch (e) {
      console.error("Error loading voucher detail:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVoucher();
  }, [voucherId, id]);

  if (loading) {
    return <div className="p-12 text-center text-slate-500">Đang tải thông tin voucher...</div>;
  }

  if (!voucher) {
    return <div className="p-12 text-center text-slate-500">Không tìm thấy voucher.</div>;
  }

  const giaGoc = Number(voucher.gia_goc) || 0;
  const giaBan = Number(voucher.gia_ban) || 0;
  const discountPct = giaGoc > 0 ? Math.round((1 - giaBan / giaGoc) * 100) : 0;
  const isInvalidPrice = giaBan >= giaGoc;

  const startDate = voucher.tg_bat_dau_ban ? voucher.tg_bat_dau_ban.slice(0, 10) : "2025-08-01";
  const endDate = voucher.tg_ket_thuc_ban ? voucher.tg_ket_thuc_ban.slice(0, 10) : "2025-12-31";
  const quantity = Number(voucher.so_luong_phat_hanh) || 0;
  const soldCount = Number(voucher.so_luong_da_ban) || 0;

  const getReviewStatusBadge = (v) => {
    if (v.trang_thai === "Dang ban" || v.trang_thai === "Da duyet") {
      return { label: "Đã duyệt", color: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" };
    }
    if (v.trang_thai === "Tu choi") {
      return { label: "Bị từ chối", color: "bg-rose-50 text-rose-700 border-rose-200", dot: "bg-rose-500" };
    }
    return { label: "Chờ duyệt", color: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" };
  };

  const computePublicationStatus = (hide) => {
    if (hide) return "Tạm ẩn";
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (now > end) return "Hết hạn";
    if (soldCount >= quantity && quantity > 0) return "Hết hàng";
    if (now >= start) return "Đang bán";
    return "Chờ mở bán";
  };

  const getPublicationStatusBadge = (v) => {
    if (v.trang_thai === "Tam ngung" || v.trang_thai === "Tam an") {
      return { label: "Tạm ngưng", color: "bg-slate-100 text-slate-600 border-slate-200", dot: "bg-slate-400" };
    }
    const isApproved = v.trang_thai === "Dang ban" || v.trang_thai === "Da duyet";
    if (!isApproved) {
      return { label: "Chưa công bố", color: "bg-slate-100 text-slate-600 border-slate-200", dot: "bg-slate-400" };
    }
    const pubStatus = computePublicationStatus(false);
    if (pubStatus === "Đang bán") return { label: "Đang bán", color: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" };
    if (pubStatus === "Chờ mở bán") return { label: "Chờ mở bán", color: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" };
    if (pubStatus === "Hết hàng") return { label: "Hết hàng", color: "bg-purple-50 text-purple-700 border-purple-200", dot: "bg-purple-500" };
    if (pubStatus === "Hết hạn") return { label: "Hết hạn", color: "bg-slate-100 text-slate-600 border-slate-200", dot: "bg-slate-400" };
    return { label: "Tạm ẩn", color: "bg-slate-100 text-slate-600 border-slate-200", dot: "bg-slate-400" };
  };

  const rb = getReviewStatusBadge(voucher);
  const pb = getPublicationStatusBadge(voucher);

  const applicableBranches = branchesList.filter((b) =>
    (voucher.ma_chi_nhanh || []).includes(b.ma_chi_nhanh)
  );

  const toggleCheck = (item) => {
    setChecklist((prev) => ({ ...prev, [item]: !prev[item] }));
  };
  const checkedCount = Object.values(checklist).filter(Boolean).length;

  const handleApprove = async () => {
    setLoading(true);
    try {
      await approveVoucherApi(voucher.ma_voucher, false);
      setApproveModal(false);
      setToastMessage(`Voucher đã được phê duyệt thành công!`);
      await loadVoucher();
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
      await rejectVoucherApi(voucher.ma_voucher, finalReason);
      setRejectModal(false);
      setToastMessage("Đã từ chối voucher. Lý do đã được ghi nhận và gửi cho đối tác.");
      await loadVoucher();
    } catch (e) {
      setToastMessage("Từ chối thất bại: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-4">
      {/* Back Button */}
      <button
        onClick={() => {
          if (onNavigate) {
            onNavigate("voucher-approval");
          } else {
            navigate("/admin/vouchers");
          }
        }}
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} /> Quay lại danh sách
      </button>

      {/* Header Card matching Prototype Code */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{voucher.ten_voucher}</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${rb.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${rb.dot}`} />
                Kiểm duyệt: {rb.label}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${pb.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${pb.dot}`} />
                Công bố: {pb.label}
              </span>
              <span className="text-xs text-slate-400 self-center font-mono">
                Gửi duyệt: {voucher.ngay_tao ? voucher.ngay_tao.slice(0, 10) : "2025-07-10"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setApproveModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
            >
              <CheckCircle size={14} /> Phê duyệt
            </button>
            <button
              onClick={() => setRejectModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors cursor-pointer shadow-xs"
            >
              <XCircle size={14} /> Từ chối
            </button>
          </div>
        </div>

        {voucher.ly_do_tu_choi && (
          <div className="mt-3 bg-slate-50 rounded-lg px-4 py-2.5 text-sm text-slate-700 border border-slate-200">
            <strong>Ghi chú kiểm duyệt:</strong> {voucher.ly_do_tu_choi}
          </div>
        )}
      </div>

      {/* Main Grid: Left 2 Cols + Right 1 Col */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Detail Sections */}
        <div className="lg:col-span-2 space-y-4">
          {/* Section 0: Hình ảnh minh họa Voucher */}
          {voucher.hinh_anh_url && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
                <ImageIcon size={16} className="text-blue-600" /> Hình ảnh minh họa Voucher
              </h3>
              <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                <img
                  src={voucher.hinh_anh_url}
                  alt={voucher.ten_voucher}
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = "";
                  }}
                />
              </div>
            </div>
          )}

          {/* Section 1: Thông tin nhận diện */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Tag size={16} className="text-blue-600" /> Thông tin nhận diện
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-400">Tên voucher</p>
                <p className="font-bold text-slate-900 mt-0.5">{voucher.ten_voucher}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Danh mục</p>
                <p className="font-medium text-slate-900 mt-0.5">{voucher.ten_danh_muc || voucher.ma_danh_muc}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-slate-400">Mô tả</p>
                <p className="text-slate-700 mt-0.5">{voucher.mo_ta || "Chưa có mô tả chi tiết."}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Chính sách hoàn hủy</p>
                <p className="text-slate-700 mt-0.5">{voucher.chinh_sach_hoan_huy || "Chưa có chính sách."}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Đối tác phát hành</p>
                <p className="font-bold text-blue-600 mt-0.5">{voucher.ten_dn || "Doanh nghiệp đối tác"}</p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Điều kiện sử dụng</p>
                <p className="text-slate-700 mt-0.5">{voucher.dieu_kien_ap_dung || "Áp dụng toàn hệ thống."}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Thông tin giá */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
              <DollarSign size={16} className="text-emerald-600" /> Thông tin giá
            </h3>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-400">Giá gốc</p>
                <p className="font-medium text-slate-700 mt-0.5">{giaGoc.toLocaleString("vi-VN")}đ</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Giá bán</p>
                <p className="font-bold text-emerald-600 mt-0.5">{giaBan.toLocaleString("vi-VN")}đ</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Mức giảm</p>
                <p className={`font-bold mt-0.5 ${discountPct > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                  {discountPct > 0 ? `-${discountPct}%` : `+${Math.abs(discountPct)}% ⚠️`}
                </p>
              </div>
            </div>
            {isInvalidPrice && (
              <div className="mt-3 flex items-center gap-2 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 font-medium">
                <XCircle size={15} /> Giá bán lớn hơn hoặc bằng giá gốc — không hợp lệ!
              </div>
            )}
          </div>

          {/* Section 3: Thời gian & Số lượng */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Calendar size={16} className="text-blue-600" /> Thời gian & Số lượng
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-400">Bắt đầu bán</p>
                <p className="font-medium text-slate-800 mt-0.5">{startDate}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Kết thúc bán</p>
                <p className="font-medium text-slate-800 mt-0.5">{endDate}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Số lượng phát hành</p>
                <p className="font-medium text-slate-800 mt-0.5">{quantity} voucher</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Đã bán / Còn lại</p>
                <p className="font-medium text-slate-800 mt-0.5">
                  {soldCount} / {Math.max(0, quantity - soldCount)}
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Phạm vi áp dụng */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
              <MapPin size={16} className="text-amber-600" /> Phạm vi chi nhánh áp dụng ({applicableBranches.length})
            </h3>
            {applicableBranches.length > 0 ? (
              <div className="space-y-2.5 text-sm text-slate-700">
                {applicableBranches.map((b) => (
                  <div key={b.ma_chi_nhanh} className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <CheckCircle size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900">{b.ten_chi_nhanh}</span>
                      <p className="text-xs text-slate-500 mt-0.5">📍 {b.dia_chi} ({b.khu_vuc})</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200 italic">
                Áp dụng cho các chi nhánh thuộc doanh nghiệp {voucher.ten_dn || "đối tác"}.
              </div>
            )
            }
          </div>
        </div>

        {/* Right Column: Checklist & Info */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
              <Info size={16} className="text-blue-600" /> Checklist kiểm tra
            </h3>
            <p className="text-xs text-slate-400 mb-3">Hỗ trợ kiểm tra — không tự phê duyệt</p>
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
                  className={`h-1.5 rounded-full transition-all duration-300 ${checkedCount === checklistItems.length ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  style={{ width: `${(checkedCount / checklistItems.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Consequences Card */}
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 shadow-xs">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Hậu quả khi phê duyệt</h4>
            <ul className="space-y-1.5 text-xs text-blue-800 leading-relaxed">
              <li>• Portal đối tác nhận kết quả duyệt</li>
              <li>• Trạng thái công bố sẽ tự động được xác định</li>
              <li>• Khách hàng có thể mua khi trạng thái công bố cho phép</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Approve Modal matching Prototype Code */}
      {approveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setApproveModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4 text-slate-800">
            <h3 className="font-bold text-slate-900 text-lg">Phê duyệt voucher</h3>

            <div className="bg-slate-50 rounded-xl p-3.5 text-xs space-y-2 border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-400">Voucher:</span>
                <span className="font-bold text-slate-900">{voucher.ten_voucher}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Đối tác:</span>
                <span className="font-semibold text-slate-800">{voucher.ten_dn || "Doanh nghiệp đối tác"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Giá bán:</span>
                <span className="text-emerald-600 font-bold">{giaBan.toLocaleString("vi-VN")}đ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Thời gian:</span>
                <span className="font-mono">{startDate} → {endDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Trạng thái kiểm duyệt sau:</span>
                <span className="text-emerald-600 font-bold">Đã duyệt</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                <span className="text-slate-400">Trạng thái công bố dự kiến:</span>
                <span className="text-blue-600 font-bold">{computePublicationStatus(false)}</span>
              </div>
            </div>

            {computePublicationStatus(false) === "Chờ mở bán" && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-800">
                <strong>Lưu ý:</strong> Hệ thống sẽ tự động công bố voucher khi đến thời gian bán ({startDate}) nếu vẫn còn đủ điều kiện.
              </div>
            )}

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

      {/* Reject Modal matching Prototype Code */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setRejectModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4 text-slate-800">
            <h3 className="font-bold text-slate-900 text-lg">Từ chối voucher</h3>

            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs space-y-1">
              <div className="font-bold text-rose-900">Voucher: {voucher.ten_voucher}</div>
              <div className="text-rose-700">Trạng thái sẽ chuyển sang: <strong>Bị từ chối</strong></div>
            </div>

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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ghi chú chi tiết:</label>
              <textarea
                rows="3"
                placeholder="Nhập ghi chú gửi cho đối tác..."
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

export default VoucherApprovalDetailPage;