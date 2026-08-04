const staffRepository = require("../../data/repositories/staff.repository");

class StaffService {
  async getStaffsByPartner(partnerId) {
    return await staffRepository.findByPartnerId(partnerId);
  }

  async createStaff(payload) {
    return await staffRepository.create(payload);
  }

  async updateStaff(id, payload) {
    return await staffRepository.update(id, payload);
  }

  async deleteStaff(id) {
    return await staffRepository.delete(id);
  }
}

module.exports = new StaffService();
