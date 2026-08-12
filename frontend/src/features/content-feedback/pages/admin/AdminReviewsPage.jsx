import { useState, useEffect, useCallback } from "react";
import { Star, Search, Filter, ArrowUpDown, Trash2, ShieldAlert, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { reviewApi } from "../../api/reviewApi";
import { ConfirmModal } from "../../components/ui/ConfirmModal";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await reviewApi.list();
      setReviews(res.data || []);
    } catch (err) {
      setError(err.message || "Không thể tải danh sách đánh giá");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  // Reset to page 1 on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, ratingFilter, sortBy]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await reviewApi.delete(deleteTarget.id);
      toast.success("Xóa đánh giá thành công!");
      setDeleteTarget(null);
      await loadReviews();
    } catch (err) {
      toast.error(err.message || "Không thể xóa đánh giá");
    }
  };

  // Filter and Sort logic
  const filtered = reviews.filter(r => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchComment = (r.comment || "").toLowerCase().includes(q);
      const matchId = (r.id || "").toLowerCase().includes(q);
      if (!matchComment && !matchId) return false;
    }
    if (ratingFilter !== "all") {
      if (r.rating !== parseInt(ratingFilter, 10)) return false;
    }
    return true;
  });

  filtered.sort((a, b) => {
    if (sortBy === "newest") return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    if (sortBy === "oldest") return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    if (sortBy === "highest") return (b.rating || 0) - (a.rating || 0);
    if (sortBy === "lowest") return (a.rating || 0) - (b.rating || 0);
    return 0;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedReviews = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Star className="text-amber-500 fill-amber-500" size={26} /> Quản lý Đánh giá
          </h1>
          <p className="text-sm text-gray-500 mt-1">Theo dõi, xem xét và kiểm duyệt đánh giá từ khách hàng.</p>
        </div>
        <button
          onClick={loadReviews}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 shadow-xs"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Làm mới
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="mb-6 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-[260px]">
          <Search size={16} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Tìm kiếm nội dung đánh giá hoặc mã..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-sm">
            <Filter size={14} className="text-gray-500" />
            <span className="text-gray-600 font-medium">Số sao:</span>
            <select 
              value={ratingFilter} 
              onChange={e => setRatingFilter(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:border-blue-500 font-medium text-gray-700"
            >
              <option value="all">Tất cả sao</option>
              <option value="5">5 sao ⭐⭐⭐⭐⭐</option>
              <option value="4">4 sao ⭐⭐⭐⭐</option>
              <option value="3">3 sao ⭐⭐⭐</option>
              <option value="2">2 sao ⭐⭐</option>
              <option value="1">1 sao ⭐</option>
            </select>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <ArrowUpDown size={14} className="text-gray-500" />
            <span className="text-gray-600 font-medium">Sắp xếp:</span>
            <select 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:border-blue-500 font-medium text-gray-700"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="highest">Điểm cao nhất</option>
              <option value="lowest">Điểm thấp nhất</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-24 text-gray-400 text-sm">Đang tải danh sách đánh giá...</div>
      ) : error ? (
        <div className="text-center py-24 text-red-500 text-sm">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
          <ShieldAlert size={40} className="mx-auto mb-2 text-gray-300" />
          <p className="text-sm font-medium">Không tìm thấy đánh giá nào phù hợp.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="p-4">Mã đánh giá</th>
                  <th className="p-4">Điểm số</th>
                  <th className="p-4">Nội dung đánh giá</th>
                  <th className="p-4">Mã lần mua voucher</th>
                  <th className="p-4">Ngày đánh giá</th>
                  <th className="p-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {paginatedReviews.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-mono text-xs font-bold text-gray-800">{r.id?.substring(0, 8)}...</td>
                    <td className="p-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 whitespace-nowrap">
                        <Star size={13} className="fill-amber-500 text-amber-500 flex-shrink-0" />
                        <span>{r.rating} / 5</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-700 max-w-md">
                      <p className="line-clamp-2">{r.comment || <span className="text-gray-400 italic">Không có bình luận</span>}</p>
                    </td>
                    <td className="p-4 font-mono text-xs text-gray-500">{r.voucherPurchaseId ? r.voucherPurchaseId.substring(0, 8) + '...' : '—'}</td>
                    <td className="p-4 text-xs text-gray-500">
                      {r.createdAt ? new Date(r.createdAt).toLocaleString('vi-VN') : '—'}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setDeleteTarget(r)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa đánh giá"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200">
              <div className="text-xs text-gray-500">
                Hiển thị {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filtered.length)} trên tổng số {filtered.length} kết quả
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 disabled:opacity-40 hover:bg-gray-50"
                >
                  Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold ${
                      currentPage === page
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 disabled:opacity-40 hover:bg-gray-50"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Xóa đánh giá"
        description="Bạn có chắc chắn muốn xóa đánh giá này không? Hành động này không thể hoàn tác."
        confirmLabel="Xóa"
        confirmVariant="danger"
      />
    </div>
  );
}
