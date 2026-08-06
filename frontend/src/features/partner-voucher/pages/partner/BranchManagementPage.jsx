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

export function BranchManagementPage() {
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
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const u = JSON.parse(storedUser);
        return u.ma_hsdn || u.ma_hs || u.id || u.ma_nguoi_dung;
      }
    } catch (e) {}
    return "20000000-0000-0000-0000-000000000001";
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
      setToastMessage("Vui lòng điền tên chi nhánh và địa chỉ!");
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

    setToastMessage("Yêu cầu thêm chi nhánh mới đã được gửi tới Quản trị viên!");
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
      setToastMessage("Tên chi nhánh và địa chỉ không được để trống.");
      return;
    }

    // Validation A7.b: Check duplicate name or address among active branches
    const isDuplicate = activeBranches.some(
      (b) =>
        b.ma_chi_nhanh !== selectedBranchForEdit.ma_chi_nhanh &&
        (b.ten_chi_nhanh.toLowerCase() === editBranchForm.ten_chi_nhanh.trim().toLowerCase() ||
          b.dia_chi.toLowerCase() === editBranchForm.dia_chi.trim().toLowerCase())
    );

    if (isDuplicate) {
      setToastMessage("Tên chi nhánh hoặc địa chỉ trùng lặp với chi nhánh hiện có.");
      return;
    }

    const partnerId = getLoggedInPartnerId();

    // A3.x.6: Store change proposal separately inside du_lieu_de_xuat JSON without overwriting official chinhanh row
    await createBranchRequestApi({
      ma_hs: partnerId,
      ma_chi_nhanh: selectedBranchForEdit.ma_chi_nhanh,
      ten_dn: "Doanh nghiệp đối tác",
      loai_yeu_cau: "Cap nhat",
      ten_chi_nhanh: editBranchForm.ten_chi_nhanh,
      khu_vuc: editBranchForm.khu_vuc,
      dia_chi: editBranchForm.dia_chi,
      du_lieu_de_xuat: {
        ten_chi_nhanh: editBranchForm.ten_chi_nhanh,
        khu_vuc: editBranchForm.khu_vuc,
        dia_chi: editBranchForm.dia_chi,
      },
    });

    setShowEditModal(false);
    setSelectedBranchForEdit(null);
    setToastMessage(
      "Yêu cầu cập nhật chi nhánh đã được gửi, thông tin hiện tại vẫn được áp dụng cho đến khi có kết quả duyệt."
    );
    await loadData();
  };

  // A3.y: Delete branch
  const handleDeleteClick = (branch) => {
    // A3.y.2c: Check if it's the ONLY active branch
    const activeCount = activeBranches.filter((b) => b.trang_thai !== "Tam ngung hoat dong").length;
    if (activeCount <= 1) {
      setToastMessage("Doanh nghiệp phải có ít nhất 1 chi nhánh hoạt động.");
      return;
    }

    // A3.y.2b: Check if branch is linked to active vouchers ("Dang ban" or "Cho duyet")
    const hasActiveVouchers = partnerVouchers.some((v) => {
      const isVoucherActive = v.trang_thai === "Dang ban" || v.trang_thai === "Cho duyet";
      const isBranchLinked = Array.isArray(v.ma_chi_nhanh) && v.ma_chi_nhanh.includes(branch.ma_chi_nhanh);
      return isVoucherActive && isBranchLinked;
    });

    if (hasActiveVouchers) {
      setToastMessage("Không thể xóa chi nhánh đang có voucher hoạt động. Đề xuất dùng 'Vô hiệu hóa chi nhánh' thay thế.");
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
    setToastMessage("Yêu cầu xóa chi nhánh đã được gửi, đang chờ quản trị viên duyệt.");
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
            <h1 className="text-2xl font-bold text-gray-900">Quản lý chi nhánh</h1>
            <p className="text-sm text-gray-500 mt-1">
              Khai báo chi nhánh mới, chỉnh sửa thông tin hoặc yêu cầu đóng điểm bán hàng.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer shadow-xs"
          >
            <Plus size={16} /> Thêm chi nhánh mới
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("official")}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === "official"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            Chi nhánh chính thức ({activeBranches.length})
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === "requests"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            Yêu cầu thay đổi ({partnerRequests.length})
            {partnerRequests.some((r) => r.trang_thai === "Cho duyet") && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            )}
          </button>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm chi nhánh theo tên, địa chỉ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between mt-3">
            <p className="text-sm text-gray-500">{filteredBranches.length} chi nhánh</p>
          </div>
        </div>

        {/* Tab 1: Official Branches */}
        {activeTab === "official" && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
            {loading ? (
              <div className="p-12 text-center text-gray-400">Đang tải danh sách chi nhánh...</div>
            ) : filteredBranches.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-gray-400">
                <Building2 size={40} className="mb-2 text-gray-300" />
                <p className="text-sm">Không tìm thấy chi nhánh nào.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredBranches.map((branch) => {
                  const pendingReq = partnerRequests.find(
                    (r) => r.ma_chi_nhanh === branch.ma_chi_nhanh && r.trang_thai === "Cho duyet"
                  );

                  return (
                    <div key={branch.ma_chi_nhanh} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-bold text-gray-900 text-base">{branch.ten_chi_nhanh}</h4>
                          <Badge status={branch.trang_thai} size="sm" />
                          {pendingReq && pendingReq.loai_yeu_cau === "Cap nhat" && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              ● Chờ duyệt cập nhật
                            </span>
                          )}
                          {pendingReq && pendingReq.loai_yeu_cau === "Xoá" && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                              ● Chờ duyệt xóa
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 flex items-center gap-1">
                          <MapPin size={13} className="text-amber-500 shrink-0" />
                          {branch.dia_chi} ({branch.khu_vuc})
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(branch)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <Edit size={13} /> Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteClick(branch)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} /> Xóa
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Pending Branch Change Requests */}
        {activeTab === "requests" && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
            {loading ? (
              <div className="p-12 text-center text-gray-400">Đang tải danh sách yêu cầu...</div>
            ) : partnerRequests.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-gray-400">
                <Building2 size={40} className="mb-2 text-gray-300" />
                <p className="text-sm">Chưa có yêu cầu thay đổi chi nhánh nào.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {partnerRequests.map((req) => (
                  <div key={req.ma_yeu_cau} className="p-5 space-y-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded-md">
                          {req.loai_yeu_cau === "Them moi"
                            ? "Thêm mới chi nhánh"
                            : req.loai_yeu_cau === "Cap nhat"
                            ? "Cập nhật thông tin chi nhánh"
                            : "Yêu cầu xóa chi nhánh"}
                        </span>
                        <h4 className="font-bold text-gray-900">{req.ten_chi_nhanh}</h4>
                      </div>
                      <Badge status={req.trang_thai} />
                    </div>

                    <div className="text-xs text-gray-600 grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div><strong>Địa chỉ:</strong> {req.dia_chi} ({req.khu_vuc})</div>
                      <div><strong>Lý do gửi:</strong> {req.ly_do || "Khai báo thay đổi chi nhánh"}</div>
                      <div><strong>Thời gian gửi:</strong> {new Date(req.ngay_tao).toLocaleString("vi-VN")}</div>
                    </div>

                    {req.ghi_chu_admin && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 space-y-1">
                        <div className="font-bold">Ghi chú từ Admin Quản lý:</div>
                        <div>{req.ghi_chu_admin}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal Add New Branch Request */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onConfirm={handleAddBranchSubmit}
          title="Tạo Yêu Cầu Thêm Chi Nhánh Mới"
          confirmText="Gửi yêu cầu"
          cancelText="Hủy"
        >
          <div className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Tên chi nhánh <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Chi nhánh Quận 7"
                value={newBranchForm.ten_chi_nhanh}
                onChange={(e) => setNewBranchForm({ ...newBranchForm, ten_chi_nhanh: e.target.value })}
                className="w-full px-3.5 py-2 border rounded-lg text-sm border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Tỉnh / Thành Phố</label>
                <select
                  value={newBranchForm.khu_vuc}
                  onChange={(e) => setNewBranchForm({ ...newBranchForm, khu_vuc: e.target.value })}
                  className="w-full px-3.5 py-2 border rounded-lg text-sm border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Địa chỉ chi nhánh chi tiết <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Địa chỉ cụ thể"
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
          title="Cập Nhật Thông Tin Chi Nhánh"
          confirmText="Gửi yêu cầu"
          cancelText="Hủy"
        >
          <div className="space-y-4 text-left">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
              <strong>Lưu ý:</strong> Đề xuất cập nhật sẽ được lưu riêng biệt và gửi tới Quản trị viên duyệt. Thông tin hiện tại vẫn áp dụng cho tới khi có kết quả duyệt.
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Tên chi nhánh <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={editBranchForm.ten_chi_nhanh}
                onChange={(e) => setEditBranchForm({ ...editBranchForm, ten_chi_nhanh: e.target.value })}
                className="w-full px-3.5 py-2 border rounded-lg text-sm border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Tỉnh / Thành Phố</label>
              <select
                value={editBranchForm.khu_vuc}
                onChange={(e) => setEditBranchForm({ ...editBranchForm, khu_vuc: e.target.value })}
                className="w-full px-3.5 py-2 border rounded-lg text-sm border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Địa chỉ chi nhánh chi tiết <span className="text-rose-500">*</span>
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
            title="Xác Nhận Yêu Cầu Xóa Chi Nhánh"
            confirmText="Xác nhận gửi yêu cầu xóa"
            confirmVariant="danger"
            cancelText="Hủy"
          >
            <div className="space-y-3 text-left">
              <p className="text-sm text-gray-700">
                Gửi yêu cầu xóa chi nhánh <strong>"{selectedBranchForDelete.ten_chi_nhanh}"</strong> để quản trị viên duyệt?
              </p>
              <p className="text-xs text-slate-500 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                📌 Chi nhánh vẫn hoạt động bình thường cho đến khi có kết quả duyệt từ quản trị viên.
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