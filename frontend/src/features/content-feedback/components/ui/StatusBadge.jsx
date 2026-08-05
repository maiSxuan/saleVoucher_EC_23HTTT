export function StatusBadge({ label, color }) {
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{label}</span>;
}

export function getContentStatusBadge(status) {
  switch (status) {
    case 'visible': return { label: 'Hiển thị', color: 'bg-green-100 text-green-800' };
    case 'hidden': return { label: 'Tạm ẩn', color: 'bg-amber-100 text-amber-800' };
    case 'stopped': return { label: 'Ngừng', color: 'bg-red-100 text-red-800' };
    default: return { label: status, color: 'bg-gray-100 text-gray-800' };
  }
}
