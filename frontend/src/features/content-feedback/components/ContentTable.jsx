import { Edit2, Eye, EyeOff, StopCircle } from "lucide-react";
import { StatusBadge, getContentStatusBadge } from "./ui/StatusBadge";

export default function ContentTable({ items, onEdit, onHide, onShow, onStop }) {
  if (items.length === 0) return <div className="py-16 text-center text-gray-400 text-sm">Chưa có nội dung.</div>;

  return (
    <table className="w-full">
      <thead>
        <tr className="bg-gray-50 border-b">
          {['Tiêu đề', 'Trạng thái', 'Hành động'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold">{h}</th>)}
        </tr>
      </thead>
      <tbody className="divide-y">
        {items.map(item => (
          <tr key={item.id} className="hover:bg-gray-50">
            <td className="px-4 py-3 text-sm font-medium">{item.title}</td>
            <td className="px-4 py-3"><StatusBadge {...getContentStatusBadge(item.status)} /></td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-1">
                <button onClick={() => onEdit(item)} className="p-1.5 text-gray-400 hover:text-blue-600"><Edit2 size={14} /></button>
                {item.status !== 'hidden' && item.status !== 'stopped' && <button onClick={() => onHide(item)} className="p-1.5 text-gray-400 hover:text-amber-600"><EyeOff size={14} /></button>}
                {item.status === 'hidden' && <button onClick={() => onShow(item)} className="p-1.5 text-gray-400 hover:text-green-600"><Eye size={14} /></button>}
                {item.status !== 'stopped' && <button onClick={() => onStop(item)} className="p-1.5 text-gray-400 hover:text-red-600"><StopCircle size={14} /></button>}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
