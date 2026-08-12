## Table `danh_muc`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `ma_danh_muc` | `uuid` | Primary |
| `ten_danh_muc` | `text` |  Unique |
| `mo_ta` | `text` |  Nullable |

## Table `nguoidung`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `ma_nguoi_dung` | `uuid` | Primary |
| `ho_ten` | `text` |  |
| `email` | `text` |  Nullable Unique |
| `sdt` | `text` |  Nullable Unique |
| `ngay_sinh` | `date` |  Nullable |
| `gioi_tinh` | `text` |  Nullable |
| `cccd` | `text` |  Nullable Unique |
| `vai_tro` | `text` |  |
| `trang_thai` | `text` |  |
| `created_at` | `timestamptz` |  |
| `ma_chi_nhanh` | `uuid` |  Nullable |
| `ma_hsdn` | `uuid` |  Nullable |

## Table `chinhanh`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `ma_chi_nhanh` | `uuid` | Primary |
| `ten_chi_nhanh` | `text` |  |
| `dia_chi` | `text` |  Nullable |
| `trang_thai` | `text` |  |
| `ma_hs` | `uuid` |  |
| `khu_vuc` | `text` |  Nullable |

## Table `hosodn`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `ma_hs` | `uuid` | Primary |
| `ten_dn` | `text` |  |
| `ma_so_thue` | `text` |  Unique |
| `dia_chi` | `text` |  Nullable |
| `giay_phep_kinh_doanh` | `text` |  Nullable |
| `ngay_tao` | `timestamptz` |  |
| `trang_thai` | `text` |  |
| `id_nguoi_dai_dien` | `uuid` |  |

## Table `voucher`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `ma_voucher` | `uuid` | Primary |
| `ten_voucher` | `text` |  |
| `mo_ta` | `text` |  Nullable |
| `gia_goc` | `numeric` |  |
| `gia_tri_giam` | `numeric` |  |
| `dieu_kien_ap_dung` | `text` |  Nullable |
| `so_luong_phat_hanh` | `int4` |  |
| `tg_bat_dau_ban` | `timestamptz` |  |
| `tg_ket_thuc_ban` | `timestamptz` |  |
| `trang_thai` | `text` |  |
| `chinh_sach_hoan_huy` | `text` |  Nullable |
| `hinh_anh_url` | `text` |  Nullable |
| `so_luong_da_ban` | `int4` |  |
| `ma_danh_muc` | `uuid` |  |

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
| `ma_tk` | `uuid` | Primary |
| `thong_tin_dang_nhap` | `text` |  Unique |
| `mat_khau` | `text` |  |
| `ma_nguoi_dung` | `uuid` |  Unique |

## Table `giohang`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `ma_gio_hang` | `uuid` | Primary |
| `ngay_tao` | `timestamptz` |  |
| `ngay_cap_nhat` | `timestamptz` |  |
| `ma_tksohuu` | `uuid` |  Unique |

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
| `ma_dh` | `uuid` | Primary |
| `ngay_dat` | `timestamptz` |  |
| `tong_tien` | `numeric` |  |
| `trang_thai` | `text` |  |
| `ly_do_huy` | `text` |  Nullable |
| `nguoi_nhan` | `text` |  Nullable |
| `ma_tk_dat` | `uuid` |  |

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
| `ma_thanh_toan` | `uuid` | Primary |
| `thoi_gian_tt` | `timestamptz` |  |
| `so_tien` | `numeric` |  |
| `phuong_thuc_tt` | `text` |  |
| `trang_thai` | `text` |  |
| `ma_dh` | `uuid` |  |

## Table `hoantien`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `ma_hoan_tien` | `uuid` | Primary |
| `so_tien` | `numeric` |  |
| `trang_thai` | `text` |  |
| `ly_do` | `text` |  Nullable |
| `ngay_xu_ly` | `timestamptz` |  Nullable |
| `ma_tk` | `uuid` |  |
| `ma_thanh_toan` | `uuid` |  |

## Table `voucher_mua`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `ma_voucher_mua` | `uuid` | Primary |
| `ma_dh` | `uuid` |  |
| `ma_voucher` | `uuid` |  |
| `voucher_code` | `text` |  Unique |
| `thoi_gian_sinh_ma` | `timestamptz` |  |
| `trang_thai` | `text` |  |
| `gia_tri_qr_mo_phong` | `text` |  Nullable |
| `ngay_su_dung` | `timestamptz` |  Nullable |
| `ma_chi_nhanh_su_dung` | `uuid` |  Nullable |
| `ma_nhan_vien_xac_nhan` | `uuid` |  Nullable |

## Table `lssinhma`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `ma_ls` | `uuid` | Primary |
| `voucher_code_cu` | `text` |  Nullable |
| `voucher_code_moi` | `text` |  |
| `tg_thuc_hien` | `timestamptz` |  |
| `ma_voucher_mua` | `uuid` |  |
| `ma_tk_admin` | `uuid` |  |

## Table `danhgia`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `ma_danh_gia` | `uuid` | Primary |
| `diem` | `int4` |  |
| `noi_dung` | `text` |  Nullable |
| `ngay_danh_gia` | `timestamptz` |  |
| `ma_voucher_mua` | `uuid` |  |
| `ma_tk_danhgia` | `uuid` |  |

## Table `khieunai`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `ma_khieu_nai` | `uuid` | Primary |
| `noi_dung` | `text` |  |
| `ngay_khieu_nai` | `timestamptz` |  |
| `trang_thai` | `text` |  |
| `ma_voucher_mua` | `uuid` |  |
| `ma_tk_xuly` | `uuid` |  Nullable |

## Table `log_ht`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `log_id` | `uuid` | Primary |
| `vai_tro_thuc_hien` | `text` |  Nullable |
| `hanh_dong` | `text` |  |
| `du_lieu_truoc` | `jsonb` |  Nullable |
| `du_lieu_sau` | `jsonb` |  Nullable |
| `ket_qua` | `text` |  Nullable |
| `ly_do_thuc_hien` | `text` |  Nullable |
| `thoi_diem_thuc_hien` | `timestamptz` |  |
| `ma_tk_thuc_hien` | `uuid` |  Nullable |
| `doi_tuong` | `text` |  Nullable |
| `ma_doi_tuong` | `uuid` |  Nullable |

## Table `noidung`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `ma_nd` | `uuid` | Primary |
| `loai` | `text` |  |
| `tieu_de` | `text` |  |
| `vai_tro` | `text` |  Nullable |
| `trang_thai` | `text` |  |
| `noi_dung` | `text` |  Nullable |
| `bat_dau_hien_thi` | `timestamptz` |  Nullable |
| `ket_thuc_hien_thi` | `timestamptz` |  Nullable |
| `ngay_tao` | `timestamptz` |  |
| `ngay_cap_nhat` | `timestamptz` |  |
| `matk_admin` | `uuid` |  |

## Table `yeu_cau_cap_nhat_hosodn`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `ma_yc` | `uuid` | Primary |
| `ma_hs` | `uuid` |  |
| `ten_dn_moi` | `text` |  Nullable |
| `ma_so_thue_moi` | `text` |  Nullable |
| `dia_chi_moi` | `text` |  Nullable |
| `giay_phep_kinh_doanh_moi` | `text` |  Nullable |
| `ho_ten_nguoi_dai_dien_moi` | `text` |  Nullable |
| `sdt_nguoi_dai_dien_moi` | `text` |  Nullable |
| `email_nguoi_dai_dien_moi` | `text` |  Nullable |
| `cccd_moi` | `text` |  Nullable |
| `trang_thai` | `varchar` |  |
| `ly_do_tu_choi` | `text` |  Nullable |
| `ngay_yeu_cau` | `timestamptz` |  |
| `nguoi_duyet` | `uuid` |  Nullable |
| `ngay_duyet` | `timestamptz` |  Nullable |
| `ngay_sinh` | `date` |  Nullable |
| `gioi_tinh` | `text` |  Nullable |

## Table `yeu_cau_cap_nhat_chinhanh`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `ma_yc` | `uuid` | Primary |
| `ma_chi_nhanh` | `uuid` |  |
| `loai_yeu_cau` | `varchar` |  |
| `ten_chi_nhanh_moi` | `text` |  Nullable |
| `khu_vuc_moi` | `text` |  Nullable |
| `dia_chi_moi` | `text` |  Nullable |
| `trang_thai` | `varchar` |  |
| `ly_do_tu_choi` | `text` |  Nullable |
| `ngay_yeu_cau` | `timestamptz` |  |
| `nguoi_duyet` | `uuid` |  Nullable |
| `ngay_duyet` | `timestamptz` |  Nullable |

