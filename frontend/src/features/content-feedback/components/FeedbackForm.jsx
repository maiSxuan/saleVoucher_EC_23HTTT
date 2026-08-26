import { useState } from "react";
import { X } from "lucide-react";

export default function FeedbackForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
}) {
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) {
      alert("Vui lòng nhập nội dung khiếu nại.");
      return;
    }
    onSubmit({ noi_dung: content });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900">Gửi khiếu nại</h3>
          <button onClick={onCancel} disabled={isSubmitting}>
            <X size={20} className="text-gray-400" />
          </button>
        </div>
        <textarea
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Mô tả vấn đề bạn gặp phải..."
          className="w-full border border-gray-200 rounded-xl p-3 text-sm mb-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-sky-500 text-white py-2 rounded-lg font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Đang gửi..." : "Gửi khiếu nại"}
        </button>
      </div>
    </div>
  );
}
