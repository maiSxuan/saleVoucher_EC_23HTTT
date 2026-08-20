-- Phân tách quyền Admin thành 3 portal và tạo các tài khoản demo.
-- Chạy một lần trong Supabase SQL Editor, sau khi schema gốc đã được tạo.
-- Mật khẩu của ba tài khoản: Demo@123
begin;
create extension if not exists pgcrypto;
alter table public.nguoidung drop constraint if exists nguoidung_vai_tro_check;

-- Chuyển dữ liệu role Admin cũ trước khi áp dụng constraint mới.
update public.nguoidung
set vai_tro = 'Admin he thong'
where vai_tro = 'Admin';

alter table public.nguoidung
add constraint nguoidung_vai_tro_check check (
    vai_tro in (
      'Khach hang',
      'Nguoi dai dien',
      'Nhan vien ban hang',
      'Nhan vien quan ly voucher',
      'Admin he thong',
      'Admin kiem duyet',
      'Admin van hang'
    )
  );
insert into public.nguoidung (
    ma_nguoi_dung,
    ho_ten,
    email,
    sdt,
    ngay_sinh,
    gioi_tinh,
    cccd,
    vai_tro,
    trang_thai
  )
values (
    '00000000-0000-0000-0000-000000000101',
    'Quan tri vien he thong',
    'admin_ht@ec.com',
    '0900000100',
    '1995-01-15',
    'Khac',
    '079095000100',
    'Admin he thong',
    'Dang hoat dong'
  ),
  (
    '00000000-0000-0000-0000-000000000102',
    'Quan tri vien kiem duyet',
    'admin_kd@ec.com',
    '0900000101',
    '1994-03-20',
    'Nu',
    '079094000101',
    'Admin kiem duyet',
    'Dang hoat dong'
  ),
  (
    '00000000-0000-0000-0000-000000000103',
    'Quan tri vien van hanh',
    'admin_vh@ec.com',
    '0900000102',
    '1993-07-12',
    'Nam',
    '079093000102',
    'Admin van hang',
    'Dang hoat dong'
  ) on conflict (email) do
update
set ho_ten = excluded.ho_ten,
  sdt = excluded.sdt,
  ngay_sinh = excluded.ngay_sinh,
  gioi_tinh = excluded.gioi_tinh,
  cccd = excluded.cccd,
  vai_tro = excluded.vai_tro,
  trang_thai = excluded.trang_thai,
  ma_chi_nhanh = null,
  ma_hsdn = null;
insert into public.taikhoan (
    ma_tk,
    thong_tin_dang_nhap,
    mat_khau,
    ma_nguoi_dung
  )
values (
    '10000000-0000-0000-0000-000000000101',
    'admin_ht@ec.com',
    crypt('Demo@123', gen_salt('bf')),
    '00000000-0000-0000-0000-000000000101'
  ),
  (
    '10000000-0000-0000-0000-000000000102',
    'admin_kd@ec.com',
    crypt('Demo@123', gen_salt('bf')),
    '00000000-0000-0000-0000-000000000102'
  ),
  (
    '10000000-0000-0000-0000-000000000103',
    'admin_vh@ec.com',
    crypt('Demo@123', gen_salt('bf')),
    '00000000-0000-0000-0000-000000000103'
  ) on conflict (thong_tin_dang_nhap) do
update
set mat_khau = excluded.mat_khau,
  ma_nguoi_dung = excluded.ma_nguoi_dung;
commit;
-- Kết quả kiểm tra sau khi chạy:
select u.ho_ten,
  u.email,
  u.vai_tro,
  u.trang_thai
from public.nguoidung u
where u.email in (
    'admin_ht@ec.com',
    'admin_kd@ec.com',
    'admin_vh@ec.com'
  )
order by u.email;
