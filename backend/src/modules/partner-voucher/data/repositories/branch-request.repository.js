const supabase = require("../../../../config/supabase");
const branchRepository = require("./branch.repository");

// Fallback memory store
const BRANCH_REQUESTS_STORE = new Map();

class BranchRequestRepository {
  /**
   * Fetch all branch update/delete requests + pending new branch additions for a partner
   */
  async findByPartnerId(partnerId) {
    const results = [];

    // 1. Fetch update/delete requests from yeu_cau_cap_nhat_chinhanh
    try {
      const { data, error } = await supabase
        .from("yeu_cau_cap_nhat_chinhanh")
        .select("*, chinhanh(ten_chi_nhanh, khu_vuc, dia_chi)")
        .eq("ma_hs", partnerId)
        .order("ngay_yeu_cau", { ascending: false });

      if (!error && data) {
        data.forEach((r) => {
          results.push({
            ma_yeu_cau: r.ma_yc,
            ma_chi_nhanh: r.ma_chi_nhanh,
            ma_hs: r.ma_hs,
            loai_yeu_cau: r.loai_yeu_cau === "CAP_NHAT" ? "Cap nhat" : r.loai_yeu_cau === "XOA" ? "Xoá" : "Them moi",
            ten_chi_nhanh: r.chinhanh?.ten_chi_nhanh || r.ten_chi_nhanh_moi,
            khu_vuc: r.khu_vuc_moi || r.chinhanh?.khu_vuc,
            dia_chi: r.dia_chi_moi || r.chinhanh?.dia_chi,
            du_lieu_de_xuat: {
              ten_chi_nhanh: r.ten_chi_nhanh_moi,
              khu_vuc: r.khu_vuc_moi,
              dia_chi: r.dia_chi_moi,
            },
            trang_thai: r.trang_thai,
            ly_do_tu_choi: r.ly_do_tu_choi,
            ngay_tao: r.ngay_yeu_cau,
          });
        });
      }
    } catch (e) {
      console.warn("[BranchRequestRepo] DB fetch warning:", e.message);
    }

    // 2. Initial branch additions are stored directly in chinhanh table with trang_thai === 'Cho duyet'
    const dbBranches = await branchRepository.findByPartnerId(partnerId);
    const pendingNewBranches = (dbBranches || []).filter((b) => b.trang_thai === "Cho duyet");

    for (const b of pendingNewBranches) {
      if (!results.some((r) => r.ma_chi_nhanh === b.ma_chi_nhanh)) {
        results.push({
          ma_yeu_cau: b.ma_chi_nhanh,
          ma_chi_nhanh: b.ma_chi_nhanh,
          ma_hs: b.ma_hs,
          ten_chi_nhanh: b.ten_chi_nhanh,
          khu_vuc: b.khu_vuc,
          dia_chi: b.dia_chi,
          loai_yeu_cau: "Them moi",
          trang_thai: "Cho duyet",
          ngay_tao: new Date().toISOString(),
        });
      }
    }

    // Include any memory store fallbacks
    for (const req of BRANCH_REQUESTS_STORE.values()) {
      if (req.ma_hs === partnerId && !results.some((r) => r.ma_yeu_cau === req.ma_yeu_cau)) {
        results.push(req);
      }
    }

    return results;
  }

  /**
   * Find request by ID
   */
  async findById(reqId) {
    // Check DB table yeu_cau_cap_nhat_chinhanh
    try {
      const { data, error } = await supabase
        .from("yeu_cau_cap_nhat_chinhanh")
        .select("*, chinhanh(ten_chi_nhanh, khu_vuc, dia_chi)")
        .eq("ma_yc", reqId)
        .maybeSingle();

      if (!error && data) {
        return {
          ma_yeu_cau: data.ma_yc,
          ma_chi_nhanh: data.ma_chi_nhanh,
          ma_hs: data.ma_hs,
          loai_yeu_cau: data.loai_yeu_cau === "CAP_NHAT" ? "Cap nhat" : data.loai_yeu_cau === "XOA" ? "Xoá" : "Them moi",
          ten_chi_nhanh: data.chinhanh?.ten_chi_nhanh || data.ten_chi_nhanh_moi,
          khu_vuc: data.khu_vuc_moi || data.chinhanh?.khu_vuc,
          dia_chi: data.dia_chi_moi || data.chinhanh?.dia_chi,
          du_lieu_de_xuat: {
            ten_chi_nhanh: data.ten_chi_nhanh_moi,
            khu_vuc: data.khu_vuc_moi,
            dia_chi: data.dia_chi_moi,
          },
          trang_thai: data.trang_thai,
          ly_do_tu_choi: data.ly_do_tu_choi,
          ngay_tao: data.ngay_yeu_cau,
        };
      }
    } catch (e) {
      console.warn("[BranchRequestRepo] findById DB warning:", e.message);
    }

    // Check memory store
    if (BRANCH_REQUESTS_STORE.has(reqId)) {
      return BRANCH_REQUESTS_STORE.get(reqId);
    }

    // Check if it's a pending new branch in DB chinhanh
    const branch = await branchRepository.findById(reqId);
    if (branch && branch.trang_thai === "Cho duyet") {
      return {
        ma_yeu_cau: branch.ma_chi_nhanh,
        ma_chi_nhanh: branch.ma_chi_nhanh,
        ma_hs: branch.ma_hs,
        ten_chi_nhanh: branch.ten_chi_nhanh,
        khu_vuc: branch.khu_vuc,
        dia_chi: branch.dia_chi,
        loai_yeu_cau: "Them moi",
        trang_thai: "Cho duyet",
        ngay_tao: new Date().toISOString(),
      };
    }

    return null;
  }

  /**
   * Create new request:
   * - If 'Them moi': Insert directly into base table `chinhanh` with trang_thai = 'Cho duyet'
   * - If 'Cap nhat' or 'Xoa': Insert into request table `yeu_cau_cap_nhat_chinhanh`
   */
  async create(payload) {
    const isNewBranch = payload.loai_yeu_cau === "Them moi" || payload.loai_yeu_cau === "THEM_MOI";

    if (isNewBranch && !payload.ma_chi_nhanh) {
      // Rule: New branch addition inserts directly into base table `chinhanh` with status 'Cho duyet'
      const createdBranch = await branchRepository.create({
        ma_hs: payload.ma_hs,
        ten_chi_nhanh: payload.ten_chi_nhanh,
        khu_vuc: payload.khu_vuc,
        dia_chi: payload.dia_chi,
        trang_thai: "Cho duyet",
      });

      const reqData = {
        ma_yeu_cau: createdBranch.ma_chi_nhanh,
        ma_chi_nhanh: createdBranch.ma_chi_nhanh,
        ma_hs: payload.ma_hs,
        loai_yeu_cau: "Them moi",
        ten_chi_nhanh: createdBranch.ten_chi_nhanh,
        khu_vuc: createdBranch.khu_vuc,
        dia_chi: createdBranch.dia_chi,
        trang_thai: "Cho duyet",
        ngay_tao: new Date().toISOString(),
      };
      BRANCH_REQUESTS_STORE.set(reqData.ma_yeu_cau, reqData);
      return reqData;
    }

    // Branch update or delete: Insert into yeu_cau_cap_nhat_chinhanh
    const dbRecord = {
      ma_hs: payload.ma_hs,
      ma_chi_nhanh: payload.ma_chi_nhanh,
      loai_yeu_cau: payload.loai_yeu_cau === "Xoá" || payload.loai_yeu_cau === "XOA" ? "XOA" : "CAP_NHAT",
      ten_chi_nhanh_moi: payload.du_lieu_de_xuat?.ten_chi_nhanh || payload.ten_chi_nhanh || null,
      khu_vuc_moi: payload.du_lieu_de_xuat?.khu_vuc || payload.khu_vuc || null,
      dia_chi_moi: payload.du_lieu_de_xuat?.dia_chi || payload.dia_chi || null,
      trang_thai: "Cho duyet",
      ngay_yeu_cau: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from("yeu_cau_cap_nhat_chinhanh")
        .insert([dbRecord])
        .select()
        .single();

      if (!error && data) {
        const item = {
          ma_yeu_cau: data.ma_yc,
          ma_chi_nhanh: data.ma_chi_nhanh,
          ma_hs: data.ma_hs,
          loai_yeu_cau: payload.loai_yeu_cau,
          ten_chi_nhanh: payload.ten_chi_nhanh,
          khu_vuc: payload.khu_vuc,
          dia_chi: payload.dia_chi,
          du_lieu_de_xuat: payload.du_lieu_de_xuat,
          trang_thai: "Cho duyet",
          ngay_tao: data.ngay_yeu_cau,
        };
        BRANCH_REQUESTS_STORE.set(item.ma_yeu_cau, item);
        return item;
      }
    } catch (e) {
      console.warn("[BranchRequestRepo] Create DB exception:", e.message);
    }

    const fallbackId = `req-${Date.now()}`;
    const fallbackItem = {
      ma_yeu_cau: fallbackId,
      ma_chi_nhanh: payload.ma_chi_nhanh,
      ma_hs: payload.ma_hs,
      loai_yeu_cau: payload.loai_yeu_cau,
      ten_chi_nhanh: payload.ten_chi_nhanh,
      khu_vuc: payload.khu_vuc,
      dia_chi: payload.dia_chi,
      du_lieu_de_xuat: payload.du_lieu_de_xuat,
      trang_thai: "Cho duyet",
      ngay_tao: new Date().toISOString(),
    };
    BRANCH_REQUESTS_STORE.set(fallbackItem.ma_yeu_cau, fallbackItem);
    return fallbackItem;
  }

  /**
   * Update request status in DB
   */
  async updateStatus(reqId, trang_thai, adminNote = "") {
    try {
      const { data, error } = await supabase
        .from("yeu_cau_cap_nhat_chinhanh")
        .update({
          trang_thai,
          ly_do_tu_choi: adminNote || null,
          ngay_duyet: new Date().toISOString(),
        })
        .eq("ma_yc", reqId)
        .select()
        .maybeSingle();

      if (!error && data) {
        const existing = BRANCH_REQUESTS_STORE.get(reqId);
        if (existing) {
          existing.trang_thai = trang_thai;
          existing.ghi_chu_admin = adminNote;
        }
      }
    } catch (e) {
      console.warn("[BranchRequestRepo] updateStatus DB exception:", e.message);
    }

    const req = BRANCH_REQUESTS_STORE.get(reqId);
    if (req) {
      req.trang_thai = trang_thai;
      req.ghi_chu_admin = adminNote;
      return req;
    }
    return null;
  }

  /**
   * Get pending request count map per ma_hs
   */
  async getAllPendingRequestsMap() {
    const map = new Map();

    // 1. Pending updates/deletes in yeu_cau_cap_nhat_chinhanh
    try {
      const { data, error } = await supabase
        .from("yeu_cau_cap_nhat_chinhanh")
        .select("ma_hs, trang_thai")
        .eq("trang_thai", "Cho duyet");

      if (!error && data) {
        data.forEach((item) => {
          map.set(item.ma_hs, (map.get(item.ma_hs) || 0) + 1);
        });
      }
    } catch (e) {
      console.warn("[BranchRequestRepo] getAllPendingRequestsMap DB warning:", e.message);
    }

    // 2. Pending new branch additions in base table chinhanh (trang_thai = 'Cho duyet')
    try {
      const { data, error } = await supabase
        .from("chinhanh")
        .select("ma_hs, trang_thai")
        .eq("trang_thai", "Cho duyet");

      if (!error && data) {
        data.forEach((item) => {
          map.set(item.ma_hs, (map.get(item.ma_hs) || 0) + 1);
        });
      }
    } catch (e) {}

    // Include memory store
    for (const req of BRANCH_REQUESTS_STORE.values()) {
      if (req.trang_thai === "Cho duyet" && req.ma_hs) {
        if (!map.has(req.ma_hs)) {
          map.set(req.ma_hs, 1);
        }
      }
    }

    return map;
  }
}

module.exports = new BranchRequestRepository();
