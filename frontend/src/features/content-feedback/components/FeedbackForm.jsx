import { useState } from 'react';
import { X } from 'lucide-react';

export default function FeedbackForm({ onSubmit, onCancel }) {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: ma_tk_xuly currently hardcoded for a dummy admin. 
    // In production, this should be handled by backend automatically based on role.
    onSubmit({ noi_dung: content, ma_tk_xuly: '00000000-0000-0000-0000-000000000000' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900">Gửi khiếu nại</h3>
          <button onClick={onCancel}><X size={20} className="text-gray-400" /></button>
        </div>
        <textarea 
          rows={4} 
          value={content} 
          onChange={e => setContent(e.target.value)}
          placeholder="Mô tả vấn đề bạn gặp phải..."
          className="w-full border border-gray-200 rounded-xl p-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
        <button onClick={handleSubmit} className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold text-sm">Gửi khiếu nại</button>
      </div>
    </div>
  );
}
