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

const SESSION_KEY = "ec_admin_partner_management_list_state_v1";

const getSavedState = () => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
};

export function PartnerManagementPage() {
  const savedState = getSavedState();

  const [partners, setPartners] = useState(savedState?.cachedPartners || []);
  const [loading, setLoading] = useState(!savedState?.cachedPartners || savedState.cachedPartners.length === 0);
  const [toastMessage, setToastMessage] = useState("");

  // Modals state
  const [selectedPartnerForReject, setSelectedPartnerForReject] = useState(null);
  const [rejectReason, setRejectReason] = useState("Giấy phép kinh doanh không hợp lệ");

  // Filters state matching Voucher Approval Page design
  const [searchTenDn, setSearchTenDn] = useState(savedState?.searchTenDn || "");
  const [searchMst, setSearchMst] = useState(savedState?.searchMst || "");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState(savedState?.selectedStatusFilter || "ALL");
  const [filterPendingBranchReqs, setFilterPendingBranchReqs] = useState(savedState?.filterPendingBranchReqs || false);

  // Pagination state
  const [page, setPage] = useState(savedState?.page || 1);
  const limit = 10;

  useEffect(() => {
    setPage(1);
  }, [searchTenDn, searchMst, selectedStatusFilter, filterPendingBranchReqs]);

  const loadData = async () => {
    if (!savedState?.cachedPartners) setLoading(true);
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
    try {
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          searchTenDn,
          searchMst,
          selectedStatusFilter,
          filterPendingBranchReqs,
          cachedPartners: partners,
        })
      );
    } catch (e) {}
  }, [searchTenDn, searchMst, selectedStatusFilter, filterPendingBranchReqs, partners]);

  useEffect(() => {
    loadData();
  }, []);

  const handleResetFilters = () => {
    setSearchTenDn("");
    setSearchMst("");
    setSelectedStatusFilter("ALL");
    setFilterPendingBranchReqs(false);
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch (e) {}
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

    const pendingReqCount = Number(p.pending_branch_requests) || 0;
    const matchesBranchReqFilter = !filterPendingBranchReqs || pendingReqCount > 0;

    return matchesTenDn && matchesMst && matchesStatus && matchesBranchReqFilter;
  });

  const totalPartners = filteredPartners.length;
  const totalPages = Math.ceil(totalPartners / limit) || 1;
  const paginatedPartners = filteredPartners.slice((page - 1) * limit, page * limit);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5">
      {/* Title */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đối tác</h1>
        <p className="text-sm text-gray-500 mt-1">Kiểm tra, duyệt và quản lý hồ sơ đối tác do doanh nghiệp gửi.</p>
      </div>

      {/* Filters matching Voucher Approval Page design */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tên doanh nghiệp..."
              value={searchTenDn}
              onChange={(e) => setSearchTenDn(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
            />
          </div>

          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Mã số thuế..."
              value={searchMst}
              onChange={(e) => setSearchMst(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
            />
          </div>

          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 font-medium"
          >
            <option value="ALL">Tất cả trạng thái hồ sơ</option>
            <option value="Cho duyet">Chờ duyệt</option>
            <option value="Da duyet">Đang hoạt động</option>
            <option value="Tu choi">Bị từ chối</option>
            <option value="Tam khoa">Tạm khóa</option>
          </select>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors select-none">
            <input
              type="checkbox"
              id="pending-branch-reqs"
              checked={filterPendingBranchReqs}
              onChange={(e) => setFilterPendingBranchReqs(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
            />
            <span>Có yêu cầu chờ duyệt</span>
          </label>
        </div>

        {(searchTenDn || searchMst || selectedStatusFilter !== "ALL" || filterPendingBranchReqs) && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Đang lọc ra {totalPartners} kết quả</span>
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
            >
              <X size={14} /> Xóa bộ lọc
            </button>
          </div>
        )}
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
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="px-3.5 py-3">Doanh nghiệp</th>
                    <th className="px-3.5 py-3">MST</th>
                    <th className="px-3.5 py-3">Người đại diện</th>
                    <th className="px-3.5 py-3 text-center">Chi nhánh</th>
                    <th className="px-3.5 py-3">Trạng thái hồ sơ</th>
                    <th className="px-3.5 py-3">Yêu cầu chờ</th>
                    <th className="px-3.5 py-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {paginatedPartners.map((partner) => {
                    const pendingReqs = Number(partner.pending_branch_requests) || 0;
                    const branchCount = partner.branches?.length || 0;
                    const sb = getPartnerStatusBadge(partner.trang_thai);

                    return (
                      <tr key={partner.ma_hs} className="hover:bg-slate-50 transition-colors">
                        {/* Tên doanh nghiệp with Partner Logo / Icon */}
                        <td className="px-3.5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0 border border-blue-100 overflow-hidden relative">
                              {partner.logo ? (
                                <img
                                  src={partner.logo}
                                  alt={partner.ten_dn}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              ) : (
                                <Building2 size={16} />
                              )}
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

            {/* Phân trang */}
            {totalPartners > 0 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50 text-sm">
                <p className="text-xs text-gray-600">
                  Trang {page} / {totalPages} (Tổng {totalPartners} đối tác)
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-3 py-1 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 disabled:opacity-40 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Trước
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="px-3 py-1 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 disabled:opacity-40 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
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
