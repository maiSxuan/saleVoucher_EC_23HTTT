-- =====================================================================
-- 002_seed_data.sql
-- DỮ LIỆU DEMO PHÙ HỢP VỚI create_tables(1).sql
-- PostgreSQL / Supabase
--
-- Mật khẩu chung cho toàn bộ tài khoản demo: Demo@123
--
-- Quy ước nghiệp vụ được áp dụng trong dữ liệu:
--   - Không seed đơn hàng ở trạng thái "Cho thanh toan".
--   - DONHANG chỉ xuất hiện sau khi kết quả thanh toán đã thành công.
--   - THANHTOAN của các đơn đã lưu đều có trạng thái "Thanh cong".
--   - Hoàn tiền được theo dõi riêng trong HOANTIEN.
--
-- CẢNH BÁO:
--   Script dùng TRUNCATE ... CASCADE và sẽ xóa toàn bộ dữ liệu hiện có.
--   Chỉ chạy trong môi trường local/dev/demo.
-- =====================================================================

begin;

-- =====================================================================
-- 0. XÓA DỮ LIỆU CŨ
-- =====================================================================
truncate table
    NOIDUNG,
    LOG_HT,
    KHIEUNAI,
    DANHGIA,
    LSSINHMA,
    VOUCHER_MUA,
    HOANTIEN,
    THANHTOAN,
    CHITIETDONHANG,
    DONHANG,
    CHITIETGIOHANG,
    GIOHANG,
    TAIKHOAN,
    VOUCHER_CN,
    VOUCHER,
    CHINHANH,
    HOSODN,
    NGUOIDUNG,
    DANH_MUC
restart identity cascade;

-- =====================================================================
-- 1. DANH MỤC
-- =====================================================================
insert into DANH_MUC (
    ma_danh_muc,
    ten_danh_muc,
    mo_ta
)
values
(
    '40000000-0000-0000-0000-000000000001',
    'An uong',
    'Voucher nha hang, quan an va do uong.'
),
(
    '40000000-0000-0000-0000-000000000002',
    'Lam dep',
    'Voucher spa, cham soc da va suc khoe.'
),
(
    '40000000-0000-0000-0000-000000000003',
    'Giai tri',
    'Voucher phim anh, vui choi va su kien.'
),
(
    '40000000-0000-0000-0000-000000000004',
    'Du lich',
    'Voucher luu tru va trai nghiem du lich.'
),
(
    '40000000-0000-0000-0000-000000000005',
    'Giao duc',
    'Voucher khoa hoc va dao tao.'
);

-- =====================================================================
-- 2. NGƯỜI DÙNG CHƯA GẮN CHI NHÁNH
-- Nhân viên bán hàng được thêm sau khi đã có CHINHANH.
-- =====================================================================
insert into NGUOIDUNG (
    ma_nguoi_dung,
    ho_ten,
    email,
    sdt,
    ngay_sinh,
    gioi_tinh,
    cccd,
    vai_tro,
    trang_thai,
    created_at,
    ma_chi_nhanh
)
values
-- Admin
(
    '00000000-0000-0000-0000-000000000001',
    'Quan tri vien he thong',
    'admin@ec.local',
    '0900000001',
    '1995-01-15',
    'Khac',
    '079095000001',
    'Admin',
    'Dang hoat dong',
    now() - interval '365 days',
    null
),

-- Khách hàng
(
    '00000000-0000-0000-0000-000000000002',
    'Nguyen Minh Anh',
    'minhanh@ec.local',
    '0900000002',
    '2002-04-20',
    'Nu',
    '079202000002',
    'Khach hang',
    'Dang hoat dong',
    now() - interval '180 days',
    null
),
(
    '00000000-0000-0000-0000-000000000003',
    'Tran Thu Ha',
    'thuha@ec.local',
    '0900000003',
    '2001-09-12',
    'Nu',
    '079201000003',
    'Khach hang',
    'Dang hoat dong',
    now() - interval '120 days',
    null
),
(
    '00000000-0000-0000-0000-000000000004',
    'Le Quoc Bao',
    'quocbao@ec.local',
    '0900000004',
    '2000-06-08',
    'Nam',
    '079200000004',
    'Khach hang',
    'Tam khoa',
    now() - interval '90 days',
    null
),

-- Đối tác 1: đang hoạt động
(
    '00000000-0000-0000-0000-000000000011',
    'Pham Hoang Nam',
    'owner.amthuc@ec.local',
    '0900000011',
    '1988-03-11',
    'Nam',
    '079088000011',
    'Nguoi dai dien',
    'Dang hoat dong',
    now() - interval '300 days',
    null
),
(
    '00000000-0000-0000-0000-000000000012',
    'Vo Ngoc Lan',
    'manager.amthuc@ec.local',
    '0900000012',
    '1992-07-19',
    'Nu',
    '079092000012',
    'Nhan vien quan ly voucher',
    'Dang hoat dong',
    now() - interval '290 days',
    null
),

-- Đối tác 2: chờ duyệt
(
    '00000000-0000-0000-0000-000000000021',
    'Nguyen Thi An',
    'owner.spa@ec.local',
    '0900000021',
    '1987-10-05',
    'Nu',
    '079087000021',
    'Nguoi dai dien',
    'Dang hoat dong',
    now() - interval '20 days',
    null
),
(
    '00000000-0000-0000-0000-000000000022',
    'Dang Thao Vy',
    'manager.spa@ec.local',
    '0900000022',
    '1994-02-18',
    'Nu',
    '079094000022',
    'Nhan vien quan ly voucher',
    'Dang hoat dong',
    now() - interval '18 days',
    null
),

-- Đối tác 3: bị từ chối
(
    '00000000-0000-0000-0000-000000000031',
    'Truong Van Hung',
    'owner.edu@ec.local',
    '0900000031',
    '1985-05-22',
    'Nam',
    '079085000031',
    'Nguoi dai dien',
    'Dang hoat dong',
    now() - interval '40 days',
    null
),
(
    '00000000-0000-0000-0000-000000000032',
    'Phan Mai Chi',
    'manager.edu@ec.local',
    '0900000032',
    '1991-08-14',
    'Nu',
    '079091000032',
    'Nhan vien quan ly voucher',
    'Dang hoat dong',
    now() - interval '38 days',
    null
),

-- Đối tác 4: tạm khóa
(
    '00000000-0000-0000-0000-000000000041',
    'Bui Duc Long',
    'owner.travel@ec.local',
    '0900000041',
    '1986-11-30',
    'Nam',
    '079086000041',
    'Nguoi dai dien',
    'Tam khoa',
    now() - interval '250 days',
    null
),
(
    '00000000-0000-0000-0000-000000000042',
    'Do Minh Trang',
    'manager.travel@ec.local',
    '0900000042',
    '1993-12-09',
    'Nu',
    '079093000042',
    'Nhan vien quan ly voucher',
    'Tam khoa',
    now() - interval '245 days',
    null
);

-- =====================================================================
-- 3. HỒ SƠ DOANH NGHIỆP
-- Trigger trg_hosodn_vai_tro sẽ kiểm tra đúng vai trò.
-- =====================================================================
insert into HOSODN (
    ma_hs,
    ten_dn,
    ma_so_thue,
    dia_chi,
    giay_phep_kinh_doanh,
    ngay_tao,
    trang_thai,
    id_nguoi_dai_dien,
    id_nvql_voucher
)
values
(
    '20000000-0000-0000-0000-000000000001',
    'Cong ty TNHH Am Thuc Sai Gon',
    '0310000001',
    '12 Nguyen Hue, TP. Ho Chi Minh',
    'https://example.local/licenses/am-thuc-sai-gon.pdf',
    now() - interval '280 days',
    'Dang hoat dong',
    '00000000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000012'
),
(
    '20000000-0000-0000-0000-000000000002',
    'Cong ty TNHH Spa An Nhien',
    '0310000002',
    '25 Thanh Thai, TP. Ho Chi Minh',
    'https://example.local/licenses/spa-an-nhien.pdf',
    now() - interval '15 days',
    'Cho duyet',
    '00000000-0000-0000-0000-000000000021',
    '00000000-0000-0000-0000-000000000022'
),
(
    '20000000-0000-0000-0000-000000000003',
    'Cong ty Co phan Giao Duc Tuong Lai',
    '0310000003',
    '80 Vo Van Tan, TP. Ho Chi Minh',
    'https://example.local/licenses/giao-duc-tuong-lai.pdf',
    now() - interval '35 days',
    'Tu choi',
    '00000000-0000-0000-0000-000000000031',
    '00000000-0000-0000-0000-000000000032'
),
(
    '20000000-0000-0000-0000-000000000004',
    'Cong ty TNHH Du Lich Thanh Pho',
    '0310000004',
    '10 Pham Ngu Lao, TP. Ho Chi Minh',
    'https://example.local/licenses/du-lich-thanh-pho.pdf',
    now() - interval '230 days',
    'Tam khoa',
    '00000000-0000-0000-0000-000000000041',
    '00000000-0000-0000-0000-000000000042'
);

-- =====================================================================
-- 4. CHI NHÁNH
-- =====================================================================
insert into CHINHANH (
    ma_chi_nhanh,
    ten_chi_nhanh,
    dia_chi,
    trang_thai,
    ma_hs
)
values
(
    '30000000-0000-0000-0000-000000000001',
    'Am Thuc Sai Gon - Nguyen Hue',
    'Quan 1',
    '12 Nguyen Hue, TP. Ho Chi Minh',
    'Dang hoat dong',
    '20000000-0000-0000-0000-000000000001'
),
(
    '30000000-0000-0000-0000-000000000002',
    'Am Thuc Sai Gon - Vo Van Tan',
    'Quan 3',
    '120 Vo Van Tan, TP. Ho Chi Minh',
    'Dang hoat dong',
    '20000000-0000-0000-0000-000000000001'
),
(
    '30000000-0000-0000-0000-000000000003',
    'Am Thuc Sai Gon - Thao Dien',
    'Quan 2',
    '42 Quoc Huong, TP. Ho Chi Minh',
    'Tam ngung hoat dong',
    '20000000-0000-0000-0000-000000000001'
),
(
    '30000000-0000-0000-0000-000000000004',
    'Spa An Nhien - Thanh Thai',
    'Quan 1',
    '25 Thanh Thai, TP. Ho Chi Minh',
    'Cho duyet',
    '20000000-0000-0000-0000-000000000002'
),
(
    '30000000-0000-0000-0000-000000000005',
    'Giao Duc Tuong Lai - Vo Van Tan',
    'Quan 3',
    '80 Vo Van Tan, TP. Ho Chi Minh',
    'Tu choi',
    '20000000-0000-0000-0000-000000000003'
),
(
    '30000000-0000-0000-0000-000000000006',
    'Du Lich Thanh Pho - Ben Thanh',
    'Quan 1',
    '10 Pham Ngu Lao, TP. Ho Chi Minh',
    'Dang hoat dong',
    '20000000-0000-0000-0000-000000000004'
);

-- =====================================================================
-- 5. NHÂN VIÊN BÁN HÀNG
-- Chỉ vai trò này được phép có ma_chi_nhanh khác NULL.
-- =====================================================================
insert into NGUOIDUNG (
    ma_nguoi_dung,
    ho_ten,
    email,
    sdt,
    ngay_sinh,
    gioi_tinh,
    cccd,
    vai_tro,
    trang_thai,
    created_at,
    ma_chi_nhanh
)
values
(
    '00000000-0000-0000-0000-000000000013',
    'Lam Tuan Kiet',
    'staff.nguyenhue@ec.local',
    '0900000013',
    '1998-01-07',
    'Nam',
    '079098000013',
    'Nhan vien ban hang',
    'Dang hoat dong',
    now() - interval '250 days',
    '30000000-0000-0000-0000-000000000001'
),
(
    '00000000-0000-0000-0000-000000000043',
    'Ngo Hoai Phuong',
    'staff.travel@ec.local',
    '0900000043',
    '1997-03-26',
    'Nu',
    '079097000043',
    'Nhan vien ban hang',
    'Tam khoa',
    now() - interval '220 days',
    '30000000-0000-0000-0000-000000000006'
);

-- =====================================================================
-- 6. TÀI KHOẢN
-- Mật khẩu chung: Demo@123
-- =====================================================================
insert into TAIKHOAN (
    ma_tk,
    thong_tin_dang_nhap,
    mat_khau,
    ma_nguoi_dung
)
values
(
    '10000000-0000-0000-0000-000000000001',
    'admin@ec.local',
    crypt('Demo@123', gen_salt('bf')),
    '00000000-0000-0000-0000-000000000001'
),
(
    '10000000-0000-0000-0000-000000000002',
    'minhanh@ec.local',
    crypt('Demo@123', gen_salt('bf')),
    '00000000-0000-0000-0000-000000000002'
),
(
    '10000000-0000-0000-0000-000000000003',
    'thuha@ec.local',
    crypt('Demo@123', gen_salt('bf')),
    '00000000-0000-0000-0000-000000000003'
),
(
    '10000000-0000-0000-0000-000000000004',
    'quocbao@ec.local',
    crypt('Demo@123', gen_salt('bf')),
    '00000000-0000-0000-0000-000000000004'
),
(
    '10000000-0000-0000-0000-000000000011',
    'owner.amthuc@ec.local',
    crypt('Demo@123', gen_salt('bf')),
    '00000000-0000-0000-0000-000000000011'
),
(
    '10000000-0000-0000-0000-000000000012',
    'manager.amthuc@ec.local',
    crypt('Demo@123', gen_salt('bf')),
    '00000000-0000-0000-0000-000000000012'
),
(
    '10000000-0000-0000-0000-000000000013',
    'staff.nguyenhue@ec.local',
    crypt('Demo@123', gen_salt('bf')),
    '00000000-0000-0000-0000-000000000013'
),
(
    '10000000-0000-0000-0000-000000000021',
    'owner.spa@ec.local',
    crypt('Demo@123', gen_salt('bf')),
    '00000000-0000-0000-0000-000000000021'
),
(
    '10000000-0000-0000-0000-000000000022',
    'manager.spa@ec.local',
    crypt('Demo@123', gen_salt('bf')),
    '00000000-0000-0000-0000-000000000022'
),
(
    '10000000-0000-0000-0000-000000000031',
    'owner.edu@ec.local',
    crypt('Demo@123', gen_salt('bf')),
    '00000000-0000-0000-0000-000000000031'
),
(
    '10000000-0000-0000-0000-000000000032',
    'manager.edu@ec.local',
    crypt('Demo@123', gen_salt('bf')),
    '00000000-0000-0000-0000-000000000032'
),
(
    '10000000-0000-0000-0000-000000000041',
    'owner.travel@ec.local',
    crypt('Demo@123', gen_salt('bf')),
    '00000000-0000-0000-0000-000000000041'
),
(
    '10000000-0000-0000-0000-000000000042',
    'manager.travel@ec.local',
    crypt('Demo@123', gen_salt('bf')),
    '00000000-0000-0000-0000-000000000042'
),
(
    '10000000-0000-0000-0000-000000000043',
    'staff.travel@ec.local',
    crypt('Demo@123', gen_salt('bf')),
    '00000000-0000-0000-0000-000000000043'
);

-- =====================================================================
-- 7. VOUCHER
-- VOUCHER chưa có FK trực tiếp đến HOSODN trong schema hiện tại.
-- Dữ liệu seed bảo đảm mỗi voucher chỉ được gắn vào chi nhánh của
-- đúng một đối tác thông qua VOUCHER_CN.
-- =====================================================================
insert into VOUCHER (
    ma_voucher,
    ten_voucher,
    mo_ta,
    gia_goc,
    gia_tri_giam,
    dieu_kien_ap_dung,
    so_luong_phat_hanh,
    tg_bat_dau_ban,
    tg_ket_thuc_ban,
    trang_thai,
    chinh_sach_hoan_huy,
    hinh_anh_url,
    so_luong_da_ban,
    ma_danh_muc
)
values
(
    '50000000-0000-0000-0000-000000000001',
    'Buffet lau hai san gia 299.000d',
    'Buffet lau hai san danh cho mot nguoi.',
    500000,
    201000,
    'Ap dung tu thu Hai den thu Sau; dat ban truoc it nhat 2 gio.',
    100,
    now() - interval '30 days',
    now() + interval '120 days',
    'Dang ban',
    'Duoc hoan tien truoc ngay su dung it nhat 24 gio.',
    'https://placehold.co/800x500?text=Buffet+Hai+San',
    3,
    '40000000-0000-0000-0000-000000000001'
),
(
    '50000000-0000-0000-0000-000000000002',
    'Lieu trinh spa thu gian 60 phut',
    'Lieu trinh massage va cham soc co the trong 60 phut.',
    800000,
    300000,
    'Khach hang can dat lich truoc; khong ap dung ngay le.',
    50,
    now() + interval '10 days',
    now() + interval '100 days',
    'Cho duyet',
    'Hoan tien truoc lich hen 48 gio.',
    'https://placehold.co/800x500?text=Spa+60+Phut',
    0,
    '40000000-0000-0000-0000-000000000002'
),
(
    '50000000-0000-0000-0000-000000000003',
    'Khoa hoc giao tiep tieng Anh 8 tuan',
    'Khoa hoc giao tiep truc tiep danh cho sinh vien.',
    3000000,
    1000000,
    'Hoc vien phai lam bai kiem tra dau vao.',
    20,
    now() + interval '7 days',
    now() + interval '90 days',
    'Tu choi',
    'Khong hoan tien sau khi khoa hoc bat dau.',
    'https://placehold.co/800x500?text=English+Course',
    0,
    '40000000-0000-0000-0000-000000000005'
),
(
    '50000000-0000-0000-0000-000000000004',
    'Ve xem phim 2D cuoi tuan',
    'Mot ve xem phim 2D tieu chuan tai chi nhanh ap dung.',
    200000,
    80000,
    'Phu thu suat chieu dac biet va ghe doi.',
    200,
    now() - interval '60 days',
    now() + interval '60 days',
    'Tam ngung',
    'Khong hoan tien sau khi da dat suat chieu.',
    'https://placehold.co/800x500?text=Ve+Xem+Phim',
    1,
    '40000000-0000-0000-0000-000000000003'
),
(
    '50000000-0000-0000-0000-000000000005',
    'Ve khu vui choi gia dinh',
    'Ve vao cong danh cho mot nguoi lon hoac mot tre em.',
    250000,
    100000,
    'Khong ap dung kem chuong trinh khuyen mai khac.',
    80,
    now() - interval '20 days',
    now() + interval '80 days',
    'Dang ban',
    'Duoc hoan tien truoc ngay su dung 24 gio.',
    'https://placehold.co/800x500?text=Khu+Vui+Choi',
    1,
    '40000000-0000-0000-0000-000000000003'
),
(
    '50000000-0000-0000-0000-000000000006',
    'Tour trai nghiem thanh pho mot ngay',
    'Tour tham quan cac dia diem noi bat trong thanh pho.',
    1500000,
    500000,
    'Khach hang mang theo giay to tuy than.',
    30,
    now() + interval '20 days',
    now() + interval '150 days',
    'Nhap',
    'Hoan tien truoc ngay khoi hanh 72 gio.',
    'https://placehold.co/800x500?text=City+Tour',
    0,
    '40000000-0000-0000-0000-000000000004'
),
(
    '50000000-0000-0000-0000-000000000007',
    'Combo an trua van phong',
    'Combo mon chinh, thuc uong va trang mieng.',
    100000,
    30000,
    'Chi ap dung tu 11:00 den 14:00.',
    10,
    now() - interval '90 days',
    now() - interval '1 day',
    'Ngung ban',
    'Khong hoan tien sau khi ma da duoc xac nhan.',
    'https://placehold.co/800x500?text=Combo+An+Trua',
    0,
    '40000000-0000-0000-0000-000000000001'
);

-- =====================================================================
-- 8. VOUCHER ÁP DỤNG TẠI CHI NHÁNH
-- =====================================================================
insert into VOUCHER_CN (
    ma_voucher,
    ma_chi_nhanh
)
values
(
    '50000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001'
),
(
    '50000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000002'
),
(
    '50000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000004'
),
(
    '50000000-0000-0000-0000-000000000003',
    '30000000-0000-0000-0000-000000000005'
),
(
    '50000000-0000-0000-0000-000000000004',
    '30000000-0000-0000-0000-000000000001'
),
(
    '50000000-0000-0000-0000-000000000005',
    '30000000-0000-0000-0000-000000000002'
),
(
    '50000000-0000-0000-0000-000000000006',
    '30000000-0000-0000-0000-000000000006'
),
(
    '50000000-0000-0000-0000-000000000007',
    '30000000-0000-0000-0000-000000000001'
);

-- =====================================================================
-- 9. GIỎ HÀNG
-- Mỗi tài khoản có tối đa một giỏ do UNIQUE(ma_tksohuu).
-- =====================================================================
insert into GIOHANG (
    ma_gio_hang,
    ngay_tao,
    ngay_cap_nhat,
    ma_tksohuu
)
values
(
    '60000000-0000-0000-0000-000000000001',
    now() - interval '10 days',
    now() - interval '1 day',
    '10000000-0000-0000-0000-000000000002'
),
(
    '60000000-0000-0000-0000-000000000002',
    now() - interval '8 days',
    now() - interval '8 days',
    '10000000-0000-0000-0000-000000000003'
),
(
    '60000000-0000-0000-0000-000000000003',
    now() - interval '5 days',
    now() - interval '2 days',
    '10000000-0000-0000-0000-000000000004'
);

insert into CHITIETGIOHANG (
    ma_gio_hang,
    ma_voucher,
    so_luong,
    ngay_them,
    ngay_cap_nhat
)
values
(
    '60000000-0000-0000-0000-000000000001',
    '50000000-0000-0000-0000-000000000001',
    1,
    now() - interval '3 days',
    now() - interval '1 day'
),
(
    '60000000-0000-0000-0000-000000000001',
    '50000000-0000-0000-0000-000000000004',
    2,
    now() - interval '2 days',
    now() - interval '1 day'
),
(
    '60000000-0000-0000-0000-000000000003',
    '50000000-0000-0000-0000-000000000005',
    1,
    now() - interval '2 days',
    now() - interval '2 days'
);

-- =====================================================================
-- 10. ĐƠN HÀNG
-- Không có dòng "Cho thanh toan".
-- Ứng dụng chỉ tạo các dòng này sau khi mô phỏng thanh toán thành công.
-- =====================================================================
insert into DONHANG (
    ma_dh,
    ngay_dat,
    tong_tien,
    trang_thai,
    ly_do_huy,
    nguoi_nhan,
    ma_tk_dat
)
values
(
    '70000000-0000-0000-0000-000000000001',
    now() - interval '15 days',
    598000,
    'Da thanh toan',
    null,
    'Nguyen Minh Anh',
    '10000000-0000-0000-0000-000000000002'
),
(
    '70000000-0000-0000-0000-000000000002',
    now() - interval '8 days',
    150000,
    'Cho hoan tien',
    'Khach hang thay doi ke hoach su dung.',
    'Tran Thu Ha',
    '10000000-0000-0000-0000-000000000003'
),
(
    '70000000-0000-0000-0000-000000000003',
    now() - interval '20 days',
    120000,
    'Da hoan tien',
    'Voucher tam ngung truoc khi khach hang su dung.',
    'Tran Thu Ha',
    '10000000-0000-0000-0000-000000000003'
),
(
    '70000000-0000-0000-0000-000000000004',
    now() - interval '6 days',
    299000,
    'Huy yeu cau hoan tien',
    'Yeu cau khong dap ung chinh sach hoan huy.',
    'Nguyen Minh Anh',
    '10000000-0000-0000-0000-000000000002'
);

insert into CHITIETDONHANG (
    ma_dh,
    ma_voucher,
    so_luong,
    gia_tai_thoi_diem_mua
)
values
(
    '70000000-0000-0000-0000-000000000001',
    '50000000-0000-0000-0000-000000000001',
    2,
    299000
),
(
    '70000000-0000-0000-0000-000000000002',
    '50000000-0000-0000-0000-000000000005',
    1,
    150000
),
(
    '70000000-0000-0000-0000-000000000003',
    '50000000-0000-0000-0000-000000000004',
    1,
    120000
),
(
    '70000000-0000-0000-0000-000000000004',
    '50000000-0000-0000-0000-000000000001',
    1,
    299000
);

-- =====================================================================
-- 11. THANH TOÁN
-- Mọi đơn được lưu đều đã có kết quả thanh toán thành công.
-- =====================================================================
insert into THANHTOAN (
    ma_thanh_toan,
    thoi_gian_tt,
    so_tien,
    phuong_thuc_tt,
    trang_thai,
    ma_dh
)
values
(
    '80000000-0000-0000-0000-000000000001',
    now() - interval '15 days',
    598000,
    'MoMo mo phong',
    'Thanh cong',
    '70000000-0000-0000-0000-000000000001'
),
(
    '80000000-0000-0000-0000-000000000002',
    now() - interval '8 days',
    150000,
    'VNPay mo phong',
    'Thanh cong',
    '70000000-0000-0000-0000-000000000002'
),
(
    '80000000-0000-0000-0000-000000000003',
    now() - interval '20 days',
    120000,
    'PayPal Sandbox',
    'Thanh cong',
    '70000000-0000-0000-0000-000000000003'
),
(
    '80000000-0000-0000-0000-000000000004',
    now() - interval '6 days',
    299000,
    'ZaloPay mo phong',
    'Thanh cong',
    '70000000-0000-0000-0000-000000000004'
);

-- =====================================================================
-- 12. HOÀN TIỀN
-- =====================================================================
insert into HOANTIEN (
    ma_hoan_tien,
    so_tien,
    trang_thai,
    ly_do,
    ngay_xu_ly,
    ma_tk,
    ma_thanh_toan
)
values
(
    '90000000-0000-0000-0000-000000000002',
    150000,
    'Dang xu ly',
    'Khach hang thay doi ke hoach su dung.',
    null,
    '10000000-0000-0000-0000-000000000003',
    '80000000-0000-0000-0000-000000000002'
),
(
    '90000000-0000-0000-0000-000000000003',
    120000,
    'Thanh cong',
    'Voucher tam ngung truoc khi khach hang su dung.',
    now() - interval '18 days',
    '10000000-0000-0000-0000-000000000003',
    '80000000-0000-0000-0000-000000000003'
),
(
    '90000000-0000-0000-0000-000000000004',
    299000,
    'That bai',
    'Khong dap ung dieu kien hoan tien cua voucher.',
    now() - interval '4 days',
    '10000000-0000-0000-0000-000000000002',
    '80000000-0000-0000-0000-000000000004'
);

-- =====================================================================
-- 13. VOUCHER CODE ĐÃ PHÁT HÀNH
-- Mỗi dòng tương ứng một mã dùng một lần.
-- =====================================================================
insert into VOUCHER_MUA (
    ma_voucher_mua,
    ma_dh,
    ma_voucher,
    voucher_code,
    thoi_gian_sinh_ma,
    trang_thai,
    gia_tri_qr_mo_phong,
    ngay_su_dung,
    ma_chi_nhanh_su_dung,
    ma_nhan_vien_xac_nhan
)
values
(
    'a0000000-0000-0000-0000-000000000001',
    '70000000-0000-0000-0000-000000000001',
    '50000000-0000-0000-0000-000000000001',
    'EC26-FOOD-A1B2C3D4',
    now() - interval '15 days',
    'Da su dung',
    'ECQR:EC26-FOOD-A1B2C3D4',
    now() - interval '5 days',
    '30000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000013'
),
(
    'a0000000-0000-0000-0000-000000000002',
    '70000000-0000-0000-0000-000000000001',
    '50000000-0000-0000-0000-000000000001',
    'EC26-FOOD-E5F6G7H8',
    now() - interval '15 days',
    'Chua su dung',
    'ECQR:EC26-FOOD-E5F6G7H8',
    null,
    null,
    null
),
(
    'a0000000-0000-0000-0000-000000000003',
    '70000000-0000-0000-0000-000000000002',
    '50000000-0000-0000-0000-000000000005',
    'EC26-FUN-J9K2L3M4',
    now() - interval '8 days',
    'Chua su dung',
    'ECQR:EC26-FUN-J9K2L3M4',
    null,
    null,
    null
),
(
    'a0000000-0000-0000-0000-000000000004',
    '70000000-0000-0000-0000-000000000003',
    '50000000-0000-0000-0000-000000000004',
    'EC26-MOVIE-N5P6Q7R8',
    now() - interval '20 days',
    'Vo hieu hoa',
    'ECQR:EC26-MOVIE-N5P6Q7R8',
    null,
    null,
    null
),
(
    'a0000000-0000-0000-0000-000000000005',
    '70000000-0000-0000-0000-000000000004',
    '50000000-0000-0000-0000-000000000001',
    'EC26-FOOD-S9T2U3V4',
    now() - interval '6 days',
    'Chua su dung',
    'ECQR:EC26-FOOD-S9T2U3V4',
    null,
    null,
    null
);

-- =====================================================================
-- 14. LỊCH SỬ SINH LẠI MÃ
-- =====================================================================
insert into LSSINHMA (
    ma_ls,
    voucher_code_cu,
    voucher_code_moi,
    tg_thuc_hien,
    ma_voucher_mua,
    ma_tk_admin
)
values
(
    'c0000000-0000-0000-0000-000000000001',
    'EC26-FOOD-OLD00001',
    'EC26-FOOD-E5F6G7H8',
    now() - interval '14 days',
    'a0000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001'
);

-- =====================================================================
-- 15. ĐÁNH GIÁ
-- =====================================================================
insert into DANHGIA (
    ma_danh_gia,
    diem,
    noi_dung,
    ngay_danh_gia,
    ma_voucher_mua,
    ma_tk_danhgia
)
values
(
    'd0000000-0000-0000-0000-000000000001',
    5,
    'Mon an da dang, nhan vien phuc vu nhanh va voucher de su dung.',
    now() - interval '4 days',
    'a0000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000002'
);

-- =====================================================================
-- 16. KHIẾU NẠI
-- Schema hiện tại bắt buộc ma_tk_xuly NOT NULL nên khiếu nại mới
-- cũng được gắn tạm cho Admin.
-- =====================================================================
insert into KHIEUNAI (
    ma_khieu_nai,
    noi_dung,
    ngay_khieu_nai,
    trang_thai,
    ma_voucher_mua,
    ma_tk_xuly
)
values
(
    'e0000000-0000-0000-0000-000000000001',
    'Toi da gui yeu cau hoan tien nhung chua nhan duoc ket qua xu ly.',
    now() - interval '2 days',
    'Moi',
    'a0000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000001'
),
(
    'e0000000-0000-0000-0000-000000000002',
    'Yeu cau giai thich ly do tu choi hoan tien.',
    now() - interval '3 days',
    'Da xu ly',
    'a0000000-0000-0000-0000-000000000005',
    '10000000-0000-0000-0000-000000000001'
);

-- =====================================================================
-- 17. NHẬT KÝ HỆ THỐNG
-- =====================================================================
insert into LOG_HT (
    log_id,
    vai_tro_thuc_hien,
    hanh_dong,
    du_lieu_truoc,
    du_lieu_sau,
    ket_qua,
    ly_do_thuc_hien,
    thoi_diem_thuc_hien,
    ma_tk_thuc_hien,
    doi_tuong,
    ma_doi_tuong
)
values
(
    'f0000000-0000-0000-0000-000000000001',
    'Admin',
    'duyet_doi_tac',
    '{"trang_thai":"Cho duyet"}'::jsonb,
    '{"trang_thai":"Dang hoat dong"}'::jsonb,
    'Thanh cong',
    'Ho so doanh nghiep va giay phep hop le.',
    now() - interval '275 days',
    '10000000-0000-0000-0000-000000000001',
    'HOSODN',
    '20000000-0000-0000-0000-000000000001'
),
(
    'f0000000-0000-0000-0000-000000000002',
    'Admin',
    'duyet_voucher',
    '{"trang_thai":"Cho duyet"}'::jsonb,
    '{"trang_thai":"Dang ban"}'::jsonb,
    'Thanh cong',
    'Thong tin gia, thoi gian va chi nhanh ap dung hop le.',
    now() - interval '31 days',
    '10000000-0000-0000-0000-000000000001',
    'VOUCHER',
    '50000000-0000-0000-0000-000000000001'
),
(
    'f0000000-0000-0000-0000-000000000003',
    'Admin',
    'tu_choi_voucher',
    '{"trang_thai":"Cho duyet"}'::jsonb,
    '{"trang_thai":"Tu choi"}'::jsonb,
    'Thanh cong',
    'Thong tin chuong trinh chua du co so kiem chung.',
    now() - interval '25 days',
    '10000000-0000-0000-0000-000000000001',
    'VOUCHER',
    '50000000-0000-0000-0000-000000000003'
),
(
    'f0000000-0000-0000-0000-000000000004',
    'Admin',
    'hoan_tien_mo_phong',
    '{"trang_thai_don":"Cho hoan tien"}'::jsonb,
    '{"trang_thai_don":"Da hoan tien"}'::jsonb,
    'Thanh cong',
    'Voucher tam ngung truoc khi khach hang su dung.',
    now() - interval '18 days',
    '10000000-0000-0000-0000-000000000001',
    'DONHANG',
    '70000000-0000-0000-0000-000000000003'
),
(
    'f0000000-0000-0000-0000-000000000005',
    'Admin',
    'cap_lai_voucher_code',
    '{"voucher_code":"EC26-FOOD-OLD00001"}'::jsonb,
    '{"voucher_code":"EC26-FOOD-E5F6G7H8"}'::jsonb,
    'Thanh cong',
    'Ma cu khong hien thi dung trong tai khoan khach hang.',
    now() - interval '14 days',
    '10000000-0000-0000-0000-000000000001',
    'VOUCHER_MUA',
    'a0000000-0000-0000-0000-000000000002'
),
(
    'f0000000-0000-0000-0000-000000000006',
    'Admin',
    'khoa_tai_khoan',
    '{"trang_thai":"Dang hoat dong"}'::jsonb,
    '{"trang_thai":"Tam khoa"}'::jsonb,
    'Thanh cong',
    'Dang nhap sai nhieu lan va phat hien hoat dong bat thuong.',
    now() - interval '7 days',
    '10000000-0000-0000-0000-000000000001',
    'NGUOIDUNG',
    '00000000-0000-0000-0000-000000000004'
);

-- =====================================================================
-- 18. NỘI DUNG
-- =====================================================================
insert into NOIDUNG (
    ma_nd,
    loai,
    tieu_de,
    vai_tro,
    trang_thai,
    noi_dung,
    bat_dau_hien_thi,
    ket_thuc_hien_thi,
    ngay_tao,
    ngay_cap_nhat,
    matk_admin
)
values
(
    'b0000000-0000-0000-0000-000000000001',
    'banner',
    'Uu dai am thuc thang nay',
    'Khach hang',
    'Dang hien thi',
    'Kham pha cac voucher an uong dang duoc ban tren san.',
    now() - interval '10 days',
    now() + interval '20 days',
    now() - interval '12 days',
    now() - interval '10 days',
    '10000000-0000-0000-0000-000000000001'
),
(
    'b0000000-0000-0000-0000-000000000002',
    'bai_viet',
    'Huong dan su dung voucher tai chi nhanh',
    'Khach hang',
    'Dang hien thi',
    'Khach hang xuat trinh voucher code hoac QR mo phong cho nhan vien chi nhanh.',
    now() - interval '30 days',
    null,
    now() - interval '32 days',
    now() - interval '30 days',
    '10000000-0000-0000-0000-000000000001'
),
(
    'b0000000-0000-0000-0000-000000000003',
    'popup',
    'Thong bao bao tri mo phong',
    'Tat ca',
    'Tam an',
    'He thong du kien bao tri trong moi truong demo.',
    now() + interval '5 days',
    now() + interval '6 days',
    now() - interval '2 days',
    now() - interval '1 day',
    '10000000-0000-0000-0000-000000000001'
),
(
    'b0000000-0000-0000-0000-000000000004',
    'chinh_sach',
    'Chinh sach hoan huy voucher',
    'Khach hang',
    'Dang hien thi',
    'Viec huy va hoan tien phu thuoc dieu kien cua voucher hoac chinh sach san.',
    now() - interval '60 days',
    null,
    now() - interval '65 days',
    now() - interval '60 days',
    '10000000-0000-0000-0000-000000000001'
);

commit;

-- =====================================================================
-- 19. KIỂM TRA NHANH SAU KHI SEED
-- =====================================================================
select 'DANH_MUC' as bang, count(*) as so_luong from DANH_MUC
union all
select 'NGUOIDUNG', count(*) from NGUOIDUNG
union all
select 'HOSODN', count(*) from HOSODN
union all
select 'CHINHANH', count(*) from CHINHANH
union all
select 'TAIKHOAN', count(*) from TAIKHOAN
union all
select 'VOUCHER', count(*) from VOUCHER
union all
select 'GIOHANG', count(*) from GIOHANG
union all
select 'CHITIETGIOHANG', count(*) from CHITIETGIOHANG
union all
select 'DONHANG', count(*) from DONHANG
union all
select 'THANHTOAN', count(*) from THANHTOAN
union all
select 'VOUCHER_MUA', count(*) from VOUCHER_MUA
union all
select 'LOG_HT', count(*) from LOG_HT
order by bang;

-- =====================================================================
-- 20. TÀI KHOẢN DEMO
-- =====================================================================
-- Admin:
--   admin@ec.local / Demo@123
--
-- Khách hàng:
--   minhanh@ec.local / Demo@123
--   thuha@ec.local    / Demo@123
--   quocbao@ec.local  / Demo@123  (tài khoản tạm khóa)
--
-- Đối tác hoạt động:
--   owner.amthuc@ec.local   / Demo@123
--   manager.amthuc@ec.local / Demo@123
--   staff.nguyenhue@ec.local / Demo@123
--
-- Đối tác chờ duyệt:
--   owner.spa@ec.local   / Demo@123
--   manager.spa@ec.local / Demo@123
-- =====================================================================