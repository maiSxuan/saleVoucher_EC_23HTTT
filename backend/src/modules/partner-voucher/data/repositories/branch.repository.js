const supabase = require("../../../../config/supabase");
const BranchModel = require("../models/branch.model");

const PARTNER_UUID_MAP = {
  "hs-001": "20000000-0000-0000-0000-000000000001",
  "hs-002": "20000000-0000-0000-0000-000000000002",
  "hs-003": "20000000-0000-0000-0000-000000000003",
  "hs-004": "20000000-0000-0000-0000-000000000004",
};

class BranchRepository {
  /**
   * Find branches by partner ID (ma_hs / id_nguoi_dai_dien / user ID) directly from Supabase DB
   */
  async findByPartnerId(partnerId) {
    if (!partnerId) return [];

    try {
      // 1. Resolve actual ma_hs from partnerId (which could be ma_hs, id_nguoi_dai_dien, or user ma_nguoi_dung)
      let resolvedMaHs = PARTNER_UUID_MAP[partnerId] || partnerId;
      const { data: hosodn } = await supabase
        .from("hosodn")
        .select("ma_hs")
        .or(`ma_hs.eq.${partnerId},id_nguoi_dai_dien.eq.${partnerId}`)
        .maybeSingle();

      if (hosodn?.ma_hs) {
        resolvedMaHs = hosodn.ma_hs;
      } else {
        const { data: userRecord } = await supabase
          .from("nguoidung")
          .select("ma_hsdn")
          .eq("ma_nguoi_dung", partnerId)
          .maybeSingle();
        if (userRecord?.ma_hsdn) resolvedMaHs = userRecord.ma_hsdn;
      }

      // 2. Query branches strictly for resolvedMaHs
      const { data, error } = await supabase
        .from("chinhanh")
        .select("*")
        .eq("ma_hs", resolvedMaHs);

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
    let validPartnerId = PARTNER_UUID_MAP[payload.ma_hs] || payload.ma_hs;
    if (payload.ma_hs) {
      const { data: userRecord } = await supabase
        .from("nguoidung")
        .select("ma_hsdn")
        .eq("ma_nguoi_dung", payload.ma_hs)
        .maybeSingle();
      if (userRecord?.ma_hsdn) validPartnerId = userRecord.ma_hsdn;
    }

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