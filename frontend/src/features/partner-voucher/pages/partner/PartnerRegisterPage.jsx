import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../../../shared/components/Card";
import Button from "../../../../shared/components/Button";
import Toast from "../../../../shared/components/Toast";
import Modal from "../../../../shared/components/Modal";
import { mockStore } from "../../../../shared/store/mockDataStore";

export function PartnerRegisterPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Business Info
    ten_dn: "",
    ma_so_thue: "",
    dia_chi: "",
    // Step 2: Representative Info
    ho_ten: "",
    sdt: "",
    email: "",
    cccd: "",
    // Step 3: Business License
    giay_phep_kinh_doanh: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
    // Step 4: Initial Branch Info
    ten_chi_nhanh: "",
    khu_vuc: "TP. Hồ Chí Minh",
    dia_chi_cn: "",
    sdt_cn: "",
    gio_mo_cua: "08:00 - 22:00",
  });

  const [errors, setErrors] = useState({});

  const steps = [
    { number: 1, title: "Thông tin doanh nghiệp" },
    { number: 2, title: "Người đại diện" },
    { number: 3, title: "Giấy phép kinh doanh" },
    { number: 4, title: "Chi nhánh ban đầu" },
    { number: 5, title: "Xem lại & Gửi duyệt" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.ten_dn.trim()) newErrors.ten_dn = "Tên doanh nghiệp không được để trống";
      if (!formData.ma_so_thue.trim()) newErrors.ma_so_thue = "Mã số thuế không được để trống";
      if (!formData.dia_chi.trim()) newErrors.dia_chi = "Địa chỉ kinh doanh không được để trống";
    } else if (step === 2) {
      if (!formData.ho_ten.trim()) newErrors.ho_ten = "Họ tên người đại diện không được để trống";
      if (!formData.sdt.trim()) newErrors.sdt = "Số điện thoại liên hệ không được để trống";
      if (!formData.email.trim()) newErrors.email = "Email liên hệ không được để trống";
    } else if (step === 4) {
      if (!formData.ten_chi_nhanh.trim()) newErrors.ten_chi_nhanh = "Tên chi nhánh không được để trống";
      if (!formData.dia_chi_cn.trim()) newErrors.dia_chi_cn = "Địa chỉ chi nhánh không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      mockStore.submitPartnerRegistration(formData);
      setLoading(false);
      setShowSuccessModal(true);
    }, 800);
  };

  return (

  <div className="min-h-screen bg-slate-100 py-10 px-4">
    <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Đăng ký Hồ sơ Đối tác</h2>
          <p className="text-sm text-slate-500 mt-1">
            Khai báo thông tin doanh nghiệp & giấy phép kinh doanh để tham gia phát hành Voucher trên hệ thống
          </p>
        </div>

        {/* Wizard Step Indicator Header */}
        <Card padding={false}>
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between relative">
              {steps.map((step, idx) => {
                const isCompleted = currentStep > step.number;
                const isCurrent = currentStep === step.number;
                return (
                  <div key={step.number} className="flex-1 flex flex-col items-center relative z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-xs ${
                        isCompleted
                          ? "bg-emerald-600 text-white"
                          : isCurrent
                          ? "bg-blue-600 text-white ring-4 ring-blue-100"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {isCompleted ? "✓" : step.number}
                    </div>
                    <span
                      className={`text-xs mt-2 font-medium text-center ${
                        isCurrent ? "text-blue-700 font-bold" : isCompleted ? "text-slate-700" : "text-slate-400"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Step Form Content */}
        <Card>
          {/* STEP 1 */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Bước 1: Thông tin Doanh Nghiệp</h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tên Doanh Nghiệp / Công Ty <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.ten_dn}
                  onChange={(e) => handleInputChange("ten_dn", e.target.value)}
                  placeholder="Ví dụ: Công ty TNHH Thương Mại & Dịch Vụ ABC"
                  className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.ten_dn && <p className="text-xs text-rose-600 mt-1">{errors.ten_dn}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Mã số thuế / Mã ĐKKD <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.ma_so_thue}
                    onChange={(e) => handleInputChange("ma_so_thue", e.target.value)}
                    placeholder="Ví dụ: 0312345678"
                    className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {errors.ma_so_thue && <p className="text-xs text-rose-600 mt-1">{errors.ma_so_thue}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Địa chỉ ĐKKD chính thức <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.dia_chi}
                  onChange={(e) => handleInputChange("dia_chi", e.target.value)}
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.dia_chi && <p className="text-xs text-rose-600 mt-1">{errors.dia_chi}</p>}
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Bước 2: Người Đại Diện Phap Lý</h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Họ và tên Người đại diện <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.ho_ten}
                  onChange={(e) => handleInputChange("ho_ten", e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.ho_ten && <p className="text-xs text-rose-600 mt-1">{errors.ho_ten}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Số điện thoại liên hệ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.sdt}
                    onChange={(e) => handleInputChange("sdt", e.target.value)}
                    placeholder="0901234567"
                    className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {errors.sdt && <p className="text-xs text-rose-600 mt-1">{errors.sdt}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email liên hệ / Thông báo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="contact@company.com"
                    className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Số CCCD / Hộ chiếu</label>
                <input
                  type="text"
                  value={formData.cccd}
                  onChange={(e) => handleInputChange("cccd", e.target.value)}
                  placeholder="079090123456"
                  className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">
                Bước 3: Đăng Tải Giấy Phép Kinh Doanh
              </h3>
              <p className="text-xs text-slate-500">
                Tải lên bản scan hoặc ảnh chụp rõ nét Giấy phép đăng ký kinh doanh còn hiệu lực (Định dạng JPG, PNG hoặc PDF, tối đa 10MB).
              </p>

              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors bg-slate-50">
                <div className="text-3xl mb-2">📄</div>
                <div className="text-sm font-semibold text-slate-800">Tải lên tài liệu pháp lý</div>
                <div className="text-xs text-slate-500 mt-1">Kéo thả file vào đây hoặc bấm để chọn tệp</div>
                <input
                  type="file"
                  className="hidden"
                  id="license-upload"
                  onChange={() => setToastMessage("Tải lên bản xem trước thành công")}
                />
                <label
                  htmlFor="license-upload"
                  className="mt-4 inline-block px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100"
                >
                  Chọn tệp từ máy tính
                </label>
              </div>

              {formData.giay_phep_kinh_doanh && (
                <div className="mt-4">
                  <div className="text-xs font-semibold text-slate-700 mb-2">Xem trước bản ĐKKD:</div>
                  <img
                    src={formData.giay_phep_kinh_doanh}
                    alt="Giấy phép kinh doanh"
                    className="max-h-48 rounded-lg border border-slate-200 object-cover"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 4 */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">
                Bước 4: Khai Báo Chi Nhánh Đầu Tiên
              </h3>
              <p className="text-xs text-slate-500">
                Cung cấp địa chỉ điểm bán hàng/chi nhánh đầu tiên sẽ áp dụng các chương trình Voucher của bạn.
              </p>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tên chi nhánh <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.ten_chi_nhanh}
                  onChange={(e) => handleInputChange("ten_chi_nhanh", e.target.value)}
                  placeholder="Ví dụ: Chi nhánh Nguyễn Huệ - Quận 1"
                  className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.ten_chi_nhanh && <p className="text-xs text-rose-600 mt-1">{errors.ten_chi_nhanh}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tỉnh / Thành Phố</label>
                  <select
                    value={formData.khu_vuc}
                    onChange={(e) => handleInputChange("khu_vuc", e.target.value)}
                    className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Cần Thơ">Cần Thơ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">SĐT chi nhánh</label>
                  <input
                    type="text"
                    value={formData.sdt_cn}
                    onChange={(e) => handleInputChange("sdt_cn", e.target.value)}
                    placeholder="02838221122"
                    className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Địa chỉ chi nhánh <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.dia_chi_cn}
                  onChange={(e) => handleInputChange("dia_chi_cn", e.target.value)}
                  placeholder="Địa chỉ cụ thể của điểm bán hàng"
                  className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.dia_chi_cn && <p className="text-xs text-rose-600 mt-1">{errors.dia_chi_cn}</p>}
              </div>
            </div>
          )}

          {/* STEP 5 */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Bước 5: Xem Lại & Xác Nhận Hồ Sơ</h3>

              <div className="bg-slate-50 p-4 rounded-xl space-y-3 text-sm border border-slate-200">
                <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Tên doanh nghiệp:</span>
                  <span className="font-semibold text-slate-900">{formData.ten_dn || "Chưa nhập"}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Mã số thuế:</span>
                  <span className="font-semibold text-slate-900">{formData.ma_so_thue || "Chưa nhập"}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Người đại diện:</span>
                  <span className="font-semibold text-slate-900">{formData.ho_ten || "Chưa nhập"}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-2">
                  <span className="text-slate-500">SĐT / Email:</span>
                  <span className="font-semibold text-slate-900">
                    {formData.sdt} - {formData.email}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-slate-500">Chi nhánh đầu tiên:</span>
                  <span className="font-semibold text-slate-900">
                    {formData.ten_chi_nhanh} ({formData.khu_vuc})
                  </span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-800 flex items-start gap-2">
                <span>⚠️</span>
                <span>
                  Bằng cách nhấn <strong>"Gửi yêu cầu xét duyệt"</strong>, bạn cam kết toàn bộ thông tin đã khai báo là chính xác. Quản trị viên hệ thống sẽ kiểm tra và phản hồi trong thời gian sớm nhất.
                </span>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
            <Button variant="secondary" onClick={handleBack} disabled={currentStep === 1}>
              ← Quay lại
            </Button>

            {currentStep < 5 ? (
              <Button variant="primary" onClick={handleNext}>
                Tiếp tục →
              </Button>
            ) : (
              <Button variant="success" onClick={handleSubmit} loading={loading}>
                ✓ Gửi yêu cầu xét duyệt
              </Button>
            )}
          </div>
        </Card>

        {/* Success Modal */}
        <Modal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            navigate("/partner/profile");
          }}
          onConfirm={() => {
            setShowSuccessModal(false);
            navigate("/partner/profile");
          }}
          title="Gửi hồ sơ thành công!"
          confirmText="Đến trang Hồ sơ đối tác"
          cancelText="Đóng"
        >
          <div className="text-center py-4 space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl mx-auto font-bold">
              ✓
            </div>
            <p className="text-slate-700">
              Hồ sơ đăng ký đối tác của bạn đã được gửi thành công tới Quản trị viên hệ thống. Trạng thái hiện tại là <strong>"Chờ duyệt"</strong>.
            </p>
          </div>
        </Modal>

        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      </div>
      </div>
  );
}

export default PartnerRegisterPage;
