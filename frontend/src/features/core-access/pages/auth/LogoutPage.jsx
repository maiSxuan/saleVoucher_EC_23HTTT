import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../app/auth-context";
import Card from "../../../../shared/components/Card";
import Button from "../../../../shared/components/Button";

export function LogoutPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 font-sans">
      <Card className="w-full max-w-md text-center p-8 shadow-lg border-slate-200 space-y-4">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl mx-auto font-bold">
          ✓
        </div>
        <h2 className="text-xl font-bold text-slate-900">Đã Đăng Xuất Thành Công</h2>
        <p className="text-xs text-slate-600">
          Phiên làm việc của bạn đã được kết thúc an toàn và thông tin xác thực đã xóa khỏi hệ thống.
        </p>

        <div className="pt-4">
          <Button variant="primary" className="w-full justify-center" onClick={() => navigate("/login")}>
            Quay lại trang Đăng nhập
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default LogoutPage;
