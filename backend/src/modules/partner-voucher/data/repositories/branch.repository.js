const supabase = require("../../../../config/supabase");
const BranchModel = require("../models/branch.model");

const SEED_BRANCHES = [
  {
    ma_chi_nhanh: "30000000-0000-0000-0000-000000000001",
    ten_chi_nhanh: "Am Thuc Sai Gon - Nguyen Hue",
    khu_vuc: "TP. Hồ Chí Minh",
    dia_chi: "12 Nguyen Hue, TP. Ho Chi Minh",
    trang_thai: "Dang hoat dong",
    ma_hs: "20000000-0000-0000-0000-000000000001",
    sdt: "02838221122",
    gio_mo_cua: "08:00 - 22:00",
  },
];

const PARTNER_UUID_MAP = {
  "hs-001": "20000000-0000-0000-0000-000000000001",
  "hs-002": "20000000-0000-0000-0000-000000000002",
  "hs-003": "20000000-0000-0000-0000-000000000003",
  "hs-004": "20000000-0000-0000-0000-000000000004",
};

function normalizePartnerUuid(partnerId) {
  if (PARTNER_UUID_MAP[partnerId]) return PARTNER_UUID_MAP[partnerId];
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  if (partnerId && uuidRegex.test(partnerId)) return partnerId;
  return "20000000-0000-0000-0000-000000000001";
}

class BranchRepository {
  /**
   * Find branches by partner ID (ma_hs)
   */
  async findByPartnerId(partnerId) {
    const validPartnerId = normalizePartnerUuid(partnerId);
    try {
      const { data, error } = await supabase
        .from("chinhanh")
        .select("*")
        .eq("ma_hs", validPartnerId);

      if (error || !data || data.length === 0) {
        return SEED_BRANCHES.filter((b) => b.ma_hs === validPartnerId).map((b) => new BranchModel(b));
      }

      return data.map((b) => new BranchModel(b));
    } catch (e) {
      return SEED_BRANCHES.filter((b) => b.ma_hs === validPartnerId).map((b) => new BranchModel(b));
    }
  }

  /**
   * Find branch by ID (ma_chi_nhanh)
   */
  async findById(id) {
    try {
      const { data, error } = await supabase
        .from("chinhanh")
        .select("*")
        .eq("ma_chi_nhanh", id)
        .single();

      if (error || !data) {
        const seed = SEED_BRANCHES.find((b) => b.ma_chi_nhanh === id);
        return seed ? new BranchModel(seed) : null;
      }

      return new BranchModel(data);
    } catch (e) {
      const seed = SEED_BRANCHES.find((b) => b.ma_chi_nhanh === id);
      return seed ? new BranchModel(seed) : null;
    }
  }

  /**
   * List all branches across partners
   */
  async findAll(query = {}) {
    try {
      const { data, error } = await supabase.from("chinhanh").select("*");
      if (error || !data || data.length === 0) {
        return SEED_BRANCHES.map((b) => new BranchModel(b));
      }
      return data.map((b) => new BranchModel(b));
    } catch (e) {
      return SEED_BRANCHES.map((b) => new BranchModel(b));
    }
  }

  /**
   * Create new branch record directly in Supabase CHINHANH table
   */
  async create(payload) {
    const validPartnerId = normalizePartnerUuid(payload.ma_hs);

    const dbPayload = {
      ten_chi_nhanh: payload.ten_chi_nhanh,
      khu_vuc: payload.khu_vuc || "TP. Hồ Chí Minh",
      dia_chi: payload.dia_chi,
      trang_thai: payload.trang_thai || "Cho duyet",
      ma_hs: validPartnerId,
    };

    try {
      const { data, error } = await supabase
        .from("chinhanh")
        .insert(dbPayload)
        .select()
        .single();

      if (error || !data) {
        console.error("Supabase chinhanh insert error:", error);
        const fallback = new BranchModel({ ...dbPayload, ma_chi_nhanh: `30000000-0000-0000-0000-${Date.now()}` });
        SEED_BRANCHES.unshift(fallback);
        return fallback;
      }
      return new BranchModel(data);
    } catch (e) {
      console.error("Supabase chinhanh insert exception:", e.message);
      const fallback = new BranchModel({ ...dbPayload, ma_chi_nhanh: `30000000-0000-0000-0000-${Date.now()}` });
      SEED_BRANCHES.unshift(fallback);
      return fallback;
    }
  }

  /**
   * Update branch record
   */
  async update(id, payload) {
    try {
      const { data, error } = await supabase
        .from("chinhanh")
        .update(payload)
        .eq("ma_chi_nhanh", id)
        .select()
        .single();

      if (error || !data) {
        return new BranchModel({ ma_chi_nhanh: id, ...payload });
      }
      return new BranchModel(data);
    } catch (e) {
      return new BranchModel({ ma_chi_nhanh: id, ...payload });
    }
  }

  /**
   * Delete or deactivate branch
   */
  async delete(id) {
    return this.update(id, { trang_thai: "Tam ngung hoat dong" });
  }
}

module.exports = new BranchRepository();
