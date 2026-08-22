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
        actorId:
          actorId || payload.actorId || payload.ma_hs || payload.ma_chi_nhanh,
        actorRole: "PARTNER",
        action:
          payload.loai_yeu_cau === "Xoa"
            ? "REQUEST_DELETE_BRANCH"
            : "REQUEST_UPDATE_BRANCH",
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
      console.warn(
        "[BranchService] Log createBranchRequest failed:",
        e.message,
      );
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
    } else if (req.loai_yeu_cau === "Xoá" || req.loai_yeu_cau === "Xoa") {
      // Permanently delete branch & Lock branch staff users (trang_thai = "Tam khoa")
      if (req.ma_chi_nhanh) {
        const supabase = require("../../../../config/supabase");

        // 1. Lock all staff users belonging to this branch
        try {
          await supabase
            .from("nguoidung")
            .update({ trang_thai: "Tam khoa" })
            .eq("ma_chi_nhanh", req.ma_chi_nhanh);

          await auditLogService.log({
            actorId: adminId,
            actorRole: "Admin kiem duyet",
            action: "LOCK_BRANCH_STAFF",
            targetType: "NGUOIDUNG",
            targetId: req.ma_chi_nhanh,
            after: { trang_thai: "Tam khoa" },
            result: "Thanh cong",
            reason: `Khóa tài khoản nhân viên phụ trách chi nhánh bị xóa (${req.ten_chi_nhanh})`,
          });
        } catch (errStaff) {
          console.warn("[BranchService] Lock branch staff failed:", errStaff.message);
        }

        // 2. Delete voucher-branch associations
        try {
          await supabase
            .from("voucher_chinhanh")
            .delete()
            .eq("ma_chi_nhanh", req.ma_chi_nhanh);
        } catch (errV) {
          console.warn("[BranchService] Delete voucher-branch link failed:", errV.message);
        }

        // 3. Delete branch permanently from chinhanh table
        await branchRepository.delete(req.ma_chi_nhanh);
      }
    } else {
      // Them moi: Activate branch
      if (req.ma_chi_nhanh) {
        await branchRepository.update(req.ma_chi_nhanh, {
          trang_thai: "Dang hoat dong",
        });
      }
    }

    const res = await branchRequestRepository.updateStatus(
      requestId,
      "Da duyet",
    );

    try {
      await auditLogService.log({
        actorId: adminId,
        actorRole: "Admin kiem duyet",
        action: "APPROVE_BRANCH_REQUEST",
        targetType: "CHINHANH",
        targetId: req.ma_chi_nhanh || requestId,
        after: { trang_thai: "Da duyet", loai_yeu_cau: req.loai_yeu_cau },
        result: "Thanh cong",
        reason: `Admin phê duyệt yêu cầu chi nhánh (${req.loai_yeu_cau}: ${req.ten_chi_nhanh})`,
      });
    } catch (e) {
      console.warn(
        "[BranchService] Log APPROVE_BRANCH_REQUEST failed:",
        e.message,
      );
    }

    return res;
  }

  async updateBranchStatus(branchId, status, adminId = null) {
    let dbStatus = status;
    const normalized = (status || "").toLowerCase().trim();
    if (normalized === "tam ngung" || normalized === "tam ngung hoat dong" || normalized === "tamngung" || normalized === "tạm ngưng") {
      dbStatus = "Tam ngung hoat dong";
    } else if (normalized === "dang hoat dong" || normalized === "hoat dong" || normalized === "active" || normalized === "đang hoạt động") {
      dbStatus = "Dang hoat dong";
    }

    const updated = await branchRepository.update(branchId, { trang_thai: dbStatus });
    try {
      await auditLogService.log({
        actorId: adminId,
        actorRole: "Admin kiem duyet",
        action: "UPDATE_BRANCH_STATUS",
        targetType: "CHINHANH",
        targetId: branchId,
        after: { trang_thai: dbStatus },
        result: "Thanh cong",
        reason: `Admin cập nhật trạng thái chi nhánh sang ${dbStatus}`,
      });
    } catch (e) {
      console.warn("[BranchService] Log updateBranchStatus failed:", e.message);
    }
    return updated;
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

    const res = await branchRequestRepository.updateStatus(
      requestId,
      "Tu choi",
      adminNote,
    );

    try {
      await auditLogService.log({
        actorId: adminId,
        actorRole: "Admin kiem duyet",
        action: "REJECT_BRANCH_REQUEST",
        targetType: "CHINHANH",
        targetId: req?.ma_chi_nhanh || requestId,
        after: { trang_thai: "Tu choi", ly_do_tu_choi: adminNote },
        result: "Thanh cong",
        reason: adminNote || "Admin từ chối yêu cầu chi nhánh",
      });
    } catch (e) {
      console.warn(
        "[BranchService] Log REJECT_BRANCH_REQUEST failed:",
        e.message,
      );
    }

    return res;
  }
}

module.exports = new BranchService();
