export function ConfirmModal({ open, onClose, onConfirm, title, description, confirmLabel, confirmVariant = 'primary' }) {
  if (!open) return null;
  
  const buttonClass = confirmVariant === 'danger' 
    ? 'bg-red-600 text-white hover:bg-red-700' 
    : 'bg-blue-600 text-white hover:bg-blue-700';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-2">{description}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Hủy</button>
          <button onClick={async () => {
            await onConfirm();
          }} className={`px-4 py-2 rounded-lg text-sm ${buttonClass}`}>{confirmLabel || 'Xác nhận'}</button>
        </div>
      </div>
    </div>
  );
}
