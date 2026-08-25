import { Edit2, Eye, EyeOff, StopCircle, Trash2, Image as ImageIcon } from "lucide-react";
import { StatusBadge, getContentStatusBadge } from "./ui/StatusBadge";

export default function ContentTable({ items, onEdit, onHide, onShow, onStop, onDelete, contentType }) {
  if (items.length === 0) return <div className="py-16 text-center text-gray-400 text-sm">Chưa có dữ liệu.</div>;

  const showImage = true;

  return (
    <table className="w-full">
      <thead>
        <tr className="bg-gray-50 border-b">
          <th className="px-4 py-3 text-left text-xs font-semibold">Tiêu đề / Tên</th>
          {showImage && <th className="px-4 py-3 text-left text-xs font-semibold">Hình ảnh</th>}
          <th className="px-4 py-3 text-left text-xs font-semibold">Mô tả / Chi tiết</th>
          <th className="px-4 py-3 text-left text-xs font-semibold">Trạng thái</th>
          <th className="px-4 py-3 text-left text-xs font-semibold">Hành động</th>
        </tr>
      </thead>
      <tbody className="divide-y">
        {items.map(item => (
          <tr key={item.id} className="hover:bg-gray-50">
            <td className="px-4 py-3 text-sm font-medium">
              {item.type === 'danh_gia' ? (
                <div className="flex items-center gap-1.5 font-semibold text-amber-600">
                  <span>★</span> {item.title} ({item.rating}/5 sao)
                </div>
              ) : (
                item.title
              )}
            </td>
            {showImage && (
              <td className="px-4 py-3">
                {(item.imageUrl || item.hinh_anh_url) ? (
                  <img src={item.imageUrl || item.hinh_anh_url} alt="Thumbnail" className="w-12 h-9 object-cover rounded-lg border border-gray-200 shadow-xs" />
                ) : (
                  <span className="text-xs text-gray-400 italic">Không có</span>
                )}
              </td>
            )}
            <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{item.content || item.description}</td>
            <td className="px-4 py-3">
              {item.type === 'danh_muc' ? (
                <span className="px-2 py-0.5 text-xs rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">Hoạt động</span>
              ) : item.type === 'danh_gia' ? (
                <span className="px-2 py-0.5 text-xs rounded-full bg-rose-50 text-rose-700 border border-rose-200">Đánh giá</span>
              ) : (
                <StatusBadge {...getContentStatusBadge(item.status)} />
              )}
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-1">
                {item.type !== 'danh_gia' && (
                  <button onClick={() => onEdit(item)} className="p-1.5 text-gray-400 hover:text-blue-600" title="Chỉnh sửa"><Edit2 size={14} /></button>
                )}
                {item.type === 'danh_gia' ? (
                  <button onClick={() => onDelete && onDelete(item)} className="p-1.5 text-gray-400 hover:text-red-600" title="Xóa"><Trash2 size={14} /></button>
                ) : item.type !== 'danh_muc' ? (
                  <>
                    {item.status !== 'hidden' && item.status !== 'stopped' && <button onClick={() => onHide(item)} className="p-1.5 text-gray-400 hover:text-sky-600" title="Tạm ẩn"><EyeOff size={14} /></button>}
                    {item.status === 'hidden' && <button onClick={() => onShow(item)} className="p-1.5 text-gray-400 hover:text-green-600" title="Hiển thị"><Eye size={14} /></button>}
                    {item.status !== 'stopped' && <button onClick={() => onStop(item)} className="p-1.5 text-gray-400 hover:text-red-600" title="Ngừng"><StopCircle size={14} /></button>}
                  </>
                ) : (
                  <button onClick={() => onDelete && onDelete(item)} className="p-1.5 text-gray-400 hover:text-red-600" title="Xóa"><Trash2 size={14} /></button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
