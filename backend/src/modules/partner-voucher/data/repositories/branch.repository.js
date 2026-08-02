const supabase = require("../../../../config/supabase");
const BranchModel = require("../models/branch.model");

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
   * Find branches by partner ID (ma_hs) directly from Supabase DB
   */
  async findByPartnerId(partnerId) {
    const validPartnerId = normalizePartnerUuid(partnerId);
    try {
      const { data, error } = await supabase
        .from("chinhanh")
        .select("*")
        .eq("ma_hs", validPartnerId);

      if (error) {
        console.error("[BranchRepository] findByPartnerId error:", error.message);
        return [];
      }

      if (!data || data.length === 0) return [];
      return data.map((b) => new BranchModel(b));
    } catch (e) {
      console.error("[BranchRepository] findByPartnerId exception:", e.message);
      return [];
    }
  }

  /**
   * Find branch by ID (ma_chi_nhanh) directly from Supabase DB
   */
  async findById(id) {
    try {
      const { data, error } = await supabase
        .from("chinhanh")
        .select("*")
        .eq("ma_chi_nhanh", id)
        .single();

      if (error || !data) return null;
      return new BranchModel(data);
    } catch (e) {
      console.error("[BranchRepository] findById exception:", e.message);
      return null;
    }
  }

  /**
   * List all branches across partners directly from Supabase DB
   */
  async findAll(query = {}) {
    try {
      const { data, error } = await supabase.from("chinhanh").select("*");
      if (error || !data || data.length === 0) return [];
      return data.map((b) => new BranchModel(b));
    } catch (e) {
      console.error("[BranchRepository] findAll exception:", e.message);
      return [];
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

    const { data, error } = await supabase
      .from("chinhanh")
      .insert(dbPayload)
      .select()
      .single();

    if (error) {
      console.error("[BranchRepository] create error:", error.message);
      throw new Error(`Thêm chi nhánh thất bại: ${error.message}`);
    }
    return new BranchModel(data);
  }

  /**
   * Update branch record
   */
  async update(id, payload) {
    const { data, error } = await supabase
      .from("chinhanh")
      .update(payload)
      .eq("ma_chi_nhanh", id)
      .select()
      .single();

    if (error) {
      console.error("[BranchRepository] update error:", error.message);
      throw new Error(`Cập nhật chi nhánh thất bại: ${error.message}`);
    }
    return new BranchModel(data);
  }

  /**
   * Delete or deactivate branch
   */
  async delete(id) {
    return this.update(id, { trang_thai: "Tam ngung hoat dong" });
  }
}

module.exports = new BranchRepository();
