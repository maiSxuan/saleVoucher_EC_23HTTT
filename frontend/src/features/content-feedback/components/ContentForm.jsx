import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import TiptapEditor from './TiptapEditor';

export default function ContentForm({ initialData, onSubmit, onCancel, contentType = 'banner' }) {
  const [formData, setFormData] = useState(initialData || { title: '', content: '', imageUrl: initialData?.imageUrl || initialData?.hinh_anh_url || '' });
  const [uploading, setUploading] = useState(false);

  // Helper resize image client-side before upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let maxWidth = 1200;
        let maxHeight = 400;

        if (contentType === 'popup') {
          maxWidth = 600;
          maxHeight = 600;
        } else if (contentType === 'bai_viet' || contentType === 'chinh_sach') {
          maxWidth = 900;
          maxHeight = 600;
        }

        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setFormData(prev => ({ ...prev, imageUrl: dataUrl }));
        setUploading(false);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/30">
      <div className="w-full max-w-2xl bg-white shadow-2xl p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-5 border-b pb-3">
          <h3 className="font-bold text-lg text-gray-950">
            {initialData ? 'Chỉnh sửa' : 'Tạo mới'} {contentType === 'danh_muc' ? 'Danh mục' : contentType === 'bai_viet' ? 'Bài viết' : 'Nội dung'}
          </h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {contentType === 'danh_muc' ? 'Tên danh mục' : 'Tiêu đề'}
            </label>
            <input 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              placeholder={contentType === 'danh_muc' ? 'Nhập tên danh mục...' : 'Nhập tiêu đề...'} 
              className="w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-blue-500" 
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-gray-700">
                {contentType === 'danh_muc' ? 'Mô tả' : 'Nội dung chi tiết'}
              </label>
              {(contentType === 'bai_viet' || contentType === 'chinh_sach') && (
                <span className="text-[10px] text-blue-600 font-medium">Sử dụng Tiptap Rich Text Editor</span>
              )}
            </div>

            {contentType === 'bai_viet' || contentType === 'chinh_sach' ? (
              <TiptapEditor 
                content={formData.content} 
                onChange={(html) => setFormData(prev => ({ ...prev, content: html }))} 
              />
            ) : (
              <textarea 
                value={formData.content} 
                onChange={e => setFormData({...formData, content: e.target.value})} 
                placeholder={contentType === 'danh_muc' ? 'Nhập mô tả danh mục...' : 'Nhập nội dung...'} 
                className="w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-blue-500" 
                rows={6}
              />
            )}
          </div>

          {/* Image upload field - Ẩn đối với danh_muc */}
          {contentType !== 'danh_muc' && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Hình ảnh minh họa (Tùy chọn — Tự động căn chỉnh kích thước)
              </label>
              <div className="flex items-center gap-3">
                <label className="flex-1 border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-blue-500 transition-colors bg-gray-50/50">
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  <div className="flex flex-col items-center gap-1 text-xs text-gray-500">
                    <Upload size={18} className="text-blue-500" />
                    <span className="font-medium text-gray-700">{uploading ? 'Đang xử lý ảnh...' : 'Tải lên tệp ảnh'}</span>
                    <span className="text-[10px] text-gray-400">PNG, JPG, WEBP</span>
                  </div>
                </label>
                {formData.imageUrl && (
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0 bg-gray-100">
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 shadow hover:bg-red-700"
                      title="Xóa ảnh"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-2.5 pt-4 border-t">
            <button type="submit" className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-xs">Lưu lại</button>
            <button type="button" onClick={onCancel} className="px-4 py-2.5 border border-gray-300 hover:bg-gray-50 font-medium rounded-xl text-sm text-gray-700 transition-colors">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
}
