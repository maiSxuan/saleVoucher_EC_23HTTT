import React, { useEffect, useState } from "react";
import { Plus, Search, X, MapPin, Building2, Edit, Trash2 } from "lucide-react";
import PartnerLayout from "../../../../layouts/PartnerLayout";
import Badge from "../../../../shared/components/Badge";
import Modal from "../../../../shared/components/Modal";
import Toast from "../../../../shared/components/Toast";
import {
  getBranchesByPartnerApi,
  getBranchRequestsApi,
  createBranchRequestApi,
  getVouchersByPartnerApi,
} from "../../../../shared/api/partnerApi";
import { VIETNAM_PROVINCES } from "../../../../shared/constants/vietnamProvinces";
import { useTranslation } from "react-i18next";

export function BranchManagementPage() {
  const { t } = useTranslation();
  const [activeBranches, setActiveBranches] = useState([]);
  const [partnerRequests, setPartnerRequests] = useState([]);
  const [partnerVouchers, setPartnerVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("official");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedBranchForEdit, setSelectedBranchForEdit] = useState(null);
  const [selectedBranchForDelete, setSelectedBranchForDelete] = useState(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    setPage(1);
  }, [searchQuery, activeTab]);

  const [newBranchForm, setNewBranchForm] = useState({
    ten_chi_nhanh: "",
    khu_vuc: "TP. Hồ Chí Minh",
    dia_chi: "",
    ly_do: "",
  });

  const [editBranchForm, setEditBranchForm] = useState({
    ten_chi_nhanh: "",
    khu_vuc: "TP. Hồ Chí Minh",
    dia_chi: "",
    ly_do: "",
  });

  const getLoggedInPartnerId = () => {
    try {
      const storedUser = localStorage.getItem("user") || localStorage.getItem("ec_auth_user");
      if (storedUser) {
        const u = JSON.parse(storedUser);
        return u.ma_hsdn || u.ma_hs || u.id || u.ma_nguoi_dung;
      }
    } catch (e) { }
    return null;
  };

  const loadData = async () => {
    setLoading(true);
    const partnerId = getLoggedInPartnerId();
    try {
      const [bData, rData, vData] = await Promise.all([
        getBranchesByPartnerApi(partnerId),
        getBranchRequestsApi(partnerId),
        getVouchersByPartnerApi(partnerId),
      ]);
      setActiveBranches(bData || []);
      setPartnerRequests(rData || []);
      setPartnerVouchers(vData || []);
    } catch (e) {
      console.error("Error loading branch management data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleResetFilters = () => {
    setSearchQuery("");
  };

  // A3.w: Add new branch
  const handleAddBranchSubmit = async () => {
    if (!newBranchForm.ten_chi_nhanh.trim() || !newBranchForm.dia_chi.trim()) {
      setToastMessage(t("Vui lòng điền tên chi nhánh và địa chỉ!"));
      return;
    }

    const partnerId = getLoggedInPartnerId();
    await createBranchRequestApi({
      ma_hs: partnerId,
      ten_dn: "Doanh nghiệp đối tác",
      loai_yeu_cau: "Them moi",
      ...newBranchForm,
    });

    setShowAddModal(false);
    setNewBranchForm({
      ten_chi_nhanh: "",
      khu_vuc: "TP. Hồ Chí Minh",
      dia_chi: "",
      ly_do: "",
    });

    setToastMessage(t("Yêu cầu thêm chi nhánh mới đã được gửi tới Quản trị viên!"));
    await loadData();
  };

  // A3.x: Edit existing branch
  const handleOpenEdit = (branch) => {
    setSelectedBranchForEdit(branch);
    setEditBranchForm({
      ten_chi_nhanh: branch.ten_chi_nhanh || "",
      khu_vuc: branch.khu_vuc || "TP. Hồ Chí Minh",
      dia_chi: branch.dia_chi || "",
      ly_do: "",
    });
    setShowEditModal(true);
  };

  const handleEditBranchSubmit = async () => {
    if (!editBranchForm.ten_chi_nhanh.trim() || !editBranchForm.dia_chi.trim()) {
      setToastMessage(t("Tên chi nhánh và địa chỉ không được để trống."));
      return;
    }

    if (!selectedBranchForEdit) return;

    // Check duplicate name and address on ANOTHER branch
    const isDuplicate = activeBranches.some(
      (b) =>
        String(b.ma_chi_nhanh) !== String(selectedBranchForEdit.ma_chi_nhanh) &&
        b.ten_chi_nhanh.trim().toLowerCase() === editBranchForm.ten_chi_nhanh.trim().toLowerCase() &&
        b.dia_chi.trim().toLowerCase() === editBranchForm.dia_chi.trim().toLowerCase()
    );

    if (isDuplicate) {
      setToastMessage(t("Tên chi nhánh và địa chỉ trùng lặp với chi nhánh khác hiện có."));
      return;
    }

    try {
      const partnerId = getLoggedInPartnerId();

      await createBranchRequestApi({
        ma_hs: partnerId,
        ma_chi_nhanh: selectedBranchForEdit.ma_chi_nhanh,
        ten_dn: selectedBranchForEdit.ten_dn || "Doanh nghiệp đối tác",
        loai_yeu_cau: "Cap nhat",
        ten_chi_nhanh: editBranchForm.ten_chi_nhanh.trim(),
        khu_vuc: editBranchForm.khu_vuc,
        dia_chi: editBranchForm.dia_chi.trim(),
        du_lieu_de_xuat: {
          ten_chi_nhanh: editBranchForm.ten_chi_nhanh.trim(),
          khu_vuc: editBranchForm.khu_vuc,
          dia_chi: editBranchForm.dia_chi.trim(),
        },
      });

      setShowEditModal(false);
      setSelectedBranchForEdit(null);
      setToastMessage(
        t("Yêu cầu cập nhật chi nhánh đã được gửi thành công, đang chờ Quản trị viên duyệt!")
      );
      await loadData();
    } catch (e) {
      console.error("Error submitting branch edit:", e);
      setToastMessage(t("Gửi yêu cầu cập nhật chi nhánh thất bại: ") + e.message);
    }
  };

  // A3.y: Delete branch
  const handleDeleteClick = (branch) => {
    // A3.y.2c: Check if it's the ONLY active branch
    const activeCount = activeBranches.filter((b) => b.trang_thai !== "Tam ngung hoat dong").length;
    if (activeCount <= 1) {
      setToastMessage(t("Doanh nghiệp phải có ít nhất 1 chi nhánh hoạt động."));
      return;
    }

    // A3.y.2b: Check if branch is linked to active vouchers ("Dang ban" or "Cho duyet")
    const hasActiveVouchers = partnerVouchers.some((v) => {
      const isVoucherActive = v.trang_thai === "Dang ban" || v.trang_thai === "Cho duyet";
      const isBranchLinked = Array.isArray(v.ma_chi_nhanh) && v.ma_chi_nhanh.includes(branch.ma_chi_nhanh);
      return isVoucherActive && isBranchLinked;
    });

    if (hasActiveVouchers) {
      setToastMessage(t("Không thể xóa chi nhánh đang có voucher hoạt động. Đề xuất dùng 'Vô hiệu hóa chi nhánh' thay thế."));
      return;
    }

    // A3.y.2a: No constraints violated -> prompt confirmation modal
    setSelectedBranchForDelete(branch);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBranchForDelete) return;

    const partnerId = getLoggedInPartnerId();
    await createBranchRequestApi({
      ma_hs: partnerId,
      ma_chi_nhanh: selectedBranchForDelete.ma_chi_nhanh,
      ten_dn: "Doanh nghiệp đối tác",
      loai_yeu_cau: "Xoá",
      ten_chi_nhanh: selectedBranchForDelete.ten_chi_nhanh,
      khu_vuc: selectedBranchForDelete.khu_vuc,
      dia_chi: selectedBranchForDelete.dia_chi,
    });

    setShowDeleteModal(false);
    setSelectedBranchForDelete(null);
    setToastMessage(t("Yêu cầu xóa chi nhánh đã được gửi, đang chờ quản trị viên duyệt."));
    await loadData();
  };

  const filteredBranches = activeBranches.filter(
    (b) =>
      (b.ten_chi_nhanh || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.dia_chi || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PartnerLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-5">
        {/* Title & Action Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t("Quản lý chi nhánh")}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {t("Khai báo chi nhánh mới, chỉnh sửa thông tin hoặc yêu cầu đóng điểm bán hàng.")}
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer shadow-xs"
          >
            <Plus size={16} /> {t("Thêm chi nhánh mới")}
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("official")}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${activeTab === "official"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
          >
            {t("Chi nhánh chính thức")} ({activeBranches.length})
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${activeTab === "requests"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
          >
            {t("Yêu cầu thay đổi")}
            {partnerRequests.filter((r) => r.trang_thai === "Cho duyet" || r.trang_thai === "Cho xu ly").length > 0 ? (
              <span className="px-2 py-0.5 text-xs bg-amber-500 text-white font-bold rounded-full animate-pulse">
                {partnerRequests.filter((r) => r.trang_thai === "Cho duyet" || r.trang_thai === "Cho xu ly").length} {t("chờ duyệt")}
              </span>
            ) : (
              <span className="text-xs text-gray-400 font-normal">
                ({partnerRequests.length})
              </span>
            )}
          </button>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t("Tìm kiếm chi nhánh theo tên, địa chỉ...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between mt-3">
            <p className="text-sm text-gray-500">{filteredBranches.length} {t("chi nhánh")}</p>
          </div>
        </div>

        {/* Tab 1: Official Branches */}
        {activeTab === "official" && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
            {loading ? (
              <div className="p-12 text-center text-gray-400">{t("Đang tải danh sách chi nhánh...")}</div>
            ) : filteredBranches.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-gray-400">
                <Building2 size={40} className="mb-2 text-gray-300" />
                <p className="text-sm">{t("Không tìm thấy chi nhánh nào.")}</p>
              </div>
            ) : (
              <div>
                <div className="divide-y divide-gray-100">
                  {filteredBranches.slice((page - 1) * limit, page * limit).map((branch) => {
                    const pendingReq = partnerRequests.find(
                      (r) => r.ma_chi_nhanh === branch.ma_chi_nhanh && (r.trang_thai === "Cho duyet" || r.trang_thai === "Cho xu ly")
                    );

                    return (
                      <div key={branch.ma_chi_nhanh} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <h4 className="font-bold text-gray-900 text-base">{branch.ten_chi_nhanh}</h4>
                            <Badge status={branch.trang_thai} size="sm" />
                            {pendingReq && pendingReq.loai_yeu_cau === "Cap nhat" && (
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                {t("Chờ duyệt cập nhật")}
                              </span>
                            )}
                            {pendingReq && pendingReq.loai_yeu_cau === "Xoá" && (
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                                {t("Chờ duyệt xóa")}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 flex items-center gap-1">
                            <MapPin size={13} className="text-amber-500 shrink-0" />
                            {branch.dia_chi} ({branch.khu_vuc})
                          </p>
                          {branch.trang_thai === "Tu choi" && branch.ly_do_tu_choi && (
                            <div className="mt-1.5 p-2 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-700 font-medium">
                              {t("Lý do từ chối:")} {branch.ly_do_tu_choi}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(branch)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            <Edit size={13} /> {t("Sửa")}
                          </button>
                          <button
                            onClick={() => handleDeleteClick(branch)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 size={13} /> {t("Xóa")}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Phân trang */}
                {filteredBranches.length > 0 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50 text-sm">
                    <p className="text-xs text-gray-600">
                      {t("Trang")} {page} / {Math.ceil(filteredBranches.length / limit) || 1} ({t("Tổng")} {filteredBranches.length} {t("chi nhánh")})
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page <= 1}
                        className="px-3 py-1 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 disabled:opacity-40 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        {t("Trước")}
                      </button>
                      <button
                        onClick={() => setPage((p) => Math.min(Math.ceil(filteredBranches.length / limit) || 1, p + 1))}
                        disabled={page >= (Math.ceil(filteredBranches.length / limit) || 1)}
                        className="px-3 py-1 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 disabled:opacity-40 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        {t("Sau")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Branch Change Requests (Clean & Separated UX) */}
        {activeTab === "requests" && (
          <div className="space-y-6">
            {/* Section 1: Pending Requests */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs p-5 space-y-4">
              <h3 className="font-bold text-gray-900 text-base flex items-center justify-between border-b border-gray-100 pb-3">
                <span>{t("Yêu cầu đang chờ duyệt")}</span>
                <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full font-bold">
                  {partnerRequests.filter((r) => r.trang_thai === "Cho duyet" || r.trang_thai === "Cho xu ly").length} {t("chờ duyệt")}
                </span>
              </h3>

              {partnerRequests.filter((r) => r.trang_thai === "Cho duyet" || r.trang_thai === "Cho xu ly").length === 0 ? (
                <div className="py-8 text-center text-gray-400 text-sm bg-gray-50 rounded-lg border border-gray-100 italic">
                  ✓ {t("Hiện không có yêu cầu thay đổi chi nhánh nào đang chờ duyệt.")}
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {partnerRequests
                    .filter((r) => r.trang_thai === "Cho duyet" || r.trang_thai === "Cho xu ly")
                    .map((req) => (
                      <div key={req.ma_yeu_cau} className="py-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded-md">
                              {req.loai_yeu_cau === "Them moi"
                                ? t("Thêm mới chi nhánh")
                                : req.loai_yeu_cau === "Cap nhat"
                                  ? t("Cập nhật thông tin chi nhánh")
                                  : t("Yêu cầu xóa chi nhánh")}
                            </span>
                            <h4 className="font-bold text-gray-900 text-base">{req.ten_chi_nhanh}</h4>
                          </div>
                          <Badge status={req.trang_thai} />
                        </div>

                        {req.loai_yeu_cau === "Cap nhat" && req.du_lieu_de_xuat && (
                          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs space-y-1 text-gray-800">
                            <div className="font-bold text-amber-900">{t("Thông tin đề xuất mới đang chờ Admin duyệt:")}</div>
                            <div>{t("Tên chi nhánh:")} <strong>{req.du_lieu_de_xuat.ten_chi_nhanh}</strong></div>
                            <div>{t("Địa chỉ đề xuất:")} <strong>{req.du_lieu_de_xuat.dia_chi} ({req.du_lieu_de_xuat.khu_vuc})</strong></div>
                          </div>
                        )}

                        <div className="text-xs text-gray-600 grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <div><strong>{t("Địa chỉ:")}</strong> {req.dia_chi} ({req.khu_vuc})</div>
                          <div><strong>{t("Thời gian gửi:")}</strong> {new Date(req.ngay_tao).toLocaleString("vi-VN")}</div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Section 2: Processed History */}
            {partnerRequests.filter((r) => r.trang_thai !== "Cho duyet" && r.trang_thai !== "Cho xu ly").length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs p-5 space-y-4">
                <h3 className="font-bold text-gray-700 text-sm border-b border-gray-100 pb-3">
                {t("Lịch sử các yêu cầu đã xử lý")} ({partnerRequests.filter((r) => r.trang_thai !== "Cho duyet" && r.trang_thai !== "Cho xu ly").length})
                </h3>
                <div className="divide-y divide-gray-100">
                  {partnerRequests
                    .filter((r) => r.trang_thai !== "Cho duyet" && r.trang_thai !== "Cho xu ly")
                    .map((req) => (
                      <div key={req.ma_yeu_cau} className="py-3.5 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">{req.ten_chi_nhanh}</span>
                            <span className="text-gray-400">
                              ({req.loai_yeu_cau === "Them moi" ? t("Thêm mới") : req.loai_yeu_cau === "Cap nhat" ? t("Cập nhật") : t("Xóa")})
                            </span>
                          </div>
                          <Badge status={req.trang_thai} />
                        </div>

                        <div className="text-gray-500">
                          {req.dia_chi} ({req.khu_vuc}) • {new Date(req.ngay_tao).toLocaleString("vi-VN")}
                        </div>

                        {(req.ly_do_tu_choi || req.ghi_chu_admin) && (
                          <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 font-medium">
                            {t("Lý do từ chối:")} {req.ly_do_tu_choi || req.ghi_chu_admin}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Add New Branch Request */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onConfirm={handleAddBranchSubmit}
          title={t("Tạo Yêu Cầu Thêm Chi Nhánh Mới")}
          confirmText={t("Gửi yêu cầu")}
          cancelText={t("Hủy")}
        >
          <div className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {t("Tên chi nhánh")} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder={t("Ví dụ: Chi nhánh Quận 7")}
                value={newBranchForm.ten_chi_nhanh}
                onChange={(e) => setNewBranchForm({ ...newBranchForm, ten_chi_nhanh: e.target.value })}
                className="w-full px-3.5 py-2 border rounded-lg text-sm border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t("Tỉnh / Thành Phố")}</label>
                <select
                  value={newBranchForm.khu_vuc}
                  onChange={(e) => setNewBranchForm({ ...newBranchForm, khu_vuc: e.target.value })}
                  className="w-full px-3.5 py-2 border rounded-lg text-sm border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  {VIETNAM_PROVINCES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {t("Địa chỉ chi nhánh chi tiết")} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder={t("Địa chỉ cụ thể")}
                value={newBranchForm.dia_chi}
                onChange={(e) => setNewBranchForm({ ...newBranchForm, dia_chi: e.target.value })}
                className="w-full px-3.5 py-2 border rounded-lg text-sm border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </Modal>

        {/* Modal Edit Branch Request (A3.x) */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onConfirm={handleEditBranchSubmit}
          title={t("Cập Nhật Thông Tin Chi Nhánh")}
          confirmText={t("Gửi yêu cầu")}
          cancelText={t("Hủy")}
        >
          <div className="space-y-4 text-left">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
              <strong>{t("Lưu ý:")}</strong> {t("Đề xuất cập nhật sẽ được lưu riêng biệt và gửi tới Quản trị viên duyệt. Thông tin hiện tại vẫn áp dụng cho tới khi có kết quả duyệt.")}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {t("Tên chi nhánh")} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={editBranchForm.ten_chi_nhanh}
                onChange={(e) => setEditBranchForm({ ...editBranchForm, ten_chi_nhanh: e.target.value })}
                className="w-full px-3.5 py-2 border rounded-lg text-sm border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">{t("Tỉnh / Thành Phố")}</label>
              <select
                value={editBranchForm.khu_vuc}
                onChange={(e) => setEditBranchForm({ ...editBranchForm, khu_vuc: e.target.value })}
                className="w-full px-3.5 py-2 border rounded-lg text-sm border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              >
                {VIETNAM_PROVINCES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {t("Địa chỉ chi nhánh chi tiết")} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={editBranchForm.dia_chi}
                onChange={(e) => setEditBranchForm({ ...editBranchForm, dia_chi: e.target.value })}
                className="w-full px-3.5 py-2 border rounded-lg text-sm border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </Modal>

        {/* Modal Delete Branch Confirmation (A3.y.2a) */}
        {selectedBranchForDelete && (
          <Modal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteConfirm}
            title={t("Xác Nhận Yêu Cầu Xóa Chi Nhánh")}
            confirmText={t("Xác nhận gửi yêu cầu xóa")}
            confirmVariant="danger"
            cancelText={t("Hủy")}
          >
            <div className="space-y-3 text-left">
              <p className="text-sm text-gray-700">
                {t("Gửi yêu cầu xóa chi nhánh")} <strong>"{selectedBranchForDelete.ten_chi_nhanh}"</strong> {t("để quản trị viên duyệt?")}
              </p>
              <p className="text-xs text-slate-500 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                {t("Chi nhánh vẫn hoạt động bình thường cho đến khi có kết quả duyệt từ quản trị viên.")}
              </p>
            </div>
          </Modal>
        )}

        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      </div>
    </PartnerLayout>
  );
}

export default BranchManagementPage;