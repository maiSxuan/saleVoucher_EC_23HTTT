import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PartnerLayout from "../../../../layouts/PartnerLayout";
import Card from "../../../../shared/components/Card";
import Button from "../../../../shared/components/Button";
import Badge from "../../../../shared/components/Badge";
import Toast from "../../../../shared/components/Toast";
import Modal from "../../../../shared/components/Modal";
import { getVoucherByIdApi, getBranchesByPartnerApi, saveVoucherApi } from "../../../../shared/api/partnerApi";
import { formatCategoryName } from "../../../../shared/utils/categoryFormatter";
import { getVoucherPublicationStatus } from "../../../../shared/utils/publicationStatusHelper";
import { useTranslation } from "react-i18next";

export function VoucherDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [voucher, setVoucher] = useState(null);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  const [toastMessage, setToastMessage] = useState("");
  const [stopSellingModal, setStopSellingModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const getLoggedInPartnerId = () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const u = JSON.parse(storedUser);
        return u.ma_hsdn || u.ma_hs || u.id || u.ma_nguoi_dung;
      }
    } catch (e) { }
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

    window.addEventListener("app_language_changed", loadData);
    return () => window.removeEventListener("app_language_changed", loadData);
  }, [id]);

  if (loading) {
    return (
      <PartnerLayout>
        <div className="p-12 text-center text-slate-500">{t("Đang tải thông tin chi tiết Voucher...")}</div>
      </PartnerLayout>
    );
  }

  if (!voucher) {
    return (
      <PartnerLayout>
        <div className="p-12 text-center text-slate-500">{t("Không tìm thấy thông tin Voucher.")}</div>
      </PartnerLayout>
    );
  }

  const activeBranches = branches.filter((b) => (voucher.ma_chi_nhanh || []).includes(b.ma_chi_nhanh));

  const handleStatusChange = async (newStatus, msg) => {
    const reviewStatus = ["Dang ban", "Tam ngung", "Ngung ban"].includes(newStatus)
      ? "Da duyet"
      : newStatus === "Cho duyet"
        ? "Cho duyet"
        : voucher.trang_thai_kiem_duyet || "Nhap";

    await saveVoucherApi({
      ma_voucher: voucher.ma_voucher,
      trang_thai: newStatus,
      trang_thai_kiem_duyet: reviewStatus,
    });
    setToastMessage(msg || t("Đã cập nhật trạng thái Voucher thành công!"));
    await loadData();
  };

  const isNhap = voucher.trang_thai === "Nhap";
  const isDangBan = voucher.trang_thai === "Dang ban";
  const isTamNgung = voucher.trang_thai === "Tam ngung";
  const isNgungBan = voucher.trang_thai === "Ngung ban";
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
              title={t("Quay lại danh sách Voucher")}
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Link to="/partner/vouchers" className="hover:underline font-semibold text-slate-700">
                {t("Danh sách Voucher")}
              </Link>
              <span>/</span>
              <span className="font-bold text-slate-900 line-clamp-1">{voucher.ten_voucher}</span>
            </div>
          </div>

          {/* Action buttons strictly scoped to voucher status */}
          <div className="flex items-center gap-2">
            {(() => {
              const pubStatus = getVoucherPublicationStatus(voucher);
              return <Badge status={pubStatus.key} text={t(pubStatus.label)} />;
            })()}

            {/* a. Trạng thái Nháp: Chỉnh sửa toàn bộ + Gửi duyệt */}
            {isNhap && (
              <>
                <Link to={`/partner/vouchers/${voucher.ma_voucher}/edit`}>
                  <Button variant="secondary" size="sm">
                    {t("Chỉnh sửa")}
                  </Button>
                </Link>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowSubmitModal(true)}
                >
                  ✓ {t("Gửi duyệt")}
                </Button>
              </>
            )}

            {/* b. Trạng thái Đang bán: Có nút Tạm ngưng và nút Ngừng bán */}
            {isDangBan && (
              <>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleStatusChange("Tam ngung", t("Đã tạm ngưng bán Voucher!"))}
                >
                  {t("Tạm ngưng")}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setStopSellingModal(true)}
                >
                  {t("Ngừng bán")}
                </Button>
              </>
            )}

            {/* c. Trạng thái Tạm ngưng: Chỉnh sửa giới hạn + Mở bán lại + Ngừng bán */}
            {isTamNgung && (
              <>
                <Link to={`/partner/vouchers/${voucher.ma_voucher}/edit`}>
                  <Button variant="secondary" size="sm">
                    {t("Chỉnh sửa")}
                  </Button>
                </Link>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleStatusChange("Dang ban", t("Đã mở bán lại Voucher!"))}
                >
                  {t("Mở bán lại")}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setStopSellingModal(true)}
                >
                  {t("Ngừng bán")}
                </Button>
              </>
            )}

            {/* d. Trạng thái Bị từ chối: Cho sửa và gửi lại */}
            {isRejected && (
              <Link to={`/partner/vouchers/${voucher.ma_voucher}/edit`}>
                <Button variant="danger" size="sm">
                  {t("Khắc phục & Gửi lại")}
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
                <h4 className="font-bold text-rose-900 text-sm">{t("Voucher này bị Quản trị viên từ chối phê duyệt")}</h4>
                <p className="text-xs text-rose-700 font-medium">
                  {t("Lý do từ chối:")} <span className="italic font-normal">{voucher.ly_do_tu_choi || t("Chưa đáp ứng điều kiện niêm yết giá hoặc chi nhánh.")}</span>
                </p>
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
              <h1 className="text-2xl font-bold">{voucher.ten_voucher}</h1>
              <p className="text-xs text-slate-300 mt-1">{t("Mã hệ thống:")} {voucher.ma_voucher}</p>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
              <span className="text-xs text-slate-400 font-medium">{t("Giá bán niêm yết:")}</span>
              <div className="text-2xl font-bold text-emerald-600">{voucher.gia_ban?.toLocaleString()}đ</div>
              <div className="text-xs text-slate-400 line-through">{t("Giá gốc:")} {voucher.gia_goc?.toLocaleString()}đ</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
              <span className="text-xs text-slate-400 font-medium">{t("Tình hình tồn kho:")}</span>
              <div className="text-2xl font-bold text-slate-900">
                {voucher.so_luong_da_ban || 0} / {voucher.so_luong_phat_hanh}
              </div>
              <div className="text-xs text-slate-500">{t("Voucher đã được phát hành")}</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
              <span className="text-xs text-slate-400 font-medium">{t("Thời gian mở bán:")}</span>
              <div className="text-xs font-bold text-slate-900 mt-1">
                {voucher.tg_bat_dau_ban ? new Date(voucher.tg_bat_dau_ban).toLocaleDateString("vi-VN") : "-"} -{" "}
                {voucher.tg_ket_thuc_ban ? new Date(voucher.tg_ket_thuc_ban).toLocaleDateString("vi-VN") : "-"}
              </div>
              <div className="text-xs text-slate-500">{t("Áp dụng trong khung giờ mở cửa")}</div>
            </div>
          </div>
        </Card>

        {/* Details & Applicable Branches */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title={t("Điều Kiện & Mô Tả")}>
            <div className="space-y-3 text-xs text-slate-700">
              <div>
                <strong className="block text-slate-900 mb-1">{t("Mô tả:")}</strong>
                <p>{voucher.mo_ta || t("Chưa có mô tả chi tiết.")}</p>
              </div>
              <div>
                <strong className="block text-slate-900 mb-1">{t("Điều kiện sử dụng:")}</strong>
                <p>{voucher.dieu_kien_ap_dung || t("Theo quy định của hệ thống.")}</p>
              </div>
              <div>
                <strong className="block text-slate-900 mb-1">{t("Chính sách hoàn hủy:")}</strong>
                <p>{voucher.chinh_sach_hoan_huy || t("Theo chính sách của đối tác.")}</p>
              </div>
            </div>
          </Card>

          <Card title={t("Chi Nhánh Áp Dụng")}>
            {activeBranches.length === 0 ? (
              <p className="text-xs text-slate-400">{t("Áp dụng trên toàn bộ chi nhánh đang hoạt động.")}</p>
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

        {/* Discontinue Alert Card if Ngung ban */}
        {isNgungBan && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🚫</span>
              <div className="space-y-1">
                <h4 className="font-bold text-rose-900 text-sm">{t("Voucher này đã ngừng bán vĩnh viễn")}</h4>
                <p className="text-xs text-rose-700 font-medium">
                  {t("Chương trình Voucher đã chính thức chấm dứt phát hành")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Modal Confirm Stop Selling (Ngừng bán) */}
        {stopSellingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setStopSellingModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4 text-slate-800">
              <div className="flex items-center gap-3 text-rose-600">
                <span className="text-2xl">⚠️</span>
                <h3 className="font-bold text-slate-900 text-lg">{t("Xác nhận NGỪNG BÁN Voucher")}</h3>
              </div>

              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-900 space-y-2">
                <p className="font-bold">{t("Chương trình Voucher:")} {voucher.ten_voucher}</p>
                <p className="leading-relaxed">
                  {t("Khi xác nhận Ngừng bán, Voucher này sẽ bị đóng vĩnh viễn")}
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setStopSellingModal(false)}
                  className="px-4 py-2 text-xs font-semibold border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {t("Hủy bỏ")}
                </button>
                <button
                  onClick={async () => {
                    setStopSellingModal(false);
                    await handleStatusChange("Ngung ban", t("Voucher đã được chuyển sang trạng thái NGỪNG BÁN vĩnh viễn!"));
                  }}
                  className="px-4 py-2 text-xs font-bold bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors cursor-pointer shadow-xs"
                >
                  {t("Xác nhận Ngừng bán")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Submit Approval Confirmation */}
        <Modal
          isOpen={showSubmitModal}
          onClose={() => setShowSubmitModal(false)}
          onConfirm={async () => {
            setShowSubmitModal(false);
            await handleStatusChange("Cho duyet", t("Đã gửi yêu cầu xét duyệt Voucher tới Quản trị viên thành công!"));
          }}
          title={t("Xác nhận gửi duyệt Voucher")}
          confirmText={`✓ ${t("Xác nhận Gửi duyệt")}`}
          cancelText={t("Hủy bỏ")}
          confirmVariant="primary"
        >
          <div className="space-y-3 text-left">
            <p className="text-sm text-slate-700">
              {t("Bạn có chắc chắn muốn gửi chương trình Voucher")} <strong>"{voucher.ten_voucher}"</strong> {t("cho Quản trị viên thẩm định và xét duyệt?")}
            </p>
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs text-amber-800 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <span>{t("Lưu ý:")}</span>
              </div>
              <p>{t("Sau khi gửi duyệt, thông tin Voucher sẽ chuyển sang trạng thái \"Chờ duyệt\". Quản trị viên sẽ thẩm định trước khi cho phép mở bán chính thức.")}</p>
            </div>
          </div>
        </Modal>

        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      </div>
    </PartnerLayout>
  );
}

export default VoucherDetailPage;