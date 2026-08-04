const supabase = require("../../../../config/supabase");
const PartnerModel = require("../models/partner.model");

class PartnerRepository {
  /**
   * Find all partner records (HOSODN) directly from Supabase DB
   */
  async findAll(query = {}) {
    try {
      let dbQuery = supabase
        .from("hosodn")
        .select("*, nguoidung!id_nguoi_dai_dien(*)");

      if (query.status && query.status !== "ALL") {
        dbQuery = dbQuery.eq("trang_thai", query.status);
      }

      const { data, error } = await dbQuery;

      if (error) {
        console.error("[PartnerRepository] findAll error:", error.message);
        return [];
      }

      if (!data || data.length === 0) return [];

      return data.map((item) => {
        const rep = item.nguoidung || {};
        return new PartnerModel({
          ma_hs: item.ma_hs,
          ten_dn: item.ten_dn,
          ma_so_thue: item.ma_so_thue,
          dia_chi: item.dia_chi,
          giay_phep_kinh_doanh: item.giay_phep_kinh_doanh,
          ngay_tao: item.ngay_tao,
          trang_thai: item.trang_thai,
          id_nguoi_dai_dien: item.id_nguoi_dai_dien,
          nguoi_dai_dien: {
            ho_ten: rep.ho_ten || "Chưa cập nhật",
            sdt: rep.sdt || "",
            email: rep.email || "",
            cccd: rep.cccd || "",
          },
        });
      });
    } catch (e) {
      console.error("[PartnerRepository] findAll exception:", e.message);
      return [];
    }
  }

  /**
   * Find partner by ID (ma_hs) or user ID (id_nguoi_dai_dien) directly from Supabase DB
   */
  async findById(id) {
    try {
      // 1. Try finding by ma_hs
      let { data, error } = await supabase
        .from("hosodn")
        .select("*, nguoidung!id_nguoi_dai_dien(*)")
        .eq("ma_hs", id)
        .maybeSingle();

      // 2. If not found, try finding by id_nguoi_dai_dien
      if (!data) {
        const { data: byRep } = await supabase
          .from("hosodn")
          .select("*, nguoidung!id_nguoi_dai_dien(*)")
          .eq("id_nguoi_dai_dien", id)
          .maybeSingle();
        data = byRep;
      }

      if (error || !data) return null;

      const rep = data.nguoidung || {};
      return new PartnerModel({
        ma_hs: data.ma_hs,
        ten_dn: data.ten_dn,
        ma_so_thue: data.ma_so_thue,
        dia_chi: data.dia_chi,
        giay_phep_kinh_doanh: data.giay_phep_kinh_doanh,
        ngay_tao: data.ngay_tao,
        trang_thai: data.trang_thai,
        id_nguoi_dai_dien: data.id_nguoi_dai_dien,
        nguoi_dai_dien: {
          ho_ten: rep.ho_ten || "",
          sdt: rep.sdt || "",
          email: rep.email || "",
          cccd: rep.cccd || "",
        },
      });
    } catch (e) {
      console.error("[PartnerRepository] findById exception:", e.message);
      return null;
    }
  }

  /**
   * Create new partner registration record
   */
  async create(payload) {
    const newPartner = {
      ten_dn: payload.ten_dn,
      ma_so_thue: payload.ma_so_thue,
      dia_chi: payload.dia_chi,
      giay_phep_kinh_doanh: payload.giay_phep_kinh_doanh,
      trang_thai: "Cho duyet",
      id_nguoi_dai_dien: payload.id_nguoi_dai_dien,
      id_nvql_voucher: payload.id_nvql_voucher,
    };

    const { data, error } = await supabase.from("hosodn").insert(newPartner).select().single();
    if (error) {
      console.error("[PartnerRepository] create error:", error.message);
      throw new Error(`Tạo hồ sơ doanh nghiệp thất bại: ${error.message}`);
    }
    return new PartnerModel(data);
  }

  /**
   * Update partner details and representative details in Supabase DB
   */
  async update(id, payload) {
    const hosodnUpdate = {};
    if (payload.ten_dn !== undefined) hosodnUpdate.ten_dn = payload.ten_dn;
    if (payload.ma_so_thue !== undefined) hosodnUpdate.ma_so_thue = payload.ma_so_thue;
    if (payload.dia_chi !== undefined) hosodnUpdate.dia_chi = payload.dia_chi;
    if (payload.giay_phep_kinh_doanh !== undefined) hosodnUpdate.giay_phep_kinh_doanh = payload.giay_phep_kinh_doanh;
    if (payload.trang_thai !== undefined) hosodnUpdate.trang_thai = payload.trang_thai;
    if (payload.ly_do_tu_choi !== undefined) hosodnUpdate.ly_do_tu_choi = payload.ly_do_tu_choi;

    // Update hosodn table
    const { error: hosodnError } = await supabase
      .from("hosodn")
      .update(hosodnUpdate)
      .eq("ma_hs", id);

    if (hosodnError) {
      console.warn("[PartnerRepository.update] Supabase hosodn update warning:", hosodnError.message);
    }

    // Update representative info in nguoidung table
    if (payload.nguoi_dai_dien) {
      const currentPartner = await this.findById(id);
      if (currentPartner?.id_nguoi_dai_dien) {
        const repData = payload.nguoi_dai_dien;
        const nguoidungUpdate = {};
        if (repData.ho_ten !== undefined) nguoidungUpdate.ho_ten = repData.ho_ten;
        if (repData.sdt !== undefined) nguoidungUpdate.sdt = repData.sdt;
        if (repData.email !== undefined) nguoidungUpdate.email = repData.email;
        if (repData.cccd !== undefined) nguoidungUpdate.cccd = repData.cccd;

        const { error: repError } = await supabase
          .from("nguoidung")
          .update(nguoidungUpdate)
          .eq("ma_nguoi_dung", currentPartner.id_nguoi_dai_dien);

        if (repError) {
          console.error("[PartnerRepository.update] Supabase nguoidung update error:", repError.message);
        }
      }
    }

    return await this.findById(id);
  }

  /**
   * Update partner approval / rejection / lock status
   */
  async updateStatus(id, trang_thai, ly_do_tu_choi = "") {
    return this.update(id, { trang_thai, ly_do_tu_choi });
  }
}

module.exports = new PartnerRepository();
