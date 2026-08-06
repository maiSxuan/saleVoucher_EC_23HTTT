const branchRepository = require("../../data/repositories/branch.repository");
const branchRequestRepository = require("../../data/repositories/branch-request.repository");

class BranchService {
  async getBranchesByPartner(partnerId) {
    return await branchRepository.findByPartnerId(partnerId);
  }

  async getBranchRequestsByPartner(partnerId) {
    return await branchRequestRepository.findByPartnerId(partnerId);
  }

  async createBranchRequest(payload) {
    return await branchRequestRepository.create(payload);
  }

  async approveBranchRequest(requestId) {
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

    return await branchRequestRepository.updateStatus(requestId, "Da duyet");
  }

  async rejectBranchRequest(requestId, adminNote = "") {
    const req = await branchRequestRepository.findById(requestId);
    if (!req) {
      throw new Error("Không tìm thấy yêu cầu chi nhánh");
    }

    if (req.loai_yeu_cau === "Them moi" && req.ma_chi_nhanh) {
      await branchRepository.update(req.ma_chi_nhanh, {
        trang_thai: "Tu choi",
      });
    }

    return await branchRequestRepository.updateStatus(requestId, "Tu choi", adminNote);
  }
}

module.exports = new BranchService();
