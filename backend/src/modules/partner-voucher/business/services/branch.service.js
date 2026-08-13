const branchRepository = require("../../data/repositories/branch.repository");
const branchRequestRepository = require("../../data/repositories/branch-request.repository");
const auditLogService = require("../../../core-access/business/services/audit-log.service");

class BranchService {
  async getBranchesByPartner(partnerId) {
    return await branchRepository.findByPartnerId(partnerId);
  }

  async getBranchRequestsByPartner(partnerId) {
    return await branchRequestRepository.findByPartnerId(partnerId);
  }

  async createBranchRequest(payload, actorId = null) {
    const createdReq = await branchRequestRepository.create(payload);

    try {
      await auditLogService.log({
        actorId: actorId || payload.actorId || payload.ma_hs || payload.ma_chi_nhanh,
        actorRole: "PARTNER",
        action: payload.loai_yeu_cau === "Xoa" ? "REQUEST_DELETE_BRANCH" : "REQUEST_UPDATE_BRANCH",
        targetType: "CHINHANH",
        targetId: payload.ma_chi_nhanh || payload.ma_hs,
        after: {
          loai_yeu_cau: payload.loai_yeu_cau,
          ten_chi_nhanh_moi: payload.ten_chi_nhanh_moi || payload.ten_chi_nhanh,
          dia_chi_moi: payload.dia_chi_moi || payload.dia_chi,
        },
        result: "Thanh cong",
        reason: "Đối tác gửi yêu cầu cập nhật/xóa chi nhánh",
      });
    } catch (e) {
      console.warn("[BranchService] Log createBranchRequest failed:", e.message);
    }

    return createdReq;
  }

  async approveBranchRequest(requestId, adminId = null) {
    const req = await branchRequestRepository.findById(requestId);
    if (!req) {
      throw new Error("Không tìm thấy yêu cầu chi nhánh");
    }

    if (req.loai_yeu_cau === "Cap nhat") {
      // Apply proposed updates to official chinhanh table
      const updateData = req.du_lieu_de_xuat || {
        ten_chi_nhanh: req.ten_chi_nhanh,
        khu_vuc: req.khu_vuc,
        dia_chi: req.dia_chi,
      };

      if (req.ma_chi_nhanh) {
        await branchRepository.update(req.ma_chi_nhanh, {
          ten_chi_nhanh: updateData.ten_chi_nhanh,
          khu_vuc: updateData.khu_vuc,
          dia_chi: updateData.dia_chi,
          trang_thai: "Dang hoat dong",
        });
      }
    } else if (req.loai_yeu_cau === "Xoá") {
      // Deactivate branch
      if (req.ma_chi_nhanh) {
        await branchRepository.update(req.ma_chi_nhanh, {
          trang_thai: "Tam ngung hoat dong",
        });
      }
    } else {
      // Them moi: Activate branch
      if (req.ma_chi_nhanh) {
        await branchRepository.update(req.ma_chi_nhanh, {
          trang_thai: "Dang hoat dong",
        });
      }
    }

    const res = await branchRequestRepository.updateStatus(requestId, "Da duyet");

    try {
      await auditLogService.log({
        actorId: adminId,
        actorRole: "ADMIN",
        action: "APPROVE_BRANCH_REQUEST",
        targetType: "CHINHANH",
        targetId: req.ma_chi_nhanh,
        after: { trang_thai: "Da duyet", loai_yeu_cau: req.loai_yeu_cau },
        result: "Thanh cong",
        reason: "Admin phê duyệt yêu cầu thay đổi thông tin chi nhánh",
      });
    } catch (e) {
      console.warn("[BranchService] Log APPROVE_BRANCH_REQUEST failed:", e.message);
    }

    return res;
  }

  async rejectBranchRequest(requestId, adminNote = "", adminId = null) {
    const req = await branchRequestRepository.findById(requestId);
    if (!req) {
      throw new Error("Không tìm thấy yêu cầu chi nhánh");
    }

    if (req.loai_yeu_cau === "Them moi" && req.ma_chi_nhanh) {
      await branchRepository.update(req.ma_chi_nhanh, {
        trang_thai: "Tu choi",
      });
    }

    const res = await branchRequestRepository.updateStatus(requestId, "Tu choi", adminNote);

    try {
      await auditLogService.log({
        actorId: adminId,
        actorRole: "ADMIN",
        action: "REJECT_BRANCH_REQUEST",
        targetType: "CHINHANH",
        targetId: req?.ma_chi_nhanh || requestId,
        after: { trang_thai: "Tu choi", ly_do_tu_choi: adminNote },
        result: "Thanh cong",
        reason: adminNote || "Admin từ chối yêu cầu chi nhánh",
      });
    } catch (e) {
      console.warn("[BranchService] Log REJECT_BRANCH_REQUEST failed:", e.message);
    }

    return res;
  }
}

module.exports = new BranchService();
