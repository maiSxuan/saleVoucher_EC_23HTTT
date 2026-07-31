import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import AdminLayout from "../../../../layouts/AdminLayout";
import Card from "../../../../shared/components/Card";
import Button from "../../../../shared/components/Button";
import Badge from "../../../../shared/components/Badge";
import Modal from "../../../../shared/components/Modal";
import Toast from "../../../../shared/components/Toast";
import { getPartnerByIdApi, approvePartnerApi, rejectPartnerApi } from "../../../../shared/api/partnerApi";

export function PartnerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("profile"); // profile, rep, docs, branches
  const [toastMessage, setToastMessage] = useState("");

  // Modals state
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approveReason, setApproveReason] = useState("Hồ sơ hợp lệ và đạt điều kiện pháp lý.");

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState("");

  const [showLockModal, setShowLockModal] = useState(false);
  const [lockReason, setLockReason] = useState("");

  const loadPartner = async () => {
    setLoading(true);
    const data = await getPartnerByIdApi(id);
    setPartner(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPartner();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-12 text-center text-slate-500">Đang tải hồ sơ đối tác...</div>
      </AdminLayout>
    );
  }

  if (!partner) {
    return (
      <AdminLayout>
        <div className="p-12 text-center text-slate-500">Không tìm thấy hồ sơ đối tác.</div>
      </AdminLayout>
    );
  }

  const handleApproveConfirm = async () => {
    await approvePartnerApi(partner.ma_hs, approveReason);
    setShowApproveModal(false);
    setToastMessage("Đã phê duyệt đối tác thành công!");
    await loadPartner();
  };

  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) {
      setRejectError("Vui lòng nhập lý do từ chối cụ thể!");
      return;
    }
    await rejectPartnerApi(partner.ma_hs, rejectReason);
    setShowRejectModal(false);
    setToastMessage("Đã từ chối hồ sơ đối tác.");
    await loadPartner();
  };

  const handleLockConfirm = async () => {
    if (!lockReason.trim()) {
      alert("Vui lòng nhập lý do khóa/mở khóa!");
      return;
    }
    setShowLockModal(false);
    setToastMessage("Cập nhật trạng thái đối tác thành công.");
    await loadPartner();
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link to="/admin/partners" className="hover:underline">
              Quản lý đối tác
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-900">{partner.ten_dn}</span>
          </div>

          <Badge status={partner.trang_thai} />
        </div>

        {/* Main Grid: Left Tabs (70%) + Right Action Panel (30%) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Navigation Header */}
            <div className="flex items-center gap-4 border-b border-slate-200 bg-white p-2 rounded-xl shadow-xs">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  activeTab === "profile" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Thông tin DN
              </button>
              <button
                onClick={() => setActiveTab("rep")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  activeTab === "rep" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Người đại diện
              </button>
              <button
                onClick={() => setActiveTab("docs")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  activeTab === "docs" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Giấy phép KD
              </button>
              <button
                onClick={() => setActiveTab("branches")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  activeTab === "branches" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Chi nhánh ({partner.branches?.length || 0})
              </button>
            </div>

            {/* TAB 1: Business Profile */}
            {activeTab === "profile" && (
              <Card title="Hồ Sơ Pháp Lý Doanh Nghiệp">
                <div className="space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-4 border-b pb-3 border-slate-100">
                    <span className="text-slate-500">Tên doanh nghiệp:</span>
                    <span className="font-bold text-slate-900">{partner.ten_dn}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-b pb-3 border-slate-100">
                    <span className="text-slate-500">Mã số thuế / MST:</span>
                    <span className="font-mono font-bold text-slate-900">{partner.ma_so_thue}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-b pb-3 border-slate-100">
                    <span className="text-slate-500">Địa chỉ đăng ký:</span>
                    <span className="font-medium text-slate-800">{partner.dia_chi}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <span className="text-slate-500">Ngày nộp hồ sơ:</span>
                    <span className="font-medium text-slate-800">
                      {new Date(partner.ngay_tao).toLocaleString("vi-VN")}
                    </span>
                  </div>
                </div>
              </Card>
            )}

            {/* TAB 2: Representative */}
            {activeTab === "rep" && (
              <Card title="Người Đại Diện Pháp Luật">
                <div className="space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-4 border-b pb-3 border-slate-100">
                    <span className="text-slate-500">Họ và tên:</span>
                    <span className="font-bold text-slate-900">{partner.nguoi_dai_dien?.ho_ten}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-b pb-3 border-slate-100">
                    <span className="text-slate-500">Số điện thoại:</span>
                    <span className="font-medium text-slate-900">{partner.nguoi_dai_dien?.sdt}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-b pb-3 border-slate-100">
                    <span className="text-slate-500">Email:</span>
                    <span className="font-medium text-slate-900">{partner.nguoi_dai_dien?.email}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <span className="text-slate-500">Số CCCD / Hộ chiếu:</span>
                    <span className="font-mono font-bold text-slate-900">{partner.nguoi_dai_dien?.cccd}</span>
                  </div>
                </div>
              </Card>
            )}

            {/* TAB 3: Documents */}
            {activeTab === "docs" && (
              <Card title="Tài Liệu Giấy Phép Đăng Ký Kinh Doanh">
                <div className="space-y-4">
                  <img
                    src={partner.giay_phep_kinh_doanh}
                    alt="Giấy phép kinh doanh"
                    className="w-full max-h-96 object-contain rounded-lg border border-slate-200 bg-slate-900/5"
                  />
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span>Xác thực tính pháp lý tài liệu scan từ Cục quản lý ĐKKD</span>
                    <a
                      href={partner.giay_phep_kinh_doanh}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 font-bold hover:underline"
                    >
                      🔗 Tải xuống tệp gốc
                    </a>
                  </div>
                </div>
              </Card>
            )}

            {/* TAB 4: Branches */}
            {activeTab === "branches" && (
              <Card title="Danh Sách Chi Nhánh">
                <div className="space-y-4">
                  <div className="divide-y divide-slate-100">
                    {(partner.branches || []).map((b) => (
                      <div key={b.ma_chi_nhanh} className="py-3 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-900">{b.ten_chi_nhanh}</div>
                          <div className="text-xs text-slate-500">📍 {b.dia_chi} ({b.khu_vuc})</div>
                        </div>
                        <Badge status={b.trang_thai} size="sm" />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Right Column: Admin Action Panel */}
          <div className="space-y-6">
            <Card title="Bảng Hành Động Quản Trị">
              <div className="space-y-3">
                <div className="text-xs text-slate-500">
                  Trạng thái hiện tại: <strong className="text-slate-900">{partner.trang_thai}</strong>
                </div>

                <div className="space-y-2 pt-2">
                  <Button
                    variant="success"
                    className="w-full justify-center"
                    icon="✓"
                    onClick={() => setShowApproveModal(true)}
                  >
                    Duyệt đối tác
                  </Button>

                  <Button
                    variant="danger"
                    className="w-full justify-center"
                    icon="✕"
                    onClick={() => setShowRejectModal(true)}
                  >
                    Từ chối hồ sơ
                  </Button>

                  <Button
                    variant="secondary"
                    className="w-full justify-center"
                    icon="🔒"
                    onClick={() => setShowLockModal(true)}
                  >
                    {partner.trang_thai === "Tam khoa" ? "Mở khóa đối tác" : "Tạm khóa đối tác"}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Modal Approve Partner */}
        <Modal
          isOpen={showApproveModal}
          onClose={() => setShowApproveModal(false)}
          onConfirm={handleApproveConfirm}
          title="Xác Nhận Phê Duyệt Hồ Sơ Đối Tác"
          confirmText="Xác nhận duyệt"
          confirmVariant="success"
        >
          <div className="space-y-3 text-left">
            <p className="text-sm text-slate-700">
              Bằng cách phê duyệt đối tác <strong>{partner.ten_dn}</strong>, tài khoản và các chi nhánh thuộc đối tác sẽ được kích hoạt trạng thái <strong>"Đang hoạt động"</strong> và có quyền đăng bán Voucher trên hệ thống.
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ghi chú / Lý do duyệt:</label>
              <textarea
                rows="2"
                value={approveReason}
                onChange={(e) => setApproveReason(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm border-slate-300 focus:outline-none"
              ></textarea>
            </div>
          </div>
        </Modal>

        {/* Modal Reject Partner */}
        <Modal
          isOpen={showRejectModal}
          onClose={() => setShowRejectModal(false)}
          onConfirm={handleRejectConfirm}
          title="Từ Chối Hồ Sơ Đối Tác"
          confirmText="Từ chối hồ sơ"
          confirmVariant="danger"
        >
          <div className="space-y-3 text-left">
            <p className="text-sm text-rose-700 font-medium">
              Vui lòng nhập chi tiết lý do từ chối để thông báo phản hồi về cho đối tác.
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lý do từ chối (Bắt buộc) <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows="3"
                placeholder="Ví dụ: Giấy phép kinh doanh bị mờ, mã số thuế không khớp với Cục Thuế..."
                value={rejectReason}
                onChange={(e) => {
                  setRejectReason(e.target.value);
                  setRejectError("");
                }}
                className="w-full px-3 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              ></textarea>
              {rejectError && <p className="text-xs text-rose-600 mt-1 font-semibold">{rejectError}</p>}
            </div>
          </div>
        </Modal>

        {/* Modal Lock/Unlock Partner */}
        <Modal
          isOpen={showLockModal}
          onClose={() => setShowLockModal(false)}
          onConfirm={handleLockConfirm}
          title={partner.trang_thai === "Tam khoa" ? "Mở Khóa Đối Tác" : "Khóa Quyền Hoạt Động Đối Tác"}
          confirmText="Xác nhận"
          confirmVariant="danger"
        >
          <div className="space-y-3 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Lý do khóa / mở khóa (Bắt buộc):</label>
              <textarea
                rows="3"
                placeholder="Nhập lý do chi tiết..."
                value={lockReason}
                onChange={(e) => setLockReason(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm border-slate-300 focus:outline-none"
              ></textarea>
            </div>
          </div>
        </Modal>

        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      </div>
    </AdminLayout>
  );
}

export default PartnerDetailPage;
