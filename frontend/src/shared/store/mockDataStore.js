/**
 * Centralized Mock Data Store with LocalStorage Persistence
 * Allows seamless interaction testing between Partner Portal and Admin Portal.
 */

const STORAGE_KEY = "ec_voucher_mock_data_v1";

const INITIAL_CATEGORIES = [
  { id: "cat-1", ten_danh_muc: "Ẩm thực & Nhà hàng", mo_ta: "Nhà hàng, quán ăn, buffet, đồ uống" },
  { id: "cat-2", ten_danh_muc: "Giải trí & Sân khấu", mo_ta: "Vé xem phim, khu vui chơi, concert, sự kiện" },
  { id: "cat-3", ten_danh_muc: "Làm đẹp & Spa", mo_ta: "Chăm sóc da, massage, salon tóc, nail" },
  { id: "cat-4", ten_danh_muc: "Du lịch & Khách sạn", mo_ta: "Khách sạn, resort, tour du lịch, nghỉ dưỡng" },
  { id: "cat-5", ten_danh_muc: "Mua sắm & Siêu thị", mo_ta: "Thời trang, điện máy, hàng tiêu dùng" },
];

const INITIAL_PARTNERS = [
  {
    ma_hs: "hs-001",
    ten_dn: "Công ty TNHH AmThucViet",
    ma_so_thue: "0312345678",
    dia_chi: "123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    giay_phep_kinh_doanh: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
    ngay_tao: "2026-07-20T09:30:00Z",
    trang_thai: "Dang hoat dong", // Cho duyet, Dang hoat dong, Tu choi, Tam khoa
    ly_do_tu_choi: "",
    nguoi_dai_dien: {
      ho_ten: "Nguyễn Văn An",
      sdt: "0908123456",
      email: "nguyenvanan@amthucviet.vn",
      cccd: "079090001234",
    },
    branches: [
      {
        ma_chi_nhanh: "cn-001",
        ten_chi_nhanh: "Chi nhánh Nguyễn Huệ - Q1",
        khu_vuc: "TP. Hồ Chí Minh",
        dia_chi: "123 Nguyễn Huệ, P. Bến Nghé, Q.1",
        trang_thai: "Dang hoat dong",
        sdt: "02838221122",
        gio_mo_cua: "08:00 - 22:00",
      },
      {
        ma_chi_nhanh: "cn-002",
        ten_chi_nhanh: "Chi nhánh Thảo Điền - Q2",
        khu_vuc: "TP. Hồ Chí Minh",
        dia_chi: "45 Xuân Thủy, P. Thảo Điền, TP. Thủ Đức",
        trang_thai: "Dang hoat dong",
        sdt: "02838223344",
        gio_mo_cua: "09:00 - 22:30",
      },
    ],
  },
  {
    ma_hs: "hs-002",
    ten_dn: "Công ty Cổ phần Spa & Wellbeing Lotus",
    ma_so_thue: "0109876543",
    dia_chi: "88 Lý Thường Kiệt, Quận Hoàn Kiếm, Hà Nội",
    giay_phep_kinh_doanh: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80",
    ngay_tao: "2026-07-25T14:15:00Z",
    trang_thai: "Cho duyet",
    ly_do_tu_choi: "",
    nguoi_dai_dien: {
      ho_ten: "Trần Thị Bích",
      sdt: "0912345678",
      email: "bich.tran@lotusspa.vn",
      cccd: "001088005678",
    },
    branches: [
      {
        ma_chi_nhanh: "cn-003",
        ten_chi_nhanh: "Lotus Spa Hoàn Kiếm",
        khu_vuc: "Hà Nội",
        dia_chi: "88 Lý Thường Kiệt, Q. Hoàn Kiếm",
        trang_thai: "Cho duyet",
        sdt: "02439887766",
        gio_mo_cua: "09:00 - 21:00",
      },
    ],
  },
  {
    ma_hs: "hs-003",
    ten_dn: "Chuỗi Cà Phê & Bánh Highlands Coffee",
    ma_so_thue: "0305544332",
    dia_chi: "720A Điện Biên Phủ, P.22, Q. Bình Thạnh, TP.HCM",
    giay_phep_kinh_doanh: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=600&q=80",
    ngay_tao: "2026-07-22T10:00:00Z",
    trang_thai: "Tu choi",
    ly_do_tu_choi: "Giấy phép kinh doanh quá hạn và hình ảnh tải lên bị mờ. Vui lòng cập nhật bản scan rõ nét còn hiệu lực.",
    nguoi_dai_dien: {
      ho_ten: "Lê Hoàng Nam",
      sdt: "0988776655",
      email: "nam.le@highlands.vn",
      cccd: "079085009988",
    },
    branches: [],
  },
];

const INITIAL_BRANCH_REQUESTS = [
  {
    ma_yeu_cau: "req-b-101",
    ma_hs: "hs-001",
    ten_dn: "Công ty TNHH AmThucViet",
    loai_yeu_cau: "Them moi", // Them moi, Chinh sua, Xoa
    ten_chi_nhanh: "Chi nhánh Landmark 81 - Q. Bình Thạnh",
    khu_vuc: "TP. Hồ Chí Minh",
    dia_chi: "Tầng B1, Landmark 81, 720A Điện Biên Phủ, P.22",
    sdt: "02838990011",
    gio_mo_cua: "10:00 - 22:00",
    ly_do: "Khai trương chi nhánh mới tại TTTM",
    trang_thai: "Cho duyet", // Cho duyet, Da duyet, Tu choi, Yeu cau bo sung
    ghi_chu_admin: "",
    ngay_tao: "2026-07-26T11:00:00Z",
  },
];

const INITIAL_STAFFS = [
  {
    ma_nv: "nv-001",
    ma_hs: "hs-001",
    ho_ten: "Nguyễn Thị Mai",
    email: "mai.nguyen@sushiworld.vn",
    sdt: "0901111111",
    vai_tro: "Nhân viên chi nhánh",
    chi_nhanh_phu_trach: [
      "Chi nhánh Lý Tự Trọng"
    ],
    trang_thai: "Dang hoat dong",
    ngay_tao: "2026-01-15",
    avatar: ""
  },

  {
    ma_nv: "nv-002",
    ma_hs: "hs-001",
    ho_ten: "Lê Văn Hùng",
    email: "hung.le@sushiworld.vn",
    sdt: "0902222222",
    vai_tro: "Nhân viên chi nhánh",
    chi_nhanh_phu_trach: [
      "Chi nhánh Nguyễn Thị Minh Khai",
      "Chi nhánh Quận 7"
    ],
    trang_thai: "Tam khoa",
    ngay_tao: "2026-02-20",
    avatar: ""
  },

  {
    ma_nv: "nv-003",
    ma_hs: "hs-001",
    ho_ten: "Phạm Quốc Bảo",
    email: "bao.pham@sushiworld.vn",
    sdt: "0903333333",
    vai_tro: "Quản lý vận hành",
    chi_nhanh_phu_trach: [],
    trang_thai: "Dang hoat dong",
    ngay_tao: "2026-03-01",
    avatar: ""
  },

  {
    ma_nv: "nv-004",
    ma_hs: "hs-001",
    ho_ten: "Trần Thị Hoa",
    email: "hoa.tran@sushiworld.vn",
    sdt: "0904444444",
    vai_tro: "Nhân viên chi nhánh",
    chi_nhanh_phu_trach: [
      "Chi nhánh Lý Tự Trọng",
      "Chi nhánh Nguyễn Thị Minh Khai"
    ],
    trang_thai: "Tam ngung",
    ngay_tao: "2025-12-10",
    avatar: ""
  },

  {
    ma_nv: "nv-005",
    ma_hs: "hs-002",
    ho_ten: "Đặng Minh Khôi",
    email: "khoi.dang@lotusspa.vn",
    sdt: "0905555555",
    vai_tro: "Quản lý chi nhánh",
    chi_nhanh_phu_trach: [
      "Lotus Spa Hoàn Kiếm"
    ],
    trang_thai: "Dang hoat dong",
    ngay_tao: "2026-04-11",
    avatar: ""
  },

  {
    ma_nv: "nv-006",
    ma_hs: "hs-002",
    ho_ten: "Ngô Thu Hà",
    email: "ha.ngo@lotusspa.vn",
    sdt: "0906666666",
    vai_tro: "Nhân viên chi nhánh",
    chi_nhanh_phu_trach: [
      "Lotus Spa Hoàn Kiếm"
    ],
    trang_thai: "Dang hoat dong",
    ngay_tao: "2026-05-05",
    avatar: ""
  },

  {
    ma_nv: "nv-007",
    ma_hs: "hs-003",
    ho_ten: "Phan Gia Huy",
    email: "huy.phan@highlands.vn",
    sdt: "0907777777",
    vai_tro: "Quản lý vận hành",
    chi_nhanh_phu_trach: [],
    trang_thai: "Tam khoa",
    ngay_tao: "2026-06-10",
    avatar: ""
  },

  {
    ma_nv: "nv-008",
    ma_hs: "hs-003",
    ho_ten: "Đỗ Thanh Tùng",
    email: "tung.do@highlands.vn",
    sdt: "0908888888",
    vai_tro: "Nhân viên chi nhánh",
    chi_nhanh_phu_trach: [],
    trang_thai: "Dang hoat dong",
    ngay_tao: "2026-06-25",
    avatar: ""
  }
];

const INITIAL_VOUCHERS = [
  {
    ma_voucher: "v-001",
    ma_hs: "hs-001",
    ten_dn: "Công ty TNHH AmThucViet",
    ten_voucher: "Voucher Buffet Hải Sản Cao Cấp Tối Cuối Tuần",
    mo_ta: "Thưởng thức hơn 80 món hải sản tươi sống nhập khẩu, bào ngư, tôm hùm nướng mỡ hành cùng quầy kem hãnh diện.",
    gia_goc: 890000,
    gia_ban: 599000,
    ma_danh_muc: "cat-1",
    ten_danh_muc: "Ẩm thực & Nhà hàng",
    dieu_kien_ap_dung: "Áp dụng cho 01 người lớn. Không áp dụng đồng thời với các chương trình khuyến mãi khác.",
    chinh_sach_hoan_huy: "Hoàn tiền 100% nếu voucher chưa sử dụng và còn trong thời hạn.",
    so_luong_phat_hanh: 500,
    so_luong_da_ban: 142,
    tg_bat_dau_ban: "2026-07-25T00:00:00Z",
    tg_ket_thuc_ban: "2026-08-30T23:59:59Z",
    trang_thai: "Dang ban", // Nhap, Cho duyet, Dang ban, Tu choi, Tam ngung, Ngung ban
    trang_thai_kiem_duyet: "Da duyet", // Nhap, Cho duyet, Da duyet, Tu choi
    trang_thai_cong_bo: "Dang ban", // Dang ban, Cho hien thi, Tam an, Ngung ban
    hinh_anh_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    ma_chi_nhanh: ["cn-001", "cn-002"],
    ly_do_tu_choi: "",
    ngay_tao: "2026-07-21T08:00:00Z",
    lich_su_duyet: [
      { ngay: "2026-07-21 08:00", hanh_dong: "Tạo mới & Gửi duyệt", nguoi_thuc_hien: "Đối tác" },
      { ngay: "2026-07-22 10:15", hanh_dong: "Đã phê duyệt", nguoi_thuc_hien: "Admin QV" },
    ],
  },
  {
    ma_voucher: "v-002",
    ma_hs: "hs-001",
    ten_dn: "Công ty TNHH AmThucViet",
    ten_voucher: "E-Voucher Trị Giá 200.000đ Áp Dụng Cho Toàn Menu",
    mo_ta: "Voucher giảm tiền mặt 200k áp dụng cho hóa đơn từ 500k tại toàn bộ chi nhánh hệ thống AmThucViet.",
    gia_goc: 200000,
    gia_ban: 120000,
    ma_danh_muc: "cat-1",
    ten_danh_muc: "Ẩm thực & Nhà hàng",
    dieu_kien_ap_dung: "Áp dụng tối đa 02 voucher/hóa đơn. Không quy đổi thành tiền mặt.",
    chinh_sach_hoan_huy: "Không áp dụng hoàn hủy.",
    so_luong_phat_hanh: 1000,
    so_luong_da_ban: 0,
    tg_bat_dau_ban: "2026-08-01T00:00:00Z",
    tg_ket_thuc_ban: "2026-09-15T23:59:59Z",
    trang_thai: "Cho duyet",
    trang_thai_kiem_duyet: "Cho duyet",
    trang_thai_cong_bo: "Cho hien thi",
    hinh_anh_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    ma_chi_nhanh: ["cn-001"],
    ly_do_tu_choi: "",
    ngay_tao: "2026-07-27T14:30:00Z",
    lich_su_duyet: [
      { ngay: "2026-07-27 14:30", hanh_dong: "Gửi yêu cầu xét duyệt", nguoi_thuc_hien: "Đối tác" },
    ],
  },
  {
    ma_voucher: "v-003",
    ma_hs: "hs-002",
    ten_dn: "Công ty Cổ phần Spa & Wellbeing Lotus",
    ten_voucher: "Gói Liệu Trình Massage Body Thảo Dược 90 Phút",
    mo_ta: "Thư giãn sâu với kỹ thuật massage bấm huyệt truyền thống kết hợp tinh dầu thảo dược thiên nhiên độc quyền.",
    gia_goc: 1200000,
    gia_ban: 499000,
    ma_danh_muc: "cat-3",
    ten_danh_muc: "Làm đẹp & Spa",
    dieu_kien_ap_dung: "Đặt chỗ trước ít nhất 24 giờ qua số hotline chi nhánh.",
    chinh_sach_hoan_huy: "Cho phép đổi ngày hẹn 01 lần.",
    so_luong_phat_hanh: 200,
    so_luong_da_ban: 0,
    tg_bat_dau_ban: "2026-07-28T00:00:00Z",
    tg_ket_thuc_ban: "2026-08-31T23:59:59Z",
    trang_thai: "Cho duyet",
    trang_thai_kiem_duyet: "Cho duyet",
    trang_thai_cong_bo: "Cho hien thi",
    hinh_anh_url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
    ma_chi_nhanh: ["cn-003"],
    ly_do_tu_choi: "",
    ngay_tao: "2026-07-28T09:00:00Z",
    lich_su_duyet: [
      { ngay: "2026-07-28 09:00", hanh_dong: "Gửi yêu cầu xét duyệt", nguoi_thuc_hien: "Đối tác" },
    ],
  },
];

const INITIAL_AUDIT_LOGS = [
  {
    log_id: "log-1",
    hanh_dong: "Phê duyệt đối tác",
    vai_tro_thuc_hien: "Admin",
    doi_tuong: "HOSODN",
    ma_doi_tuong: "hs-001",
    ly_do_thuc_hien: "Hồ sơ pháp lý đầy đủ và hợp lệ",
    thoi_diem: "2026-07-20T10:00:00Z",
    ket_qua: "Thanh cong",
  },
  {
    log_id: "log-2",
    hanh_dong: "Phê duyệt Voucher",
    vai_tro_thuc_hien: "Admin",
    doi_tuong: "VOUCHER",
    ma_doi_tuong: "v-001",
    ly_do_thuc_hien: "Voucher đáp ứng đúng quy định chiết khấu và điều kiện áp dụng",
    thoi_diem: "2026-07-22T10:15:00Z",
    ket_qua: "Thanh cong",
  },
];

class MockDataStore {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const initialData = {
        partners: INITIAL_PARTNERS,
        branchRequests: INITIAL_BRANCH_REQUESTS,
        staffs: INITIAL_STAFFS,
        vouchers: INITIAL_VOUCHERS,
        categories: INITIAL_CATEGORIES,
        auditLogs: INITIAL_AUDIT_LOGS,
        activePartnerId: "hs-001", // Default active partner view for Partner Portal
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    }
  }

  getData() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch (e) {
      console.error("Failed to load mock data:", e);
      return {};
    }
  }

  saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  // Active Partner Context
  getActivePartnerId() {
    return this.getData().activePartnerId || "hs-001";
  }

  setActivePartnerId(id) {
    const data = this.getData();
    data.activePartnerId = id;
    this.saveData(data);
  }

  getActivePartner() {
    const data = this.getData();
    return data.partners.find((p) => p.ma_hs === data.activePartnerId) || data.partners[0];
  }

  // Partners
  getPartners() {
    return this.getData().partners || [];
  }

  getPartnerById(id) {
    return this.getPartners().find((p) => p.ma_hs === id);
  }

  getStaffs() {
    return this.getData().staffs || [];
}

getStaffsByPartner(partnerId) {
    return this.getStaffs().filter(
        staff => staff.ma_hs === partnerId
    );
}

getStaffById(id) {
    return this.getStaffs().find(
        staff => staff.ma_nv === id
    );
}

  updatePartnerProfile(partnerId, updatedFields) {
    const data = this.getData();
    const index = data.partners.findIndex((p) => p.ma_hs === partnerId);
    if (index !== -1) {
      data.partners[index] = { ...data.partners[index], ...updatedFields };
      this.saveData(data);
    }
    return data.partners[index];
  }

  submitPartnerRegistration(registrationForm) {
    const data = this.getData();
    const newId = `hs-${Date.now().toString().slice(-4)}`;
    const newBranchId = `cn-${Date.now().toString().slice(-4)}`;

    const newPartner = {
      ma_hs: newId,
      ten_dn: registrationForm.ten_dn,
      ma_so_thue: registrationForm.ma_so_thue,
      dia_chi: registrationForm.dia_chi,
      giay_phep_kinh_doanh: registrationForm.giay_phep_kinh_doanh || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
      ngay_tao: new Date().toISOString(),
      trang_thai: "Cho duyet",
      ly_do_tu_choi: "",
      nguoi_dai_dien: {
        ho_ten: registrationForm.ho_ten,
        sdt: registrationForm.sdt,
        email: registrationForm.email,
        cccd: registrationForm.cccd,
      },
      branches: [
        {
          ma_chi_nhanh: newBranchId,
          ten_chi_nhanh: registrationForm.ten_chi_nhanh || "Chi nhánh chính",
          khu_vuc: registrationForm.khu_vuc || "TP. Hồ Chí Minh",
          dia_chi: registrationForm.dia_chi_cn || registrationForm.dia_chi,
          trang_thai: "Cho duyet",
          sdt: registrationForm.sdt_cn || registrationForm.sdt,
          gio_mo_cua: registrationForm.gio_mo_cua || "08:00 - 21:00",
        },
      ],
    };

    data.partners.unshift(newPartner);
    data.activePartnerId = newId;
    this.saveData(data);
    return newPartner;
  }

  approvePartner(partnerId, reason) {
    const data = this.getData();
    const partner = data.partners.find((p) => p.ma_hs === partnerId);
    if (partner) {
      partner.trang_thai = "Dang hoat dong";
      partner.ly_do_tu_choi = "";
      partner.branches = partner.branches.map((b) => ({ ...b, trang_thai: "Dang hoat dong" }));

      // Add audit log
      data.auditLogs.unshift({
        log_id: `log-${Date.now()}`,
        hanh_dong: "Phê duyệt đối tác",
        vai_tro_thuc_hien: "Admin",
        doi_tuong: "HOSODN",
        ma_doi_tuong: partnerId,
        ly_do_thuc_hien: reason || "Hồ sơ hợp lệ",
        thoi_diem: new Date().toISOString(),
        ket_qua: "Thanh cong",
      });

      this.saveData(data);
    }
  }

  rejectPartner(partnerId, reason) {
    const data = this.getData();
    const partner = data.partners.find((p) => p.ma_hs === partnerId);
    if (partner) {
      partner.trang_thai = "Tu choi";
      partner.ly_do_tu_choi = reason;

      data.auditLogs.unshift({
        log_id: `log-${Date.now()}`,
        hanh_dong: "Từ chối đối tác",
        vai_tro_thuc_hien: "Admin",
        doi_tuong: "HOSODN",
        ma_doi_tuong: partnerId,
        ly_do_thuc_hien: reason,
        thoi_diem: new Date().toISOString(),
        ket_qua: "Thanh cong",
      });

      this.saveData(data);
    }
  }

  lockUnlockPartner(partnerId, lock, reason) {
    const data = this.getData();
    const partner = data.partners.find((p) => p.ma_hs === partnerId);
    if (partner) {
      partner.trang_thai = lock ? "Tam khoa" : "Dang hoat dong";

      data.auditLogs.unshift({
        log_id: `log-${Date.now()}`,
        hanh_dong: lock ? "Khóa đối tác" : "Mở khóa đối tác",
        vai_tro_thuc_hien: "Admin",
        doi_tuong: "HOSODN",
        ma_doi_tuong: partnerId,
        ly_do_thuc_hien: reason,
        thoi_diem: new Date().toISOString(),
        ket_qua: "Thanh cong",
      });

      this.saveData(data);
    }
  }

  // Branch & Branch Requests
  getBranchRequests() {
    return this.getData().branchRequests || [];
  }

  createBranchRequest(requestData) {
    const data = this.getData();
    const newReq = {
      ma_yeu_cau: `req-b-${Date.now().toString().slice(-4)}`,
      ma_hs: requestData.ma_hs,
      ten_dn: requestData.ten_dn,
      loai_yeu_cau: requestData.loai_yeu_cau || "Them moi",
      ten_chi_nhanh: requestData.ten_chi_nhanh,
      khu_vuc: requestData.khu_vuc,
      dia_chi: requestData.dia_chi,
      sdt: requestData.sdt,
      gio_mo_cua: requestData.gio_mo_cua || "08:00 - 22:00",
      ly_do: requestData.ly_do || "",
      trang_thai: "Cho duyet",
      ghi_chu_admin: "",
      ngay_tao: new Date().toISOString(),
    };

    data.branchRequests.unshift(newReq);
    this.saveData(data);
    return newReq;
  }

  approveBranchRequest(requestId) {
    const data = this.getData();
    const req = data.branchRequests.find((r) => r.ma_yeu_cau === requestId);
    if (req) {
      req.trang_thai = "Da duyet";

      const partner = data.partners.find((p) => p.ma_hs === req.ma_hs);
      if (partner) {
        if (req.loai_yeu_cau === "Them moi") {
          partner.branches.push({
            ma_chi_nhanh: `cn-${Date.now().toString().slice(-4)}`,
            ten_chi_nhanh: req.ten_chi_nhanh,
            khu_vuc: req.khu_vuc,
            dia_chi: req.dia_chi,
            trang_thai: "Dang hoat dong",
            sdt: req.sdt,
            gio_mo_cua: req.gio_mo_cua,
          });
        }
      }
      this.saveData(data);
    }
  }

  rejectBranchRequest(requestId, adminNote) {
    const data = this.getData();
    const req = data.branchRequests.find((r) => r.ma_yeu_cau === requestId);
    if (req) {
      req.trang_thai = "Tu choi";
      req.ghi_chu_admin = adminNote;
      this.saveData(data);
    }
  }

  // Vouchers
  getVouchers() {
    return this.getData().vouchers || [];
  }

  getVoucherById(id) {
    return this.getVouchers().find((v) => v.ma_voucher === id);
  }

  getVouchersByPartner(partnerId) {
    return this.getVouchers().filter((v) => v.ma_hs === partnerId);
  }

  saveVoucher(voucherForm) {
    const data = this.getData();
    const isEdit = !!voucherForm.ma_voucher;
    const partner = data.partners.find((p) => p.ma_hs === (voucherForm.ma_hs || data.activePartnerId));
    const category = data.categories.find((c) => c.id === voucherForm.ma_danh_muc);

    const now = new Date();
    const dateStr = now.toISOString().replace("T", " ").slice(0, 16);

    if (isEdit) {
      const idx = data.vouchers.findIndex((v) => v.ma_voucher === voucherForm.ma_voucher);
      if (idx !== -1) {
        const existing = data.vouchers[idx];
        const isSubmitNow = voucherForm.isSubmit;
        const newStatus = isSubmitNow ? "Cho duyet" : existing.trang_thai;
        const newKiemDuyet = isSubmitNow ? "Cho duyet" : existing.trang_thai_kiem_duyet;

        data.vouchers[idx] = {
          ...existing,
          ...voucherForm,
          ten_danh_muc: category ? category.ten_danh_muc : existing.ten_danh_muc,
          trang_thai: newStatus,
          trang_thai_kiem_duyet: newKiemDuyet,
          ly_do_tu_choi: isSubmitNow ? "" : existing.ly_do_tu_choi,
          lich_su_duyet: [
            ...(existing.lich_su_duyet || []),
            {
              ngay: dateStr,
              hanh_dong: isSubmitNow ? "Gửi lại duyệt" : "Cập nhật thông tin",
              nguoi_thuc_hien: "Đối tác",
            },
          ],
        };
        this.saveData(data);
        return data.vouchers[idx];
      }
    } else {
      const newVoucherId = `v-${Date.now().toString().slice(-4)}`;
      const isSubmitNow = voucherForm.isSubmit;

      const newVoucher = {
        ma_voucher: newVoucherId,
        ma_hs: partner ? partner.ma_hs : data.activePartnerId,
        ten_dn: partner ? partner.ten_dn : "Doanh nghiệp",
        ten_voucher: voucherForm.ten_voucher,
        mo_ta: voucherForm.mo_ta,
        gia_goc: Number(voucherForm.gia_goc),
        gia_ban: Number(voucherForm.gia_ban),
        ma_danh_muc: voucherForm.ma_danh_muc,
        ten_danh_muc: category ? category.ten_danh_muc : "Khác",
        dieu_kien_ap_dung: voucherForm.dieu_kien_ap_dung || "Áp dụng theo quy định chung.",
        chinh_sach_hoan_huy: voucherForm.chinh_sach_hoan_huy || "Theo chính sách của nhà cung cấp.",
        so_luong_phat_hanh: Number(voucherForm.so_luong_phat_hanh),
        so_luong_da_ban: 0,
        tg_bat_dau_ban: voucherForm.tg_bat_dau_ban,
        tg_ket_thuc_ban: voucherForm.tg_ket_thuc_ban,
        trang_thai: isSubmitNow ? "Cho duyet" : "Nhap",
        trang_thai_kiem_duyet: isSubmitNow ? "Cho duyet" : "Nhap",
        trang_thai_cong_bo: "Cho hien thi",
        hinh_anh_url: voucherForm.hinh_anh_url || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
        ma_chi_nhanh: voucherForm.ma_chi_nhanh || [],
        ly_do_tu_choi: "",
        ngay_tao: new Date().toISOString(),
        lich_su_duyet: [
          {
            ngay: dateStr,
            hanh_dong: isSubmitNow ? "Tạo mới & Gửi duyệt" : "Tạo bản nháp",
            nguoi_thuc_hien: "Đối tác",
          },
        ],
      };

      data.vouchers.unshift(newVoucher);
      this.saveData(data);
      return newVoucher;
    }
  }

  submitVoucherForReview(voucherId) {
    const data = this.getData();
    const v = data.vouchers.find((item) => item.ma_voucher === voucherId);
    if (v) {
      v.trang_thai = "Cho duyet";
      v.trang_thai_kiem_duyet = "Cho duyet";
      v.ly_do_tu_choi = "";
      v.lich_su_duyet.push({
        ngay: new Date().toISOString().replace("T", " ").slice(0, 16),
        hanh_dong: "Gửi duyệt voucher",
        nguoi_thuc_hien: "Đối tác",
      });
      this.saveData(data);
    }
  }

  approveVoucher(voucherId, isHidden = false) {
    const data = this.getData();
    const v = data.vouchers.find((item) => item.ma_voucher === voucherId);
    if (v) {
      const now = new Date();
      const start = new Date(v.tg_bat_dau_ban);

      v.trang_thai_kiem_duyet = "Da duyet";

      if (isHidden) {
        v.trang_thai_cong_bo = "Tam an";
        v.trang_thai = "Tam ngung";
      } else if (now >= start) {
        v.trang_thai_cong_bo = "Dang ban";
        v.trang_thai = "Dang ban";
      } else {
        v.trang_thai_cong_bo = "Cho hien thi";
        v.trang_thai = "Dang ban";
      }

      v.lich_su_duyet.push({
        ngay: now.toISOString().replace("T", " ").slice(0, 16),
        hanh_dong: isHidden ? "Đã duyệt (Tạm ẩn)" : "Phê duyệt công bố",
        nguoi_thuc_hien: "Admin",
      });

      data.auditLogs.unshift({
        log_id: `log-${Date.now()}`,
        hanh_dong: "Phê duyệt Voucher",
        vai_tro_thuc_hien: "Admin",
        doi_tuong: "VOUCHER",
        ma_doi_tuong: voucherId,
        ly_do_thuc_hien: "Đáp ứng đầy đủ điều kiện phát hành",
        thoi_diem: now.toISOString(),
        ket_qua: "Thanh cong",
      });

      this.saveData(data);
    }
  }

  rejectVoucher(voucherId, reason) {
    const data = this.getData();
    const v = data.vouchers.find((item) => item.ma_voucher === voucherId);
    if (v) {
      const now = new Date();
      v.trang_thai = "Tu choi";
      v.trang_thai_kiem_duyet = "Tu choi";
      v.ly_do_tu_choi = reason;

      v.lich_su_duyet.push({
        ngay: now.toISOString().replace("T", " ").slice(0, 16),
        hanh_dong: `Từ chối: ${reason}`,
        nguoi_thuc_hien: "Admin",
      });

      data.auditLogs.unshift({
        log_id: `log-${Date.now()}`,
        hanh_dong: "Từ chối Voucher",
        vai_tro_thuc_hien: "Admin",
        doi_tuong: "VOUCHER",
        ma_doi_tuong: voucherId,
        ly_do_thuc_hien: reason,
        thoi_diem: now.toISOString(),
        ket_qua: "Thanh cong",
      });

      this.saveData(data);
    }
  }

  updateVoucherStatus(voucherId, newStatus) {
    const data = this.getData();
    const v = data.vouchers.find((item) => item.ma_voucher === voucherId);
    if (v) {
      v.trang_thai = newStatus;
      this.saveData(data);
    }
  }

  // Categories & Audit Logs
  getCategories() {
    return this.getData().categories || INITIAL_CATEGORIES;
  }

  getAuditLogs() {
    return this.getData().auditLogs || [];
  }
}

export const mockStore = new MockDataStore();