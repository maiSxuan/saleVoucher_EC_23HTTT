-- =====================================================================
-- HỆ THỐNG BÁN VOUCHER GIẢM GIÁ TRỰC TUYẾN
-- Schema PostgreSQL cho Supabase — chuyển từ Relational Model (drawio)
-- =====================================================================
-- Quy ước:
--  - Khóa chính dùng UUID (gen_random_uuid()) — chuẩn Supabase, tránh lộ
--    thứ tự bản ghi, dễ merge dữ liệu mẫu, hợp với auth.users.id nếu
--    sau này tích hợp Supabase Auth.
--  - Cột trạng thái (TRANG_THAI...) dùng TEXT + CHECK thay vì PostgreSQL
--    ENUM: dễ ALTER thêm giá trị mới khi làm đồ án mà không phải
--    ALTER TYPE (ENUM native khó sửa hơn nhiều).
--  - Tiền tệ dùng NUMERIC(12,2). Thời gian dùng TIMESTAMPTZ.
--  - Mọi FK đều được đánh index thủ công (Postgres không tự tạo index
--    cho FK, chỉ tự tạo cho PK/UNIQUE).
-- =====================================================================
create extension if not exists pgcrypto;
create schema if not exists extensions;
create extension if not exists pg_trgm with schema extensions;
set search_path = public,
    extensions;
-- =====================================================================
-- XÓA BẢNG CŨ NẾU ĐÃ TỒN TẠI (giúp chạy lại script nhiều lần không bị lỗi)
-- Xóa theo thứ tự ngược lại với lúc tạo để không dính lỗi foreign key
-- =====================================================================
DROP TABLE IF EXISTS NOIDUNG CASCADE;
DROP TABLE IF EXISTS LOG_HT CASCADE;
DROP TABLE IF EXISTS KHIEUNAI CASCADE;
DROP TABLE IF EXISTS DANHGIA CASCADE;
DROP TABLE IF EXISTS LSSINHMA CASCADE;
DROP TABLE IF EXISTS VOUCHER_MUA CASCADE;
DROP TABLE IF EXISTS HOANTIEN CASCADE;
DROP TABLE IF EXISTS THANHTOAN CASCADE;
DROP TABLE IF EXISTS CHITIETDONHANG CASCADE;
DROP TABLE IF EXISTS DONHANG CASCADE;
DROP TABLE IF EXISTS CHITIETGIOHANG CASCADE;
DROP TABLE IF EXISTS GIOHANG CASCADE;
DROP TABLE IF EXISTS TAIKHOAN CASCADE;
DROP TABLE IF EXISTS VOUCHER_CN CASCADE;
DROP TABLE IF EXISTS VOUCHER CASCADE;
DROP TABLE IF EXISTS HOSODN CASCADE;
DROP TABLE IF EXISTS CHINHANH CASCADE;
DROP TABLE IF EXISTS NGUOIDUNG CASCADE;
DROP TABLE IF EXISTS DANH_MUC CASCADE;
DROP TABLE IF EXISTS YEUCAUHUY CASCADE;
DROP FUNCTION IF EXISTS fn_check_hosodn_vai_tro() CASCADE;
-- =====================================================================
-- 1. DANH_MUC
-- =====================================================================
create table DANH_MUC (
    ma_danh_muc uuid primary key default gen_random_uuid(),
    ten_danh_muc text not null unique,
    mo_ta text,
    hinh_anh_url text
);
-- =====================================================================
-- 2. NGUOI_DUNG
-- [FIX] Tao NGUOIDUNG truoc CHINHANH va HOSODN vi hai bang kia FK vao day.
--       CHK subquery ve vai_tro cua CHINHANH duoc chuyen sang trigger.
-- =====================================================================
create table NGUOIDUNG (
    ma_nguoi_dung uuid primary key default gen_random_uuid(),
    ho_ten text not null,
    email text unique,
    sdt text unique,
    ngay_sinh date,
    gioi_tinh text check (gioi_tinh in ('Nam', 'Nu', 'Khac')),
    cccd text unique,
    vai_tro text not null check (
        vai_tro in (
            'Khach hang',
            'Nguoi dai dien',
            'Nhan vien ban hang',
            'Nhan vien quan ly voucher',
            'Admin he thong',
            'Admin kiem duyet',
            'Admin van hang'
        )
    ),
    trang_thai text not null default 'Dang hoat dong' check (trang_thai in ('Dang hoat dong', 'Tam khoa')),
    created_at timestamptz not null default now(),
    ma_chi_nhanh uuid,
    ma_hsdn uuid
);
-- =====================================================================
-- 3. CHI_NHANH
-- [FIX] Tao sau NGUOIDUNG de NGUOIDUNG co the FK sang CHINHANH.
--       HOSODN cung tham chieu CHINHANH nen CHINHANH phai tao truoc HOSODN.
-- =====================================================================
create table CHINHANH (
    ma_chi_nhanh uuid primary key default gen_random_uuid(),
    ten_chi_nhanh text not null,
    khu_vuc text,
    dia_chi text,
    trang_thai text not null default 'Cho duyet' check (
        trang_thai in (
            'Cho duyet',
            'Dang hoat dong',
            'Tu choi',
            'Tam ngung hoat dong'
        )
    ),
    ma_hs uuid not null
);
-- Sau khi co CHINHANH, gan FK va CHECK vao NGUOIDUNG
-- [FIX] Them FK tu NGUOIDUNG.ma_chi_nhanh -> CHINHANH sau khi CHINHANH da ton tai
alter table NGUOIDUNG
add constraint fk_nguoi_dung_chi_nhanh foreign key (ma_chi_nhanh) references CHINHANH(ma_chi_nhanh),
    -- [FIX] CHECK: chi NVBD moi co CHINHANH
add constraint chk_nguoi_dung_chi_nhanh_nvbh check (
        (
            vai_tro = 'Nhan vien ban hang'
            AND ma_chi_nhanh IS NOT NULL
        )
        OR (
            vai_tro != 'Nhan vien ban hang'
            AND ma_chi_nhanh IS NULL
        )
    );
-- Foreign key NGUOIDUNG.ma_hsdn -> HOSODN is added after HOSODN exists.
-- =====================================================================
-- 4. HO_SO_DN  (ho so doanh nghiep doi tac)
-- [FIX] Tao sau NGUOIDUNG. Subquery trong CHECK khong hop le trong
--       PostgreSQL -> da xoa, thay bang trigger ben duoi.
-- =====================================================================
create table HOSODN (
    ma_hs uuid primary key default gen_random_uuid(),
    ten_dn text not null,
    ma_so_thue text unique not null,
    dia_chi text,
    giay_phep_kinh_doanh text,
    logo varchar(500),
    ngay_tao timestamptz not null default now(),
    trang_thai text not null default 'Cho duyet' check (
        trang_thai in (
            'Cho duyet',
            'Dang hoat dong',
            'Tu choi',
            'Tam khoa'
        )
    ),
    id_nvql_voucher uuid references NGUOIDUNG(ma_nguoi_dung)
);
create index idx_ho_so_dn_nvql_voucher on HOSODN(id_nvql_voucher);
-- Sau khi HOSODN ton tai, gan FK tu CHINHANH.ma_hs -> HOSODN
-- [FIX] FK duoc them bang ALTER TABLE vi CHINHANH tao truoc HOSODN
alter table CHINHANH
add constraint fk_chi_nhanh_ho_so_dn foreign key (ma_hs) references HOSODN(ma_hs);
alter table NGUOIDUNG
add constraint fk_nguoi_dung_ho_so_dn foreign key (ma_hsdn) references HOSODN(ma_hs),
    -- Chi nguoi dai dien hoac NVQL voucher moi duoc gan ho so doanh nghiep.
    -- Cho phep NULL trong luc seed de xu ly quan he FK vong voi HOSODN.
add constraint chk_nguoi_dung_ho_so_dn check (
        ma_hsdn IS NULL
        OR vai_tro IN ('Nguoi dai dien', 'Nhan vien quan ly voucher')
    );
create index idx_nguoi_dung_ma_hsdn on NGUOIDUNG(ma_hsdn);
-- Moi ho so doanh nghiep co toi da mot nguoi dai dien.
create unique index uq_nguoi_dung_dai_dien_ma_hsdn on NGUOIDUNG(ma_hsdn)
where vai_tro = 'Nguoi dai dien'
    and ma_hsdn is not null;
-- =====================================================================
-- 5. VOUCHER
-- [FIX] Tham chieu DANH_MUC (da doi ten nhat quan, khong phai DANHMUC)
-- =====================================================================
create table VOUCHER (
    ma_voucher uuid primary key default gen_random_uuid(),
    ten_voucher text not null,
    mo_ta text,
    gia_goc numeric(12, 2) not null check (gia_goc > 0),
    gia_tri_giam numeric(12, 2) not null default 0 check (gia_tri_giam >= 0),
    dieu_kien_ap_dung text,
    so_luong_phat_hanh integer not null check (so_luong_phat_hanh >= 0),
    tg_bat_dau_ban timestamptz not null,
    tg_ket_thuc_ban timestamptz not null,
    trang_thai text not null default 'Nhap' check (
        trang_thai in (
            'Nhap',
            'Cho duyet',
            'Dang ban',
            'Tu choi',
            'Tam ngung',
            'Ngung ban'
        )
    ),
    chinh_sach_hoan_huy text,
    hinh_anh_url text,
    so_luong_da_ban integer not null default 0 check (so_luong_da_ban >= 0),
    ma_danh_muc uuid not null,
    -- [FIX] Doi DANHMUC -> DANH_MUC cho khop voi ten bang thuc te
    constraint fk_voucher_danhmuc foreign key (ma_danh_muc) references DANH_MUC(ma_danh_muc),
    constraint chk_voucher_giam_gia_hop_le check (gia_tri_giam <= gia_goc),
    constraint chk_voucher_ban_khong_vuot_phat_hanh check (so_luong_da_ban <= so_luong_phat_hanh),
    constraint chk_voucher_thoi_gian_ban check (tg_ket_thuc_ban > tg_bat_dau_ban)
);
create index idx_voucher_danh_muc on VOUCHER(ma_danh_muc);
-- =====================================================================
-- 6. VOUCHER_CN  (voucher ap dung tai cac chi nhanh nao - N-N)
-- =====================================================================
create table VOUCHER_CN (
    ma_voucher uuid not null references VOUCHER(ma_voucher) on delete cascade,
    ma_chi_nhanh uuid not null references CHINHANH(ma_chi_nhanh) on delete cascade,
    primary key (ma_voucher, ma_chi_nhanh)
);
create index idx_voucher_cn_chi_nhanh on VOUCHER_CN(ma_chi_nhanh);
-- =====================================================================
-- 7. TAI_KHOAN
-- =====================================================================
create table TAIKHOAN (
    ma_tk uuid primary key default gen_random_uuid(),
    thong_tin_dang_nhap text unique not null,
    mat_khau text not null,
    ma_nguoi_dung uuid not null unique references NGUOIDUNG(ma_nguoi_dung)
);
-- =====================================================================
-- 8. GIO_HANG
-- =====================================================================
create table GIOHANG (
    ma_gio_hang uuid primary key default gen_random_uuid(),
    ngay_tao timestamptz not null default now(),
    ngay_cap_nhat timestamptz not null default now(),
    ma_tksohuu uuid not null references TAIKHOAN(ma_tk) on delete cascade,
    constraint uq_gio_hang_ma_tksohuu unique (ma_tksohuu)
);
-- =====================================================================
-- 9. CHI_TIET_GIO_HANG  (bang ket hop GIO_HANG x VOUCHER)
-- =====================================================================
create table CHITIETGIOHANG (
    -- [FIX] Doi gio_hang -> GIOHANG va voucher -> VOUCHER cho nhat quan
    ma_gio_hang uuid not null references GIOHANG(ma_gio_hang) on delete cascade,
    ma_voucher uuid not null references VOUCHER(ma_voucher),
    so_luong integer not null check (so_luong > 0),
    ngay_them timestamptz not null default now(),
    ngay_cap_nhat timestamptz not null default now(),
    primary key (ma_gio_hang, ma_voucher)
);
create index idx_ctgh_ma_voucher on CHITIETGIOHANG(ma_voucher);
-- =====================================================================
-- 10. DON_HANG
-- =====================================================================
create table DONHANG (
    ma_dh uuid primary key default gen_random_uuid(),
    ngay_dat timestamptz not null default now(),
    tong_tien numeric(12, 2) not null check (tong_tien >= 0),
    trang_thai text not null default 'Cho thanh toan' check (
        trang_thai in (
            'Cho thanh toan',
            'Da thanh toan',
            'Da huy',
            'Cho hoan tien',
            'Da hoan tien'
        )
    ),
    ly_do_huy text,
    nguoi_nhan text,
    ma_tk_dat uuid not null references TAIKHOAN(ma_tk)
);
-- =====================================================================
-- 11. CHI_TIET_DON_HANG  (bang ket hop DON_HANG x VOUCHER)
-- =====================================================================
create table CHITIETDONHANG (
    ma_dh uuid not null references DONHANG(ma_dh) on delete cascade,
    ma_voucher uuid not null references VOUCHER(ma_voucher),
    so_luong integer not null check (so_luong > 0),
    gia_tai_thoi_diem_mua numeric(12, 2) not null,
    primary key (ma_dh, ma_voucher)
);
create index idx_ctdh_ma_voucher on CHITIETDONHANG(ma_voucher);
-- =====================================================================
-- 12. THANH_TOAN
-- =====================================================================
create table THANHTOAN (
    ma_thanh_toan uuid primary key default gen_random_uuid(),
    thoi_gian_tt timestamptz not null default now(),
    so_tien numeric(12, 2) not null check (so_tien >= 0),
    phuong_thuc_tt text not null,
    trang_thai text not null default 'Dang xu ly' check (
        trang_thai in ('Dang xu ly', 'Thanh cong', 'That bai')
    ),
    ma_gd_goc text,
    -- BỔ SUNG: Mã giao dịch/Capture ID từ VNPay/PayPal
    ma_dh uuid not null references DONHANG(ma_dh)
);
-- =====================================================================
-- 13. HOAN_TIEN
-- =====================================================================
create table HOANTIEN (
    ma_hoan_tien uuid primary key default gen_random_uuid(),
    so_tien numeric(12, 2) not null check (so_tien >= 0),
    trang_thai text not null default 'Cho xu ly' check (
        trang_thai in (
            'Cho xu ly',
            'Dang xu ly',
            'Thanh cong',
            'That bai',
            'Can kiem tra'
        )
    ),
    ly_do text,
    ngay_xu_ly timestamptz,
    ma_tk uuid references TAIKHOAN(ma_tk),
    -- Admin xử lý, có thể null lúc mới tạo
    ma_thanh_toan uuid not null references THANHTOAN(ma_thanh_toan),
    -- Các trường mới thêm để hỗ trợ quy trình hoàn tiền Sandbox (UC-ADM-06)
    cong_thanh_toan text,
    -- VNPay / PayPal
    ma_gd_hoan text,
    -- Mã giao dịch hoàn tiền từ cổng thanh toán
    ma_phan_hoi text,
    -- Mã/kết quả phản hồi từ cổng thanh toán
    nguon text check (nguon in ('Yeu cau huy', 'Khieu nai')),
    -- Hoàn tiền xuất phát từ đâu
    -- Khóa ngoại được thêm sau khi YEUCAUHUY và KHIEUNAI đã được tạo.
    ma_yc_huy uuid,
    ma_khieu_nai uuid
);
create index idx_hoan_tien_ma_tk on HOANTIEN(ma_tk);
create unique index uq_hoan_tien_ma_yc_huy on HOANTIEN(ma_yc_huy)
where ma_yc_huy is not null;
create unique index uq_hoan_tien_ma_khieu_nai on HOANTIEN(ma_khieu_nai)
where ma_khieu_nai is not null;
-- =====================================================================
-- 14. VOUCHER_MUA  (ma voucher dien tu - moi dong = 1 ma dung 1 lan)
-- =====================================================================
create table VOUCHER_MUA (
    ma_voucher_mua uuid primary key default gen_random_uuid(),
    ma_dh uuid not null,
    ma_voucher uuid not null,
    voucher_code text not null unique,
    thoi_gian_sinh_ma timestamptz not null default now(),
    trang_thai text not null default 'Chua su dung' check (
        trang_thai in (
            'Chua su dung',
            'Da su dung',
            'Het han',
            'Loi sinh ma',
            'Vo hieu hoa'
        )
    ),
    gia_tri_qr_mo_phong text,
    ngay_su_dung timestamptz,
    ma_chi_nhanh_su_dung uuid references CHINHANH(ma_chi_nhanh),
    ma_nhan_vien_xac_nhan uuid references TAIKHOAN(ma_tk),
    constraint fk_voucher_mua_ctdh foreign key (ma_dh, ma_voucher) references CHITIETDONHANG(ma_dh, ma_voucher)
);
create index idx_voucher_mua_ctdh on VOUCHER_MUA(ma_dh, ma_voucher);
-- =====================================================================
-- 15. LS_SINH_MA  (lich su sinh lai ma)
-- =====================================================================
create table LSSINHMA (
    ma_ls uuid primary key default gen_random_uuid(),
    voucher_code_cu text,
    voucher_code_moi text not null,
    tg_thuc_hien timestamptz not null default now(),
    ma_voucher_mua uuid not null references VOUCHER_MUA(ma_voucher_mua),
    -- [FIX] Xoa dau phay thua o cuoi constraint cuoi cung
    ma_tk_admin uuid not null references TAIKHOAN(ma_tk)
);
-- =====================================================================
-- 16. DANH_GIA
-- =====================================================================
create table DANHGIA (
    ma_danh_gia uuid primary key default gen_random_uuid(),
    diem integer not null check (
        diem between 1 and 5
    ),
    noi_dung text,
    ngay_danh_gia timestamptz not null default now(),
    ma_voucher_mua uuid not null references VOUCHER_MUA(ma_voucher_mua),
    ma_tk_danhgia uuid not null references TAIKHOAN(ma_tk),
    unique (ma_voucher_mua, ma_tk_danhgia)
);
-- [FIX] Doi ma_tk -> ma_tk_danhgia cho khop voi ten cot thuc te
create index idx_danh_gia_ma_tk_danhgia on DANHGIA(ma_tk_danhgia);
-- =====================================================================
-- 17. KHIEU_NAI
-- =====================================================================
create table KHIEUNAI (
    ma_khieu_nai uuid primary key default gen_random_uuid(),
    noi_dung text not null,
    ngay_khieu_nai timestamptz not null default now(),
    trang_thai text not null default 'Moi' check (
        trang_thai in ('Moi', 'Dang xu ly', 'Da xu ly', 'Tu choi')
    ),
    ly_do_tu_choi_kn text,
    ma_voucher_mua uuid not null references VOUCHER_MUA(ma_voucher_mua),
    ma_tk_xuly uuid references TAIKHOAN(ma_tk),
    constraint chk_khieunai_ma_tk_xuly check (
        (
            trang_thai = 'Moi'
            and ma_tk_xuly is null
        )
        or (
            trang_thai != 'Moi'
            and ma_tk_xuly is not null
        )
    )
);
create index idx_khieu_nai_ma_tk_xuly on KHIEUNAI(ma_tk_xuly);
-- =====================================================================
-- 18. LOG_HT  (nhat ky he thong)
-- =====================================================================
create table LOG_HT (
    log_id uuid primary key default gen_random_uuid(),
    vai_tro_thuc_hien text,
    hanh_dong text not null,
    du_lieu_truoc jsonb,
    du_lieu_sau jsonb,
    ket_qua text check (ket_qua in ('Thanh cong', 'That bai')),
    ly_do_thuc_hien text,
    thoi_diem_thuc_hien timestamptz not null default now(),
    -- [FIX] Doi tai_khoan -> TAIKHOAN cho nhat quan
    ma_tk_thuc_hien uuid references TAIKHOAN(ma_tk),
    doi_tuong text,
    ma_doi_tuong uuid
);
-- =====================================================================
-- 19. NOI_DUNG  (quan ly noi dung: banner, bai viet, popup, chinh sach)
-- =====================================================================
create table NOIDUNG (
    ma_nd uuid primary key default gen_random_uuid(),
    loai text not null check (
        loai in ('banner', 'bai_viet', 'popup', 'chinh_sach')
    ),
    tieu_de text not null,
    trang_thai text not null default 'Dang hien thi' check (
        trang_thai in ('Dang hien thi', 'Tam an', 'Ngung hien thi')
    ),
    noi_dung text,
    bat_dau_hien_thi timestamptz,
    ket_thuc_hien_thi timestamptz,
    ngay_tao timestamptz not null default now(),
    ngay_cap_nhat timestamptz not null default now(),
    matk_admin uuid not null references TAIKHOAN(ma_tk)
);
-- [FIX] Doi noi_dung -> NOIDUNG cho nhat quan
create index idx_noi_dung_id_admin on NOIDUNG(matk_admin);
CREATE TABLE IF NOT EXISTS public.yeu_cau_cap_nhat_hosodn (
    ma_yc UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ma_hs UUID NOT NULL REFERENCES public.hosodn(ma_hs) ON DELETE CASCADE,
    -- 1. Thông tin Hồ sơ Doanh nghiệp đề xuất mới
    ten_dn_moi TEXT NULL,
    ma_so_thue_moi TEXT NULL,
    dia_chi_moi TEXT NULL,
    giay_phep_kinh_doanh_moi TEXT NULL,
    logo_new VARCHAR(500) NULL,
    -- 2. Thông tin Người đại diện đề xuất mới (ghi vào NGUOIDUNG khi duyệt)
    ho_ten_nguoi_dai_dien_moi TEXT NULL,
    sdt_nguoi_dai_dien_moi TEXT NULL,
    email_nguoi_dai_dien_moi TEXT NULL,
    cccd_moi TEXT NULL,
    -- 3. Quản lý Trạng thái & Vết phê duyệt
    trang_thai VARCHAR(50) NOT NULL DEFAULT 'Cho duyet',
    -- 'Cho duyet', 'Da duyet', 'Tu choi'
    ly_do_tu_choi TEXT NULL,
    ngay_yeu_cau TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    nguoi_duyet UUID NULL REFERENCES public.nguoidung(ma_nguoi_dung),
    ngay_duyet TIMESTAMPTZ NULL
);
-- Index truy vấn nhanh
CREATE INDEX IF NOT EXISTS idx_yc_hoso_trang_thai ON public.yeu_cau_cap_nhat_hosodn(trang_thai);
CREATE TABLE IF NOT EXISTS public.yeu_cau_cap_nhat_chinhanh (
    ma_yc UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ma_chi_nhanh UUID NULL REFERENCES public.chinhanh(ma_chi_nhanh) ON DELETE CASCADE,
    -- NULL nếu là yêu cầu THEM_MOI
    ma_hs UUID NULL REFERENCES public.hosodn(ma_hs) ON DELETE CASCADE,
    loai_yeu_cau VARCHAR(50) NOT NULL,
    -- 'THEM_MOI', 'CAP_NHAT', 'XOA'
    -- Thông tin Chi nhánh đề xuất mới (ghi/sửa/xóa vào CHINHANH khi duyệt)
    ten_chi_nhanh_moi TEXT NULL,
    khu_vuc_moi TEXT NULL,
    dia_chi_moi TEXT NULL,
    -- Quản lý Trạng thái & Vết phê duyệt
    trang_thai VARCHAR(50) NOT NULL DEFAULT 'Cho duyet',
    -- 'Cho duyet', 'Da duyet', 'Tu choi'
    ly_do_tu_choi TEXT NULL,
    ngay_yeu_cau TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    nguoi_duyet UUID NULL REFERENCES public.nguoidung(ma_nguoi_dung),
    ngay_duyet TIMESTAMPTZ NULL
);
-- Index truy vấn nhanh
CREATE INDEX IF NOT EXISTS idx_yc_cn_trang_thai ON public.yeu_cau_cap_nhat_chinhanh(trang_thai);
alter table yeu_cau_cap_nhat_hosodn
add ngay_sinh date;
alter table yeu_cau_cap_nhat_hosodn
add gioi_tinh text;
-- =====================================================================
-- 20. YEU_CAU_HUY (Yeu cau huy don hang)
-- =====================================================================
create table YEUCAUHUY (
    ma_yc_huy uuid primary key default gen_random_uuid(),
    ngay_yeu_cau timestamptz not null default now(),
    ly_do_kh text not null,
    trang_thai text not null default 'Cho xu ly' check (
        trang_thai in ('Cho xu ly', 'Da chap nhan', 'Da tu choi')
    ),
    ly_do_xu_ly text,
    ngay_xu_ly timestamptz,
    ma_dh uuid not null unique references DONHANG(ma_dh) on delete cascade,
    ma_tk_xuly uuid references TAIKHOAN(ma_tk)
);
create index idx_yeu_cau_huy_ma_tk_xuly on YEUCAUHUY(ma_tk_xuly);
-- HOANTIEN được khai báo trước hai bảng nghiệp vụ nguồn, nên chỉ thêm khóa
-- ngoại sau khi cả YEUCAUHUY và KHIEUNAI đã tồn tại.
alter table HOANTIEN
add constraint fk_hoantien_yeucauhuy foreign key (ma_yc_huy) references YEUCAUHUY(ma_yc_huy);
alter table HOANTIEN
add constraint fk_hoantien_khieunai foreign key (ma_khieu_nai) references KHIEUNAI(ma_khieu_nai);
-- =====================================================================
-- RANG BUOC LIEN BANG BO SUNG (xu ly bang TRIGGER)
-- =====================================================================
-- RB-15: kiem tra ton kho tai thoi diem dat hang & thanh toan, tru kho
--        khi thanh toan thanh cong -> nen viet trigger AFTER UPDATE
--        tren THANHTOAN (khi trang_thai chuyen sang 'Thanh cong') de:
--          1) kiem tra lai so_luong_con_lai >= so_luong dat
--          2) UPDATE VOUCHER SET so_luong_da_ban = so_luong_da_ban + so_luong
--          3) sinh cac dong VOUCHER_MUA tuong ung (RB-05)
--        Dung transaction + FOR UPDATE lock tren dong voucher de tranh
--        race condition khi nhieu khach mua cung luc.
-- =====================================================================
-- GOI Y RLS (Row Level Security) khi len Supabase that:
--   alter table DONHANG enable row level security;
--   create policy "khach xem don cua minh"
--     on DONHANG for select
--     using (ma_tk_dat = (select ma_tk from TAIKHOAN where ma_nguoi_dung = auth.uid()));
--   (ap dung tuong tu cho GIOHANG, VOUCHER_MUA, DANHGIA, KHIEUNAI...)
-- =====================================================================
-- =====================================================================
-- PERFORMANCE INDEXES
-- Keep this section synchronized with:
-- migrations/20260812_query_performance_indexes.sql
-- =====================================================================
-- Authentication and Admin user searches (ILIKE / filter + sort).
create index if not exists idx_perf_taikhoan_login_trgm on public.TAIKHOAN using gin (thong_tin_dang_nhap gin_trgm_ops);
create index if not exists idx_perf_nguoidung_ho_ten_trgm on public.NGUOIDUNG using gin (ho_ten gin_trgm_ops);
create index if not exists idx_perf_nguoidung_email_trgm on public.NGUOIDUNG using gin (email gin_trgm_ops);
create index if not exists idx_perf_nguoidung_sdt_trgm on public.NGUOIDUNG using gin (sdt gin_trgm_ops);
create index if not exists idx_perf_nguoidung_vai_tro_created on public.NGUOIDUNG (vai_tro, created_at desc);
create index if not exists idx_perf_nguoidung_trang_thai_created on public.NGUOIDUNG (trang_thai, created_at desc);
create index if not exists idx_perf_nguoidung_hsdn_vai_tro on public.NGUOIDUNG (ma_hsdn, vai_tro)
where ma_hsdn is not null;
create index if not exists idx_perf_nguoidung_chi_nhanh_vai_tro on public.NGUOIDUNG (ma_chi_nhanh, vai_tro)
where ma_chi_nhanh is not null;
-- Partner, branch, voucher and approval queues.
create index if not exists idx_perf_chinhanh_hs_status_name on public.CHINHANH (ma_hs, trang_thai, ten_chi_nhanh);
create index if not exists idx_perf_chinhanh_status_name on public.CHINHANH (trang_thai, ten_chi_nhanh);
create index if not exists idx_perf_hosodn_status_created on public.HOSODN (trang_thai, ngay_tao desc);
create index if not exists idx_perf_hosodn_status_name on public.HOSODN (trang_thai, ten_dn);
create index if not exists idx_perf_voucher_status_sale_start on public.VOUCHER (trang_thai, tg_bat_dau_ban desc);
create index if not exists idx_perf_yc_hosodn_hs_status_date on public.yeu_cau_cap_nhat_hosodn (ma_hs, trang_thai, ngay_yeu_cau desc);
-- Legacy schemas may not yet contain ma_hs on the branch-request table.
do $$ begin if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
        and table_name = 'yeu_cau_cap_nhat_chinhanh'
        and column_name = 'ma_hs'
) then execute $sql$ create index if not exists idx_perf_yc_chinhanh_hs_status_date on public.yeu_cau_cap_nhat_chinhanh (ma_hs, trang_thai, ngay_yeu_cau desc) $sql$;
end if;
end $$;
-- Orders, payments, refunds and issued voucher codes.
create index if not exists idx_perf_donhang_customer_date on public.DONHANG (ma_tk_dat, ngay_dat desc);
create index if not exists idx_perf_donhang_customer_status_date on public.DONHANG (ma_tk_dat, trang_thai, ngay_dat desc);
create index if not exists idx_perf_donhang_status_date on public.DONHANG (trang_thai, ngay_dat desc);
create index if not exists idx_perf_thanhtoan_order_status_date on public.THANHTOAN (ma_dh, trang_thai, thoi_gian_tt desc);
create index if not exists idx_perf_thanhtoan_status_date on public.THANHTOAN (trang_thai, thoi_gian_tt desc);
create index if not exists idx_perf_hoantien_payment_date on public.HOANTIEN (ma_thanh_toan, ngay_xu_ly desc);
create index if not exists idx_perf_voucher_mua_order_status_date on public.VOUCHER_MUA (ma_dh, trang_thai, thoi_gian_sinh_ma desc);
CREATE INDEX if not exists idx_voucher_mua_ma_voucher ON voucher_mua (ma_voucher);
create index if not exists idx_perf_voucher_mua_status_date on public.VOUCHER_MUA (trang_thai, thoi_gian_sinh_ma desc);
create index if not exists idx_perf_voucher_mua_used_branch_date on public.VOUCHER_MUA (ma_chi_nhanh_su_dung, ngay_su_dung desc)
where trang_thai = 'Da su dung';
CREATE if not exists INDEX idx_voucher_mua_ma_dh ON voucher_mua (ma_dh);
CREATE UNIQUE INDEX if not exists idx_danhgia_ma_voucher_mua ON danhgia (ma_voucher_mua);
create index if not exists idx_perf_lssinhma_voucher_date on public.LSSINHMA (ma_voucher_mua, tg_thuc_hien desc);
create index if not exists idx_perf_khieunai_status_date on public.KHIEUNAI (trang_thai, ngay_khieu_nai desc);
create index if not exists idx_perf_khieunai_voucher_date on public.KHIEUNAI (ma_voucher_mua, ngay_khieu_nai desc);
create index if not exists idx_perf_yeucauhuy_status_date on public.YEUCAUHUY (trang_thai, ngay_yeu_cau desc);
create index if not exists idx_perf_yeucauhuy_order_status_date on public.YEUCAUHUY (ma_dh, trang_thai, ngay_yeu_cau desc);
-- Audit log listing and rejection-history lookups.
create index if not exists idx_perf_log_time on public.LOG_HT (thoi_diem_thuc_hien desc);
create index if not exists idx_perf_log_actor_time on public.LOG_HT (ma_tk_thuc_hien, thoi_diem_thuc_hien desc);
create index if not exists idx_perf_log_target_time on public.LOG_HT (
    doi_tuong,
    ma_doi_tuong,
    thoi_diem_thuc_hien desc
);
create index if not exists idx_perf_log_action_trgm on public.LOG_HT using gin (hanh_dong gin_trgm_ops);
create index if not exists idx_perf_log_result_time on public.LOG_HT (ket_qua, thoi_diem_thuc_hien desc);
create index if not exists idx_perf_log_target_trgm on public.LOG_HT using gin (doi_tuong gin_trgm_ops);
create index if not exists idx_perf_log_actor_role_trgm on public.LOG_HT using gin (vai_tro_thuc_hien gin_trgm_ops);
create index if not exists idx_perf_log_reason_trgm on public.LOG_HT using gin (ly_do_thuc_hien gin_trgm_ops);