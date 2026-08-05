import React, { useEffect, useState } from "react";
import { Plus, Search, X, MapPin, Building2, Edit, Trash2 } from "lucide-react";
import PartnerLayout from "../../../../layouts/PartnerLayout";
import Badge from "../../../../shared/components/Badge";
import Modal from "../../../../shared/components/Modal";
import Toast from "../../../../shared/components/Toast";
import { getBranchesByPartnerApi, getBranchRequestsApi, createBranchRequestApi } from "../../../../shared/api/partnerApi";

export function BranchManagementPage() {
  const [activeBranches, setActiveBranches] = useState([]);
  const [partnerRequests, setPartnerRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("official");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [newBranchForm, setNewBranchForm] = useState({
    ten_chi_nhanh: "",
    khu_vuc: "TP. Hồ Chí Minh",
    dia_chi: "",
    sdt: "",
    gio_mo_cua: "08:00 - 22:00",
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

  const loadBranchesAndRequests = async () => {
    setLoading(true);
    const partnerId = getLoggedInPartnerId();
    const [bData, rData] = await Promise.all([
      getBranchesByPartnerApi(partnerId),
      getBranchRequestsApi(partnerId),
    ]);
    setActiveBranches(bData || []);
    setPartnerRequests(rData || []);
    setLoading(false);
  };

  useEffect(() => {
    loadBranchesAndRequests();
  }, []);

  const handleResetFilters = () => {
    setSearchQuery("");
  };

  const handleAddBranchSubmit = async () => {
    if (!newBranchForm.ten_chi_nhanh.trim() || !newBranchForm.dia_chi.trim()) {
      alert("Vui lòng điền tên chi nhánh và địa chỉ!");
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
      sdt: "",
      gio_mo_cua: "08:00 - 22:00",
      ly_do: "",
    });

    setToastMessage("Yêu cầu thêm chi nhánh mới đã được gửi tới Quản trị viên!");
    await loadBranchesAndRequests();
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

        {/* Filters Bar matching prototype */}
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
            <button
              onClick={handleResetFilters}
              className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 cursor-pointer"
            >
              <X size={14} /> Đặt lại
            </button>
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
                {filteredBranches.map((branch) => (
                  <div key={branch.ma_chi_nhanh} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold text-gray-900 text-base">{branch.ten_chi_nhanh}</h4>
                        <Badge status={branch.trang_thai} size="sm" />
                      </div>
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <MapPin size={13} className="text-amber-500 shrink-0" />
                        {branch.dia_chi} ({branch.khu_vuc})
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => alert(`Yêu cầu chỉnh sửa chi nhánh ${branch.ten_chi_nhanh} đã được khởi tạo.`)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <Edit size={13} /> Sửa
                      </button>
                      <button
                        onClick={() => alert(`Đã gửi yêu cầu đề nghị ngưng hoạt động chi nhánh ${branch.ten_chi_nhanh}`)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 size={13} /> Xóa
                      </button>
                    </div>
                  </div>
                ))}
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
                          {req.loai_yeu_cau === "Them moi" ? "Thêm mới chi nhánh" : req.loai_yeu_cau}
                        </span>
                        <h4 className="font-bold text-gray-900">{req.ten_chi_nhanh}</h4>
                      </div>
                      <Badge status={req.trang_thai} />
                    </div>

                    <div className="text-xs text-gray-600 grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div><strong>Địa chỉ:</strong> {req.dia_chi} ({req.khu_vuc})</div>
                      <div><strong>Lý do gửi:</strong> {req.ly_do || "Khai báo điểm bán hàng mới"}</div>
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
                  className="w-full px-3.5 py-2 border rounded-lg text-sm border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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

        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      </div>
    </PartnerLayout>
  );
}

export default BranchManagementPage;