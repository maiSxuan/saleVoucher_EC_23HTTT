## Table `danh_muc`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `ten_danh_muc` | `text` |  Unique |
| `mo_ta` | `text` |  Nullable |
| `ma_danh_muc` | `uuid` | Primary |
| `hinh_anh_url` | `text` |  Nullable |

## Table `nguoidung`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `ho_ten` | `text` |  |
| `email` | `text` |  Nullable Unique |
| `sdt` | `text` |  Nullable Unique |
| `ngay_sinh` | `date` |  Nullable |
| `gioi_tinh` | `text` |  Nullable |
| `cccd` | `text` |  Nullable Unique |
| `vai_tro` | `text` |  |
| `ma_chi_nhanh` | `uuid` |  Nullable |
| `ma_nguoi_dung` | `uuid` | Primary |
| `trang_thai` | `text` |  |
| `created_at` | `timestamptz` |  |
| `ma_hsdn` | `uuid` |  Nullable |

## Table `chinhanh`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `ten_chi_nhanh` | `text` |  |
| `dia_chi` | `text` |  Nullable |
| `ma_hs` | `uuid` |  |
| `ma_chi_nhanh` | `uuid` | Primary |
| `trang_thai` | `text` |  |
| `khu_vuc` | `text` |  Nullable |

## Table `hosodn`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `ten_dn` | `text` |  |
| `ma_so_thue` | `text` |  Unique |
| `dia_chi` | `text` |  Nullable |
| `giay_phep_kinh_doanh` | `text` |  Nullable |
| `ma_hs` | `uuid` | Primary |
| `ngay_tao` | `timestamptz` |  |
| `trang_thai` | `text` |  |
| `logo` | `varchar` |  Nullable |

## Table `voucher`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `ten_voucher` | `text` |  |
| `mo_ta` | `text` |  Nullable |
| `gia_goc` | `numeric` |  |
| `dieu_kien_ap_dung` | `text` |  Nullable |
| `so_luong_phat_hanh` | `int4` |  |
| `tg_bat_dau_ban` | `timestamptz` |  |
| `tg_ket_thuc_ban` | `timestamptz` |  |
| `chinh_sach_hoan_huy` | `text` |  Nullable |
| `hinh_anh_url` | `text` |  Nullable |
| `ma_danh_muc` | `uuid` |  |
| `ma_voucher` | `uuid` | Primary |
| `gia_tri_giam` | `numeric` |  |
| `trang_thai` | `text` |  |
| `so_luong_da_ban` | `int4` |  |

## Table `voucher_cn`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `ma_voucher` | `uuid` | Primary |
| `ma_chi_nhanh` | `uuid` | Primary |

## Table `taikhoan`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `thong_tin_dang_nhap` | `text` |  Unique |
| `mat_khau` | `text` |  |
| `ma_nguoi_dung` | `uuid` |  Unique |
| `ma_tk` | `uuid` | Primary |

## Table `giohang`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `ma_tksohuu` | `uuid` |  Unique |
| `ma_gio_hang` | `uuid` | Primary |
| `ngay_tao` | `timestamptz` |  |
| `ngay_cap_nhat` | `timestamptz` |  |

## Table `chitietgiohang`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `ma_gio_hang` | `uuid` | Primary |
| `ma_voucher` | `uuid` | Primary |
| `so_luong` | `int4` |  |
| `ngay_them` | `timestamptz` |  |
| `ngay_cap_nhat` | `timestamptz` |  |

## Table `donhang`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `tong_tien` | `numeric` |  |
| `ly_do_huy` | `text` |  Nullable |
| `nguoi_nhan` | `text` |  Nullable |
| `ma_tk_dat` | `uuid` |  |
| `ma_dh` | `uuid` | Primary |
| `ngay_dat` | `timestamptz` |  |
| `trang_thai` | `text` |  |

## Table `chitietdonhang`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `ma_dh` | `uuid` | Primary |
| `ma_voucher` | `uuid` | Primary |
| `so_luong` | `int4` |  |
| `gia_tai_thoi_diem_mua` | `numeric` |  |

## Table `thanhtoan`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `so_tien` | `numeric` |  |
| `phuong_thuc_tt` | `text` |  |
| `ma_dh` | `uuid` |  |
| `ma_thanh_toan` | `uuid` | Primary |
| `thoi_gian_tt` | `timestamptz` |  |
| `trang_thai` | `text` |  |
| `ma_gd_goc` | `text` |  Nullable |

## Table `hoantien`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `so_tien` | `numeric` |  |
| `ly_do` | `text` |  Nullable |
| `ngay_xu_ly` | `timestamptz` |  Nullable |
| `ma_thanh_toan` | `uuid` |  |
| `ma_tk` | `uuid` |  Nullable |
| `ma_hoan_tien` | `uuid` | Primary |
| `trang_thai` | `text` |  |
| `cong_thanh_toan` | `text` |  Nullable |
| `ma_gd_hoan` | `text` |  Nullable |
| `nguon_phat_sinh` | `text` |  Nullable |
| `ma_yc_huy` | `uuid` |  Nullable |
| `ma_khieu_nai` | `uuid` |  Nullable |
| `ma_phan_hoi` | `text` |  Nullable |
| `nguon` | `text` |  Nullable |

## Table `voucher_mua`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `ma_dh` | `uuid` |  |
| `ma_voucher` | `uuid` |  |
| `voucher_code` | `text` |  Unique |
| `gia_tri_qr_mo_phong` | `text` |  Nullable |
| `ngay_su_dung` | `timestamptz` |  Nullable |
| `ma_chi_nhanh_su_dung` | `uuid` |  Nullable |
| `ma_nhan_vien_xac_nhan` | `uuid` |  Nullable |
| `ma_voucher_mua` | `uuid` | Primary |
| `thoi_gian_sinh_ma` | `timestamptz` |  |
| `trang_thai` | `text` |  |

## Table `lssinhma`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `voucher_code_cu` | `text` |  Nullable |
| `voucher_code_moi` | `text` |  |
| `ma_voucher_mua` | `uuid` |  |
| `ma_tk_admin` | `uuid` |  |
| `ma_ls` | `uuid` | Primary |
| `tg_thuc_hien` | `timestamptz` |  |

## Table `danhgia`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `diem` | `int4` |  |
| `noi_dung` | `text` |  Nullable |
| `ma_voucher_mua` | `uuid` |  |
| `ma_tk_danhgia` | `uuid` |  |
| `ma_danh_gia` | `uuid` | Primary |
| `ngay_danh_gia` | `timestamptz` |  |

## Table `khieunai`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `noi_dung` | `text` |  |
| `ma_voucher_mua` | `uuid` |  |
| `ma_khieu_nai` | `uuid` | Primary |
| `ngay_khieu_nai` | `timestamptz` |  |
| `trang_thai` | `text` |  |
| `ma_tk_xuly` | `uuid` |  Nullable |
| `ly_do_tu_choi_kn` | `text` |  Nullable |

## Table `log_ht`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `vai_tro_thuc_hien` | `text` |  Nullable |
| `hanh_dong` | `text` |  |
| `du_lieu_truoc` | `jsonb` |  Nullable |
| `du_lieu_sau` | `jsonb` |  Nullable |
| `ket_qua` | `text` |  Nullable |
| `ly_do_thuc_hien` | `text` |  Nullable |
| `ma_tk_thuc_hien` | `uuid` |  Nullable |
| `doi_tuong` | `text` |  Nullable |
| `ma_doi_tuong` | `uuid` |  Nullable |
| `log_id` | `uuid` | Primary |
| `thoi_diem_thuc_hien` | `timestamptz` |  |

## Table `noidung`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `loai` | `text` |  |
| `tieu_de` | `text` |  |
| `noi_dung` | `text` |  Nullable |
| `bat_dau_hien_thi` | `timestamptz` |  Nullable |
| `ket_thuc_hien_thi` | `timestamptz` |  Nullable |
| `matk_admin` | `uuid` |  |
| `ma_nd` | `uuid` | Primary |
| `trang_thai` | `text` |  |
| `ngay_tao` | `timestamptz` |  |
| `ngay_cap_nhat` | `timestamptz` |  |
| `hinh_anh_url` | `text` |  Nullable |

## Table `yeu_cau_cap_nhat_hosodn`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `ngay_sinh` | `date` |  Nullable |
| `gioi_tinh` | `text` |  Nullable |
| `logo_new` | `varchar` |  Nullable |
| `ma_hs` | `uuid` |  |
| `ten_dn_moi` | `text` |  Nullable |
| `ma_so_thue_moi` | `text` |  Nullable |
| `dia_chi_moi` | `text` |  Nullable |
| `giay_phep_kinh_doanh_moi` | `text` |  Nullable |
| `ho_ten_nguoi_dai_dien_moi` | `text` |  Nullable |
| `sdt_nguoi_dai_dien_moi` | `text` |  Nullable |
| `email_nguoi_dai_dien_moi` | `text` |  Nullable |
| `cccd_moi` | `text` |  Nullable |
| `ly_do_tu_choi` | `text` |  Nullable |
| `nguoi_duyet` | `uuid` |  Nullable |
| `ngay_duyet` | `timestamptz` |  Nullable |
| `ma_yc` | `uuid` | Primary |
| `trang_thai` | `varchar` |  |
| `ngay_yeu_cau` | `timestamptz` |  |

## Table `yeu_cau_cap_nhat_chinhanh`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `ma_chi_nhanh` | `uuid` |  |
| `loai_yeu_cau` | `varchar` |  |
| `ten_chi_nhanh_moi` | `text` |  Nullable |
| `khu_vuc_moi` | `text` |  Nullable |
| `dia_chi_moi` | `text` |  Nullable |
| `ly_do_tu_choi` | `text` |  Nullable |
| `nguoi_duyet` | `uuid` |  Nullable |
| `ngay_duyet` | `timestamptz` |  Nullable |
| `ma_yc` | `uuid` | Primary |
| `trang_thai` | `varchar` |  |
| `ngay_yeu_cau` | `timestamptz` |  |

## Table `yeucauhuy`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `ly_do_kh` | `text` |  |
| `ly_do_xu_ly` | `text` |  Nullable |
| `ngay_xu_ly` | `timestamptz` |  Nullable |
| `ma_dh` | `uuid` |  Unique |
| `ma_tk_xuly` | `uuid` |  Nullable |
| `ma_yc_huy` | `uuid` | Primary |
| `ngay_yeu_cau` | `timestamptz` |  |
| `trang_thai` | `text` |  |

