import { useReview } from '../../hooks/useReview';
import ReviewForm from '../../components/ReviewForm';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function CreateReviewPage({ voucherPurchaseId }) {
  const { t } = useTranslation();
  const { create } = useReview();
  const navigate = useNavigate();

  const handleSubmitReview = async (reviewData) => {
    try {
      // TODO: Replace 'VOUCHER_PURCHASE_ID_MOCK'
      await create({ ...reviewData, ma_voucher_mua: voucherPurchaseId || 'VOUCHER_PURCHASE_ID_MOCK' });
      toast.success('Đã gửi đánh giá thành công!');
      navigate(-1);
    } catch (err) {
      toast.error('Có lỗi xảy ra khi gửi đánh giá.');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">{t("review.writeReview", "Viết đánh giá")}</h2>
      <ReviewForm 
        onSubmit={handleSubmitReview} 
        onCancel={() => navigate(-1)} 
      />
    </div>
  );
}
