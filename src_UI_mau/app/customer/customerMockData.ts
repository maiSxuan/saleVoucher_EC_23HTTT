// Customer Storefront — Mock Data

export type CustomerAccountStatus = 'active' | 'temp_locked' | 'admin_locked';
export type VoucherAvailability = 'selling' | 'sold_out' | 'expired' | 'suspended' | 'stopped' | 'scheduled';
export type CartItemStatus = 'valid' | 'unavailable' | 'qty_exceeded';
export type OrderStatus = 'pending_payment' | 'paid' | 'refunded' | 'cancelled';
export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded_sim';
export type CodeStatus = 'pending_issue' | 'issued_unused' | 'used' | 'expired' | 'cancelled' | 'disabled' | 'error';
export type ReviewStatus = 'not_reviewed' | 'reviewed';

export interface CustomerVoucher {
  id: string;
  name: string;
  partner: string;
  category: string;
  image: string;
  originalPrice: number;
  salePrice: number;
  description: string;
  conditions: string;
  cancellationPolicy: string;
  startSaleDate: string;
  endSaleDate: string;
  startUseDate: string;
  endUseDate: string;
  branches: string[];
  totalQty: number;
  soldQty: number;
  availability: VoucherAvailability;
  rating?: number;
  reviewCount?: number;
  reviews?: CustomerReview[];
}

export interface CustomerReview {
  id: string;
  authorName: string;
  comment: string;
  createdAt: string;
  voucherId: string;
}

export interface CartItem {
  voucherId: string;
  quantity: number;
  status: CartItemStatus;
}

export interface CustomerOrder {
  id: string;
  customerId: string;
  items: { voucherId: string; quantity: number; unitPrice: number }[];
  total: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  codeStatus: CodeStatus;
  createdAt: string;
  paidAt?: string;
  codes: VoucherCode[];
  reviewStatus: ReviewStatus;
}

export interface VoucherCode {
  id: string;
  orderId: string;
  code: string;
  voucherId: string;
  voucherName: string;
  partner: string;
  branches: string[];
  validUntil: string;
  status: CodeStatus;
  usedAt?: string;
  usedBranch?: string;
  issuedAt?: string;
}

export interface CustomerAccount {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  status: CustomerAccountStatus;
  failedLoginCount: number;
  joinedAt: string;
}

// ---- Vouchers (public catalog) ----
export const mockCustomerVouchers: CustomerVoucher[] = [
  {
    id: 'CV001',
    name: 'Buffet Lẩu Hải Sản Cao Cấp - 2 Người',
    partner: 'Nhà hàng Biển Đông',
    category: 'Ẩm thực',
    image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&h=250&fit=crop',
    originalPrice: 850000,
    salePrice: 520000,
    description: 'Trải nghiệm buffet hải sản cao cấp cho 2 người với hơn 30 món lẩu và hải sản tươi sống. Bao gồm nước uống và phục vụ tận bàn.',
    conditions: 'Áp dụng cho 2 người. Chỉ dùng 1 lần. Đặt bàn trước 1 ngày.',
    cancellationPolicy: 'Không hoàn tiền sau khi mua.',
    startSaleDate: '2026-07-01',
    endSaleDate: '2026-08-31',
    startUseDate: '2026-07-01',
    endUseDate: '2026-08-31',
    branches: ['Chi nhánh Quận 1', 'Chi nhánh Quận 7'],
    totalQty: 200,
    soldQty: 145,
    availability: 'selling',
    rating: 4.7,
    reviewCount: 89,
    reviews: [
      { id: 'R001', authorName: 'Nguyễn Lan', comment: 'Hải sản tươi ngon, phục vụ nhanh. Sẽ quay lại!', createdAt: '10/07/2026', voucherId: 'CV001' },
      { id: 'R002', authorName: 'Trần Văn Hùng', comment: 'Giá tốt, chất lượng ổn. Cơm buffet khá nhiều món.', createdAt: '12/07/2026', voucherId: 'CV001' },
    ],
  },
  {
    id: 'CV002',
    name: 'Spa & Massage Toàn Thân 90 Phút',
    partner: 'Lotus Spa Center',
    category: 'Làm đẹp & Spa',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=250&fit=crop',
    originalPrice: 600000,
    salePrice: 320000,
    description: 'Gói massage toàn thân 90 phút với tinh dầu thiên nhiên, bao gồm ngâm chân thảo dược và đắp mặt nạ dưỡng ẩm.',
    conditions: 'Đặt lịch trước tối thiểu 24 giờ. 1 người/voucher.',
    cancellationPolicy: 'Hủy trước 24h được đổi lịch, không hoàn tiền.',
    startSaleDate: '2026-06-15',
    endSaleDate: '2026-09-30',
    startUseDate: '2026-06-15',
    endUseDate: '2026-09-30',
    branches: ['Chi nhánh Quận 3', 'Chi nhánh Bình Thạnh'],
    totalQty: 150,
    soldQty: 98,
    availability: 'selling',
    rating: 4.9,
    reviewCount: 134,
    reviews: [
      { id: 'R003', authorName: 'Lê Thị Mai', comment: 'Dịch vụ tuyệt vời, chuyên viên tay nghề cao, không gian thư giãn.', createdAt: '08/07/2026', voucherId: 'CV002' },
    ],
  },
  {
    id: 'CV003',
    name: 'Combo Bánh Ngọt & Cà Phê - 3 Món',
    partner: 'The Cake House',
    category: 'Cà phê & Bánh',
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=250&fit=crop',
    originalPrice: 280000,
    salePrice: 159000,
    description: '3 món bánh ngọt Pháp kết hợp với 2 ly cà phê Arabica cao cấp. Phù hợp cho 2 người.',
    conditions: 'Không áp dụng cuối tuần. Thứ 2–Thứ 6.',
    cancellationPolicy: 'Không hoàn tiền.',
    startSaleDate: '2026-07-10',
    endSaleDate: '2026-09-10',
    startUseDate: '2026-07-10',
    endUseDate: '2026-09-10',
    branches: ['Chi nhánh Quận 1', 'Chi nhánh Quận Bình Thạnh'],
    totalQty: 300,
    soldQty: 197,
    availability: 'selling',
    rating: 4.5,
    reviewCount: 203,
    reviews: [
      { id: 'R004', authorName: 'Phạm Quốc Bảo', comment: 'Bánh thơm ngon, giá rất tốt!', createdAt: '14/07/2026', voucherId: 'CV003' },
    ],
  },
  {
    id: 'CV004',
    name: 'Vé Xem Phim CGV + Bắp Rang Lớn',
    partner: 'CGV Cinemas Vietnam',
    category: 'Giải trí',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=250&fit=crop',
    originalPrice: 220000,
    salePrice: 145000,
    description: '1 vé xem phim bất kỳ (trừ phim IMAX và 4DX) kèm 1 bắp rang cỡ lớn tại CGV.',
    conditions: 'Hợp lệ với phim 2D và 3D. Không áp dụng phim đặc biệt.',
    cancellationPolicy: 'Không đổi/hoàn tiền sau khi mua.',
    startSaleDate: '2026-07-01',
    endSaleDate: '2026-08-15',
    startUseDate: '2026-07-01',
    endUseDate: '2026-08-15',
    branches: ['CGV Vincom Đồng Khởi', 'CGV Hùng Vương Plaza'],
    totalQty: 500,
    soldQty: 500,
    availability: 'sold_out',
    rating: 4.3,
    reviewCount: 412,
    reviews: [],
  },
  {
    id: 'CV005',
    name: 'Phòng Khách Sạn 4 Sao Đà Lạt - 1 Đêm',
    partner: 'Dalat Palace Resort',
    category: 'Du lịch & Khách sạn',
    image: 'https://images.unsplash.com/photo-1455587734955-081b22074882?w=400&h=250&fit=crop',
    originalPrice: 2500000,
    salePrice: 1450000,
    description: 'Phòng Superior cho 2 người tại khách sạn 4 sao Đà Lạt, bao gồm bữa sáng và quyền sử dụng hồ bơi.',
    conditions: 'Không áp dụng dịp lễ Tết. Đặt phòng trước 3 ngày.',
    cancellationPolicy: 'Miễn phí hủy trước 48h. Sau đó tính 50% giá.',
    startSaleDate: '2026-07-01',
    endSaleDate: '2026-10-31',
    startUseDate: '2026-07-01',
    endUseDate: '2026-10-31',
    branches: ['Dalat Palace - Khu A', 'Dalat Palace - Khu B'],
    totalQty: 80,
    soldQty: 23,
    availability: 'selling',
    rating: 4.8,
    reviewCount: 45,
    reviews: [],
  },
  {
    id: 'CV006',
    name: 'Khóa Học Yoga 1 Tháng Không Giới Hạn',
    partner: 'Yoga Zone Vietnam',
    category: 'Thể thao & Sức khỏe',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=250&fit=crop',
    originalPrice: 1800000,
    salePrice: 890000,
    description: 'Thẻ tập yoga 1 tháng không giới hạn số buổi tại bất kỳ chi nhánh Yoga Zone. Hơn 20 buổi lớp mỗi tuần.',
    conditions: 'Kích hoạt trong vòng 30 ngày từ ngày mua. Không chuyển nhượng.',
    cancellationPolicy: 'Không hoàn tiền sau khi kích hoạt.',
    startSaleDate: '2026-06-01',
    endSaleDate: '2026-07-10',
    startUseDate: '2026-06-01',
    endUseDate: '2026-08-10',
    branches: ['Chi nhánh Quận 1', 'Chi nhánh Quận 3', 'Chi nhánh Tân Bình'],
    totalQty: 120,
    soldQty: 120,
    availability: 'expired',
    rating: 4.6,
    reviewCount: 78,
    reviews: [],
  },
  {
    id: 'CV007',
    name: 'Set Sushi Premium Nhật Bản - 2 Người',
    partner: 'Sakura Japanese Restaurant',
    category: 'Ẩm thực',
    image: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&h=250&fit=crop',
    originalPrice: 980000,
    salePrice: 620000,
    description: 'Set sushi cao cấp gồm 20 miếng sushi tươi, miso soup và món tráng miệng mochi Nhật Bản. Cho 2 người.',
    conditions: '1 voucher/bàn. Cần đặt chỗ trước.',
    cancellationPolicy: 'Không hoàn tiền.',
    startSaleDate: '2026-07-05',
    endSaleDate: '2026-09-05',
    startUseDate: '2026-07-05',
    endUseDate: '2026-09-05',
    branches: ['Sakura Quận 1', 'Sakura Quận 7'],
    totalQty: 100,
    soldQty: 34,
    availability: 'suspended',
    rating: 4.4,
    reviewCount: 29,
    reviews: [],
  },
  {
    id: 'CV008',
    name: 'Combo Cắt + Nhuộm Tóc Chuyên Nghiệp',
    partner: 'L\'Oreal Hair Salon',
    category: 'Làm đẹp & Spa',
    image: 'https://images.unsplash.com/photo-1560066984-138daaa81ed0?w=400&h=250&fit=crop',
    originalPrice: 750000,
    salePrice: 420000,
    description: 'Dịch vụ cắt tóc + nhuộm màu chuyên nghiệp bởi stylist có kinh nghiệm. Bao gồm gội đầu và phục hồi tóc.',
    conditions: 'Đặt lịch trước 48h. 1 người/voucher.',
    cancellationPolicy: 'Đổi lịch miễn phí, hủy bị mất phí 20%.',
    startSaleDate: '2026-07-01',
    endSaleDate: '2026-09-30',
    startUseDate: '2026-07-01',
    endUseDate: '2026-09-30',
    branches: ['Salon Quận 1', 'Salon Quận 10'],
    totalQty: 200,
    soldQty: 87,
    availability: 'selling',
    rating: 4.5,
    reviewCount: 63,
    reviews: [],
  },
];

// Only selling vouchers for public display
export const getAvailableVouchers = () => mockCustomerVouchers.filter(v => v.availability === 'selling');

// ---- Customer Accounts ----
export const mockCustomerAccount: CustomerAccount = {
  id: 'CU001',
  email: 'khachhang@demo.com',
  phone: '0901234567',
  fullName: 'Nguyễn Thị Hoa',
  status: 'active',
  failedLoginCount: 0,
  joinedAt: '01/03/2026',
};

// ---- Orders ----
export const mockCustomerOrders: CustomerOrder[] = [
  {
    id: 'ORD001',
    customerId: 'CU001',
    items: [{ voucherId: 'CV001', quantity: 1, unitPrice: 520000 }],
    total: 520000,
    orderStatus: 'paid',
    paymentStatus: 'success',
    codeStatus: 'issued_unused',
    createdAt: '05/07/2026',
    paidAt: '05/07/2026',
    reviewStatus: 'not_reviewed',
    codes: [
      {
        id: 'VCO001',
        orderId: 'ORD001',
        code: 'VCH-SEAFOOD-A7K9',
        voucherId: 'CV001',
        voucherName: 'Buffet Lẩu Hải Sản Cao Cấp - 2 Người',
        partner: 'Nhà hàng Biển Đông',
        branches: ['Chi nhánh Quận 1', 'Chi nhánh Quận 7'],
        validUntil: '31/08/2026',
        status: 'issued_unused',
        issuedAt: '05/07/2026',
      },
    ],
  },
  {
    id: 'ORD002',
    customerId: 'CU001',
    items: [
      { voucherId: 'CV002', quantity: 1, unitPrice: 320000 },
      { voucherId: 'CV003', quantity: 2, unitPrice: 159000 },
    ],
    total: 638000,
    orderStatus: 'paid',
    paymentStatus: 'success',
    codeStatus: 'used',
    createdAt: '10/06/2026',
    paidAt: '10/06/2026',
    reviewStatus: 'reviewed',
    codes: [
      {
        id: 'VCO002',
        orderId: 'ORD002',
        code: 'VCH-SPA-B3M5',
        voucherId: 'CV002',
        voucherName: 'Spa & Massage Toàn Thân 90 Phút',
        partner: 'Lotus Spa Center',
        branches: ['Chi nhánh Quận 3', 'Chi nhánh Bình Thạnh'],
        validUntil: '30/09/2026',
        status: 'used',
        issuedAt: '10/06/2026',
        usedAt: '18/06/2026',
        usedBranch: 'Chi nhánh Quận 3',
      },
      {
        id: 'VCO003',
        orderId: 'ORD002',
        code: 'VCH-CAKE-C9P1',
        voucherId: 'CV003',
        voucherName: 'Combo Bánh Ngọt & Cà Phê',
        partner: 'The Cake House',
        branches: ['Chi nhánh Quận 1'],
        validUntil: '10/09/2026',
        status: 'issued_unused',
        issuedAt: '10/06/2026',
      },
      {
        id: 'VCO004',
        orderId: 'ORD002',
        code: 'VCH-CAKE-D2Q8',
        voucherId: 'CV003',
        voucherName: 'Combo Bánh Ngọt & Cà Phê',
        partner: 'The Cake House',
        branches: ['Chi nhánh Quận 1'],
        validUntil: '10/09/2026',
        status: 'expired',
        issuedAt: '10/06/2026',
      },
    ],
  },
  {
    id: 'ORD003',
    customerId: 'CU001',
    items: [{ voucherId: 'CV005', quantity: 1, unitPrice: 1450000 }],
    total: 1450000,
    orderStatus: 'pending_payment',
    paymentStatus: 'failed',
    codeStatus: 'pending_issue',
    createdAt: '15/07/2026',
    reviewStatus: 'not_reviewed',
    codes: [],
  },
  {
    id: 'ORD004',
    customerId: 'CU001',
    items: [{ voucherId: 'CV001', quantity: 1, unitPrice: 520000 }],
    total: 520000,
    orderStatus: 'paid',
    paymentStatus: 'success',
    codeStatus: 'error',
    createdAt: '12/07/2026',
    paidAt: '12/07/2026',
    reviewStatus: 'not_reviewed',
    codes: [],
  },
];

// ---- Cart (session state — initial empty, managed in component) ----
export const initialCart: CartItem[] = [];

export const voucherCategoryLabels: Record<string, string> = {
  'Ẩm thực': 'Ẩm thực',
  'Làm đẹp & Spa': 'Làm đẹp & Spa',
  'Cà phê & Bánh': 'Cà phê & Bánh',
  'Giải trí': 'Giải trí',
  'Du lịch & Khách sạn': 'Du lịch & Khách sạn',
  'Thể thao & Sức khỏe': 'Thể thao & Sức khỏe',
};

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending_payment: 'Chờ thanh toán',
  paid: 'Đã thanh toán',
  refunded: 'Đã hoàn tiền',
  cancelled: 'Đã hủy',
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  pending: 'Chờ thanh toán',
  success: 'Thành công',
  failed: 'Thất bại',
  refunded_sim: 'Đã hoàn tiền (mô phỏng)',
};

export const codeStatusLabels: Record<CodeStatus, string> = {
  pending_issue: 'Chờ phát hành mã',
  issued_unused: 'Chưa sử dụng',
  used: 'Đã sử dụng',
  expired: 'Hết hạn',
  cancelled: 'Đã hủy',
  disabled: 'Vô hiệu hóa',
  error: 'Lỗi sinh mã',
};
