import { useFeedback } from '../../hooks/useFeedback';
import FeedbackForm from '../../components/FeedbackForm';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function CreateFeedbackPage({ voucherPurchaseId }) {
  const { create } = useFeedback();
  const navigate = useNavigate();

  const handleSubmitFeedback = async (feedbackData) => {
    try {
      // TODO: Replace 'VOUCHER_PURCHASE_ID_MOCK' with actual order/purchase ID
      await create({ ...feedbackData, ma_voucher_mua: voucherPurchaseId || 'VOUCHER_PURCHASE_ID_MOCK' });
      toast.success('Đã gửi phản ánh thành công!');
      navigate(-1); // Quay lại trang trước
    } catch (err) {
      toast.error('Có lỗi xảy ra khi gửi phản ánh.');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Gửi phản ánh / Khiếu nại</h2>
      <FeedbackForm 
        onSubmit={handleSubmitFeedback} 
        onCancel={() => navigate(-1)} 
      />
    </div>
  );
}
