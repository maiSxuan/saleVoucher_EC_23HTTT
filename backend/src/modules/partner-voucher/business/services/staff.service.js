const staffRepository = require("../../data/repositories/staff.repository");
const auditLogService = require("../../../core-access/business/services/audit-log.service");

class StaffService {
  async getStaffsByPartner(partnerId) {
    return await staffRepository.findByPartnerId(partnerId);
  }

  async createStaff(payload, actorId = null, actorRole = "PARTNER") {
    const created = await staffRepository.create(payload);

    try {
      await auditLogService.log({
        actorId: actorId || payload.actorId || payload.ma_hs || null,
        actorRole: actorRole || "PARTNER",
        action: "CREATE_STAFF",
        targetType: "NGUOIDUNG",
        targetId: created?.ma_nv || created?.ma_nguoi_dung,
        after: {
          ho_ten: created?.ho_ten,
          email: created?.email,
          sdt: created?.sdt,
          vai_tro: created?.vai_tro,
          ma_chi_nhanh: created?.ma_chi_nhanh,
        },
        result: "Thanh cong",
        reason: "Thêm nhân viên mới vào hệ thống",
      });
    } catch (e) {
      console.warn("[StaffService] Log CREATE_STAFF failed:", e.message);
    }

    return created;
  }

  async updateStaff(id, payload, actorId = null, actorRole = "PARTNER") {
    const existing = await staffRepository.findById(id);
    const updated = await staffRepository.update(id, payload);

    try {
      const isStatusChange = payload.trang_thai && existing && payload.trang_thai !== existing.trang_thai;
      const actionName = isStatusChange
        ? payload.trang_thai === "Tam khoa"
          ? "LOCK_STAFF"
          : "UNLOCK_STAFF"
        : "UPDATE_STAFF";

      await auditLogService.log({
        actorId: actorId || payload.actorId || existing?.ma_hs || null,
        actorRole: actorRole || "PARTNER",
        action: actionName,
        targetType: "NGUOIDUNG",
        targetId: id,
        before: existing
          ? {
              ho_ten: existing.ho_ten,
              sdt: existing.sdt,
              email: existing.email,
              trang_thai: existing.trang_thai,
              vai_tro: existing.vai_tro,
            }
          : null,
        after: updated
          ? {
              ho_ten: updated.ho_ten,
              sdt: updated.sdt,
              email: updated.email,
              trang_thai: updated.trang_thai,
              vai_tro: updated.vai_tro,
            }
          : null,
        result: "Thanh cong",
        reason: isStatusChange ? `Cập nhật trạng thái nhân viên sang ${payload.trang_thai}` : "Cập nhật thông tin nhân viên",
      });
    } catch (e) {
      console.warn("[StaffService] Log UPDATE_STAFF failed:", e.message);
    }

    return updated;
  }

  async deleteStaff(id, actorId = null, actorRole = "PARTNER") {
    const existing = await staffRepository.findById(id);
    const deleted = await staffRepository.delete(id);

    try {
      await auditLogService.log({
        actorId: actorId || existing?.ma_hs || null,
        actorRole: actorRole || "PARTNER",
        action: "LOCK_STAFF",
        targetType: "NGUOIDUNG",
        targetId: id,
        before: existing ? { ho_ten: existing.ho_ten, trang_thai: existing.trang_thai } : null,
        after: { trang_thai: "Tam khoa" },
        result: "Thanh cong",
        reason: "Tạm khóa nhân viên",
      });
    } catch (e) {
      console.warn("[StaffService] Log LOCK_STAFF failed:", e.message);
    }

    return deleted;
  }
}

module.exports = new StaffService();
