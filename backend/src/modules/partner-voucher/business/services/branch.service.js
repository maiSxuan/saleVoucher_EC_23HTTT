const branchRepository = require("../../data/repositories/branch.repository");
const branchRequestRepository = require("../../data/repositories/branch-request.repository");

class BranchService {
  async getBranchesByPartner(partnerId) {
    return await branchRepository.findByPartnerId(partnerId);
  }

  async getBranchRequestsByPartner(partnerId) {
    return await branchRequestRepository.findByPartnerId(partnerId);
  }

  async getAllBranchRequests(query) {
    return await branchRequestRepository.findAll(query);
  }

  async createBranchRequest(payload) {
    return await branchRequestRepository.create(payload);
  }

  async approveBranchRequest(requestId) {
    const req = await branchRequestRepository.updateStatus(requestId, "Da duyet");
    if (req && req.loai_yeu_cau === "Them moi") {
      await branchRepository.create({
        ten_chi_nhanh: req.ten_chi_nhanh,
        khu_vuc: req.khu_vuc,
        dia_chi: req.dia_chi,
        trang_thai: "Dang hoat dong",
        ma_hs: req.ma_hs,
        sdt: req.sdt,
        gio_mo_cua: req.gio_mo_cua,
      });
    }
    return req;
  }

  async rejectBranchRequest(requestId, adminNote = "") {
    return await branchRequestRepository.updateStatus(requestId, "Tu choi", adminNote);
  }
}

module.exports = new BranchService();
