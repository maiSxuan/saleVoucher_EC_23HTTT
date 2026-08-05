import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Search, X, Eye, CheckCircle, XCircle } from "lucide-react";
import Toast from "../../../../shared/components/Toast";
import Modal from "../../../../shared/components/Modal";
import {
  getPartnersApi,
  approvePartnerApi,
  rejectPartnerApi,
} from "../../../../shared/api/partnerApi";

export function PartnerManagementPage() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  // Modals state
  const [selectedPartnerForReject, setSelectedPartnerForReject] = useState(null);
  const [rejectReason, setRejectReason] = useState("Giấy phép kinh doanh không hợp lệ");

  // Filters state matching Voucher Approval Page design
  const [searchTenDn, setSearchTenDn] = useState("");
  const [searchMst, setSearchMst] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("ALL");
  const [filterPendingBranchReqs, setFilterPendingBranchReqs] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getPartnersApi();
      setPartners(data || []);
    } catch (e) {
      console.error("Error loading partners:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleResetFilters = () => {
    setSearchTenDn("");
    setSearchMst("");
    setSelectedStatusFilter("ALL");
    setFilterPendingBranchReqs(false);
  };

  const handleApproveInline = async (partnerId) => {
    setLoading(true);
    try {
      await approvePartnerApi(partnerId);
      setToastMessage("Đã phê duyệt đối tác thành công!");
      await loadData();
    } catch (e) {
      setToastMessage("Phê duyệt thất bại: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectConfirm = async () => {
    if (!selectedPartnerForReject) return;
    setLoading(true);
    try {
      await rejectPartnerApi(selectedPartnerForReject.ma_hs, rejectReason);
      setSelectedPartnerForReject(null);
      setToastMessage("Đã từ chối hồ sơ đối tác.");
      await loadData();
    } catch (e) {
      setToastMessage("Từ chối thất bại: " + e.message);
    } finally {
      setLoading(false);
    }
  };

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

  const filteredPartners = partners.filter((p) => {
    const matchesTenDn = (p.ten_dn || "").toLowerCase().includes(searchTenDn.toLowerCase());
    const matchesMst = (p.ma_so_thue || "").toLowerCase().includes(searchMst.toLowerCase());

    const matchesStatus =
      selectedStatusFilter === "ALL"
        ? true
        : selectedStatusFilter === "Da duyet"
          ? p.trang_thai === "Dang hoat dong" || p.trang_thai === "Hoat dong" || p.trang_thai === "Da duyet"
          : p.trang_thai === selectedStatusFilter;

    const pendingReqCount = p.pending_branch_requests || (p.trang_thai === "Cho duyet" ? 1 : 0);
    const matchesBranchReqFilter = !filterPendingBranchReqs || pendingReqCount > 0;

    return matchesTenDn && matchesMst && matchesStatus && matchesBranchReqFilter;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5">
      {/* Title */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đối tác</h1>
        <p className="text-sm text-gray-500 mt-1">Kiểm tra, duyệt và quản lý hồ sơ đối tác do doanh nghiệp gửi.</p>
      </div>

      {/* Filters matching Duyệt voucher page 100% */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tên doanh nghiệp..."
              value={searchTenDn}
              onChange={(e) => setSearchTenDn(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Mã số thuế..."
              value={searchMst}
              onChange={(e) => setSearchMst(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="Cho duyet">Chờ duyệt</option>
            <option value="Da duyet">Đã duyệt</option>
            <option value="Tu choi">Bị từ chối</option>
            <option value="Tam khoa">Bị khóa</option>
          </select>

          <label className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 cursor-pointer bg-white">
            <input
              type="checkbox"
              id="pending-branch-reqs"
              checked={filterPendingBranchReqs}
              onChange={(e) => setFilterPendingBranchReqs(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-xs text-gray-600 truncate">Yêu cầu chi nhánh chờ xử lý</span>
          </label>
        </div>

        <div className="flex items-center justify-between mt-3">
          <p className="text-sm text-gray-500">{filteredPartners.length} đối tác</p>
          <button
            onClick={handleResetFilters}
            className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 cursor-pointer"
          >
            <X size={14} /> Đặt lại
          </button>
        </div>
      </div>

      {/* Partner Table matching Voucher Approval Page */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Đang tải danh sách đối tác...</div>
        ) : filteredPartners.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-slate-400">
            <Building2 size={40} className="mb-2 text-slate-300" />
            <p className="text-sm">Không tìm thấy đối tác nào phù hợp</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-3.5 py-3">Tên doanh nghiệp</th>
                  <th className="px-3.5 py-3">Mã số thuế</th>
                  <th className="px-3.5 py-3">Người đại diện</th>
                  <th className="px-3.5 py-3 text-center">Chi nhánh</th>
                  <th className="px-3.5 py-3">Trạng thái hồ sơ</th>
                  <th className="px-3.5 py-3">Yêu cầu chờ</th>
                  <th className="px-3.5 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredPartners.map((partner) => {
                  const pendingReqs = partner.pending_branch_requests || (partner.trang_thai === "Cho duyet" ? 1 : 0);
                  const branchCount = partner.branches?.length || 0;
                  const sb = getPartnerStatusBadge(partner.trang_thai);

                  return (
                    <tr key={partner.ma_hs} className="hover:bg-slate-50 transition-colors">
                      {/* Tên doanh nghiệp with Building Icon */}
                      <td className="px-3.5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0 border border-blue-100">
                            <Building2 size={16} />
                          </div>
                          <div>
                            <Link
                              to={`/admin/partners/${partner.ma_hs}`}
                              className="font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1"
                            >
                              {partner.ten_dn}
                            </Link>
                            <div className="text-xs text-slate-400">
                              Đăng ký: {partner.ngay_tao ? partner.ngay_tao.slice(0, 10) : "2025-10-21"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Mã số thuế */}
                      <td className="px-3.5 py-3.5 font-mono text-xs text-slate-700 font-medium">
                        {partner.ma_so_thue || "---"}
                      </td>

                      {/* Người đại diện */}
                      <td className="px-3.5 py-3.5">
                        <div className="font-medium text-slate-800">{partner.nguoi_dai_dien?.ho_ten || "---"}</div>
                        <div className="text-xs text-slate-400">{partner.nguoi_dai_dien?.sdt || partner.nguoi_dai_dien?.email || ""}</div>
                      </td>

                      {/* Chi nhánh */}
                      <td className="px-3.5 py-3.5 text-center font-semibold text-slate-700">{branchCount}</td>

                      {/* Trạng thái hồ sơ */}
                      <td className="px-3.5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${sb.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sb.dot}`} />
                          {sb.label}
                        </span>
                      </td>

                      {/* Yêu cầu chờ */}
                      <td className="px-3.5 py-3.5">
                        {pendingReqs > 0 ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            {pendingReqs} yêu cầu
                          </span>
                        ) : (
                          <span className="text-slate-300 font-medium">—</span>
                        )}
                      </td>

                      {/* Action Link: Only Chi tiết */}
                      <td className="px-3.5 py-3.5 text-right whitespace-nowrap">
                        <Link
                          to={`/admin/partners/${partner.ma_hs}`}
                          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-semibold hover:bg-blue-50 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          <Eye size={14} /> Chi tiết
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {selectedPartnerForReject && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedPartnerForReject(null)}
          onConfirm={handleRejectConfirm}
          title="Từ Chối Hồ Sơ Đối Tác"
          confirmText="Xác nhận từ chối"
          confirmVariant="danger"
        >
          <div className="space-y-4 text-left">
            <p className="text-xs text-rose-700 font-semibold">
              Đối tác: <strong>{selectedPartnerForReject.ten_dn}</strong>
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả lý do từ chối:</label>
              <textarea
                rows="3"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-sm border-slate-300 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              ></textarea>
            </div>
          </div>
        </Modal>
      )}

      <Toast message={toastMessage} onClose={() => setToastMessage("")} />
    </div>
  );
}

export default PartnerManagementPage;
