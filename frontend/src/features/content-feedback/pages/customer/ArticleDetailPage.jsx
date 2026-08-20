import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, BookOpen } from "lucide-react";
import { contentApi } from "../../api/contentApi";

export default function ArticleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    contentApi.getById(id)
      .then(res => {
        if (res && res.data) {
          setArticle(res.data);
        } else {
          setErrorMsg("Không tìm thấy bài viết.");
        }
      })
      .catch(() => setErrorMsg("Không thể tải bài viết."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="py-24 text-center text-gray-400">Đang tải bài viết...</div>;
  if (errorMsg || !article) return <div className="py-24 text-center text-red-500">{errorMsg || "Bài viết không tồn tại."}</div>;

  const imageUrl = article.imageUrl || article.hinh_anh_url;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-sky-600 mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Quay lại
      </button>

      <article className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
        {imageUrl && (
          <div className="w-full h-72 sm:h-96 overflow-hidden bg-gray-100">
            <img src={imageUrl} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-6 sm:p-10">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
            <span className="px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 font-semibold">Cẩm nang</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar size={13} /> {article.createdAt ? new Date(article.createdAt).toLocaleDateString("vi-VN") : ""}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 leading-tight">
            {article.title}
          </h1>

          <div 
            className="prose max-w-none text-gray-700 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </article>
    </div>
  );
}
