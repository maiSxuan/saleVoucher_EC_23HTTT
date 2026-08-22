-- ============================================================================
-- EC Voucher - indexes for the query patterns used by the backend repositories
-- Target: Supabase PostgreSQL
-- Safe to run more than once.
--
-- Run this file in Supabase SQL Editor during a low-traffic period. PostgreSQL
-- must briefly lock each table while a regular index is being created.
-- ============================================================================

begin;

-- pg_trgm is required for ILIKE '%keyword%' / prefix searches.
create schema if not exists extensions;
create extension if not exists pg_trgm with schema extensions;
set local search_path = public, extensions;

-- --------------------------------------------------------------------------
-- Authentication and Admin user searches
-- --------------------------------------------------------------------------
create index if not exists idx_perf_taikhoan_login_trgm
  on public.taikhoan using gin (thong_tin_dang_nhap gin_trgm_ops);

create index if not exists idx_perf_nguoidung_ho_ten_trgm
  on public.nguoidung using gin (ho_ten gin_trgm_ops);

create index if not exists idx_perf_nguoidung_email_trgm
  on public.nguoidung using gin (email gin_trgm_ops);

create index if not exists idx_perf_nguoidung_sdt_trgm
  on public.nguoidung using gin (sdt gin_trgm_ops);

create index if not exists idx_perf_nguoidung_vai_tro_created
  on public.nguoidung (vai_tro, created_at desc);

create index if not exists idx_perf_nguoidung_trang_thai_created
  on public.nguoidung (trang_thai, created_at desc);

-- Staff lists are scoped by partner/branch first, then by role.
create index if not exists idx_perf_nguoidung_hsdn_vai_tro
  on public.nguoidung (ma_hsdn, vai_tro)
  where ma_hsdn is not null;

create index if not exists idx_perf_nguoidung_chi_nhanh_vai_tro
  on public.nguoidung (ma_chi_nhanh, vai_tro)
  where ma_chi_nhanh is not null;

-- --------------------------------------------------------------------------
-- Partners, branches, vouchers and approval queues
-- --------------------------------------------------------------------------
create index if not exists idx_perf_chinhanh_hs_status_name
  on public.chinhanh (ma_hs, trang_thai, ten_chi_nhanh);

create index if not exists idx_perf_chinhanh_status_name
  on public.chinhanh (trang_thai, ten_chi_nhanh);

create index if not exists idx_perf_hosodn_status_created
  on public.hosodn (trang_thai, ngay_tao desc);

create index if not exists idx_perf_hosodn_status_name
  on public.hosodn (trang_thai, ten_dn);

create index if not exists idx_perf_voucher_status_sale_start
  on public.voucher (trang_thai, tg_bat_dau_ban desc);

create index if not exists idx_perf_yc_hosodn_hs_status_date
  on public.yeu_cau_cap_nhat_hosodn (ma_hs, trang_thai, ngay_yeu_cau desc);

-- Some older EC Voucher databases do not yet have ma_hs on this request table.
-- Skip only this optional index in that legacy case instead of aborting the run.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'yeu_cau_cap_nhat_chinhanh'
      and column_name = 'ma_hs'
  ) then
    execute $sql$
      create index if not exists idx_perf_yc_chinhanh_hs_status_date
      on public.yeu_cau_cap_nhat_chinhanh (ma_hs, trang_thai, ngay_yeu_cau desc)
    $sql$;
  end if;
end $$;

-- --------------------------------------------------------------------------
-- Orders, payments, refunds and issued voucher codes
-- --------------------------------------------------------------------------
create index if not exists idx_perf_donhang_customer_date
  on public.donhang (ma_tk_dat, ngay_dat desc);

create index if not exists idx_perf_donhang_status_date
  on public.donhang (trang_thai, ngay_dat desc);

create index if not exists idx_perf_thanhtoan_order_status_date
  on public.thanhtoan (ma_dh, trang_thai, thoi_gian_tt desc);

create index if not exists idx_perf_thanhtoan_status_date
  on public.thanhtoan (trang_thai, thoi_gian_tt desc);

create index if not exists idx_perf_hoantien_payment_date
  on public.hoantien (ma_thanh_toan, ngay_xu_ly desc);

create index if not exists idx_perf_voucher_mua_order_status_date
  on public.voucher_mua (ma_dh, trang_thai, thoi_gian_sinh_ma desc);

create index if not exists idx_perf_voucher_mua_status_date
  on public.voucher_mua (trang_thai, thoi_gian_sinh_ma desc);

-- Kept small because it contains only successfully redeemed vouchers.
create index if not exists idx_perf_voucher_mua_used_branch_date
  on public.voucher_mua (ma_chi_nhanh_su_dung, ngay_su_dung desc)
  where trang_thai = 'Da su dung';

create index if not exists idx_perf_lssinhma_voucher_date
  on public.lssinhma (ma_voucher_mua, tg_thuc_hien desc);

create index if not exists idx_perf_khieunai_status_date
  on public.khieunai (trang_thai, ngay_khieu_nai desc);

create index if not exists idx_perf_khieunai_voucher_date
  on public.khieunai (ma_voucher_mua, ngay_khieu_nai desc);

create index if not exists idx_perf_yeucauhuy_status_date
  on public.yeucauhuy (trang_thai, ngay_yeu_cau desc);

-- --------------------------------------------------------------------------
-- Audit log listing and rejection-history lookups
-- --------------------------------------------------------------------------
create index if not exists idx_perf_log_time
  on public.log_ht (thoi_diem_thuc_hien desc);

create index if not exists idx_perf_log_actor_time
  on public.log_ht (ma_tk_thuc_hien, thoi_diem_thuc_hien desc);

create index if not exists idx_perf_log_target_time
  on public.log_ht (doi_tuong, ma_doi_tuong, thoi_diem_thuc_hien desc);

create index if not exists idx_perf_log_action_trgm
  on public.log_ht using gin (hanh_dong gin_trgm_ops);

-- --------------------------------------------------------------------------
-- Remove older indexes now fully covered by the indexes above. PK/UNIQUE
-- indexes and indexes with a different leading column are intentionally kept.
-- --------------------------------------------------------------------------
drop index if exists public.idx_tai_khoan_nguoi_dung;
drop index if exists public.idx_voucher_mua_code;
drop index if exists public.idx_nguoi_dung_ma_chi_nhanh;
drop index if exists public.idx_nguoi_dung_ma_hsdn;
drop index if exists public.idx_chi_nhanh_ma_hs;
drop index if exists public.idx_voucher_trang_thai;
drop index if exists public.idx_don_hang_ma_tk_dat;
drop index if exists public.idx_don_hang_trang_thai;
drop index if exists public.idx_thanh_toan_ma_dh;
drop index if exists public.idx_hoan_tien_ma_thanh_toan;
drop index if exists public.idx_ls_sinh_ma_voucher_mua;
drop index if exists public.idx_khieu_nai_ma_voucher_mua;
drop index if exists public.idx_log_ma_tk_thuc_hien;
drop index if exists public.idx_log_doi_tuong;
drop index if exists public.idx_yc_hoso_ma_hs;
drop index if exists public.idx_yc_cn_ma_hs;
drop index if exists public.idx_yeu_cau_huy_trang_thai;

commit;

-- Refresh planner statistics after the new indexes are available.
analyze public.nguoidung;
analyze public.chinhanh;
analyze public.hosodn;
analyze public.voucher;
analyze public.donhang;
analyze public.thanhtoan;
analyze public.hoantien;
analyze public.voucher_mua;
analyze public.lssinhma;
analyze public.khieunai;
analyze public.yeucauhuy;
analyze public.log_ht;

-- Supabase SQL Editor displays this final result so the installation is easy
-- to verify. A successful run currently returns 31 idx_perf_* indexes when the
-- optional branch-request column ma_hs exists, otherwise 30.
select indexname, indexdef
from pg_indexes
where schemaname = 'public'
  and indexname like 'idx_perf_%'
order by indexname;
