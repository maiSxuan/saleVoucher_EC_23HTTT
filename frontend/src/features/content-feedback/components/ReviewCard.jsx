import { Star } from "lucide-react";

export default function ReviewCard({ review }) {
  if (!review) return null;
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
      <div className="flex items-center gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={16} className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
        ))}
        <span className="ml-2 text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
      </div>
      <p className="text-sm text-gray-700">{review.comment}</p>
      <div className="mt-2 text-[10px] text-gray-400">User ID: {review.userId}</div>
    </div>
  );
}
