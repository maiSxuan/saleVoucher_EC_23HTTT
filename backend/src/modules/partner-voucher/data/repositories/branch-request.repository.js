const supabase = require("../../../../config/supabase");
const branchRepository = require("./branch.repository");

// Memory store for branch change requests (Them moi, Cap nhat, Xoa)
const BRANCH_REQUESTS_STORE = new Map();

class BranchRequestRepository {
  async findByPartnerId(partnerId) {
    const list = Array.from(BRANCH_REQUESTS_STORE.values()).filter(
      (r) => r.ma_hs === partnerId || r.resolvedMaHs === partnerId
    );

    // Also fetch any branch with trang_thai === "Cho duyet" from DB as pending requests
    const dbBranches = await branchRepository.findByPartnerId(partnerId);
    const pendingDbBranches = dbBranches.filter((b) => b.trang_thai === "Cho duyet");

    for (const b of pendingDbBranches) {
      if (!BRANCH_REQUESTS_STORE.has(b.ma_chi_nhanh)) {
        list.push({
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

    return list;
  }

  async findById(id) {
    if (BRANCH_REQUESTS_STORE.has(id)) {
      return BRANCH_REQUESTS_STORE.get(id);
    }
    // Check if it's a branch ma_chi_nhanh in DB
    const branch = await branchRepository.findById(id);
    if (branch) {
      return {
        ma_yeu_cau: branch.ma_chi_nhanh,
        ma_chi_nhanh: branch.ma_chi_nhanh,
        ma_hs: branch.ma_hs,
        ten_chi_nhanh: branch.ten_chi_nhanh,
        khu_vuc: branch.khu_vuc,
        dia_chi: branch.dia_chi,
        loai_yeu_cau: "Them moi",
        trang_thai: branch.trang_thai || "Cho duyet",
        ngay_tao: new Date().toISOString(),
      };
    }
    return null;
  }

  async create(payload) {
    const reqId = payload.ma_chi_nhanh || `req-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    let createdBranch = null;

    if (payload.loai_yeu_cau === "Them moi" && !payload.ma_chi_nhanh) {
      createdBranch = await branchRepository.create({
        ma_hs: payload.ma_hs,
        ten_chi_nhanh: payload.ten_chi_nhanh,
        khu_vuc: payload.khu_vuc,
        dia_chi: payload.dia_chi,
        trang_thai: "Cho duyet",
      });
    }

    const reqData = {
      ma_yeu_cau: createdBranch ? createdBranch.ma_chi_nhanh : reqId,
      ma_chi_nhanh: createdBranch ? createdBranch.ma_chi_nhanh : (payload.ma_chi_nhanh || reqId),
      ma_hs: payload.ma_hs,
      ten_dn: payload.ten_dn || "Doanh nghiệp đối tác",
      loai_yeu_cau: payload.loai_yeu_cau || "Them moi",
      ten_chi_nhanh: payload.ten_chi_nhanh,
      khu_vuc: payload.khu_vuc || "TP. Hồ Chí Minh",
      dia_chi: payload.dia_chi,
      du_lieu_de_xuat: payload.du_lieu_de_xuat || {
        ten_chi_nhanh: payload.ten_chi_nhanh,
        khu_vuc: payload.khu_vuc,
        dia_chi: payload.dia_chi,
      },
      trang_thai: "Cho duyet",
      ngay_tao: new Date().toISOString(),
    };

    BRANCH_REQUESTS_STORE.set(reqData.ma_yeu_cau, reqData);
    if (reqData.ma_chi_nhanh) {
      BRANCH_REQUESTS_STORE.set(reqData.ma_chi_nhanh, reqData);
    }

    return reqData;
  }

  async updateStatus(reqId, trang_thai, adminNote = "") {
    const req = await this.findById(reqId);
    if (!req) return null;

    req.trang_thai = trang_thai;
    if (adminNote) req.ghi_chu_admin = adminNote;

    BRANCH_REQUESTS_STORE.set(reqId, req);
    if (req.ma_chi_nhanh) {
      BRANCH_REQUESTS_STORE.set(req.ma_chi_nhanh, req);
    }
    return req;
  }
}

module.exports = new BranchRequestRepository();
