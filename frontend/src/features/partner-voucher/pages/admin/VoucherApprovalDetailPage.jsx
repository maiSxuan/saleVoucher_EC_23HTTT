import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Card from "../../../../shared/components/Card";
import Button from "../../../../shared/components/Button";
import Badge from "../../../../shared/components/Badge";
import Modal from "../../../../shared/components/Modal";
import Toast from "../../../../shared/components/Toast";
import { getVoucherByIdApi, approveVoucherApi, rejectVoucherApi } from "../../../../shared/api/partnerApi";

export function VoucherApprovalDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [voucher, setVoucher] = useState(null);
  const [loading, setLoading] = useState(true);

  const [toastMessage, setToastMessage] = useState("");
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [isHiddenCheck, setIsHiddenCheck] = useState(false);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedPredefinedReason, setSelectedPredefinedReason] = useState("Lỗi niêm yết giá");
  const [customRejectReason, setCustomRejectReason] = useState("");

  const loadVoucher = async () => {
    setLoading(true);
    const data = await getVoucherByIdApi(id);
    setVoucher(data);
    setLoading(false);
  };

  useEffect(() => {
    loadVoucher();
  }, [id]);

  if (loading) {
    return <div className="p-12 text-center text-slate-500">Đang tải thông tin Voucher...</div>;
  }

  if (!voucher) {
    return <div className="p-12 text-center text-slate-500">Không tìm thấy Voucher.</div>;
  }

  const discountPercent =
    voucher.gia_goc && voucher.gia_ban
      ? Math.round(((voucher.gia_goc - voucher.gia_ban) / voucher.gia_goc) * 100)
      : 0;

  const handleApproveConfirm = async () => {
    await approveVoucherApi(voucher.ma_voucher, isHiddenCheck);
    setShowApproveModal(false);
    setToastMessage("Phê duyệt Voucher thành công!");
    await loadVoucher();
  };

  const handleRejectConfirm = async () => {
    const finalReason = customRejectReason.trim()
      ? `${selectedPredefinedReason}: ${customRejectReason}`
      : selectedPredefinedReason;

    await rejectVoucherApi(voucher.ma_voucher, finalReason);
    setShowRejectModal(false);
    setToastMessage("Đã từ chối Voucher.");
    await loadVoucher();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link to="/admin/vouchers" className="hover:underline">
              Duyệt Voucher
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-900">{voucher.ten_voucher}</span>
          </div>

          <Badge status={voucher.trang_thai_kiem_duyet || voucher.trang_thai} />
        </div>

        {/* 2-Column Grid: Voucher Details (70%) + Checklist & Action Panel (30%) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Voucher Image & Info */}
            <Card padding={false}>
              <div className="flex flex-col md:flex-row">
                <img
                  src={voucher.hinh_anh_url}
                  alt={voucher.ten_voucher}
                  className="w-full md:w-64 h-56 object-cover rounded-t-xl md:rounded-l-xl md:rounded-t-none"
                />
                <div className="p-6 flex-1 space-y-3">
                  <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 font-bold text-xs rounded-md">
                    {voucher.ten_danh_muc}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900">{voucher.ten_voucher}</h2>
                  <p className="text-xs text-slate-600 line-clamp-2">{voucher.mo_ta}</p>
                  <div className="pt-2 text-xs text-slate-500">
                    Đối tác đăng ký: <strong className="text-slate-900">{voucher.ten_dn || "Công ty đối tác"}</strong>
                  </div>
                </div>
              </div>
            </Card>

            {/* Price Comparison Card */}
            <Card title="So Sánh Giá Bán & Tỷ Lệ Chiết Khấu">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-400 font-medium">Giá niêm yết (Giá gốc)</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">{voucher.gia_goc?.toLocaleString()}đ</div>
                </div>

                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="text-xs text-emerald-700 font-medium">Giá bán ưu đãi</div>
                  <div className="text-xl font-bold text-emerald-700 mt-1">{voucher.gia_ban?.toLocaleString()}đ</div>
                </div>

                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="text-xs text-blue-700 font-medium">Chiết khấu giảm</div>
                  <div className="text-xl font-bold text-blue-700 mt-1">{discountPercent}%</div>
                </div>
              </div>
            </Card>

            {/* Conditions & Validity */}
            <Card title="Điều Kiện & Thời Gian Bán">
              <div className="space-y-3 text-xs text-slate-700">
                <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Số lượng phát hành:</span>
                  <span className="font-bold text-slate-900">{voucher.so_luong_phat_hanh} voucher</span>
                </div>
                <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Thời gian bắt đầu bán:</span>
                  <span className="font-medium text-slate-900">
                    {voucher.tg_bat_dau_ban ? new Date(voucher.tg_bat_dau_ban).toLocaleString("vi-VN") : "-"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Thời gian kết thúc bán:</span>
                  <span className="font-medium text-slate-900">
                    {voucher.tg_ket_thuc_ban ? new Date(voucher.tg_ket_thuc_ban).toLocaleString("vi-VN") : "-"}
                  </span>
                </div>
                <div>
                  <strong className="block text-slate-900 mb-1">Điều kiện áp dụng:</strong>
                  <p>{voucher.dieu_kien_ap_dung}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Validation Checklist & Actions */}
          <div className="space-y-6">
            {/* Checklist */}
            <Card title="Checklist Kiểm Duyệt Tự Động">
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2 text-emerald-700 font-medium">
                  <span>✓</span>
                  <span>Giá bán nhỏ hơn giá gốc và lớn hơn 0</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-700 font-medium">
                  <span>✓</span>
                  <span>Thời gian bán hợp lệ (Hạn kết thúc &gt; Bắt đầu)</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-700 font-medium">
                  <span>✓</span>
                  <span>Đối tác ở trạng thái Đang hoạt động</span>
                </div>
              </div>
            </Card>

            {/* Action Panel */}
            <Card title="Quyết Định Kiểm Duyệt">
              <div className="space-y-3">
                <Button
                  variant="success"
                  className="w-full justify-center"
                  icon="✓"
                  onClick={() => setShowApproveModal(true)}
                >
                  Phê duyệt công bố Voucher
                </Button>

                <Button
                  variant="danger"
                  className="w-full justify-center"
                  icon="✕"
                  onClick={() => setShowRejectModal(true)}
                >
                  Từ chối phê duyệt
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Modal Approve Voucher */}
        <Modal
          isOpen={showApproveModal}
          onClose={() => setShowApproveModal(false)}
          onConfirm={handleApproveConfirm}
          title="Xác Nhận Phê Duyệt Voucher"
          confirmText="Xác nhận phê duyệt"
          confirmVariant="success"
        >
          <div className="space-y-4 text-left">
            <p className="text-sm text-slate-700">
              Voucher <strong>"{voucher.ten_voucher}"</strong> sẽ được cập nhật kết quả kiểm duyệt sang <strong>"Đã duyệt"</strong>.
            </p>

            <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={isHiddenCheck}
                onChange={(e) => setIsHiddenCheck(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <div className="text-xs">
                <div className="font-bold text-slate-900">Tạm ẩn Voucher này sau khi duyệt</div>
                <div className="text-slate-500">Chuyển trạng thái công bố sang "Tạm ẩn", chưa hiện lên app ngay lập tức.</div>
              </div>
            </label>
          </div>
        </Modal>

        {/* Modal Reject Voucher */}
        <Modal
          isOpen={showRejectModal}
          onClose={() => setShowRejectModal(false)}
          onConfirm={handleRejectConfirm}
          title="Từ Chối Phê Duyệt Voucher"
          confirmText="Xác nhận từ chối"
          confirmVariant="danger"
        >
          <div className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Chọn nhóm lý do từ chối:</label>
              <select
                value={selectedPredefinedReason}
                onChange={(e) => setSelectedPredefinedReason(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm border-slate-300 focus:outline-none"
              >
                <option value="Lỗi nhận diện / Hình ảnh">Lỗi nhận diện / Hình ảnh không rõ ràng</option>
                <option value="Lỗi giá niêm yết">Lỗi niêm yết giá / Giá bán không hợp lệ</option>
                <option value="Lỗi thời gian phát hành">Lỗi thời gian phát hành</option>
                <option value="Điều kiện mâu thuẫn">Điều kiện sử dụng mâu thuẫn hoặc không rõ ràng</option>
                <option value="Khác">Lý do khác</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Giải thích chi tiết (Gửi đối tác):</label>
              <textarea
                rows="3"
                placeholder="Nhập mô tả cụ thể về điểm mâu thuẫn để đối tác chỉnh sửa..."
                value={customRejectReason}
                onChange={(e) => setCustomRejectReason(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm border-slate-300 focus:outline-none"
              ></textarea>
            </div>
          </div>
        </Modal>

        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      </div>
  );
}

export default VoucherApprovalDetailPage;
