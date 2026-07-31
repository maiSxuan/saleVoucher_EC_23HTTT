// ========== PARTNER PORTAL TYPES ==========

export type PartnerRole = 'owner' | 'manager' | 'staff';
export type StaffStatus = 'active' | 'locked' | 'deleted';
export type BranchRequestStatus = 'pending' | 'pending_update' | 'pending_delete' | 'approved' | 'rejected' | 'need_info';
export type VoucherDraftStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'selling' | 'suspended' | 'stopped' | 'expired' | 'sold_out';
export type VoucherCodeLookupResult = 'valid' | 'invalid' | 'used' | 'expired' | 'cancelled' | 'out_of_scope' | 'error';

export interface PartnerAccount {
  id: string;
  email: string;
  phone: string;
  name: string;
  role: PartnerRole;
  status: StaffStatus;
  partnerId: string;
  branchIds: string[]; // for staff role
  createdAt: string;
  createdBy?: string;
}

export interface PartnerBranch {
  id: string;
  partnerId: string;
  name: string;
  region: string;
  address: string;
  phone: string;
  openTime: string;
  closeTime: string;
  breakTime?: string;
  status: 'active' | 'suspended';
  pendingRequest?: {
    type: 'add' | 'edit' | 'delete';
    status: BranchRequestStatus;
    requestedAt: string;
    current?: Partial<PartnerBranch>;
    proposed: Partial<PartnerBranch>;
    adminNote?: string;
  };
}

export interface LegalUpdateRequest {
  id: string;
  partnerId: string;
  status: 'pending' | 'approved' | 'rejected' | 'need_info';
  requestedAt: string;
  current: LegalInfo;
  proposed: LegalInfo;
  adminNote?: string;
}

export interface LegalInfo {
  businessName: string;
  taxCode: string;
  businessType: string;
  mainAddress: string;
  categories: string[];
  licenseFile: string;
  representativeName: string;
  representativeTitle: string;
  representativeCccd: string;
  representativePhone: string;
  representativeEmail: string;
}

export interface PartnerVoucher {
  id: string;
  partnerId: string;
  name: string;
  category: string;
  image: string;
  description: string;
  originalPrice: number;
  salePrice: number;
  startSaleDate: string;
  endSaleDate: string;
  startUseDate: string;
  endUseDate: string;
  branchIds: string[];
  quantity: number;
  soldCount: number;
  usedCount: number;
  conditions: string;
  refundPolicy: string;
  reviewStatus: 'draft' | 'pending' | 'approved' | 'rejected';
  publicationStatus: 'unpublished' | 'scheduled' | 'selling' | 'suspended' | 'stopped' | 'expired' | 'sold_out';
  submittedAt?: string;
  reviewedAt?: string;
  reviewNote?: string;
  rejectionGroup?: string;
  timeline: { ts: string; action: string; actor: string }[];
}

export interface VoucherCodeLookup {
  code: string;
  voucherId: string;
  voucherName: string;
  partnerName: string;
  applicableBranchIds: string[];
  validUntil: string;
  status: 'unused' | 'used' | 'expired' | 'cancelled' | 'disabled';
  usedAt?: string;
  usedBranch?: string;
  customerHint: string; // masked info e.g., "KH ***789"
  discountType: 'percent' | 'fixed' | 'none';
  discountValue?: number;
  originalTransactionValue?: number; // from order
  conditions: string;
}

export interface PartnerStaff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: PartnerRole;
  branchIds: string[];
  status: StaffStatus;
  createdAt: string;
  createdBy: string;
}

export interface ReportData {
  voucherId: string;
  voucherName: string;
  issued: number;
  sold: number;
  used: number;
  revenue: number;
  usageRate: number;
}

// ========== MOCK PARTNER DATA ==========

export const mockPartnerBranches: PartnerBranch[] = [
  {
    id: 'PB001',
    partnerId: 'P002',
    name: 'Chi nhánh Lý Tự Trọng',
    region: 'TP.HCM - Quận 1',
    address: '12 Lý Tự Trọng, Q1, TP.HCM',
    phone: '028-38001234',
    openTime: '08:00',
    closeTime: '22:00',
    breakTime: '14:00-15:00',
    status: 'active',
  },
  {
    id: 'PB002',
    partnerId: 'P002',
    name: 'Chi nhánh Nguyễn Thị Minh Khai',
    region: 'TP.HCM - Quận 3',
    address: '55 Nguyễn Thị Minh Khai, Q3, TP.HCM',
    phone: '028-39001234',
    openTime: '09:00',
    closeTime: '21:00',
    status: 'suspended',
    pendingRequest: {
      type: 'edit',
      status: 'pending_update',
      requestedAt: '2026-07-14',
      current: { openTime: '09:00', closeTime: '21:00', phone: '028-39001234' },
      proposed: { openTime: '08:30', closeTime: '22:00', phone: '028-39001235' },
    },
  },
  {
    id: 'PB003',
    partnerId: 'P002',
    name: 'Chi nhánh Quận 7',
    region: 'TP.HCM - Quận 7',
    address: '78 Nguyễn Thị Thập, Q7, TP.HCM',
    phone: '028-37001234',
    openTime: '10:00',
    closeTime: '22:00',
    status: 'active',
    pendingRequest: {
      type: 'add',
      status: 'pending',
      requestedAt: '2026-07-15',
      proposed: { name: 'Chi nhánh Quận 7', region: 'TP.HCM - Quận 7', address: '78 Nguyễn Thị Thập, Q7, TP.HCM', phone: '028-37001234', openTime: '10:00', closeTime: '22:00' },
    },
  },
];

export const mockLegalInfo: LegalInfo = {
  businessName: 'Sushi World Vietnam',
  taxCode: '0987654321',
  businessType: 'Công ty TNHH',
  mainAddress: '10 Nguyễn Huệ, Q1, TP.HCM',
  categories: ['Ẩm thực', 'Nhà hàng'],
  licenseFile: 'giay_phep_kinh_doanh_2024.pdf',
  representativeName: 'Trần Minh Tú',
  representativeTitle: 'Giám đốc',
  representativeCccd: '079081234567',
  representativePhone: '0912345678',
  representativeEmail: 'tu.tran@sushiworld.vn',
};

export const mockLegalUpdateRequest: LegalUpdateRequest = {
  id: 'LU001',
  partnerId: 'P002',
  status: 'pending',
  requestedAt: '2026-07-13',
  current: mockLegalInfo,
  proposed: {
    ...mockLegalInfo,
    representativePhone: '0912345699',
    representativeEmail: 'tu.tran.new@sushiworld.vn',
  },
};

export const mockPartnerVouchers: PartnerVoucher[] = [
  {
    id: 'PV001',
    partnerId: 'P002',
    name: 'Sushi Set A cho 2 người',
    category: 'Ẩm thực',
    image: '',
    description: 'Combo sushi cao cấp cho 2 người gồm 20 miếng nigiri, 2 cuộn hosomaki và 2 ly miso soup.',
    originalPrice: 680000,
    salePrice: 450000,
    startSaleDate: '2026-07-20',
    endSaleDate: '2026-08-31',
    startUseDate: '2026-07-20',
    endUseDate: '2026-09-15',
    branchIds: ['PB001', 'PB002'],
    quantity: 200,
    soldCount: 0,
    usedCount: 0,
    conditions: 'Đặt trước 30 phút. Không áp dụng ngày lễ và cuối tuần.',
    refundPolicy: 'Không hoàn tiền sau khi mua.',
    reviewStatus: 'draft',
    publicationStatus: 'unpublished',
    timeline: [{ ts: '2026-07-16 10:00', action: 'Tạo nháp', actor: 'Trần Minh Tú' }],
  },
  {
    id: 'PV002',
    partnerId: 'P002',
    name: 'Buffet Sushi Tối Thứ 6',
    category: 'Ẩm thực',
    image: '',
    description: 'Buffet sushi không giới hạn tối thứ 6, gồm hơn 50 loại sushi và sashimi.',
    originalPrice: 950000,
    salePrice: 750000,
    startSaleDate: '2026-07-01',
    endSaleDate: '2026-07-31',
    startUseDate: '2026-07-01',
    endUseDate: '2026-07-31',
    branchIds: ['PB001'],
    quantity: 100,
    soldCount: 45,
    usedCount: 38,
    conditions: 'Chỉ áp dụng tối thứ 6 từ 18:00–22:00.',
    refundPolicy: 'Hoàn tiền 100% nếu huỷ trước 24 giờ.',
    reviewStatus: 'approved',
    publicationStatus: 'selling',
    submittedAt: '2026-06-25',
    reviewedAt: '2026-06-28',
    timeline: [
      { ts: '2026-06-25 09:00', action: 'Gửi duyệt', actor: 'Trần Minh Tú' },
      { ts: '2026-06-28 14:00', action: 'Admin phê duyệt', actor: 'Admin Hệ thống' },
      { ts: '2026-07-01 00:00', action: 'Tự động công bố', actor: 'Hệ thống' },
    ],
  },
  {
    id: 'PV003',
    partnerId: 'P002',
    name: 'Set Sashimi Hải Sản Premium',
    category: 'Ẩm thực',
    image: '',
    description: 'Set sashimi hải sản nhập khẩu cao cấp theo mùa.',
    originalPrice: 1200000,
    salePrice: 990000,
    startSaleDate: '2026-08-01',
    endSaleDate: '2026-08-31',
    startUseDate: '2026-08-01',
    endUseDate: '2026-09-30',
    branchIds: ['PB001', 'PB003'],
    quantity: 50,
    soldCount: 0,
    usedCount: 0,
    conditions: 'Đặt trước 1 ngày.',
    refundPolicy: 'Hoàn tiền 100% nếu huỷ trước 48 giờ.',
    reviewStatus: 'pending',
    publicationStatus: 'unpublished',
    submittedAt: '2026-07-15',
    timeline: [
      { ts: '2026-07-14 16:00', action: 'Tạo nháp', actor: 'Trần Minh Tú' },
      { ts: '2026-07-15 09:00', action: 'Gửi duyệt', actor: 'Trần Minh Tú' },
    ],
  },
  {
    id: 'PV004',
    partnerId: 'P002',
    name: 'Lunch Set 1 người (Lỗi giá)',
    category: 'Ẩm thực',
    image: '',
    description: 'Set ăn trưa tiết kiệm gồm 10 miếng sushi kết hợp.',
    originalPrice: 250000,
    salePrice: 380000, // intentionally invalid
    startSaleDate: '2026-07-20',
    endSaleDate: '2026-08-20',
    startUseDate: '2026-07-20',
    endUseDate: '2026-08-31',
    branchIds: ['PB001'],
    quantity: 150,
    soldCount: 0,
    usedCount: 0,
    conditions: 'Giờ ăn trưa 11:00–14:00.',
    refundPolicy: 'Không hoàn tiền.',
    reviewStatus: 'rejected',
    publicationStatus: 'unpublished',
    submittedAt: '2026-07-10',
    reviewedAt: '2026-07-12',
    reviewNote: 'Giá bán (380,000đ) lớn hơn giá gốc (250,000đ). Vui lòng kiểm tra lại thông tin giá.',
    rejectionGroup: 'Thông tin giá không hợp lệ',
    timeline: [
      { ts: '2026-07-10 10:00', action: 'Gửi duyệt', actor: 'Trần Minh Tú' },
      { ts: '2026-07-12 11:00', action: 'Admin từ chối', actor: 'Admin Hệ thống' },
    ],
  },
  {
    id: 'PV005',
    partnerId: 'P002',
    name: 'Omakase Đặc Biệt',
    category: 'Ẩm thực',
    image: '',
    description: 'Trải nghiệm omakase đặc biệt do bếp trưởng chọn nguyên liệu.',
    originalPrice: 2000000,
    salePrice: 1600000,
    startSaleDate: '2026-09-01',
    endSaleDate: '2026-09-30',
    startUseDate: '2026-09-01',
    endUseDate: '2026-10-31',
    branchIds: ['PB001'],
    quantity: 30,
    soldCount: 0,
    usedCount: 0,
    conditions: 'Đặt trước 3 ngày.',
    refundPolicy: 'Không hoàn tiền.',
    reviewStatus: 'approved',
    publicationStatus: 'scheduled',
    submittedAt: '2026-07-12',
    reviewedAt: '2026-07-14',
    timeline: [
      { ts: '2026-07-12 14:00', action: 'Gửi duyệt', actor: 'Trần Minh Tú' },
      { ts: '2026-07-14 10:00', action: 'Admin phê duyệt – Chờ hiển thị', actor: 'Admin Hệ thống' },
    ],
  },
  {
    id: 'PV006',
    partnerId: 'P002',
    name: 'Sushi Cuộc Hẹn Đôi',
    category: 'Ẩm thực',
    image: '',
    description: 'Set sushi lãng mạn cho 2 người với nến và rượu sake.',
    originalPrice: 780000,
    salePrice: 580000,
    startSaleDate: '2026-06-01',
    endSaleDate: '2026-06-30',
    startUseDate: '2026-06-01',
    endUseDate: '2026-07-31',
    branchIds: ['PB001', 'PB002'],
    quantity: 80,
    soldCount: 80,
    usedCount: 65,
    conditions: 'Đặt trước 1 ngày.',
    refundPolicy: 'Không hoàn tiền.',
    reviewStatus: 'approved',
    publicationStatus: 'sold_out',
    submittedAt: '2026-05-25',
    reviewedAt: '2026-05-28',
    timeline: [
      { ts: '2026-05-25 09:00', action: 'Gửi duyệt', actor: 'Trần Minh Tú' },
      { ts: '2026-05-28 14:00', action: 'Admin phê duyệt', actor: 'Admin Hệ thống' },
      { ts: '2026-06-30 18:00', action: 'Hết số lượng', actor: 'Hệ thống' },
    ],
  },
  {
    id: 'PV007',
    partnerId: 'P002',
    name: 'Sushi Happy Hour',
    category: 'Ẩm thực',
    image: '',
    description: 'Sushi giá rẻ trong khung giờ happy hour 14:00–17:00.',
    originalPrice: 350000,
    salePrice: 250000,
    startSaleDate: '2026-07-01',
    endSaleDate: '2026-07-31',
    startUseDate: '2026-07-01',
    endUseDate: '2026-07-31',
    branchIds: ['PB001'],
    quantity: 200,
    soldCount: 120,
    usedCount: 95,
    conditions: 'Chỉ áp dụng 14:00–17:00.',
    refundPolicy: 'Không hoàn tiền.',
    reviewStatus: 'approved',
    publicationStatus: 'suspended',
    submittedAt: '2026-06-28',
    reviewedAt: '2026-06-30',
    timeline: [
      { ts: '2026-06-28 10:00', action: 'Gửi duyệt', actor: 'Trần Minh Tú' },
      { ts: '2026-06-30 09:00', action: 'Admin phê duyệt', actor: 'Admin Hệ thống' },
      { ts: '2026-07-01 00:00', action: 'Tự động công bố', actor: 'Hệ thống' },
      { ts: '2026-07-16 10:00', action: 'Tạm ngưng bán', actor: 'Trần Minh Tú' },
    ],
  },
];

// Voucher codes for lookup
export const mockVoucherCodes: (VoucherCodeLookup & { id: string })[] = [
  {
    id: 'VC-VALID-001',
    code: 'SW-BUFF-A1B2C3',
    voucherId: 'PV002',
    voucherName: 'Buffet Sushi Tối Thứ 6',
    partnerName: 'Sushi World',
    applicableBranchIds: ['PB001'],
    validUntil: '2026-07-31',
    status: 'unused',
    customerHint: 'KH ***234',
    discountType: 'fixed',
    discountValue: 200000,
    originalTransactionValue: 950000,
    conditions: 'Chỉ áp dụng tối thứ 6 từ 18:00–22:00.',
  },
  {
    id: 'VC-USED-001',
    code: 'SW-BUFF-X9Y8Z7',
    voucherId: 'PV002',
    voucherName: 'Buffet Sushi Tối Thứ 6',
    partnerName: 'Sushi World',
    applicableBranchIds: ['PB001'],
    validUntil: '2026-07-31',
    status: 'used',
    usedAt: '2026-07-11 19:45',
    usedBranch: 'Chi nhánh Lý Tự Trọng',
    customerHint: 'KH ***567',
    discountType: 'fixed',
    discountValue: 200000,
    originalTransactionValue: 950000,
    conditions: 'Chỉ áp dụng tối thứ 6 từ 18:00–22:00.',
  },
  {
    id: 'VC-EXPIRED-001',
    code: 'SW-LOVE-E1F2G3',
    voucherId: 'PV006',
    voucherName: 'Sushi Cuộc Hẹn Đôi',
    partnerName: 'Sushi World',
    applicableBranchIds: ['PB001', 'PB002'],
    validUntil: '2026-07-31',
    status: 'expired',
    customerHint: 'KH ***890',
    discountType: 'fixed',
    discountValue: 200000,
    conditions: 'Đặt trước 1 ngày.',
  },
  {
    id: 'VC-NOPRICE-001',
    code: 'SW-HAPP-N0P1Q2',
    voucherId: 'PV007',
    voucherName: 'Sushi Happy Hour',
    partnerName: 'Sushi World',
    applicableBranchIds: ['PB001'],
    validUntil: '2026-07-31',
    status: 'unused',
    customerHint: 'KH ***112',
    discountType: 'none',
    conditions: 'Chỉ áp dụng 14:00–17:00.',
  },
  {
    id: 'VC-CANCEL-001',
    code: 'SW-SET1-C4D5E6',
    voucherId: 'PV002',
    voucherName: 'Buffet Sushi Tối Thứ 6',
    partnerName: 'Sushi World',
    applicableBranchIds: ['PB001'],
    validUntil: '2026-07-31',
    status: 'cancelled',
    customerHint: 'KH ***345',
    discountType: 'fixed',
    discountValue: 200000,
    conditions: 'Chỉ áp dụng tối thứ 6 từ 18:00–22:00.',
  },
];

export const mockPartnerStaff: PartnerStaff[] = [
  {
    id: 'PS001',
    name: 'Nguyễn Thị Mai',
    email: 'mai.nguyen@sushiworld.vn',
    phone: '0901111111',
    role: 'staff',
    branchIds: ['PB001'],
    status: 'active',
    createdAt: '2026-01-15',
    createdBy: 'Trần Minh Tú',
  },
  {
    id: 'PS002',
    name: 'Lê Văn Hùng',
    email: 'hung.le@sushiworld.vn',
    phone: '0902222222',
    role: 'staff',
    branchIds: ['PB002', 'PB003'],
    status: 'locked',
    createdAt: '2026-02-20',
    createdBy: 'Trần Minh Tú',
  },
  {
    id: 'PS003',
    name: 'Phạm Quốc Bảo',
    email: 'bao.pham@sushiworld.vn',
    phone: '0903333333',
    role: 'manager',
    branchIds: [],
    status: 'active',
    createdAt: '2026-03-01',
    createdBy: 'Trần Minh Tú',
  },
  {
    id: 'PS004',
    name: 'Trần Thị Hoa',
    email: 'hoa.tran@sushiworld.vn',
    phone: '0904444444',
    role: 'staff',
    branchIds: ['PB001', 'PB002'],
    status: 'deleted',
    createdAt: '2025-12-10',
    createdBy: 'Trần Minh Tú',
  },
];

export const mockReportData: ReportData[] = [
  { voucherId: 'PV002', voucherName: 'Buffet Sushi Tối Thứ 6', issued: 100, sold: 45, used: 38, revenue: 33750000, usageRate: 84.4 },
  { voucherId: 'PV006', voucherName: 'Sushi Cuộc Hẹn Đôi', issued: 80, sold: 80, used: 65, revenue: 46400000, usageRate: 81.3 },
  { voucherId: 'PV007', voucherName: 'Sushi Happy Hour', issued: 200, sold: 120, used: 95, revenue: 30000000, usageRate: 79.2 },
];

export const partnerRoleLabels: Record<PartnerRole, string> = {
  owner: 'Chủ tài khoản (Owner)',
  manager: 'Quản lý vận hành',
  staff: 'Nhân viên chi nhánh',
};

export const staffStatusLabels: Record<StaffStatus, string> = {
  active: 'Hoạt động',
  locked: 'Tạm khóa',
  deleted: 'Đã vô hiệu hóa',
};

export const branchRequestStatusLabels: Record<BranchRequestStatus, string> = {
  pending: 'Chờ duyệt thêm',
  pending_update: 'Chờ duyệt cập nhật',
  pending_delete: 'Chờ duyệt xóa',
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
  need_info: 'Yêu cầu bổ sung',
};

export const voucherDraftStatusLabels: Record<string, string> = {
  draft: 'Nháp',
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
  selling: 'Đang bán',
  suspended: 'Tạm ngưng',
  stopped: 'Ngừng bán',
  expired: 'Hết hạn',
  sold_out: 'Hết số lượng',
  scheduled: 'Chờ hiển thị',
  unpublished: 'Chưa công bố',
};
