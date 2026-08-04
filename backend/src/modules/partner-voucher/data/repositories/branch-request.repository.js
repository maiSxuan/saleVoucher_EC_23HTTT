const branchRepository = require("./branch.repository");
const BranchRequestModel = require("../models/branch-request.model");

class BranchRequestRepository {
  async findByPartnerId(partnerId) {
    const branches = await branchRepository.findByPartnerId(partnerId);
    return branches.map(
      (b) =>
        new BranchRequestModel({
          ma_yeu_cau: b.ma_chi_nhanh,
          ma_hs: b.ma_hs,
          ten_chi_nhanh: b.ten_chi_nhanh,
          khu_vuc: b.khu_vuc,
          dia_chi: b.dia_chi,
          trang_thai: b.trang_thai,
          loai_yeu_cau: "Them moi"
        })
    );
  }

  async findAll(query = {}) {
    const branches = await branchRepository.findAll(query);
    return branches.map(
      (b) =>
        new BranchRequestModel({
          ma_yeu_cau: b.ma_chi_nhanh,
          ma_hs: b.ma_hs,
          ten_chi_nhanh: b.ten_chi_nhanh,
          khu_vuc: b.khu_vuc,
          dia_chi: b.dia_chi,
          trang_thai: b.trang_thai,
          loai_yeu_cau: "Them moi"
        })
    );
  }

  async create(payload) {
    const createdBranch = await branchRepository.create({
      ten_chi_nhanh: payload.ten_chi_nhanh,
      khu_vuc: payload.khu_vuc || "TP. Hồ Chí Minh",
      dia_chi: payload.dia_chi,
      trang_thai: "Cho duyet",
      ma_hs: payload.ma_hs || "20000000-0000-0000-0000-000000000001",
    });

    return new BranchRequestModel({
      ma_yeu_cau: createdBranch.ma_chi_nhanh,
      ma_hs: createdBranch.ma_hs,
      ten_chi_nhanh: createdBranch.ten_chi_nhanh,
      khu_vuc: createdBranch.khu_vuc,
      dia_chi: createdBranch.dia_chi,
      trang_thai: createdBranch.trang_thai,
      loai_yeu_cau: "Them moi",
    });
  }

  async updateStatus(id, trang_thai, ghi_chu_admin = "") {
    const updated = await branchRepository.update(id, { trang_thai });
    if (!updated) return null;
    return new BranchRequestModel({
      ma_yeu_cau: updated.ma_chi_nhanh,
      ma_hs: updated.ma_hs,
      ten_chi_nhanh: updated.ten_chi_nhanh,
      khu_vuc: updated.khu_vuc,
      dia_chi: updated.dia_chi,
      trang_thai: updated.trang_thai,
      ghi_chu_admin,
    });
  }
}

module.exports = new BranchRequestRepository();
