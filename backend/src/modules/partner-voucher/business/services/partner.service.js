const partnerRepository = require("../../data/repositories/partner.repository");
const branchRepository = require("../../data/repositories/branch.repository");

class PartnerService {
  async getPartners(query) {
    const partners = await partnerRepository.findAll(query);
    // Attach branches to each partner
    const result = await Promise.all(
      partners.map(async (p) => {
        const branches = await branchRepository.findByPartnerId(p.ma_hs);
        return { ...p, branches };
      })
    );
    return result;
  }

  async getPartnerById(id) {
    const partner = await partnerRepository.findById(id);
    if (!partner) return null;
    const branches = await branchRepository.findByPartnerId(id);
    return { ...partner, branches };
  }

  async registerAccount(payload) {
    return await partnerRepository.createAccount(payload);
  }

  async createPartner(payload) {
    return await partnerRepository.create(payload);
  }

  async updatePartner(id, payload) {
    return await partnerRepository.update(id, payload);
  }

  async approvePartner(id, reason = "") {
    const updated = await partnerRepository.updateStatus(id, "Dang hoat dong");
    // Kích hoạt toàn bộ chi nhánh thuộc đối tác sang 'Dang hoat dong'
    const branches = await branchRepository.findByPartnerId(id);
    await Promise.all(
      branches.map((b) => branchRepository.update(b.ma_chi_nhanh, { trang_thai: "Dang hoat dong" }))
    );
    return updated;
  }

  async rejectPartner(id, reason = "") {
    return await partnerRepository.updateStatus(id, "Tu choi", reason);
  }

  async lockUnlockPartner(id, isLocking, reason = "") {
    const status = isLocking ? "Tam khoa" : "Dang hoat dong";
    return await partnerRepository.updateStatus(id, status, reason);
  }
}

module.exports = new PartnerService();