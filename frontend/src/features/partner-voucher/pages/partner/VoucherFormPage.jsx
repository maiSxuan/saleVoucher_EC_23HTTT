import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PartnerLayout from "../../../../layouts/PartnerLayout";
import Card from "../../../../shared/components/Card";
import Button from "../../../../shared/components/Button";
import Toast from "../../../../shared/components/Toast";
import Modal from "../../../../shared/components/Modal";
import {
  getVoucherByIdApi,
  saveVoucherApi,
  getBranchesByPartnerApi,
  getCategoriesApi,
} from "../../../../shared/api/partnerApi";
import { formatCategoryName } from "../../../../shared/utils/categoryFormatter";

export function VoucherFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const getTodayDateTimeLocal = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  const getFutureDateTimeLocal = (days = 30) => {
    const d = new Date(Date.now() + days * 86400000);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  const [categoriesList, setCategoriesList] = useState([]);
  const [activeBranches, setActiveBranches] = useState([]);
  const [voucherStatus, setVoucherStatus] = useState("");
  const [initialQuantity, setInitialQuantity] = useState(0);

  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    ma_voucher: "",
    ten_voucher: "",
    mo_ta: "",
    ma_danh_muc: "",
    gia_goc: "",
    gia_ban: "",
    so_luong_phat_hanh: "",
    tg_bat_dau_ban: getTodayDateTimeLocal(),
    tg_ket_thuc_ban: getFutureDateTimeLocal(30),
    dieu_kien_ap_dung: "Áp dụng cho mọi hoá đơn . Vui lòng xuất trình mã trước khi sử dụng.",
    chinh_sach_hoan_huy: "Không quy đổi thành tiền mặt. Hỗ trợ hoàn tiền nếu hủy trước 24h.",
    hinh_anh_url: "",
    ma_chi_nhanh: [],
  });

  const getLoggedInPartnerId = () => {
    try {
      const storedUser = localStorage.getItem("user") || localStorage.getItem("ec_auth_user");
      if (storedUser) {
        const u = JSON.parse(storedUser);
        return u.ma_hsdn || u.ma_hs || u.id || u.ma_nguoi_dung;
      }
    } catch (e) {}
    return null;
  };

  useEffect(() => {
    async function loadInitial() {
      // 1. Fetch categories
      const cates = await getCategoriesApi();
      if (cates && cates.length > 0) {
        setCategoriesList(cates);
        if (!formData.ma_danh_muc) {
          setFormData((prev) => ({ ...prev, ma_danh_muc: cates[0]?.ma_danh_muc || "" }));
        }
      }

      // 2. Fetch partner branches
      const partnerId = getLoggedInPartnerId();
      if (partnerId) {
        const branches = await getBranchesByPartnerApi(partnerId);
        const activeOnly = (branches || []).filter((b) => b.trang_thai === "Dang hoat dong" || !b.trang_thai);
        setActiveBranches(activeOnly);
        if (!id && activeOnly.length > 0) {
          setFormData((prev) => ({ ...prev, ma_chi_nhanh: activeOnly.map((b) => b.ma_chi_nhanh) }));
        }
      }

      // 3. If editing, fetch voucher details
      if (id) {
        const existing = await getVoucherByIdApi(id);
        if (existing) {
          if (existing.trang_thai === "Ngung ban") {
            navigate(`/partner/vouchers/${id}`);
            return;
          }
          setVoucherStatus(existing.trang_thai || "");
          const initQty = Number(existing.so_luong_phat_hanh) || 0;
          setInitialQuantity(initQty);
          setFormData({
            ma_voucher: existing.ma_voucher,
            ten_voucher: existing.ten_voucher || "",
            mo_ta: existing.mo_ta || "",
            ma_danh_muc: existing.ma_danh_muc || (cates && cates[0]?.ma_danh_muc) || "",
            gia_goc: existing.gia_goc || "",
            gia_ban: existing.gia_ban || "",
            so_luong_phat_hanh: existing.so_luong_phat_hanh || "",
            tg_bat_dau_ban: existing.tg_bat_dau_ban ? existing.tg_bat_dau_ban.slice(0, 16) : getTodayDateTimeLocal(),
            tg_ket_thuc_ban: existing.tg_ket_thuc_ban ? existing.tg_ket_thuc_ban.slice(0, 16) : getFutureDateTimeLocal(30),
            dieu_kien_ap_dung: existing.dieu_kien_ap_dung || "",
            chinh_sach_hoan_huy: existing.chinh_sach_hoan_huy || "",
            hinh_anh_url: existing.hinh_anh_url || "",
            ma_chi_nhanh: existing.ma_chi_nhanh || [],
          });
        }
      }
    }
    loadInitial();
  }, [id]);

  const isTamNgung = voucherStatus === "Tam ngung";
  const isRejected = voucherStatus === "Tu choi";

  const handleBranchToggle = (branchId) => {
    if (isTamNgung) return;
    setFormData((prev) => {
      const selected = prev.ma_chi_nhanh.includes(branchId)
        ? prev.ma_chi_nhanh.filter((b) => b !== branchId)
        : [...prev.ma_chi_nhanh, branchId];
      if (errors.ma_chi_nhanh && selected.length > 0) {
        setErrors((errs) => ({ ...errs, ma_chi_nhanh: "" }));
      }
      return { ...prev, ma_chi_nhanh: selected };
    });
  };

  const isAllBranchesSelected =
    activeBranches.length > 0 &&
    activeBranches.every((b) => formData.ma_chi_nhanh.includes(b.ma_chi_nhanh));

  const handleSelectAllBranches = (e) => {
    if (isTamNgung) return;
    const isChecked = e.target.checked;
    if (isChecked) {
      setFormData((prev) => ({
        ...prev,
        ma_chi_nhanh: activeBranches.map((b) => b.ma_chi_nhanh),
      }));
      if (errors.ma_chi_nhanh) setErrors((errs) => ({ ...errs, ma_chi_nhanh: "" }));
    } else {
      setFormData((prev) => ({
        ...prev,
        ma_chi_nhanh: [],
      }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.ten_voucher.trim()) errs.ten_voucher = "Tên Voucher không được để trống";
    if (!formData.gia_goc || Number(formData.gia_goc) <= 0) errs.gia_goc = "Giá gốc phải lớn hơn 0";
    if (!formData.gia_ban || Number(formData.gia_ban) <= 0) errs.gia_ban = "Giá bán phải lớn hơn 0";
    if (Number(formData.gia_ban) >= Number(formData.gia_goc)) errs.gia_ban = "Giá bán phải nhỏ hơn Giá gốc";

    const newQty = Number(formData.so_luong_phat_hanh);
    if (!formData.so_luong_phat_hanh || newQty <= 0) {
      errs.so_luong_phat_hanh = "Số lượng phát hành phải lớn hơn 0";
    } else if (isTamNgung && initialQuantity > 0 && newQty < initialQuantity) {
      errs.so_luong_phat_hanh = `Khi tạm ngưng, số lượng phát hành mới (${newQty}) không được nhỏ hơn số lượng ban đầu (${initialQuantity}). Bạn chỉ có thể tăng thêm giới hạn.`;
    }

    // 1. Validation 2 mốc thời gian
    if (!formData.tg_bat_dau_ban) {
      errs.tg_bat_dau_ban = "Thời gian mở bán không được để trống";
    }

    if (!formData.tg_ket_thuc_ban) {
      errs.tg_ket_thuc_ban = "Thời gian kết thúc bán không được để trống";
    }

    if (formData.tg_bat_dau_ban && formData.tg_ket_thuc_ban) {
      const startTime = new Date(formData.tg_bat_dau_ban).getTime();
      const endTime = new Date(formData.tg_ket_thuc_ban).getTime();
      const nowBufferTime = Date.now() - 5 * 60 * 1000;

      if (isNaN(startTime)) {
        errs.tg_bat_dau_ban = "Thời gian mở bán không hợp lệ";
      } else if (!id && startTime < nowBufferTime) {
        // Chỉ kiểm tra thời gian bắt đầu so với hiện tại khi TẠO MỚI voucher (!id)
        errs.tg_bat_dau_ban = "Thời gian mở bán phải lớn hơn hoặc bằng ngày hiện tại";
      }

      if (isNaN(endTime)) {
        errs.tg_ket_thuc_ban = "Thời gian kết thúc không hợp lệ";
      }

      if (!isNaN(startTime) && !isNaN(endTime)) {
        if (endTime <= startTime) {
          errs.tg_ket_thuc_ban = "Thời gian kết thúc bán phải sau thời gian bắt đầu mở bán";
        }
      }
    }

    // 2. Validation bắt buộc chọn ít nhất 1 chi nhánh
    if (!formData.ma_chi_nhanh || formData.ma_chi_nhanh.length === 0) {
      errs.ma_chi_nhanh = "Voucher phải được áp dụng cho ít nhất 1 chi nhánh";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const executeSave = async (isSubmitNow = false) => {
    setLoading(true);
    const partnerId = getLoggedInPartnerId();

    // Determine target status
    let targetStatus = "Nhap";
    if (isTamNgung) {
      targetStatus = "Tam ngung"; // Giữ nguyên trạng thái Tạm ngưng khi chỉnh sửa
    } else if (isRejected || isSubmitNow) {
      targetStatus = "Cho duyet";
    } else if (id) {
      targetStatus = voucherStatus || "Nhap";
    }

    const targetKiemDuyet = isTamNgung ? "Da duyet" : targetStatus;

    const saved = await saveVoucherApi({
      ...formData,
      ma_hs: partnerId,
      trang_thai: targetStatus,
      trang_thai_kiem_duyet: targetKiemDuyet,
      ly_do_tu_choi: targetStatus === "Cho duyet" ? "" : undefined,
    });

    setLoading(false);
    setToastMessage(
      isTamNgung
        ? "Đã cập nhật thông tin Voucher thành công!"
        : isRejected
        ? "Đã khắc phục thông tin & Gửi lại yêu cầu duyệt thành công!"
        : isSubmitNow
        ? "Tạo và Gửi duyệt Voucher thành công!"
        : "Lưu bản nháp thành công!"
    );
    setTimeout(() => {
      navigate(`/partner/vouchers/${saved?.ma_voucher || id}`);
    }, 1000);
  };

  const handleSave = (isSubmitNow = false) => {
    if (!validate()) return;
    if (isSubmitNow || isRejected) {
      setShowSubmitModal(true);
    } else {
      executeSave(false);
    }
  };

  const discountPercent =
    formData.gia_goc && formData.gia_ban
      ? Math.round(((formData.gia_goc - formData.gia_ban) / formData.gia_goc) * 100)
      : 0;

  return (
    <PartnerLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {id ? "Chỉnh Sửa Chương Trình Voucher" : "Tạo Mới Chương Trình Voucher"}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Thiết lập thông tin nhận diện, giá bán, thời gian phát hành và phạm vi chi nhánh áp dụng
            </p>
          </div>
        </div>

        {/* Warning banner if Voucher is Rejected */}
        {isRejected && (
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
            <span>⚠️</span>
            <span>
              <strong>Voucher bị từ chối phê duyệt:</strong> Vui lòng chỉnh sửa, bổ sung thông tin cần thiết và bấm <strong>"✓ Lưu & Gửi duyệt ngay"</strong> để gửi lại cho Quản trị viên xét duyệt.
            </span>
          </div>
        )}

        {/* Warning banner if Voucher is Tam ngung */}
        {isTamNgung && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 text-xs font-semibold flex items-center gap-2">
            <span>🔒</span>
            <span>
              <strong>Voucher đang ở trạng thái Tạm ngưng:</strong> Bạn có thể điều chỉnh <strong>Số lượng phát hành (Chỉnh sửa giới hạn)</strong>, tên hoặc mô tả. Các trường Giá và Chi nhánh bị khóa chỉnh sửa theo quy định.
            </span>
          </div>
        )}

        {/* Section 1: Basic Information */}
        <Card title="1. Thông Tin Nhận Diện Voucher">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tên chương trình Voucher <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Voucher Thưởng Thức Buffet Lẩu Nướng Hải Sản Cao Cấp"
                value={formData.ten_voucher}
                onChange={(e) => setFormData({ ...formData, ten_voucher: e.target.value })}
                className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {errors.ten_voucher && <p className="text-xs text-rose-600 mt-1">{errors.ten_voucher}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Danh mục Voucher <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.ma_danh_muc}
                  onChange={(e) => setFormData({ ...formData, ma_danh_muc: e.target.value })}
                  className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  {categoriesList.map((c) => {
                    const cateId = c.ma_danh_muc || c.id;
                    return (
                      <option key={cateId} value={cateId}>
                        {formatCategoryName(c.ten_danh_muc)}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Hình ảnh minh họa (URL)</label>
                <input
                  type="text"
                  value={formData.hinh_anh_url}
                  onChange={(e) => setFormData({ ...formData, hinh_anh_url: e.target.value })}
                  className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả chi tiết nội dung Voucher</label>
              <textarea
                rows="3"
                placeholder="Mô tả trải nghiệm, các món ăn hoặc dịch vụ được hưởng..."
                value={formData.mo_ta}
                onChange={(e) => setFormData({ ...formData, mo_ta: e.target.value })}
                className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              ></textarea>
            </div>
          </div>
        </Card>

        {/* Section 2: Pricing & Quantity */}
        <Card title="2. Giá Bán & Số Lượng Phát Hành">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Giá niêm yết (Giá gốc đ) <span className="text-rose-500">*</span> {isTamNgung && "(Đã khóa)"}
                </label>
                <input
                  type="number"
                  disabled={isTamNgung}
                  placeholder="890000"
                  value={formData.gia_goc}
                  onChange={(e) => setFormData({ ...formData, gia_goc: e.target.value })}
                  className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-slate-100 disabled:text-slate-500"
                />
                {errors.gia_goc && <p className="text-xs text-rose-600 mt-1">{errors.gia_goc}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Giá ưu đãi bán ra (Giá bán đ) <span className="text-rose-500">*</span> {isTamNgung && "(Đã khóa)"}
                </label>
                <input
                  type="number"
                  disabled={isTamNgung}
                  placeholder="599000"
                  value={formData.gia_ban}
                  onChange={(e) => setFormData({ ...formData, gia_ban: e.target.value })}
                  className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-slate-100 disabled:text-slate-500"
                />
                {errors.gia_ban && <p className="text-xs text-rose-600 mt-1">{errors.gia_ban}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Số lượng phát hành <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="500"
                  value={formData.so_luong_phat_hanh}
                  onChange={(e) => setFormData({ ...formData, so_luong_phat_hanh: e.target.value })}
                  className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {isTamNgung && initialQuantity > 0 && (
                  <p className="text-[11px] text-amber-700 mt-1 font-medium">
                    💡 Khi tạm ngưng, số lượng phát hành mới chỉ được điều chỉnh tăng thêm (tối thiểu {initialQuantity}).
                  </p>
                )}
                {errors.so_luong_phat_hanh && <p className="text-xs text-rose-600 mt-1 font-semibold">{errors.so_luong_phat_hanh}</p>}
              </div>
            </div>

            {discountPercent > 0 && (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-xs font-semibold text-emerald-800 flex items-center justify-between">
                <span>🔥 Chiết khấu ưu đãi dành cho khách hàng:</span>
                <span className="text-sm font-bold bg-emerald-600 text-white px-2 py-0.5 rounded">
                  Giảm {discountPercent}% (Tiết kiệm {(formData.gia_goc - formData.gia_ban).toLocaleString()}đ)
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Thời gian mở bán từ <span className="text-rose-500">*</span> {isTamNgung && "(Đã khóa)"}
                </label>
                <input
                  type="datetime-local"
                  disabled={isTamNgung}
                  value={formData.tg_bat_dau_ban}
                  onChange={(e) => {
                    setFormData({ ...formData, tg_bat_dau_ban: e.target.value });
                    if (errors.tg_bat_dau_ban) setErrors((prev) => ({ ...prev, tg_bat_dau_ban: "" }));
                  }}
                  className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-slate-100 disabled:text-slate-500"
                />
                {errors.tg_bat_dau_ban && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.tg_bat_dau_ban}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Thời gian kết thúc bán <span className="text-rose-500">*</span> {isTamNgung && "(Đã khóa)"}
                </label>
                <input
                  type="datetime-local"
                  disabled={isTamNgung}
                  value={formData.tg_ket_thuc_ban}
                  onChange={(e) => {
                    setFormData({ ...formData, tg_ket_thuc_ban: e.target.value });
                    if (errors.tg_ket_thuc_ban) setErrors((prev) => ({ ...prev, tg_ket_thuc_ban: "" }));
                  }}
                  className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-slate-100 disabled:text-slate-500"
                />
                {errors.tg_ket_thuc_ban && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.tg_ket_thuc_ban}</p>}
              </div>
            </div>
          </div>
        </Card>

        {/* Section 3: Applicable Branches */}
        <Card title={`3. Chi Nhánh Áp Dụng ${isTamNgung ? "(Đã khóa chỉnh sửa)" : ""}`}>
          <div className="space-y-3">
            {activeBranches.length > 0 && (
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <label
                  className={`flex items-center gap-2 text-xs font-bold text-slate-800 ${
                    isTamNgung ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:text-blue-600"
                  }`}
                >
                  <input
                    type="checkbox"
                    disabled={isTamNgung}
                    checked={isAllBranchesSelected}
                    onChange={handleSelectAllBranches}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span>✓ Chọn tất cả chi nhánh ({activeBranches.length})</span>
                </label>
                <span className="text-xs text-slate-500 font-medium">
                  Đã chọn: <strong className="text-blue-600 font-bold">{formData.ma_chi_nhanh.length}</strong> / {activeBranches.length} chi nhánh
                </span>
              </div>
            )}

            {activeBranches.length === 0 ? (
              <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
                Chưa có chi nhánh chính thức nào. Vui lòng đăng ký chi nhánh trước khi phát hành Voucher.
              </p>
            ) : (
              activeBranches.map((branch) => (
                <label
                  key={branch.ma_chi_nhanh}
                  className={`flex items-center gap-3 p-3 rounded-lg border border-slate-200 transition-colors ${
                    isTamNgung ? "bg-slate-50 opacity-60 cursor-not-allowed" : "hover:bg-slate-50 cursor-pointer"
                  }`}
                >
                  <input
                    type="checkbox"
                    disabled={isTamNgung}
                    checked={formData.ma_chi_nhanh.includes(branch.ma_chi_nhanh)}
                    onChange={() => handleBranchToggle(branch.ma_chi_nhanh)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div>
                    <div className="text-sm font-bold text-slate-900">{branch.ten_chi_nhanh}</div>
                    <div className="text-xs text-slate-500">📍 {branch.dia_chi} ({branch.khu_vuc})</div>
                  </div>
                </label>
              ))
            )}
            {errors.ma_chi_nhanh && (
              <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200 mt-2">
                ⚠️ {errors.ma_chi_nhanh}
              </p>
            )}
          </div>
        </Card>

        {/* Section 4: Terms & Policies */}
        <Card title="4. Điều Khoản & Chính Sách">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Điều kiện áp dụng</label>
              <textarea
                rows="2"
                value={formData.dieu_kien_ap_dung}
                onChange={(e) => setFormData({ ...formData, dieu_kien_ap_dung: e.target.value })}
                className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Chính sách hoàn hủy</label>
              <textarea
                rows="2"
                value={formData.chinh_sach_hoan_huy}
                onChange={(e) => setFormData({ ...formData, chinh_sach_hoan_huy: e.target.value })}
                className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              ></textarea>
            </div>
          </div>
        </Card>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Hủy bỏ
          </Button>

          <div className="flex items-center gap-3">
  {id && !["Nhap", "Tu choi"].includes(voucherStatus) ? (
    <Button variant="primary" onClick={() => handleSave(true)} loading={loading}>
      Lưu thay đổi
    </Button>
  ) : (
    <>
      <Button variant="secondary" onClick={() => handleSave(false)} loading={loading}>
        Lưu bản nháp
      </Button>
      <Button variant="primary" onClick={() => handleSave(true)} loading={loading}>
        ✓ Lưu & Gửi duyệt ngay
      </Button>
    </>
  )}
</div>
        </div>

        {/* Modal Submit Approval Confirmation */}
        <Modal
          isOpen={showSubmitModal}
          onClose={() => setShowSubmitModal(false)}
          onConfirm={async () => {
            setShowSubmitModal(false);
            await executeSave(true);
          }}
          title="Xác nhận gửi duyệt Voucher"
          confirmText="✓ Xác nhận Gửi duyệt"
          cancelText="Hủy bỏ"
          confirmVariant="primary"
          loading={loading}
        >
          <div className="space-y-3 text-left">
            <p className="text-sm text-slate-700">
              Bạn có chắc chắn muốn gửi thông tin Voucher <strong>"{formData.ten_voucher || "chương trình này"}"</strong> cho Quản trị viên thẩm định và xét duyệt?
            </p>
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs text-amber-800 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <span>Lưu ý:</span>
              </div>
              <p>Sau khi gửi duyệt, thông tin Voucher sẽ ở trạng thái <strong>"Chờ duyệt"</strong>. Quản trị viên sẽ kiểm duyệt trước khi chính thức kích hoạt chương trình.</p>
            </div>
          </div>
        </Modal>

        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      </div>
    </PartnerLayout>
  );
}

export default VoucherFormPage;