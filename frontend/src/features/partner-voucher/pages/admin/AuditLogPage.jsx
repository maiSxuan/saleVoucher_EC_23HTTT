import React from "react";
import AdminLayout from "../../../../layouts/AdminLayout";
import Card from "../../../../shared/components/Card";
import Badge from "../../../../shared/components/Badge";
import { mockStore } from "../../../../shared/store/mockDataStore";

export function AuditLogPage() {
  const auditLogs = mockStore.getAuditLogs();

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Nhật Ký Hệ Thống (Audit Logs)</h2>
            <p className="text-sm text-slate-500 mt-1">
              Ghi nhận toàn bộ thao tác thay đổi trạng thái, phê duyệt, từ chối, khóa tài khoản và voucher
            </p>
          </div>
        </div>

        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Thời Gian</th>
                  <th className="py-3.5 px-4">Hành Động</th>
                  <th className="py-3.5 px-4">Đối Tượng</th>
                  <th className="py-3.5 px-4">Thực Hiện Bởi</th>
                  <th className="py-3.5 px-4">Nội Dung / Lý Do</th>
                  <th className="py-3.5 px-4">Kết Quả</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.log_id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 text-xs font-mono text-slate-600">
                      {new Date(log.thoi_diem).toLocaleString("vi-VN")}
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900">{log.hanh_dong}</td>
                    <td className="py-4 px-4 text-xs font-mono text-slate-700">
                      {log.doi_tuong} ({log.ma_doi_tuong})
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-800">{log.vai_tro_thuc_hien}</td>
                    <td className="py-4 px-4 text-xs text-slate-600 italic max-w-md">{log.ly_do_thuc_hien}</td>
                    <td className="py-4 px-4">
                      <Badge status={log.ket_qua === "Thanh cong" ? "Thanh cong" : "That bai"} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}

export default AuditLogPage;
