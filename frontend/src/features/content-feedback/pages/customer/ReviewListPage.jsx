import { useState } from 'react';
import { useReview } from '../../hooks/useReview';
import ReviewCard from '../../components/ReviewCard';
import ReviewForm from '../../components/ReviewForm';
import { toast } from 'sonner';

export default function ReviewListPage({ voucherPurchaseId = 'VOUCHER_ID_MOCK' }) {
  const { data: reviews, loading, error, create } = useReview();
  const [showReviewModal, setShowReviewModal] = useState(false);

  const handleSubmitReview = async (reviewData) => {
    try {
      await create({ 
        ...reviewData, 
        ma_voucher_mua: voucherPurchaseId 
      });
      setShowReviewModal(false);
      toast.success('Đã gửi đánh giá thành công!');
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi xảy ra khi gửi đánh giá.');
    }
  };

  if (loading) return <div>Đang tải đánh giá...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Đánh giá sản phẩm</h2>
        <button 
          onClick={() => setShowReviewModal(true)}
          className="bg-sky-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-sky-600"
        >
          Viết đánh giá
        </button>
      </div>

      <div className="grid gap-4">
        {reviews && reviews.length > 0 ? (
          reviews.map(review => <ReviewCard key={review.id} review={review} />)
        ) : (
          <p className="text-gray-500 text-sm">Chưa có đánh giá nào.</p>
        )}
      </div>

      {showReviewModal && (
        <ReviewForm 
          onSubmit={handleSubmitReview} 
          onCancel={() => setShowReviewModal(false)} 
        />
      )}
    </div>
  );
}
