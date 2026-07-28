import React from 'react';
import { AlertTriangle, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Forbidden() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={32} className="text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Không có quyền truy cập</h1>
        <p className="text-sm text-gray-500 mb-6">
          Bạn không có đủ quyền hạn để xem trang này. Vui lòng liên hệ quản trị viên hoặc quay về trang chủ.
        </p>
        <button
          onClick={() => navigate('/')}
          className="flex items-center justify-center gap-2 w-full bg-indigo-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors"
        >
          <Home size={18} /> Quay về Trang chủ
        </button>
      </div>
    </div>
  );
}
