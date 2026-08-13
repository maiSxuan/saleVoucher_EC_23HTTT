const supabase = require("../../../../config/supabase");

// Fallback memory store if needed
const PROFILE_REQUESTS_STORE = new Map();

class PartnerProfileRequestRepository {
  /**
   * Fetch all profile update requests for a partner
   */
  async findByPartnerId(partnerId) {
    try {
      const { data, error } = await supabase
        .from("yeu_cau_cap_nhat_hosodn")
        .select("*")
        .eq("ma_hs", partnerId)
        .order("ngay_yeu_cau", { ascending: false });

      if (!error && data) {
        return data;
      }
    } catch (e) {
      console.warn("[PartnerProfileRequestRepo] DB fetch warning:", e.message);
    }

    // Fallback to memory store
    return Array.from(PROFILE_REQUESTS_STORE.values()).filter((r) => r.ma_hs === partnerId);
  }

  /**
   * Find profile update request by ID
   */
  async findById(reqId) {
    try {
      const { data, error } = await supabase
        .from("yeu_cau_cap_nhat_hosodn")
        .select("*")
        .eq("ma_yc", reqId)
        .maybeSingle();

      if (!error && data) {
        return data;
      }
    } catch (e) {
      console.warn("[PartnerProfileRequestRepo] findById DB warning:", e.message);
    }

    return PROFILE_REQUESTS_STORE.get(reqId) || null;
  }

  /**
   * Find pending profile update request for a partner
   */
  async findPendingByPartnerId(partnerId) {
    try {
      const { data, error } = await supabase
        .from("yeu_cau_cap_nhat_hosodn")
        .select("*")
        .eq("ma_hs", partnerId)
        .or("trang_thai.eq.Cho duyet,trang_thai.eq.Cho xu ly")
        .order("ngay_yeu_cau", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        return data;
      }
    } catch (e) {
      console.warn("[PartnerProfileRequestRepo] findPendingByPartnerId warning:", e.message);
    }

    const memoryReq = Array.from(PROFILE_REQUESTS_STORE.values()).find(
      (r) => r.ma_hs === partnerId && (r.trang_thai === "Cho duyet" || r.trang_thai === "Cho xu ly")
    );
    return memoryReq || null;
  }

  /**
   * Create new profile update request in yeu_cau_cap_nhat_hosodn
   */
  async create(payload) {
    const record = {
      ma_hs: payload.ma_hs,
      ten_dn_moi: payload.ten_dn_moi || null,
      ma_so_thue_moi: payload.ma_so_thue_moi || null,
      dia_chi_moi: payload.dia_chi_moi || null,
      giay_phep_kinh_doanh_moi: payload.giay_phep_kinh_doanh_moi || null,
      logo_new: payload.logo_new || payload.logo_moi || payload.logo || null,
      ho_ten_nguoi_dai_dien_moi: payload.ho_ten_nguoi_dai_dien_moi || null,
      sdt_nguoi_dai_dien_moi: payload.sdt_nguoi_dai_dien_moi || null,
      email_nguoi_dai_dien_moi: payload.email_nguoi_dai_dien_moi || null,
      cccd_moi: payload.cccd_moi || null,
      ngay_sinh: payload.ngay_sinh || payload.ngay_sinh_moi || null,
      gioi_tinh: payload.gioi_tinh || payload.gioi_tinh_moi || null,
      trang_thai: payload.trang_thai || "Cho duyet",
      ly_do_tu_choi: null,
      ngay_yeu_cau: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from("yeu_cau_cap_nhat_hosodn")
        .insert([record])
        .select()
        .single();

      if (!error && data) {
        PROFILE_REQUESTS_STORE.set(data.ma_yc, data);
        return data;
      }
      console.warn("[PartnerProfileRequestRepo] Insert error, fallback to memory:", error?.message);
    } catch (e) {
      console.warn("[PartnerProfileRequestRepo] Create DB exception:", e.message);
    }

    const fallbackRecord = {
      ma_yc: `yc-profile-${Date.now()}`,
      ...record,
    };
    PROFILE_REQUESTS_STORE.set(fallbackRecord.ma_yc, fallbackRecord);
    return fallbackRecord;
  }

  /**
   * Update request status (Da duyet / Tu choi)
   */
  async updateStatus(reqId, trang_thai, ly_do_tu_choi = null, nguoi_duyet = null) {
    const finalAdminId = nguoi_duyet || "00000000-0000-0000-0000-000000000001";
    const updateFields = {
      trang_thai,
      ly_do_tu_choi: ly_do_tu_choi || null,
      nguoi_duyet: finalAdminId,
      ngay_duyet: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from("yeu_cau_cap_nhat_hosodn")
        .update(updateFields)
        .eq("ma_yc", reqId)
        .select()
        .maybeSingle();

      if (!error && data) {
        PROFILE_REQUESTS_STORE.set(data.ma_yc, data);
        return data;
      }
    } catch (e) {
      console.warn("[PartnerProfileRequestRepo] updateStatus DB exception:", e.message);
    }

    const existing = PROFILE_REQUESTS_STORE.get(reqId);
    if (existing) {
      Object.assign(existing, updateFields);
      PROFILE_REQUESTS_STORE.set(reqId, existing);
      return existing;
    }
    return null;
  }

  /**
   * Get map of pending profile request count by ma_hs
   */
  async getAllPendingRequestsMap() {
    const map = new Map();
    try {
      const { data, error } = await supabase
        .from("yeu_cau_cap_nhat_hosodn")
        .select("ma_hs, trang_thai")
        .eq("trang_thai", "Cho duyet");

      if (!error && data) {
        data.forEach((item) => {
          map.set(item.ma_hs, (map.get(item.ma_hs) || 0) + 1);
        });
      }
    } catch (e) {
      console.warn("[PartnerProfileRequestRepo] getAllPendingRequestsMap DB warning:", e.message);
    }

    // Include memory store items
    for (const req of PROFILE_REQUESTS_STORE.values()) {
      if (req.trang_thai === "Cho duyet" && req.ma_hs) {
        if (!map.has(req.ma_hs)) {
          map.set(req.ma_hs, 1);
        }
      }
    }
    return map;
  }
}

module.exports = new PartnerProfileRequestRepository();
