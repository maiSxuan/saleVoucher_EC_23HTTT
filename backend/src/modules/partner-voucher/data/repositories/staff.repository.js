const supabase = require("../../../../config/supabase");
const StaffModel = require("../models/staff.model");

const SEED_STAFFS = [
  {
    ma_nv: "nv-001",
    ma_nguoi_dung: "00000000-0000-0000-0000-000000000013",
    ma_hs: "20000000-0000-0000-0000-000000000001",
    ho_ten: "Lam Tuan Kiet",
    email: "staff.nguyenhue@ec.local",
    sdt: "0900000013",
    vai_tro: "Nhân viên chi nhánh",
    chi_nhanh_phu_trach: ["Am Thuc Sai Gon - Nguyen Hue"],
    trang_thai: "Dang hoat dong",
    ngay_tao: "2026-01-15",
  },
  {
    ma_nv: "nv-002",
    ma_nguoi_dung: "00000000-0000-0000-0000-000000000043",
    ma_hs: "20000000-0000-0000-0000-000000000004",
    ho_ten: "Ngo Hoai Phuong",
    email: "staff.travel@ec.local",
    sdt: "0900000043",
    vai_tro: "Nhân viên chi nhánh",
    chi_nhanh_phu_trach: ["Du Lich Thanh Pho - Ben Thanh"],
    trang_thai: "Tam khoa",
    ngay_tao: "2026-02-20",
  },
];

class StaffRepository {
  /**
   * Find staff members by partner ID
   */
  async findByPartnerId(partnerId) {
    try {
      const { data, error } = await supabase
        .from("nguoidung")
        .select("*, chinhanh(ten_chi_nhanh)")
        .or("vai_tro.eq.Nhan vien ban hang,vai_tro.eq.Nhan vien quan ly voucher");

      if (error || !data || data.length === 0) {
        return SEED_STAFFS.filter((s) => s.ma_hs === partnerId).map((s) => new StaffModel(s));
      }

      return data
        .filter((item) => item.ma_hsdn === partnerId || item.chinhanh?.ma_hs === partnerId)
        .map((item) => {
          const branchName = item.chinhanh?.ten_chi_nhanh;
          return new StaffModel({
            ma_nv: item.ma_nguoi_dung,
            ma_nguoi_dung: item.ma_nguoi_dung,
            ma_hs: partnerId,
            ho_ten: item.ho_ten,
            email: item.email,
            sdt: item.sdt,
            vai_tro: item.vai_tro === "Nhan vien quan ly voucher" ? "Quản lý vận hành" : "Nhân viên chi nhánh",
            chi_nhanh_phu_trach: branchName ? [branchName] : [],
            trang_thai: item.trang_thai,
            ngay_tao: item.created_at ? item.created_at.slice(0, 10) : "2026-01-01",
          });
        });
    } catch (e) {
      return SEED_STAFFS.filter((s) => s.ma_hs === partnerId).map((s) => new StaffModel(s));
    }
  }

  /**
   * Find staff by ID
   */
  async findById(id) {
    const list = SEED_STAFFS;
    const found = list.find((s) => s.ma_nv === id || s.ma_nguoi_dung === id);
    return found ? new StaffModel(found) : null;
  }

  /**
   * Create new staff record
   */
  async create(payload) {
    const newStaff = new StaffModel({
      ...payload,
      ma_nv: `nv-${Date.now()}`,
      ma_nguoi_dung: `00000000-0000-0000-0000-${Date.now()}`,
    });
    SEED_STAFFS.unshift(newStaff);
    return newStaff;
  }

  /**
   * Update staff record
   */
  async update(id, payload) {
    const idx = SEED_STAFFS.findIndex((s) => s.ma_nv === id || s.ma_nguoi_dung === id);
    if (idx !== -1) {
      SEED_STAFFS[idx] = { ...SEED_STAFFS[idx], ...payload };
      return new StaffModel(SEED_STAFFS[idx]);
    }
    return new StaffModel({ ma_nv: id, ...payload });
  }

  /**
   * Delete or toggle staff lock status
   */
  async delete(id) {
    const idx = SEED_STAFFS.findIndex((s) => s.ma_nv === id || s.ma_nguoi_dung === id);
    if (idx !== -1) {
      SEED_STAFFS.splice(idx, 1);
    }
    return { success: true };
  }
}

module.exports = new StaffRepository();
