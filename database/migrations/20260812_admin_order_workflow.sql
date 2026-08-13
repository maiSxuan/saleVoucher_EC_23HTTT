-- Upgrade an existing EC Voucher database for the admin order workflows.
-- Safe to run more than once.
begin;

alter table if exists public.thanhtoan
  add column if not exists ma_gd_goc text;

alter table if exists public.khieunai
  add column if not exists ly_do_tu_choi_kn text;

alter table if exists public.hoantien
  add column if not exists cong_thanh_toan text,
  add column if not exists ma_gd_hoan text,
  add column if not exists ma_phan_hoi text,
  add column if not exists nguon text,
  add column if not exists ma_yc_huy uuid,
  add column if not exists ma_khieu_nai uuid;

-- Expand legacy CHECK constraints to the states used by UC-ADM-06/07.
alter table if exists public.hoantien
  drop constraint if exists hoantien_trang_thai_check;
alter table if exists public.hoantien
  add constraint hoantien_trang_thai_check
  check (trang_thai in ('Cho xu ly', 'Dang xu ly', 'Thanh cong', 'That bai', 'Can kiem tra'));

alter table if exists public.hoantien
  drop constraint if exists hoantien_nguon_check;
alter table if exists public.hoantien
  add constraint hoantien_nguon_check
  check (nguon is null or nguon in ('Yeu cau huy', 'Khieu nai'));

alter table if exists public.khieunai
  drop constraint if exists khieunai_trang_thai_check;
alter table if exists public.khieunai
  add constraint khieunai_trang_thai_check
  check (trang_thai in ('Moi', 'Dang xu ly', 'Da xu ly', 'Tu choi'));

do $$
begin
  if to_regclass('public.hoantien') is not null
     and to_regclass('public.yeucauhuy') is not null
     and not exists (
       select 1 from pg_constraint
       where conrelid = 'public.hoantien'::regclass
         and conname = 'fk_hoantien_yeucauhuy'
     ) then
    alter table public.hoantien
      add constraint fk_hoantien_yeucauhuy
      foreign key (ma_yc_huy) references public.yeucauhuy(ma_yc_huy);
  end if;

  if to_regclass('public.hoantien') is not null
     and to_regclass('public.khieunai') is not null
     and not exists (
       select 1 from pg_constraint
       where conrelid = 'public.hoantien'::regclass
         and conname = 'fk_hoantien_khieunai'
     ) then
    alter table public.hoantien
      add constraint fk_hoantien_khieunai
      foreign key (ma_khieu_nai) references public.khieunai(ma_khieu_nai);
  end if;
end $$;

create unique index if not exists uq_hoantien_ma_yc_huy
  on public.hoantien (ma_yc_huy)
  where ma_yc_huy is not null;

create unique index if not exists uq_hoantien_ma_khieu_nai
  on public.hoantien (ma_khieu_nai)
  where ma_khieu_nai is not null;

commit;
