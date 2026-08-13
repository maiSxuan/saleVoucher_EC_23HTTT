import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  ArrowLeft,
  FileText,
  Clock,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Lock,
  RefreshCw,
  HelpCircle,
  LogIn,
  User,
  Sparkles,
} from "lucide-react";
import { contentApi } from "../../../content-feedback/api/contentApi";

// Inline Markdown parser for **bold**, *italic*, `code`, [link](url)
function parseInlineMarkdown(str) {
  if (!str) return "";

  const parts = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let key = 0;
  let match;

  while ((match = pattern.exec(str)) !== null) {
    if (match.index > lastIndex) {
      parts.push(str.substring(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(<strong key={key++} className="font-extrabold text-slate-900">{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("*") && token.endsWith("*")) {
      parts.push(<em key={key++} className="italic text-slate-800">{token.slice(1, -1)}</em>);
    } else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(<code key={key++} className="bg-slate-100 text-cyan-800 px-1.5 py-0.5 rounded text-xs font-mono">{token.slice(1, -1)}</code>);
    } else if (token.startsWith("[") && token.includes("](")) {
      const linkText = token.substring(1, token.indexOf("]"));
      const linkUrl = token.substring(token.indexOf("(") + 1, token.length - 1);
      parts.push(
        <a key={key++} href={linkUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:text-cyan-700 underline font-semibold">
          {linkText}
        </a>
      );
    } else {
      parts.push(token);
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < str.length) {
    parts.push(str.substring(lastIndex));
  }

  return parts.length === 1 ? parts[0] : parts;
}

// Markdown & HTML renderer function
function renderFormattedContent(text) {
  if (!text || typeof text !== "string") return null;

  // If text is already HTML format
  if (/<[a-z][\s\S]*>/i.test(text)) {
    return (
      <div
        className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed space-y-3"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    );
  }

  // Parse Markdown lines
  const lines = text.split("\n");
  const elements = [];
  let listItems = [];
  let isOrderedList = false;

  const flushList = (keyPrefix) => {
    if (listItems.length > 0) {
      if (isOrderedList) {
        elements.push(
          <ol key={`ol-${keyPrefix}`} className="list-decimal pl-6 space-y-1.5 text-slate-700 text-sm my-3 font-medium">
            {listItems.map((item, i) => (
              <li key={i}>{parseInlineMarkdown(item)}</li>
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul key={`ul-${keyPrefix}`} className="list-disc pl-6 space-y-1.5 text-slate-700 text-sm my-3 font-medium">
            {listItems.map((item, i) => (
              <li key={i}>{parseInlineMarkdown(item)}</li>
            ))}
          </ul>
        );
      }
      listItems = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList(index);
      return;
    }

    // Headers
    if (trimmed.startsWith("# ")) {
      flushList(index);
      elements.push(
        <h1 key={index} className="text-2xl font-extrabold text-slate-900 mt-6 mb-3 border-b border-slate-200 pb-2">
          {parseInlineMarkdown(trimmed.replace(/^#\s+/, ""))}
        </h1>
      );
      return;
    }
    if (trimmed.startsWith("## ")) {
      flushList(index);
      elements.push(
        <h2 key={index} className="text-xl font-bold text-slate-900 mt-5 mb-2 border-b border-slate-100 pb-1">
          {parseInlineMarkdown(trimmed.replace(/^##\s+/, ""))}
        </h2>
      );
      return;
    }
    if (trimmed.startsWith("### ")) {
      flushList(index);
      elements.push(
        <h3 key={index} className="text-lg font-bold text-slate-800 mt-4 mb-2">
          {parseInlineMarkdown(trimmed.replace(/^###\s+/, ""))}
        </h3>
      );
      return;
    }

    // Bullet List (- or *)
    if (/^[-*]\s+/.test(trimmed)) {
      if (isOrderedList && listItems.length > 0) flushList(index);
      isOrderedList = false;
      listItems.push(trimmed.replace(/^[-*]\s+/, ""));
      return;
    }

    // Numbered List (1. 2.)
    if (/^\d+\.\s+/.test(trimmed)) {
      if (!isOrderedList && listItems.length > 0) flushList(index);
      isOrderedList = true;
      listItems.push(trimmed.replace(/^\d+\.\s+/, ""));
      return;
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      flushList(index);
      elements.push(
        <blockquote key={index} className="border-l-4 border-cyan-500 pl-4 py-2.5 italic text-slate-700 bg-slate-50 rounded-r-xl my-3 font-medium">
          {parseInlineMarkdown(trimmed.replace(/^>\s+/, ""))}
        </blockquote>
      );
      return;
    }

    // Regular paragraph
    flushList(index);
    elements.push(
      <p key={index} className="text-slate-700 text-sm leading-relaxed my-2">
        {parseInlineMarkdown(trimmed)}
      </p>
    );
  });

  flushList("end");
  return <div className="space-y-2">{elements}</div>;
}

export default function PolicyPage() {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user") || localStorage.getItem("ec_auth_user");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch (e) {}

    let ignore = false;
    setLoading(true);

    contentApi.list("chinh_sach")
      .then((res) => {
        if (!ignore && res && Array.isArray(res.data)) {
          setPolicies(res.data);
        }
      })
      .catch((e) => {
        console.warn("[PolicyPage] Failed to fetch policy content:", e.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles size={14} className="text-yellow-300 animate-pulse" />
        <span>Snow Voucher — Điều Khoản & Chính Sách Minh Bạch Hàng Đầu</span>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-lg shadow-sm">
              ❄️
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Snow Voucher
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-cyan-600 bg-slate-100 hover:bg-slate-200/80 px-3.5 py-2 rounded-full transition-all"
            >
              <ArrowLeft size={14} />
              <span>Quay lại Trang chủ</span>
            </Link>
            {!currentUser && (
              <Link
                to="/login"
                className="flex items-center gap-1 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 px-3.5 py-2 rounded-full shadow-sm transition-all"
              >
                <LogIn size={14} />
                <span>Đăng nhập</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-10 w-full space-y-8">
        {/* Title Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs text-center space-y-3 relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center mx-auto text-2xl shadow-inner">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Điều Khoản & Chính Sách Sàn Snow Voucher
          </h1>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Văn bản chính thức áp dụng cho tất cả Khách hàng và Đối tác đăng ký, mua bán và sử dụng e-voucher trên nền tảng Snow Voucher
          </p>
        </div>

        {/* Policy Content Loaded from DB (table noidung, loai = 'chinh_sach') */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-4 animate-pulse">
            <div className="h-6 bg-slate-100 rounded-lg w-1/3" />
            <div className="h-4 bg-slate-100 rounded-lg w-full" />
            <div className="h-4 bg-slate-100 rounded-lg w-5/6" />
          </div>
        ) : policies.length > 0 ? (
          <div className="space-y-6">
            {policies.map((item, idx) => (
              <div
                key={item.id || item.ma_nd || idx}
                className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-700 font-bold text-sm flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900">
                      {item.title || item.tieu_de || "Chính sách nền tảng"}
                    </h2>
                  </div>
                  {item.created_at && (
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={13} />
                      {new Date(item.created_at).toLocaleDateString("vi-VN")}
                    </span>
                  )}
                </div>

                {item.imageUrl || item.hinh_anh_url ? (
                  <img
                    src={item.imageUrl || item.hinh_anh_url}
                    alt={item.title || "Chính sách"}
                    className="w-full max-h-80 object-cover rounded-2xl border border-slate-200"
                  />
                ) : null}

                {/* Parsed Markdown & HTML content */}
                <div className="pt-2">
                  {renderFormattedContent(
                    item.content || item.noi_dung || item.description || "Nội dung điều khoản đang được cập nhật."
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Rich Default Fallback Policy Document */
          <div className="space-y-6">
            {/* Section 1 */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                  <Lock size={18} />
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  1. Chính sách bảo mật thông tin cá nhân (Privacy Policy)
                </h2>
              </div>
              <div className="text-sm text-slate-600 space-y-2 leading-relaxed">
                <p>
                  Snow Voucher cam kết bảo vệ tuyệt đối thông tin cá nhân của người dùng bao gồm Họ tên, Số điện thoại, Email, Địa chỉ giao hàng và lịch sử giao dịch e-voucher.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-500">
                  <li>Thông tin chỉ được sử dụng cho mục đích xác nhận đơn hàng, gửi mã voucher và chăm sóc khách hàng.</li>
                  <li>Không chia sẻ thông tin cho bên thứ ba ngoại trừ các đơn vị đối tác cấp voucher chính thức.</li>
                </ul>
              </div>
            </div>

            {/* Section 2 */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <RefreshCw size={18} />
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  2. Quy định đổi trả & Sử dụng E-Voucher
                </h2>
              </div>
              <div className="text-sm text-slate-600 space-y-2 leading-relaxed">
                <p>
                  Khách hàng sở hữu mã E-Voucher chính hãng có thể sử dụng tại toàn bộ các chi nhánh thuộc đối tác niêm yết trong thời gian hiệu lực của voucher.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-500">
                  <li>Mã QR hoặc mã code voucher có giá trị đổi dịch vụ 01 lần duy nhất tại cửa hàng đối tác.</li>
                  <li>Trường hợp gặp sự cố phát sinh lỗi mã (Lỗi sinh mã, lỗi thanh toán), hệ thống hỗ trợ hoàn tiền hoặc đổi mã mới trong vòng 24h.</li>
                </ul>
              </div>
            </div>

            {/* Section 3 */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <CheckCircle2 size={18} />
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  3. Quyền lợi & Trách nhiệm của Đối tác Doanh nghiệp
                </h2>
              </div>
              <div className="text-sm text-slate-600 space-y-2 leading-relaxed">
                <p>
                  Các thương hiệu đối tác khi đăng ký phát hành voucher trên Snow Voucher phải tuân thủ nghiêm ngặt tính xác thực của thông tin chi nhánh, giá niêm yết và thời gian bán hàng.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-base">❄️</span>
            <span className="font-bold text-white">Snow Voucher</span>
            <span>— Sàn Thương Mại Điện Tử E-Voucher</span>
          </div>
          <div>
            Email: nkngan23@clc.fitus.edu.vn | Hotline: 0967456832
          </div>
        </div>
      </footer>
    </div>
  );
}
