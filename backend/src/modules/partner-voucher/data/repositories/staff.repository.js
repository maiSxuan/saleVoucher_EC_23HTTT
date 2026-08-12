const supabase = require("../../../../config/supabase");
const StaffModel = require("../models/staff.model");

const bcrypt = require("bcryptjs");

class StaffRepository {
  async resolvePartnerId(inputPartnerId) {
    if (!inputPartnerId) return "20000000-0000-0000-0000-000000000001";
    let resolvedMaHs = inputPartnerId;
    const { data: hosodn } = await supabase
      .from("hosodn")
      .select("ma_hs")
      .or(`ma_hs.eq.${inputPartnerId},id_nguoi_dai_dien.eq.${inputPartnerId}`)
      .maybeSingle();

    if (hosodn?.ma_hs) {
      resolvedMaHs = hosodn.ma_hs;
    } else {
      const { data: userRecord } = await supabase
        .from("nguoidung")
        .select("ma_hsdn")
        .eq("ma_nguoi_dung", inputPartnerId)
        .maybeSingle();
      if (userRecord?.ma_hsdn) resolvedMaHs = userRecord.ma_hsdn;
    }
    return resolvedMaHs;
  }

  async findByPartnerId(partnerId) {
    const validPartnerId = await this.resolvePartnerId(partnerId);
    try {
      // (1) Nhân viên quản lý - gắn trực tiếp với doanh nghiệp qua ma_hsdn
      const { data: quanLyData, error: quanLyError } = await supabase
        .from("nguoidung")
        .select("*")
        .eq("vai_tro", "Nhan vien quan ly voucher")
        .eq("ma_hsdn", validPartnerId);

      if (quanLyError) {
        console.error("[StaffRepository] findByPartnerId (quanLy) error:", quanLyError.message);
      }

      // (2) Nhân viên chi nhánh - gắn với doanh nghiệp qua chinhanh.ma_hs
      const { data: chiNhanhData, error: chiNhanhError } = await supabase
        .from("nguoidung")
        .select("*, chinhanh!inner(ten_chi_nhanh, ma_hs)")
        .eq("vai_tro", "Nhan vien ban hang")
        .eq("chinhanh.ma_hs", validPartnerId);

      if (chiNhanhError) {
        console.error("[StaffRepository] findByPartnerId (chiNhanh) error:", chiNhanhError.message);
      }

      const combined = [...(quanLyData || []), ...(chiNhanhData || [])];

      return combined.map((item) => {
        const branchName = item.chinhanh?.ten_chi_nhanh;
        return new StaffModel({
          ma_nv: item.ma_nguoi_dung,
          ma_nguoi_dung: item.ma_nguoi_dung,
          ma_hs: validPartnerId,
          ho_ten: item.ho_ten,
          email: item.email,
          sdt: item.sdt,
          ngay_sinh: item.ngay_sinh,
          gioi_tinh: item.gioi_tinh || "Khac",
          cccd: item.cccd || "",
          vai_tro: item.vai_tro === "Nhan vien quan ly voucher" ? "Quản lý vận hành" : "Nhân viên chi nhánh",
          ma_chi_nhanh: item.ma_chi_nhanh || null,
          chi_nhanh_phu_trach: branchName ? [branchName] : [],
          trang_thai: item.trang_thai,
          ngay_tao: item.created_at ? item.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
        });
      });
    } catch (e) {
      console.error("[StaffRepository] findByPartnerId exception:", e.message);
      return [];
    }
  }

  async findById(id) {
    try {
      const { data, error } = await supabase
        .from("nguoidung")
        .select("*, chinhanh(ten_chi_nhanh)")
        .eq("ma_nguoi_dung", id)
        .single();

      if (error || !data) return null;

      const branchName = data.chinhanh?.ten_chi_nhanh;
      return new StaffModel({
        ma_nv: data.ma_nguoi_dung,
        ma_nguoi_dung: data.ma_nguoi_dung,
        ma_hs: data.ma_hsdn || data.chinhanh?.ma_hs,
        ho_ten: data.ho_ten,
        email: data.email,
        sdt: data.sdt,
        ngay_sinh: data.ngay_sinh,
        gioi_tinh: data.gioi_tinh || "Khac",
        cccd: data.cccd || "",
        vai_tro: data.vai_tro === "Nhan vien quan ly voucher" ? "Quản lý vận hành" : "Nhân viên chi nhánh",
        ma_chi_nhanh: data.ma_chi_nhanh || null,
        chi_nhanh_phu_trach: branchName ? [branchName] : [],
        trang_thai: data.trang_thai,
        ngay_tao: data.created_at ? data.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
      });
    } catch (e) {
      console.error("[StaffRepository] findById exception:", e.message);
      return null;
    }
  }

  async create(payload) {
    const validPartnerId = await this.resolvePartnerId(payload.ma_hs);
    const isNvbh = payload.vai_tro !== "Quản lý vận hành";

    let branchId = payload.ma_chi_nhanh || null;
    if (isNvbh && !branchId) {
      const { data: defaultBranch } = await supabase
        .from("chinhanh")
        .select("ma_chi_nhanh")
        .eq("ma_hs", validPartnerId)
        .limit(1)
        .maybeSingle();

      branchId = defaultBranch?.ma_chi_nhanh || null;
    }

    const dbPayload = {
      ho_ten: payload.ho_ten,
      email: payload.email || null,
      sdt: payload.sdt || null,
      ngay_sinh: payload.ngay_sinh || null,
      gioi_tinh: payload.gioi_tinh || "Khac",
      cccd: payload.cccd || null,
      vai_tro: isNvbh ? "Nhan vien ban hang" : "Nhan vien quan ly voucher",
      trang_thai: payload.trang_thai || "Dang hoat dong",
      ma_hsdn: isNvbh ? null : validPartnerId,
      ma_chi_nhanh: isNvbh ? branchId : null,
    };

    const { data, error } = await supabase.from("nguoidung").insert(dbPayload).select().single();
    if (error) {
      console.error("[StaffRepository] create error:", error.message);
      throw new Error(`Thêm nhân viên thất bại: ${error.message}`);
    }

    // Tự động khởi tạo Tài khoản Đăng nhập trong bảng `taikhoan` cho nhân viên
    const loginIdentifier = payload.email || payload.sdt;
    if (loginIdentifier) {
      try {
        const rawPassword = payload.mat_khau || "123456";
        const hashedPassword = await bcrypt.hash(rawPassword, 10);
        await supabase.from("taikhoan").insert({
          thong_tin_dang_nhap: loginIdentifier.trim().toLowerCase(),
          mat_khau: hashedPassword,
          ma_nguoi_dung: data.ma_nguoi_dung,
        });
      } catch (accErr) {
        console.warn("[StaffRepository] create taikhoan warning:", accErr.message);
      }
    }

    return this.findById(data.ma_nguoi_dung);
  }

  async update(id, payload) {
    const isNvbh = payload.vai_tro !== "Quản lý vận hành";
    const updatePayload = {};
    if (payload.ho_ten !== undefined) updatePayload.ho_ten = payload.ho_ten;
    if (payload.sdt !== undefined) updatePayload.sdt = payload.sdt || null;
    if (payload.email !== undefined) updatePayload.email = payload.email || null;
    if (payload.ngay_sinh !== undefined) updatePayload.ngay_sinh = payload.ngay_sinh || null;
    if (payload.gioi_tinh !== undefined) updatePayload.gioi_tinh = payload.gioi_tinh;
    if (payload.cccd !== undefined) updatePayload.cccd = payload.cccd || null;
    if (payload.trang_thai !== undefined) updatePayload.trang_thai = payload.trang_thai;
    if (payload.vai_tro !== undefined) {
      const validPartnerId = await this.resolvePartnerId(payload.ma_hs);
      updatePayload.vai_tro = isNvbh ? "Nhan vien ban hang" : "Nhan vien quan ly voucher";
      updatePayload.ma_hsdn = isNvbh ? null : validPartnerId;
    }
    if (payload.ma_chi_nhanh !== undefined) {
      updatePayload.ma_chi_nhanh = isNvbh ? payload.ma_chi_nhanh : null;
    }

    const { error } = await supabase.from("nguoidung").update(updatePayload).eq("ma_nguoi_dung", id);
    if (error) {
      console.error("[StaffRepository] update error:", error.message);
      throw new Error(`Cập nhật nhân viên thất bại: ${error.message}`);
    }

    // Đồng bộ thông tin đăng nhập trong bảng `taikhoan`
    const newLoginIdentifier = payload.email || payload.sdt;
    if (newLoginIdentifier || payload.mat_khau) {
      try {
        const { data: existingAcc } = await supabase
          .from("taikhoan")
          .select("ma_tk")
          .eq("ma_nguoi_dung", id)
          .maybeSingle();

        const accFields = {};
        if (newLoginIdentifier) {
          accFields.thong_tin_dang_nhap = newLoginIdentifier.trim().toLowerCase();
        }
        if (payload.mat_khau) {
          accFields.mat_khau = await bcrypt.hash(payload.mat_khau, 10);
        }

        if (existingAcc) {
          await supabase.from("taikhoan").update(accFields).eq("ma_tk", existingAcc.ma_tk);
        } else if (newLoginIdentifier) {
          const rawPassword = payload.mat_khau || "123456";
          const hashedPassword = await bcrypt.hash(rawPassword, 10);
          await supabase.from("taikhoan").insert({
            thong_tin_dang_nhap: newLoginIdentifier.trim().toLowerCase(),
            mat_khau: hashedPassword,
            ma_nguoi_dung: id,
          });
        }
      } catch (accErr) {
        console.warn("[StaffRepository] sync taikhoan warning:", accErr.message);
      }
    }

    return this.findById(id);
  }

  async delete(id) {
    return this.update(id, { trang_thai: "Tam khoa" });
  }
}

module.exports = new StaffRepository();