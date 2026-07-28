// ========== TYPES ==========

export type UserRole = 'customer' | 'partner' | 'partner_staff' | 'admin';
export type UserStatus = 'active' | 'locked';

export interface PurchaseRecord {
  voucherId: string;
  voucherName: string;
  amount: number;
  date: string;
  codeStatus: string;
}

export interface AdminRecord {
  timestamp: string;
  action: string;
  executor: string;
  before: string;
  after: string;
  reason?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  purchaseHistory: PurchaseRecord[];
  adminHistory: AdminRecord[];
}

export type PartnerProfileStatus = 'pending' | 'approved' | 'rejected' | 'locked';

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  status: 'active' | 'suspended';
  voucherScope: string;
}

export interface BranchRequest {
  id: string;
  partnerId: string;
  type: 'add' | 'edit' | 'delete';
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  branchId?: string;
  current?: Partial<Branch>;
  proposed: Partial<Branch>;
  reason?: string;
}

export interface Partner {
  id: string;
  businessName: string;
  taxCode: string;
  representative: string;
  phone: string;
  email: string;
  address: string;
  profileStatus: PartnerProfileStatus;
  branches: Branch[];
  branchRequests: BranchRequest[];
  documents: string[];
  createdAt: string;
  adminHistory: AdminRecord[];
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected';
export type PublicationStatus = 'unpublished' | 'scheduled' | 'selling' | 'hidden' | 'stopped' | 'expired' | 'sold_out';

export interface Voucher {
  id: string;
  name: string;
  description: string;
  category: string;
  partnerId: string;
  partnerName: string;
  originalPrice: number;
  salePrice: number;
  startDate: string;
  endDate: string;
  quantity: number;
  soldCount: number;
  reviewStatus: ReviewStatus;
  publicationStatus: PublicationStatus;
  branches: string[];
  conditions: string;
  usageLimit: number;
  submittedAt: string;
  reviewedAt?: string;
  reviewNote?: string;
}

export type OrderStatus = 'created' | 'pending_payment' | 'paid' | 'pending_refund' | 'refunded' | 'cancelled' | 'refund_rejected';
export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded_sim';
export type VoucherCodeStatus = 'not_issued' | 'issued' | 'generation_error' | 'unused' | 'used' | 'expired' | 'cancelled' | 'disabled';

export interface PaymentRecord {
  id: string;
  timestamp: string;
  action: string;
  amount: number;
  status: string;
  note: string;
}

export interface CodeRecord {
  id: string;
  timestamp: string;
  action: string;
  code?: string;
  oldCode?: string;
  status: string;
  note: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  voucherId: string;
  voucherName: string;
  partnerId: string;
  partnerName: string;
  total: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  voucherCodeStatus: VoucherCodeStatus;
  voucherCode?: string;
  createdAt: string;
  paymentHistory: PaymentRecord[];
  codeHistory: CodeRecord[];
  refundRequest?: { reason: string; requestedAt: string; rejectedReason?: string };
}

export type ContentType = 'category' | 'banner' | 'article' | 'popup' | 'policy';
export type ContentStatus = 'visible' | 'hidden' | 'stopped';

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  status: ContentStatus;
  displayPosition?: string;
  content?: string;
  updatedAt: string;
  updatedBy: string;
}

export type LogModule = 'users' | 'partners' | 'vouchers' | 'orders' | 'content';
export type LogResult = 'success' | 'failed';

export interface SystemLog {
  id: string;
  timestamp: string;
  executor: string;
  module: LogModule;
  action: string;
  target: string;
  targetId: string;
  beforeStatus?: string;
  afterStatus?: string;
  result: LogResult;
  reason?: string;
  errorMessage?: string;
  extraData?: Record<string, string>;
}

// ========== MOCK DATA ==========

export const mockUsers: User[] = [
  {
    id: 'U001',
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@email.com',
    phone: '0901234567',
    role: 'customer',
    status: 'active',
    createdAt: '2025-01-15',
    purchaseHistory: [
      { voucherId: 'V003', voucherName: 'Buffet Pizza Hut 2 người', amount: 350000, date: '2025-03-10', codeStatus: 'used' },
      { voucherId: 'V005', voucherName: 'Cắt tóc nam cao cấp', amount: 120000, date: '2025-04-02', codeStatus: 'unused' },
    ],
    adminHistory: [],
  },
  {
    id: 'U002',
    name: 'Trần Thị Bích',
    email: 'bich.tran@email.com',
    phone: '0912345678',
    role: 'customer',
    status: 'locked',
    createdAt: '2024-11-20',
    purchaseHistory: [
      { voucherId: 'V001', voucherName: 'Spa Thư Giãn', amount: 450000, date: '2024-12-15', codeStatus: 'disabled' },
    ],
    adminHistory: [
      { timestamp: '2025-02-10 14:30', action: 'Khóa tài khoản', executor: 'Admin Hệ thống', before: 'Đang hoạt động', after: 'Bị khóa', reason: 'Vi phạm điều khoản sử dụng: yêu cầu hoàn tiền gian lận.' },
    ],
  },
  {
    id: 'U003',
    name: 'Lê Minh Tuấn',
    email: 'tuan.le@partner.com',
    phone: '0923456789',
    role: 'partner',
    status: 'active',
    createdAt: '2024-09-05',
    purchaseHistory: [],
    adminHistory: [],
  },
  {
    id: 'U004',
    name: 'Phạm Thị Lan',
    email: 'lan.pham@email.com',
    phone: '0934567890',
    role: 'partner_staff',
    status: 'active',
    createdAt: '2025-03-01',
    purchaseHistory: [],
    adminHistory: [],
  },
  {
    id: 'U005',
    name: 'Hoàng Đức Mạnh',
    email: 'manh.hoang@email.com',
    phone: '0945678901',
    role: 'customer',
    status: 'active',
    createdAt: '2025-05-10',
    purchaseHistory: [
      { voucherId: 'V002', voucherName: 'Bữa ăn Nhật tại Sushi World', amount: 280000, date: '2025-06-01', codeStatus: 'used' },
    ],
    adminHistory: [],
  },
];

export const mockPartners: Partner[] = [
  {
    id: 'P001',
    businessName: 'Pizza Hut Vietnam',
    taxCode: '0123456789',
    representative: 'Nguyễn Thành Công',
    phone: '028-38123456',
    email: 'contact@pizzahut.vn',
    address: '123 Nguyễn Huệ, Q1, TP.HCM',
    profileStatus: 'pending',
    branches: [
      { id: 'B001', name: 'Chi nhánh Nguyễn Huệ', address: '123 Nguyễn Huệ, Q1', phone: '028-38123457', status: 'active', voucherScope: 'Toàn bộ menu' },
      { id: 'B002', name: 'Chi nhánh Lê Lợi', address: '45 Lê Lợi, Q1', phone: '028-38123458', status: 'active', voucherScope: 'Toàn bộ menu' },
    ],
    branchRequests: [
      {
        id: 'BR001', partnerId: 'P001', type: 'add', requestedAt: '2025-07-10', status: 'pending',
        proposed: { name: 'Chi nhánh Quận 3', address: '78 Võ Văn Tần, Q3', phone: '028-39123456', voucherScope: 'Toàn bộ menu' }
      }
    ],
    documents: ['giay_phep_kinh_doanh.pdf', 'dang_ky_thue.pdf'],
    createdAt: '2025-06-01',
    adminHistory: [],
  },
  {
    id: 'P002',
    businessName: 'Sushi World',
    taxCode: '0987654321',
    representative: 'Trần Minh Tú',
    phone: '028-39234567',
    email: 'info@sushiworld.vn',
    address: '56 Hai Bà Trưng, Q1, TP.HCM',
    profileStatus: 'approved',
    branches: [
      { id: 'B003', name: 'Chi nhánh Hai Bà Trưng', address: '56 Hai Bà Trưng, Q1', phone: '028-39234568', status: 'active', voucherScope: 'Combo và Set meal' },
      { id: 'B004', name: 'Chi nhánh Đinh Tiên Hoàng', address: '120 Đinh Tiên Hoàng, Q1', phone: '028-39234569', status: 'suspended', voucherScope: 'Combo và Set meal' },
    ],
    branchRequests: [
      {
        id: 'BR002', partnerId: 'P002', type: 'edit', requestedAt: '2025-07-08', status: 'pending',
        branchId: 'B003',
        current: { name: 'Chi nhánh Hai Bà Trưng', address: '56 Hai Bà Trưng, Q1', phone: '028-39234568', voucherScope: 'Combo và Set meal' },
        proposed: { name: 'Chi nhánh Hai Bà Trưng (Mới)', address: '58 Hai Bà Trưng, Q1', phone: '028-39234570', voucherScope: 'Toàn bộ menu' }
      }
    ],
    documents: ['giay_phep_kinh_doanh.pdf'],
    createdAt: '2024-08-15',
    adminHistory: [
      { timestamp: '2024-09-01 10:00', action: 'Duyệt hồ sơ đối tác', executor: 'Admin Hệ thống', before: 'Chờ duyệt', after: 'Đã duyệt', reason: 'Hồ sơ đầy đủ và hợp lệ.' },
    ],
  },
  {
    id: 'P003',
    businessName: 'Barber King',
    taxCode: '0112233445',
    representative: 'Lê Văn Hùng',
    phone: '090-5678901',
    email: 'barbershop@barberking.vn',
    address: '89 Cách Mạng Tháng 8, Q10, TP.HCM',
    profileStatus: 'rejected',
    branches: [],
    branchRequests: [],
    documents: ['giay_phep_kinh_doanh.pdf'],
    createdAt: '2025-05-20',
    adminHistory: [
      { timestamp: '2025-06-05 09:15', action: 'Từ chối hồ sơ đối tác', executor: 'Admin Hệ thống', before: 'Chờ duyệt', after: 'Bị từ chối', reason: 'Mã số thuế không hợp lệ theo xác minh cơ quan thuế.' },
    ],
  },
  {
    id: 'P004',
    businessName: 'Café Highlands',
    taxCode: '0556677889',
    representative: 'Ngô Thị Mai',
    phone: '028-35678901',
    email: 'partner@highlands.vn',
    address: '200 Lý Tự Trọng, Q1, TP.HCM',
    profileStatus: 'locked',
    branches: [
      { id: 'B005', name: 'Chi nhánh Lý Tự Trọng', address: '200 Lý Tự Trọng, Q1', phone: '028-35678902', status: 'active', voucherScope: 'Toàn bộ đồ uống' },
    ],
    branchRequests: [],
    documents: ['giay_phep_kinh_doanh.pdf', 'hop_dong_hop_tac.pdf'],
    createdAt: '2024-06-01',
    adminHistory: [
      { timestamp: '2024-07-01 08:00', action: 'Duyệt hồ sơ đối tác', executor: 'Admin Hệ thống', before: 'Chờ duyệt', after: 'Đã duyệt', reason: '' },
      { timestamp: '2025-07-01 16:00', action: 'Khóa đối tác', executor: 'Admin Hệ thống', before: 'Hoạt động', after: 'Bị khóa', reason: 'Nhận nhiều khiếu nại về chất lượng dịch vụ không đúng voucher.' },
    ],
  },
];

export const mockVouchers: Voucher[] = [
  {
    id: 'V001',
    name: 'Buffet Pizza Hut 2 người',
    description: 'Trải nghiệm buffet pizza không giới hạn cho 2 người tại Pizza Hut. Áp dụng tất cả các ngày trong tuần.',
    category: 'Ẩm thực',
    partnerId: 'P001',
    partnerName: 'Pizza Hut Vietnam',
    originalPrice: 500000,
    salePrice: 350000,
    startDate: '2025-07-20',
    endDate: '2025-12-31',
    quantity: 200,
    soldCount: 0,
    reviewStatus: 'pending',
    publicationStatus: 'unpublished',
    branches: ['Chi nhánh Nguyễn Huệ', 'Chi nhánh Lê Lợi'],
    conditions: 'Đặt bàn trước 1 ngày. Áp dụng từ 11:00 - 21:00. Không áp dụng ngày lễ Tết.',
    usageLimit: 1,
    submittedAt: '2025-07-14 09:00',
  },
  {
    id: 'V002',
    name: 'Set Sushi cao cấp 2 người',
    description: 'Bộ sushi cao cấp với 30 miếng tươi ngon kèm súp miso và nước uống.',
    category: 'Ẩm thực',
    partnerId: 'P002',
    partnerName: 'Sushi World',
    originalPrice: 450000,
    salePrice: 280000,
    startDate: '2025-07-01',
    endDate: '2025-09-30',
    quantity: 100,
    soldCount: 47,
    reviewStatus: 'approved',
    publicationStatus: 'selling',
    branches: ['Chi nhánh Hai Bà Trưng'],
    conditions: 'Đặt trước 2 tiếng. Áp dụng từ 10:00 - 22:00.',
    usageLimit: 1,
    submittedAt: '2025-06-20 14:30',
    reviewedAt: '2025-06-22 10:00',
  },
  {
    id: 'V003',
    name: 'Cắt tóc nam cao cấp',
    description: 'Cắt tóc + gội đầu + cạo râu bằng dao cạo thẳng tại Barber King.',
    category: 'Làm đẹp',
    partnerId: 'P003',
    partnerName: 'Barber King',
    originalPrice: 200000,
    salePrice: 250000,
    startDate: '2025-08-01',
    endDate: '2025-12-31',
    quantity: 50,
    soldCount: 0,
    reviewStatus: 'pending',
    publicationStatus: 'unpublished',
    branches: ['Chi nhánh Cách Mạng'],
    conditions: 'Áp dụng tất cả các ngày.',
    usageLimit: 1,
    submittedAt: '2025-07-13 11:00',
  },
  {
    id: 'V004',
    name: 'Cà phê Highlands combo sáng',
    description: 'Combo cà phê + bánh ngọt buổi sáng tại Highlands Coffee.',
    category: 'Đồ uống',
    partnerId: 'P004',
    partnerName: 'Café Highlands',
    originalPrice: 90000,
    salePrice: 65000,
    startDate: '2025-06-01',
    endDate: '2025-07-31',
    quantity: 500,
    soldCount: 500,
    reviewStatus: 'approved',
    publicationStatus: 'sold_out',
    branches: ['Chi nhánh Lý Tự Trọng'],
    conditions: 'Áp dụng từ 7:00 - 10:00 hàng ngày.',
    usageLimit: 1,
    submittedAt: '2025-05-28 16:00',
    reviewedAt: '2025-05-30 09:00',
  },
  {
    id: 'V005',
    name: 'Spa Thư Giãn 60 phút',
    description: 'Trị liệu thư giãn toàn thân 60 phút bằng đá nóng và tinh dầu thảo mộc.',
    category: 'Chăm sóc sức khỏe',
    partnerId: 'P002',
    partnerName: 'Sushi World',
    originalPrice: 600000,
    salePrice: 380000,
    startDate: '2025-09-01',
    endDate: '2025-12-31',
    quantity: 80,
    soldCount: 0,
    reviewStatus: 'approved',
    publicationStatus: 'scheduled',
    branches: ['Chi nhánh Hai Bà Trưng'],
    conditions: 'Đặt lịch trước 24 giờ. Không áp dụng cuối tuần.',
    usageLimit: 1,
    submittedAt: '2025-07-05 10:00',
    reviewedAt: '2025-07-07 14:00',
  },
  {
    id: 'V006',
    name: 'Buffet hải sản tươi sống',
    description: 'Buffet hải sản không giới hạn với hơn 30 loại hải sản tươi ngon.',
    category: 'Ẩm thực',
    partnerId: 'P002',
    partnerName: 'Sushi World',
    originalPrice: 700000,
    salePrice: 520000,
    startDate: '2025-07-15',
    endDate: '2025-10-15',
    quantity: 150,
    soldCount: 23,
    reviewStatus: 'approved',
    publicationStatus: 'hidden',
    branches: ['Chi nhánh Hai Bà Trưng', 'Chi nhánh Đinh Tiên Hoàng'],
    conditions: 'Áp dụng từ 17:00 - 22:00. Không áp dụng ngày lễ.',
    usageLimit: 2,
    submittedAt: '2025-07-01 09:00',
    reviewedAt: '2025-07-03 11:00',
  },
];

export const mockOrders: Order[] = [
  {
    id: 'ORD001',
    customerId: 'U001',
    customerName: 'Nguyễn Văn An',
    voucherId: 'V002',
    voucherName: 'Set Sushi cao cấp 2 người',
    partnerId: 'P002',
    partnerName: 'Sushi World',
    total: 280000,
    orderStatus: 'paid',
    paymentStatus: 'success',
    voucherCodeStatus: 'unused',
    voucherCode: 'SUSHI-7X9K2M',
    createdAt: '2025-07-10 15:30',
    paymentHistory: [
      { id: 'PAY001', timestamp: '2025-07-10 15:30', action: 'Tạo đơn thanh toán', amount: 280000, status: 'pending', note: 'Khởi tạo giao dịch mô phỏng' },
      { id: 'PAY002', timestamp: '2025-07-10 15:31', action: 'Xác nhận thanh toán', amount: 280000, status: 'success', note: 'Thanh toán mô phỏng thành công' },
    ],
    codeHistory: [
      { id: 'CODE001', timestamp: '2025-07-10 15:32', action: 'Phát hành mã', code: 'SUSHI-7X9K2M', status: 'issued', note: 'Mã được sinh và gửi email mô phỏng thành công' },
    ],
  },
  {
    id: 'ORD002',
    customerId: 'U005',
    customerName: 'Hoàng Đức Mạnh',
    voucherId: 'V002',
    voucherName: 'Set Sushi cao cấp 2 người',
    partnerId: 'P002',
    partnerName: 'Sushi World',
    total: 280000,
    orderStatus: 'paid',
    paymentStatus: 'success',
    voucherCodeStatus: 'generation_error',
    createdAt: '2025-07-12 10:00',
    paymentHistory: [
      { id: 'PAY003', timestamp: '2025-07-12 10:00', action: 'Tạo đơn thanh toán', amount: 280000, status: 'pending', note: '' },
      { id: 'PAY004', timestamp: '2025-07-12 10:01', action: 'Xác nhận thanh toán', amount: 280000, status: 'success', note: 'Thanh toán mô phỏng thành công' },
    ],
    codeHistory: [
      { id: 'CODE002', timestamp: '2025-07-12 10:02', action: 'Phát hành mã (thất bại)', status: 'generation_error', note: 'Lỗi: Không thể kết nối đến dịch vụ sinh mã. Timeout sau 30 giây.' },
    ],
  },
  {
    id: 'ORD003',
    customerId: 'U001',
    customerName: 'Nguyễn Văn An',
    voucherId: 'V004',
    voucherName: 'Cà phê Highlands combo sáng',
    partnerId: 'P004',
    partnerName: 'Café Highlands',
    total: 65000,
    orderStatus: 'pending_refund',
    paymentStatus: 'success',
    voucherCodeStatus: 'unused',
    voucherCode: 'HL-3YU89P',
    createdAt: '2025-07-08 08:00',
    paymentHistory: [
      { id: 'PAY005', timestamp: '2025-07-08 08:00', action: 'Xác nhận thanh toán', amount: 65000, status: 'success', note: '' },
    ],
    codeHistory: [
      { id: 'CODE003', timestamp: '2025-07-08 08:01', action: 'Phát hành mã', code: 'HL-3YU89P', status: 'issued', note: '' },
    ],
    refundRequest: { reason: 'Voucher hết hạn trước thời hạn do đối tác thay đổi chính sách.', requestedAt: '2025-07-14 09:00' },
  },
  {
    id: 'ORD004',
    customerId: 'U002',
    customerName: 'Trần Thị Bích',
    voucherId: 'V005',
    voucherName: 'Spa Thư Giãn 60 phút',
    partnerId: 'P002',
    partnerName: 'Sushi World',
    total: 380000,
    orderStatus: 'refunded',
    paymentStatus: 'refunded_sim',
    voucherCodeStatus: 'disabled',
    voucherCode: 'SPA-K91MP3',
    createdAt: '2025-06-20 14:00',
    paymentHistory: [
      { id: 'PAY006', timestamp: '2025-06-20 14:00', action: 'Xác nhận thanh toán', amount: 380000, status: 'success', note: '' },
      { id: 'PAY007', timestamp: '2025-06-25 10:00', action: 'Hoàn tiền mô phỏng', amount: 380000, status: 'refunded_sim', note: 'Admin ghi nhận hoàn tiền mô phỏng' },
    ],
    codeHistory: [
      { id: 'CODE004', timestamp: '2025-06-20 14:01', action: 'Phát hành mã', code: 'SPA-K91MP3', status: 'issued', note: '' },
      { id: 'CODE005', timestamp: '2025-06-25 10:01', action: 'Vô hiệu hóa mã', code: 'SPA-K91MP3', status: 'disabled', note: 'Vô hiệu hóa do hoàn tiền mô phỏng' },
    ],
    refundRequest: { reason: 'Khách hàng không thể sử dụng do bệnh. Yêu cầu hoàn tiền theo chính sách.', requestedAt: '2025-06-23 11:00' },
  },
  {
    id: 'ORD005',
    customerId: 'U001',
    customerName: 'Nguyễn Văn An',
    voucherId: 'V006',
    voucherName: 'Buffet hải sản tươi sống',
    partnerId: 'P002',
    partnerName: 'Sushi World',
    total: 520000,
    orderStatus: 'paid',
    paymentStatus: 'success',
    voucherCodeStatus: 'used',
    voucherCode: 'SEA-2VK87J',
    createdAt: '2025-07-05 19:00',
    paymentHistory: [
      { id: 'PAY008', timestamp: '2025-07-05 19:00', action: 'Xác nhận thanh toán', amount: 520000, status: 'success', note: '' },
    ],
    codeHistory: [
      { id: 'CODE006', timestamp: '2025-07-05 19:01', action: 'Phát hành mã', code: 'SEA-2VK87J', status: 'issued', note: '' },
      { id: 'CODE007', timestamp: '2025-07-06 18:30', action: 'Xác thực sử dụng', code: 'SEA-2VK87J', status: 'used', note: 'Nhân viên xác thực tại Chi nhánh Hai Bà Trưng' },
    ],
  },
  {
    id: 'ORD006',
    customerId: 'U005',
    customerName: 'Hoàng Đức Mạnh',
    voucherId: 'V004',
    voucherName: 'Cà phê Highlands combo sáng',
    partnerId: 'P004',
    partnerName: 'Café Highlands',
    total: 65000,
    orderStatus: 'pending_payment',
    paymentStatus: 'pending',
    voucherCodeStatus: 'not_issued',
    createdAt: '2025-07-15 07:30',
    paymentHistory: [
      { id: 'PAY009', timestamp: '2025-07-15 07:30', action: 'Tạo đơn thanh toán', amount: 65000, status: 'pending', note: '' },
    ],
    codeHistory: [],
  },
];

export const mockContent: ContentItem[] = [
  { id: 'CT001', type: 'category', title: 'Ẩm thực', status: 'visible', displayPosition: 'Menu chính', updatedAt: '2025-07-01 09:00', updatedBy: 'Admin Hệ thống' },
  { id: 'CT002', type: 'category', title: 'Làm đẹp', status: 'visible', displayPosition: 'Menu chính', updatedAt: '2025-07-01 09:00', updatedBy: 'Admin Hệ thống' },
  { id: 'CT003', type: 'category', title: 'Du lịch', status: 'hidden', displayPosition: 'Menu chính', updatedAt: '2025-06-15 10:00', updatedBy: 'Admin Hệ thống' },
  { id: 'CT004', type: 'category', title: 'Giải trí (Cũ)', status: 'stopped', displayPosition: 'Ẩn', updatedAt: '2025-05-01 08:00', updatedBy: 'Admin Hệ thống' },
  { id: 'CT005', type: 'banner', title: 'Banner Flash Sale 7/7', status: 'visible', displayPosition: 'Trang chủ - Đầu trang', updatedAt: '2025-07-07 08:00', updatedBy: 'Admin Hệ thống' },
  { id: 'CT006', type: 'banner', title: 'Banner Khai trương đối tác mới', status: 'hidden', displayPosition: 'Trang chủ - Giữa trang', updatedAt: '2025-06-20 14:00', updatedBy: 'Admin Hệ thống' },
  { id: 'CT007', type: 'banner', title: 'Banner Mừng sinh nhật 2024', status: 'stopped', displayPosition: 'Ẩn', updatedAt: '2024-12-31 23:59', updatedBy: 'Admin Hệ thống' },
  { id: 'CT008', type: 'article', title: 'Hướng dẫn sử dụng voucher lần đầu', status: 'visible', displayPosition: 'Blog', updatedAt: '2025-06-01 10:00', updatedBy: 'Admin Hệ thống' },
  { id: 'CT009', type: 'article', title: 'Top 10 nhà hàng đáng thử 2025', status: 'hidden', displayPosition: 'Blog', updatedAt: '2025-07-10 11:00', updatedBy: 'Admin Hệ thống' },
  { id: 'CT010', type: 'article', title: 'Bài viết thử nghiệm tháng 4', status: 'stopped', displayPosition: 'Ẩn', updatedAt: '2025-04-30 17:00', updatedBy: 'Admin Hệ thống' },
  { id: 'CT011', type: 'popup', title: 'Popup Chào mừng người dùng mới', status: 'visible', displayPosition: 'Toàn trang', updatedAt: '2025-07-01 09:00', updatedBy: 'Admin Hệ thống' },
  { id: 'CT012', type: 'popup', title: 'Popup khuyến mãi tháng 6', status: 'hidden', displayPosition: 'Trang chủ', updatedAt: '2025-06-30 23:59', updatedBy: 'Admin Hệ thống' },
  { id: 'CT013', type: 'popup', title: 'Popup thông báo bảo trì cũ', status: 'stopped', displayPosition: 'Ẩn', updatedAt: '2025-03-15 06:00', updatedBy: 'Admin Hệ thống' },
  { id: 'CT014', type: 'policy', title: 'Chính sách hoàn tiền', status: 'visible', displayPosition: 'Trang chính sách', updatedAt: '2025-01-10 09:00', updatedBy: 'Admin Hệ thống' },
  { id: 'CT015', type: 'policy', title: 'Điều khoản sử dụng', status: 'visible', displayPosition: 'Trang chính sách', updatedAt: '2025-01-10 09:00', updatedBy: 'Admin Hệ thống' },
  { id: 'CT016', type: 'policy', title: 'Chính sách bảo mật (Phiên bản cũ)', status: 'stopped', displayPosition: 'Ẩn', updatedAt: '2024-12-01 09:00', updatedBy: 'Admin Hệ thống' },
];

export const mockLogs: SystemLog[] = [
  { id: 'LOG001', timestamp: '2025-07-14 16:05', executor: 'Admin Hệ thống', module: 'users', action: 'Khóa tài khoản', target: 'Trần Thị Bích', targetId: 'U002', beforeStatus: 'Đang hoạt động', afterStatus: 'Bị khóa', result: 'success', reason: 'Vi phạm điều khoản sử dụng: yêu cầu hoàn tiền gian lận.' },
  { id: 'LOG002', timestamp: '2025-07-14 14:30', executor: 'Admin Hệ thống', module: 'vouchers', action: 'Phê duyệt voucher', target: 'Set Sushi cao cấp 2 người', targetId: 'V002', beforeStatus: 'reviewStatus: Chờ duyệt | publicationStatus: Chưa công bố', afterStatus: 'reviewStatus: Đã duyệt | publicationStatus: Đang bán', result: 'success', reason: 'Voucher hợp lệ đầy đủ.' },
  { id: 'LOG003', timestamp: '2025-07-13 11:20', executor: 'Admin Hệ thống', module: 'orders', action: 'Hoàn tiền mô phỏng', target: 'ORD004', targetId: 'ORD004', beforeStatus: 'Chờ hoàn tiền', afterStatus: 'Đã hoàn tiền', result: 'success', reason: 'Khách hàng không thể sử dụng do bệnh. Đủ điều kiện theo chính sách.' },
  { id: 'LOG004', timestamp: '2025-07-12 10:02', executor: 'Hệ thống', module: 'orders', action: 'Phát hành voucher code', target: 'ORD002', targetId: 'ORD002', beforeStatus: 'Chưa phát hành', afterStatus: 'Lỗi sinh mã', result: 'failed', errorMessage: 'Timeout kết nối đến dịch vụ sinh mã sau 30 giây.' },
  { id: 'LOG005', timestamp: '2025-07-10 09:30', executor: 'Admin Hệ thống', module: 'partners', action: 'Từ chối hồ sơ đối tác', target: 'Barber King', targetId: 'P003', beforeStatus: 'Chờ duyệt', afterStatus: 'Bị từ chối', result: 'success', reason: 'Mã số thuế không hợp lệ theo xác minh cơ quan thuế.' },
  { id: 'LOG006', timestamp: '2025-07-09 15:00', executor: 'Admin Hệ thống', module: 'partners', action: 'Khóa đối tác', target: 'Café Highlands', targetId: 'P004', beforeStatus: 'Hoạt động', afterStatus: 'Bị khóa', result: 'success', reason: 'Nhận nhiều khiếu nại về chất lượng dịch vụ không đúng voucher.' },
  { id: 'LOG007', timestamp: '2025-07-08 14:10', executor: 'Admin Hệ thống', module: 'content', action: 'Tạm ẩn nội dung', target: 'Banner Khai trương đối tác mới', targetId: 'CT006', beforeStatus: 'Đang hiển thị', afterStatus: 'Tạm ẩn', result: 'success', reason: 'Đối tác yêu cầu tạm ẩn để cập nhật thông tin.' },
  { id: 'LOG008', timestamp: '2025-07-07 09:00', executor: 'Admin Hệ thống', module: 'users', action: 'Cập nhật vai trò', target: 'Phạm Thị Lan', targetId: 'U004', beforeStatus: 'Khách hàng', afterStatus: 'Nhân viên đối tác', result: 'success', reason: '' },
  { id: 'LOG009', timestamp: '2025-07-05 16:45', executor: 'Admin Hệ thống', module: 'vouchers', action: 'Từ chối voucher', target: 'Cắt tóc nam cao cấp (lần 1)', targetId: 'V003', beforeStatus: 'Chờ duyệt', afterStatus: 'Bị từ chối', result: 'success', reason: 'Giá bán (250.000đ) lớn hơn giá gốc (200.000đ). Thông tin giá không hợp lệ.' },
  { id: 'LOG010', timestamp: '2025-07-03 11:00', executor: 'Admin Hệ thống', module: 'orders', action: 'Cấp lại voucher code', target: 'ORD002', targetId: 'ORD002', beforeStatus: 'Lỗi sinh mã', afterStatus: 'Đã phát hành', result: 'failed', errorMessage: 'Lỗi hệ thống khi ghi log bắt buộc. Thao tác bị hủy để đảm bảo tính nhất quán.' },
];

// ========== HELPER LABELS ==========

export const roleLabels: Record<UserRole, string> = {
  customer: 'Khách hàng',
  partner: 'Đối tác',
  partner_staff: 'Nhân viên đối tác',
  admin: 'Quản trị viên',
};

export const profileStatusLabels: Record<PartnerProfileStatus, string> = {
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Bị từ chối',
  locked: 'Bị khóa',
};

export const reviewStatusLabels: Record<ReviewStatus, string> = {
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Bị từ chối',
};

export const publicationStatusLabels: Record<PublicationStatus, string> = {
  unpublished: 'Chưa công bố',
  scheduled: 'Chờ hiển thị',
  selling: 'Đang bán',
  hidden: 'Tạm ẩn',
  stopped: 'Ngừng bán',
  expired: 'Hết hạn',
  sold_out: 'Hết số lượng',
};

export const orderStatusLabels: Record<OrderStatus, string> = {
  created: 'Đã tạo',
  pending_payment: 'Chờ thanh toán',
  paid: 'Đã thanh toán',
  pending_refund: 'Chờ hoàn tiền',
  refunded: 'Đã hoàn tiền',
  cancelled: 'Đã hủy',
  refund_rejected: 'Hủy yêu cầu hoàn tiền',
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  pending: 'Chờ thanh toán',
  success: 'Thành công',
  failed: 'Thất bại',
  refunded_sim: 'Đã hoàn tiền mô phỏng',
};

export const voucherCodeStatusLabels: Record<VoucherCodeStatus, string> = {
  not_issued: 'Chưa phát hành',
  issued: 'Đã phát hành',
  generation_error: 'Lỗi sinh mã',
  unused: 'Chưa sử dụng',
  used: 'Đã sử dụng',
  expired: 'Hết hạn',
  cancelled: 'Bị hủy',
  disabled: 'Vô hiệu hóa',
};

export const contentStatusLabels: Record<ContentStatus, string> = {
  visible: 'Đang hiển thị',
  hidden: 'Tạm ẩn',
  stopped: 'Ngừng hiển thị',
};

export const contentTypeLabels: Record<ContentType, string> = {
  category: 'Danh mục',
  banner: 'Banner',
  article: 'Bài viết',
  popup: 'Popup',
  policy: 'Chính sách',
};

export const moduleLabels: Record<LogModule, string> = {
  users: 'Người dùng',
  partners: 'Đối tác',
  vouchers: 'Voucher',
  orders: 'Đơn hàng',
  content: 'Nội dung',
};
