const supabase = require("../../../../config/supabase");
const PartnerModel = require("../models/partner.model");

// In-memory fallback dataset for seamless demo operation
const SEED_PARTNERS = [
  {
    ma_hs: "20000000-0000-0000-0000-000000000001",
    ten_dn: "Cong ty TNHH Am Thuc Sai Gon",
    ma_so_thue: "0310000001",
    dia_chi: "12 Nguyen Hue, TP. Ho Chi Minh",
    giay_phep_kinh_doanh: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
    ngay_tao: "2025-10-21T09:34:18.181Z",
    trang_thai: "Dang hoat dong",
    ly_do_tu_choi: "",
    nguoi_dai_dien: {
      ho_ten: "Pham Hoang Nam",
      sdt: "0900000011",
      email: "owner.amthuc@ec.local",
      cccd: "079088000011",
    },
  },
  {
    ma_hs: "20000000-0000-0000-0000-000000000002",
    ten_dn: "Cong ty TNHH Spa An Nhien",
    ma_so_thue: "0310000002",
    dia_chi: "25 Thanh Thai, TP. Ho Chi Minh",
    giay_phep_kinh_doanh: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80",
    ngay_tao: "2026-07-13T09:34:18.181Z",
    trang_thai: "Cho duyet",
    ly_do_tu_choi: "",
    nguoi_dai_dien: {
      ho_ten: "Nguyen Thi An",
      sdt: "0900000021",
      email: "owner.spa@ec.local",
      cccd: "079087000021",
    },
  },
  {
    ma_hs: "20000000-0000-0000-0000-000000000003",
    ten_dn: "Cong ty Co phan Giao Duc Tuong Lai",
    ma_so_thue: "0310000003",
    dia_chi: "80 Vo Van Tan, TP. Ho Chi Minh",
    giay_phep_kinh_doanh: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=600&q=80",
    ngay_tao: "2026-06-23T09:34:18.181Z",
    trang_thai: "Tu choi",
    ly_do_tu_choi: "Giấy phép kinh doanh chưa hợp lệ.",
    nguoi_dai_dien: {
      ho_ten: "Truong Van Hung",
      sdt: "0900000031",
      email: "owner.edu@ec.local",
      cccd: "079085000031",
    },
  },
];

class PartnerRepository {
  /**
   * Find all partner records (HOSODN)
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

      if (error || !data || data.length === 0) {
        return SEED_PARTNERS.map((p) => new PartnerModel(p));
      }

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
      return SEED_PARTNERS.map((p) => new PartnerModel(p));
    }
  }

  /**
   * Find partner by ID (ma_hs)
   */
  async findById(id) {
    try {
      const { data, error } = await supabase
        .from("hosodn")
        .select("*, nguoidung!id_nguoi_dai_dien(*)")
        .eq("ma_hs", id)
        .single();

      if (error || !data) {
        const seed = SEED_PARTNERS.find((p) => p.ma_hs === id);
        return seed ? new PartnerModel(seed) : null;
      }

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
      const seed = SEED_PARTNERS.find((p) => p.ma_hs === id);
      return seed ? new PartnerModel(seed) : null;
    }
  }

  /**
   * Create new partner registration record
   */
  async create(payload) {
    try {
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
      if (error || !data) {
        return new PartnerModel({ ...payload, ma_hs: `20000000-0000-0000-0000-${Date.now()}` });
      }
      return new PartnerModel(data);
    } catch (e) {
      return new PartnerModel({ ...payload, ma_hs: `20000000-0000-0000-0000-${Date.now()}` });
    }
  }

  /**
   * Update partner details or status
   */
  async update(id, payload) {
    try {
      const { data, error } = await supabase
        .from("hosodn")
        .update(payload)
        .eq("ma_hs", id)
        .select()
        .single();

      if (error || !data) {
        return new PartnerModel({ ma_hs: id, ...payload });
      }
      return new PartnerModel(data);
    } catch (e) {
      return new PartnerModel({ ma_hs: id, ...payload });
    }
  }

  /**
   * Update partner approval / rejection / lock status
   */
  async updateStatus(id, trang_thai, ly_do_tu_choi = "") {
    return this.update(id, { trang_thai });
  }
}

module.exports = new PartnerRepository();
