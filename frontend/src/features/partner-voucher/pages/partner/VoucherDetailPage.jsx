import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PartnerLayout from "../../../../layouts/PartnerLayout";
import Card from "../../../../shared/components/Card";
import Button from "../../../../shared/components/Button";
import Badge from "../../../../shared/components/Badge";
import Toast from "../../../../shared/components/Toast";
import { getVoucherByIdApi, getBranchesByPartnerApi, saveVoucherApi } from "../../../../shared/api/partnerApi";

export function VoucherDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [voucher, setVoucher] = useState(null);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  const [toastMessage, setToastMessage] = useState("");

  const getLoggedInPartnerId = () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const u = JSON.parse(storedUser);
        return u.ma_hsdn || u.ma_hs || u.id || u.ma_nguoi_dung;
      }
    } catch (e) {}
    return "20000000-0000-0000-0000-000000000001";
  };

  const loadData = async () => {
    setLoading(true);
    const data = await getVoucherByIdApi(id);
    setVoucher(data);

    const partnerId = data?.ma_hs || getLoggedInPartnerId();
    if (partnerId) {
      const bList = await getBranchesByPartnerApi(partnerId);
      setBranches(bList || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (loading) {
    return (
      <PartnerLayout>
        <div className="p-12 text-center text-slate-500">Đang tải thông tin chi tiết Voucher...</div>
      </PartnerLayout>
    );
  }

  if (!voucher) {
    return (
      <PartnerLayout>
        <div className="p-12 text-center text-slate-500">Không tìm thấy thông tin Voucher.</div>
      </PartnerLayout>
    );
  }

  const activeBranches = branches.filter((b) => (voucher.ma_chi_nhanh || []).includes(b.ma_chi_nhanh));

  const handleStatusChange = async (newStatus, msg) => {
    await saveVoucherApi({
      ma_voucher: voucher.ma_voucher,
      trang_thai: newStatus,
      trang_thai_kiem_duyet: newStatus === "Cho duyet" ? "Cho duyet" : voucher.trang_thai_kiem_duyet,
    });
    setToastMessage(msg || "Đã cập nhật trạng thái Voucher thành công!");
    await loadData();
  };

  const isNhap = voucher.trang_thai === "Nhap";
  const isDangBan = voucher.trang_thai === "Dang ban";
  const isTamNgung = voucher.trang_thai === "Tam ngung";
  const isRejected = voucher.trang_thai === "Tu choi" || voucher.trang_thai_kiem_duyet === "Tu choi";

  return (
    <PartnerLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Breadcrumb & Action Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Quay lại danh sách Voucher"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Link to="/partner/vouchers" className="hover:underline font-semibold text-slate-700">
                Danh sách Voucher
              </Link>
              <span>/</span>
              <span className="font-bold text-slate-900 line-clamp-1">{voucher.ten_voucher}</span>
            </div>
          </div>

          {/* Action buttons strictly scoped to voucher status */}
          <div className="flex items-center gap-2">
            <Badge status={voucher.trang_thai} />

            {/* a. Trạng thái Nháp: Chỉnh sửa toàn bộ + Gửi duyệt */}
            {isNhap && (
              <>
                <Link to={`/partner/vouchers/${voucher.ma_voucher}/edit`}>
                  <Button variant="secondary" size="sm">
                    Chỉnh sửa
                  </Button>
                </Link>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleStatusChange("Cho duyet", "Đã gửi yêu cầu xét duyệt Voucher!")}
                >
                  Gửi duyệt
                </Button>
              </>
            )}

            {/* b. Trạng thái Đang bán: Chỉ xem, có nút Tạm ngưng (không được sửa) */}
            {isDangBan && (
              <Button
                variant="warning"
                size="sm"
                onClick={() => handleStatusChange("Tam ngung", "Đã tạm ngưng bán Voucher!")}
              >
                Tạm ngưng
              </Button>
            )}

            {/* c. Trạng thái Tạm ngưng: Chỉnh sửa giới hạn + Mở bán lại */}
            {isTamNgung && (
              <>
                <Link to={`/partner/vouchers/${voucher.ma_voucher}/edit`}>
                  <Button variant="secondary" size="sm">
                    Chỉnh sửa
                  </Button>
                </Link>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleStatusChange("Dang ban", "Đã mở bán lại Voucher!")}
                >
                  Mở bán lại
                </Button>
              </>
            )}

            {/* d. Trạng thái Bị từ chối: Cho sửa và gửi lại */}
            {isRejected && (
              <Link to={`/partner/vouchers/${voucher.ma_voucher}/edit`}>
                <Button variant="danger" size="sm">
                  Khắc phục & Gửi lại
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Rejection Alert Card if Rejected */}
        {isRejected && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="space-y-1">
                <h4 className="font-bold text-rose-900 text-sm">Voucher này bị Quản trị viên từ chối phê duyệt</h4>
                <p className="text-xs text-rose-700 font-medium">
                  Lý do từ chối: <span className="italic font-normal">{voucher.ly_do_tu_choi || "Chưa đáp ứng điều kiện niêm yết giá hoặc chi nhánh."}</span>
                </p>
                <div className="pt-2">
                  <Link to={`/partner/vouchers/${voucher.ma_voucher}/edit`}>
                    <Button variant="danger" size="sm">
                      Chỉnh sửa & Gửi lại
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hero Image & Information Card */}
        <Card padding={false}>
          <div className="relative h-64 w-full bg-slate-900 overflow-hidden">
            <img
              src={voucher.hinh_anh_url}
              alt={voucher.ten_voucher}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950/80 to-transparent text-white">
              <span className="px-2.5 py-1 bg-blue-600 text-xs font-bold rounded-full mb-2 inline-block">
                {voucher.ten_danh_muc || "Danh mục Voucher"}
              </span>
              <h1 className="text-2xl font-bold">{voucher.ten_voucher}</h1>
              <p className="text-xs text-slate-300 mt-1">Mã hệ thống: {voucher.ma_voucher}</p>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
              <span className="text-xs text-slate-400 font-medium">Giá bán niêm yết:</span>
              <div className="text-2xl font-bold text-emerald-600">{voucher.gia_ban?.toLocaleString()}đ</div>
              <div className="text-xs text-slate-400 line-through">Giá gốc: {voucher.gia_goc?.toLocaleString()}đ</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
              <span className="text-xs text-slate-400 font-medium">Tình hình tồn kho:</span>
              <div className="text-2xl font-bold text-slate-900">
                {voucher.so_luong_da_ban || 0} / {voucher.so_luong_phat_hanh}
              </div>
              <div className="text-xs text-slate-500">Voucher đã được phát hành</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
              <span className="text-xs text-slate-400 font-medium">Thời gian mở bán:</span>
              <div className="text-xs font-bold text-slate-900 mt-1">
                {voucher.tg_bat_dau_ban ? new Date(voucher.tg_bat_dau_ban).toLocaleDateString("vi-VN") : "-"} -{" "}
                {voucher.tg_ket_thuc_ban ? new Date(voucher.tg_ket_thuc_ban).toLocaleDateString("vi-VN") : "-"}
              </div>
              <div className="text-xs text-slate-500">Áp dụng trong khung giờ mở cửa</div>
            </div>
          </div>
        </Card>

        {/* Details & Applicable Branches */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Điều Kiện & Mô Tả">
            <div className="space-y-3 text-xs text-slate-700">
              <div>
                <strong className="block text-slate-900 mb-1">Mô tả:</strong>
                <p>{voucher.mo_ta || "Chưa có mô tả chi tiết."}</p>
              </div>
              <div>
                <strong className="block text-slate-900 mb-1">Điều kiện sử dụng:</strong>
                <p>{voucher.dieu_kien_ap_dung || "Theo quy định của hệ thống."}</p>
              </div>
              <div>
                <strong className="block text-slate-900 mb-1">Chính sách hoàn hủy:</strong>
                <p>{voucher.chinh_sach_hoan_huy || "Theo chính sách của đối tác."}</p>
              </div>
            </div>
          </Card>

          <Card title="Chi Nhánh Áp Dụng">
            {activeBranches.length === 0 ? (
              <p className="text-xs text-slate-400">Áp dụng trên toàn bộ chi nhánh đang hoạt động.</p>
            ) : (
              <div className="space-y-2">
                {activeBranches.map((b) => (
                  <div key={b.ma_chi_nhanh} className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs">
                    <div className="font-bold text-slate-900">{b.ten_chi_nhanh}</div>
                    <div className="text-slate-500">📍 {b.dia_chi}</div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      </div>
    </PartnerLayout>
  );
}

export default VoucherDetailPage;