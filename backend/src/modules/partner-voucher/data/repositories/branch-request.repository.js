const supabase = require("../../../../config/supabase");
const branchRepository = require("./branch.repository");

// Memory store for branch change requests (Them moi, Cap nhat, Xoa)
const BRANCH_REQUESTS_STORE = new Map();

const INITIAL_DEMO_BRANCH_REQUESTS = [
  {
    ma_yeu_cau: "req-tn3c-01",
    ma_chi_nhanh: "ee0a1d22-e0fb-419d-90c5-599307fb59c8",
    ma_hs: "39bed090-c598-48b8-9e03-436d75e57c7d",
    ten_dn: "Công Ty Thuốc Nam 3 Chùa",
    loai_yeu_cau: "Cap nhat",
    ten_chi_nhanh: "Nam Khánh 4",
    khu_vuc: "TP. Hồ Chí Minh",
    dia_chi: "134 Khải",
    du_lieu_de_xuat: {
      ten_chi_nhanh: "Nam Khánh 4 - Chi nhánh Tân Bình",
      khu_vuc: "TP. Hồ Chí Minh",
      dia_chi: "456 Lý Thường Kiệt, Phường 7, Q. Tân Bình",
    },
    trang_thai: "Cho duyet",
    ngay_tao: "2026-08-07T08:30:00Z",
  },
];

for (const req of INITIAL_DEMO_BRANCH_REQUESTS) {
  BRANCH_REQUESTS_STORE.set(req.ma_yeu_cau, req);
  if (req.ma_chi_nhanh) {
    BRANCH_REQUESTS_STORE.set(req.ma_chi_nhanh, req);
  }
}

class BranchRequestRepository {
  async findByPartnerId(partnerId) {
    const list = Array.from(BRANCH_REQUESTS_STORE.values()).filter(
      (r) => r.ma_hs === partnerId || r.resolvedMaHs === partnerId
    );

    const uniqueMap = new Map();
    list.forEach((item) => uniqueMap.set(item.ma_yeu_cau, item));

    // Also fetch any branch with trang_thai === "Cho duyet" or "Cho duyet cap nhat" or "Cho duyet huy" from DB
    const dbBranches = await branchRepository.findByPartnerId(partnerId);
    const pendingDbBranches = (dbBranches || []).filter(
      (b) => b.trang_thai === "Cho duyet" || b.trang_thai === "Cho duyet cap nhat" || b.trang_thai === "Cho duyet huy"
    );

    for (const b of pendingDbBranches) {
      if (!uniqueMap.has(b.ma_chi_nhanh)) {
        const reqType = b.trang_thai === "Cho duyet cap nhat" ? "Cap nhat" : b.trang_thai === "Cho duyet huy" ? "Xoá" : "Them moi";
        const item = {
          ma_yeu_cau: b.ma_chi_nhanh,
          ma_chi_nhanh: b.ma_chi_nhanh,
          ma_hs: b.ma_hs,
          ten_chi_nhanh: b.ten_chi_nhanh,
          khu_vuc: b.khu_vuc,
          dia_chi: b.dia_chi,
          loai_yeu_cau: reqType,
          trang_thai: "Cho duyet",
          du_lieu_de_xuat: reqType === "Cap nhat" ? {
            ten_chi_nhanh: b.ten_chi_nhanh + " (Cập nhật)",
            khu_vuc: b.khu_vuc,
            dia_chi: b.dia_chi,
          } : undefined,
          ngay_tao: new Date().toISOString(),
        };
        uniqueMap.set(item.ma_yeu_cau, item);
      }
    }

    return Array.from(uniqueMap.values());
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
        loai_yeu_cau: branch.trang_thai === "Cho duyet cap nhat" ? "Cap nhat" : branch.trang_thai === "Cho duyet huy" ? "Xoá" : "Them moi",
        trang_thai: "Cho duyet",
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

  async getAllPendingRequestsMap() {
    const map = new Map();
    for (const req of BRANCH_REQUESTS_STORE.values()) {
      if (req.trang_thai === "Cho duyet" || req.trang_thai === "Cho xu ly" || req.trang_thai === "Chờ xử lý") {
        const hs = req.ma_hs || req.resolvedMaHs;
        if (hs) {
          map.set(hs, (map.get(hs) || 0) + 1);
        }
      }
    }
    return map;
  }
}

module.exports = new BranchRequestRepository();
