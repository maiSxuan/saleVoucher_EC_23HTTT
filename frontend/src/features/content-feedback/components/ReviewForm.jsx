import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ReviewForm({ onSubmit, onCancel }) {
  const { t } = useTranslation();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    // Sử dụng ma_tk (dùng cho khóa ngoại bảng danhgia) hoặc ma_nguoi_dung
    const userId = user?.ma_nguoi_dung || user?.id;
    
    if (!userId) {
      alert(t("Không tìm thấy thông tin tài khoản."));
      return;
    }
    
    onSubmit({ diem: rating, noi_dung: comment, ma_nguoi_dung: userId });
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900">{t("Viết đánh giá")}</h3>
          <button onClick={onCancel}><X size={20} className="text-gray-400" /></button>
        </div>
        <div className="flex items-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => setRating(star)}>
              <Star size={24} className={star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
            </button>
          ))}
        </div>
        <textarea 
          rows={4} 
          value={comment} 
          onChange={e => setComment(e.target.value)}
          placeholder={t("Nhận xét về trải nghiệm...")}
          className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={handleSubmit} className="w-full bg-sky-500 text-white py-2 rounded-lg font-semibold text-sm">{t("Gửi đánh giá")}</button>
      </div>
    </div>
  );
}
