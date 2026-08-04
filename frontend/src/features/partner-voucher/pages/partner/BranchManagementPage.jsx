import React, { useEffect, useState } from "react";
import PartnerLayout from "../../../../layouts/PartnerLayout";
import Card from "../../../../shared/components/Card";
import Button from "../../../../shared/components/Button";
import Badge from "../../../../shared/components/Badge";
import Modal from "../../../../shared/components/Modal";
import Toast from "../../../../shared/components/Toast";
import { getBranchesByPartnerApi, getBranchRequestsApi, createBranchRequestApi } from "../../../../shared/api/partnerApi";
import { mockStore } from "../../../../shared/store/mockDataStore";

export function BranchManagementPage() {
  const activePartner = mockStore.getActivePartner();
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

  const loadBranchesAndRequests = async () => {
    if (!activePartner?.ma_hs) return;
    setLoading(true);
    const [bData, rData] = await Promise.all([
      getBranchesByPartnerApi(activePartner.ma_hs),
      getBranchRequestsApi(activePartner.ma_hs),
    ]);
    setActiveBranches(bData || []);
    setPartnerRequests(rData || []);
    setLoading(false);
  };

  useEffect(() => {
    loadBranchesAndRequests();
  }, []);

  const handleAddBranchSubmit = async () => {
    if (!newBranchForm.ten_chi_nhanh.trim() || !newBranchForm.dia_chi.trim()) {
      alert("Vui lòng điền tên chi nhánh và địa chỉ!");
      return;
    }

    await createBranchRequestApi({
      ma_hs: activePartner.ma_hs,
      ten_dn: activePartner.ten_dn,
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
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Quản Lý Chi Nhánh</h2>
            <p className="text-sm text-slate-500 mt-1">
              Khai báo chi nhánh mới, chỉnh sửa thông tin hoặc yêu cầu đóng điểm bán hàng
            </p>
          </div>
          <Button variant="primary" icon="➕" onClick={() => setShowAddModal(true)}>
            Thêm chi nhánh mới
          </Button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-4 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("official")}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === "official"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Chi nhánh chính thức ({activeBranches.length})
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === "requests"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Yêu cầu thay đổi ({partnerRequests.length})
            {partnerRequests.some((r) => r.trang_thai === "Cho duyet") && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm chi nhánh theo tên, địa chỉ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-xs"
            />
            <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
          </div>
        </div>

        {/* Tab 1: Official Branches */}
        {activeTab === "official" && (
          <Card padding={false}>
            {loading ? (
              <div className="p-12 text-center text-slate-400">Đang tải danh sách chi nhánh...</div>
            ) : filteredBranches.length === 0 ? (
              <div className="p-12 text-center text-slate-400">Không tìm thấy chi nhánh nào.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredBranches.map((branch) => (
                  <div key={branch.ma_chi_nhanh} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold text-slate-900 text-base">{branch.ten_chi_nhanh}</h4>
                        <Badge status={branch.trang_thai} size="sm" />
                      </div>
                      <p className="text-xs text-slate-600">📍 {branch.dia_chi} ({branch.khu_vuc})</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => alert(`Yêu cầu chỉnh sửa chi nhánh ${branch.ten_chi_nhanh} đã được khởi tạo.`)}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-rose-600 hover:bg-rose-50"
                        onClick={() => alert(`Đã gửi yêu cầu đề nghị ngưng hoạt động chi nhánh ${branch.ten_chi_nhanh}`)}
                      >
                        Xoá
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Tab 2: Pending Branch Change Requests */}
        {activeTab === "requests" && (
          <Card padding={false}>
            {loading ? (
              <div className="p-12 text-center text-slate-400">Đang tải danh sách yêu cầu...</div>
            ) : partnerRequests.length === 0 ? (
              <div className="p-12 text-center text-slate-400">Chưa có yêu cầu thay đổi chi nhánh nào.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {partnerRequests.map((req) => (
                  <div key={req.ma_yeu_cau} className="p-6 space-y-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded">
                          {req.loai_yeu_cau === "Them moi" ? "Thêm mới chi nhánh" : req.loai_yeu_cau}
                        </span>
                        <h4 className="font-bold text-slate-900">{req.ten_chi_nhanh}</h4>
                      </div>
                      <Badge status={req.trang_thai} />
                    </div>

                    <div className="text-xs text-slate-600 grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
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
          </Card>
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tên chi nhánh <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Chi nhánh Quận 7"
                value={newBranchForm.ten_chi_nhanh}
                onChange={(e) => setNewBranchForm({ ...newBranchForm, ten_chi_nhanh: e.target.value })}
                className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tỉnh / Thành Phố</label>
                <select
                  value={newBranchForm.khu_vuc}
                  onChange={(e) => setNewBranchForm({ ...newBranchForm, khu_vuc: e.target.value })}
                  className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Địa chỉ chi nhánh chi tiết <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Địa chỉ cụ thể"
                value={newBranchForm.dia_chi}
                onChange={(e) => setNewBranchForm({ ...newBranchForm, dia_chi: e.target.value })}
                className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
