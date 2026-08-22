/**
 * Purpose: Service cho Audit Log — ghi nhật ký hệ thống (RB-12).
 * Được gọi từ các service khác sau mỗi thao tác quản trị quan trọng.
 *
 * RB-12: Thao tác quản trị quan trọng phải ghi log.
 * RB-15 (skills.md §15): Nếu log bắt buộc và ghi log thất bại → không báo thành công.
 */
const auditLogRepository = require('../../data/repositories/audit-log.repository');
const LOG_RESULT = require('../../../../common/constants/log-result');
const supabase = require('../../../../config/supabase');

class AuditLogService {
  /**
   * Resolve actorId to a valid ma_tk (FK taikhoan).
  /**
   * Resolve actorId to a valid ma_tk (FK taikhoan).
   * Supports resolving ma_tk directly, ma_nguoi_dung, ma_hs, ma_chi_nhanh, ma_voucher, ma_yc,
   * or falling back to default Admin/Partner account when actorId is null.
   */
  async resolveActorId(actorId, actorRole = null) {
    if (actorId) {
      try {
        // 1. Try direct match on taikhoan.ma_tk
        const { data: directMatch } = await supabase
          .from("taikhoan")
          .select("ma_tk")
          .eq("ma_tk", actorId)
          .maybeSingle();
        if (directMatch) return directMatch.ma_tk;

        // 2. Try lookup by ma_nguoi_dung
        const { data: byUser } = await supabase
          .from("taikhoan")
          .select("ma_tk")
          .eq("ma_nguoi_dung", actorId)
          .limit(1)
          .maybeSingle();
        if (byUser) return byUser.ma_tk;

        // 3. Try lookup via hosodn: ma_hs → nguoidung.ma_hsdn → taikhoan.ma_tk
        const { data: representative } = await supabase
          .from("nguoidung")
          .select("ma_nguoi_dung")
          .eq("ma_hsdn", actorId)
          .eq("vai_tro", "Nguoi dai dien")
          .maybeSingle();
        if (representative?.ma_nguoi_dung) {
          const { data: byRep } = await supabase
            .from("taikhoan")
            .select("ma_tk")
            .eq("ma_nguoi_dung", representative.ma_nguoi_dung)
            .limit(1)
            .maybeSingle();
          if (byRep) return byRep.ma_tk;
        }

        // 4. Try lookup via chinhanh: ma_chi_nhanh → ma_hs → nguoidung.ma_hsdn → taikhoan.ma_tk
        const { data: chinhanh } = await supabase
          .from("chinhanh")
          .select("ma_hs")
          .eq("ma_chi_nhanh", actorId)
          .maybeSingle();
        if (chinhanh?.ma_hs) {
          return await this.resolveActorId(chinhanh.ma_hs, actorRole);
        }

        // 5. Try lookup via voucher: ma_voucher → ma_hs → nguoidung.ma_hsdn → taikhoan.ma_tk
        const { data: voucher } = await supabase
          .from("voucher")
          .select("ma_hs")
          .eq("ma_voucher", actorId)
          .maybeSingle();
        if (voucher?.ma_hs) {
          return await this.resolveActorId(voucher.ma_hs, actorRole);
        }

        // 6. Try lookup via yeu_cau_cap_nhat_hosodn: ma_yc → ma_hs → nguoidung.ma_hsdn → taikhoan.ma_tk
        const { data: reqProfile } = await supabase
          .from("yeu_cau_cap_nhat_hosodn")
          .select("ma_hs")
          .eq("ma_yc", actorId)
          .maybeSingle();
        if (reqProfile?.ma_hs) {
          return await this.resolveActorId(reqProfile.ma_hs, actorRole);
        }

        // 7. Try lookup via yeu_cau_cap_nhat_chinhanh: ma_yc → ma_hs → nguoidung.ma_hsdn → taikhoan.ma_tk
        const { data: reqBranch } = await supabase
          .from("yeu_cau_cap_nhat_chinhanh")
          .select("ma_hs")
          .eq("ma_yc", actorId)
          .maybeSingle();
        if (reqBranch?.ma_hs) {
          return await this.resolveActorId(reqBranch.ma_hs, actorRole);
        }
      } catch (e) {
        console.warn("[AuditLogService] resolveActorId warning:", e.message);
      }
    }

    // 8. Default fallback if actorId is still null/unresolved
    try {
      const adminDbRole = {
        ADMIN_SYSTEM: "Admin he thong",
        ADMIN_MODERATION: "Admin kiem duyet",
        ADMIN_OPERATION: "Admin van hang",
      }[actorRole];
      if (adminDbRole) {
        const { data: adminAcc } = await supabase
          .from("taikhoan")
          .select("ma_tk, nguoidung!inner(vai_tro)")
          .eq("nguoidung.vai_tro", adminDbRole)
          .limit(1)
          .maybeSingle();
        if (adminAcc?.ma_tk) return adminAcc.ma_tk;
      }

      // Default fallback for PARTNER if null:
      const { data: partnerAcc } = await supabase
        .from("taikhoan")
        .select("ma_tk")
        .not("thong_tin_dang_nhap", "ilike", "%admin%")
        .limit(1)
        .maybeSingle();
      if (partnerAcc?.ma_tk) return partnerAcc.ma_tk;
    } catch (e) {
      console.warn("[AuditLogService] fallback resolve warning:", e.message);
    }

    return null;
  }

  /**
   * Normalize role string (DB Vietnamese or JWT) to clean standard role keys:
   * 'PARTNER_OWNER', 'PARTNER_MANAGER', 'PARTNER_STAFF',
   * 'Admin he thong', 'Admin kiem duyet', 'Admin van hanh', 'CUSTOMER'
   */
  normalizeRoleToKey(roleStr) {
    if (!roleStr || typeof roleStr !== "string") return null;
    const r = roleStr.trim().toLowerCase();

    if (r.includes("quan ly") || r.includes("manager") || r === "partner_manager" || r === "voucher_manager") {
      return "PARTNER_MANAGER";
    }
    if (r.includes("dai dien") || r.includes("owner") || r === "partner_owner") {
      return "PARTNER_OWNER";
    }
    if (r.includes("ban hang") || r.includes("staff") || r === "partner_staff") {
      return "PARTNER_STAFF";
    }
    if (r === "Admin he thong" || r.includes("admin he thong")) {
      return "Admin he thong";
    }
    if (r === "Admin kiem duyet" || r.includes("admin kiem duyet")) {
      return "Admin kiem duyet";
    }
    if (r === "Admin van hanh" || r.includes("admin van hang")) {
      return "Admin van hanh";
    }
    if (r === "admin") {
      return "Admin he thong";
    }
    if (r.includes("khach hang") || r.includes("customer")) {
      return "CUSTOMER";
    }

    return roleStr.toUpperCase();
  }

  /**
   * Resolve specific role key (e.g. 'PARTNER_OWNER', 'PARTNER_MANAGER', 'Admin he thong')
   * when actorRole is generic ('PARTNER') or null.
   */
  async resolveActorRole(actorId, actorRole = null) {
    let resolvedRole = this.normalizeRoleToKey(actorRole);
    if (resolvedRole && resolvedRole !== "PARTNER") {
      return resolvedRole;
    }

    if (actorId) {
      try {
        const { data: acc } = await supabase
          .from("taikhoan")
          .select("ma_nguoi_dung")
          .or(`ma_tk.eq.${actorId},ma_nguoi_dung.eq.${actorId}`)
          .maybeSingle();

        const userId = acc?.ma_nguoi_dung || actorId;

        const { data: user } = await supabase
          .from("nguoidung")
          .select("vai_tro")
          .eq("ma_nguoi_dung", userId)
          .maybeSingle();

        if (user?.vai_tro) {
          return this.normalizeRoleToKey(user.vai_tro);
        }
      } catch (e) {
        console.warn("[AuditLogService] resolveActorRole warning:", e.message);
      }
    }

    return resolvedRole || "PARTNER";
  }

  /**
   * Ghi một bản ghi audit log vào DB.
   * @param {object} params
   *  - actorId: uuid tài khoản hoặc người dùng thực hiện (sẽ tự resolve sang ma_tk)
   *  - actorRole: string role JWT (ví dụ: 'Admin he thong')
   *  - action: string mô tả hành động (ví dụ: 'LOGIN', 'LOCK_USER')
   *  - targetType: string tên đối tượng (ví dụ: 'NGUOIDUNG', 'VOUCHER')
   *  - targetId: uuid của đối tượng bị tác động
   *  - before: object|null dữ liệu trước khi thay đổi
   *  - after: object|null dữ liệu sau khi thay đổi
   *  - result: 'Thanh cong' | 'That bai'
   *  - reason: string|null lý do thực hiện
   * @param {boolean} strict - Nếu true, throw nếu ghi log thất bại (dùng cho thao tác bắt buộc log)
   */
  async log(
    {
      actorId = null,
      actorRole = null,
      action,
      targetType = null,
      targetId = null,
      before = null,
      after = null,
      result = LOG_RESULT.THANH_CONG,
      reason = null,
    },
    strict = false
  ) {
    if (!strict) {
      // Non-blocking background log execution for non-strict actions
      setImmediate(async () => {
        try {
          const resolvedActorId = await this.resolveActorId(actorId, actorRole);
          const resolvedActorRole = await this.resolveActorRole(actorId, actorRole);
          await auditLogRepository.create({
            vai_tro_thuc_hien: resolvedActorRole,
            hanh_dong: action,
            du_lieu_truoc: before,
            du_lieu_sau: after,
            ket_qua: result,
            ly_do_thuc_hien: reason,
            ma_tk_thuc_hien: resolvedActorId,
            doi_tuong: targetType,
            ma_doi_tuong: targetId,
          });
        } catch (err) {
          console.warn('[AuditLogService] Ghi log thất bại (background):', err.message);
        }
      });
      return { success: true, queued: true };
    }

    try {
      // Strict logging: synchronous execution
      const resolvedActorId = await this.resolveActorId(actorId, actorRole);
      const resolvedActorRole = await this.resolveActorRole(actorId, actorRole);
      const logEntry = await auditLogRepository.create({
        vai_tro_thuc_hien: resolvedActorRole,
        hanh_dong: action,
        du_lieu_truoc: before,
        du_lieu_sau: after,
        ket_qua: result,
        ly_do_thuc_hien: reason,
        ma_tk_thuc_hien: resolvedActorId,
        doi_tuong: targetType,
        ma_doi_tuong: targetId,
      });
      return logEntry;
    } catch (err) {
      throw new Error(`Ghi audit log bắt buộc thất bại: ${err.message}`);
    }
  }

  /**
   * Đọc danh sách audit log với bộ lọc và phân trang.
   * @param {object} query - { page, limit, maTkThucHien, doiTuong, hanhDong, ketQua, search }
   */
  async listLogs({ page = 1, limit = 20, maTkThucHien, doiTuong, hanhDong, ketQua, search } = {}) {
    const { logs, total } = await auditLogRepository.list({
      page: Number(page),
      limit: Number(limit),
      maTkThucHien,
      doiTuong,
      hanhDong,
      ketQua,
      search,
    });

    return {
      logs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }
}

module.exports = new AuditLogService();
