import { useState } from 'react';
import { X } from 'lucide-react';

export default function ContentForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(initialData || { title: '', content: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/30">
      <div className="w-full max-w-lg bg-white shadow-2xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">{initialData ? 'Chỉnh sửa' : 'Tạo mới'}</h3>
          <button onClick={onCancel}><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            value={formData.title} 
            onChange={e => setFormData({...formData, title: e.target.value})} 
            placeholder="Tiêu đề..." className="w-full border rounded-lg px-3 py-2" 
          />
          <textarea 
            value={formData.content} 
            onChange={e => setFormData({...formData, content: e.target.value})} 
            placeholder="Nội dung..." className="w-full border rounded-lg px-3 py-2" rows={6}
          />
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Lưu</button>
            <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-lg">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
}
