const userRepository = require('../../data/repositories/user.repository');
const auditLogService = require('./audit-log.service');
const UserModel = require('../../data/models/user.model');
const { DB_ROLES, JWT_ROLES, DB_TO_JWT } = require('../../../../common/constants/roles');
const LOG_RESULT = require('../../../../common/constants/log-result');
const AppError = require('../../../../common/errors/AppError');

const STATUS = {
  ACTIVE: 'Dang hoat dong',  // Đang hoạt động bình thường
  LOCKED: 'Tam khoa',          // Đã bị tạm khóa
};

const VALID_ROLES = Object.values(DB_ROLES);

class UserService {
  // -----------------------------------------------------------------------
  // 1. LẤY DANH SÁCH NGƯỜI DÙNG (BR-ADM-01: Admin xem danh sách)
  //    - Chỉ Admin được gọi endpoint này (enforce ở route middleware).
  //    - Hỗ trợ lọc và phân trang.
  //    - Trả về mảng UserModel đã mapping.
  // -----------------------------------------------------------------------
  async listUsers({ page, limit, name, phone, role, status } = {}) {
    // Gọi repository để lấy dữ liệu thật từ Supabase
    const { users, total } = await userRepository.findAll({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      name,
      phone,
      role,
      status,
    });

    // Map từng row DB → UserModel để chuẩn hóa cấu trúc trả về
    // Tại sao map? → Controller/frontend chỉ cần biết cấu trúc UserModel,
    // không cần biết tên cột DB (ma_nguoi_dung, ho_ten, sdt...)
    const mappedUsers = users.map(
      (u) =>
        new UserModel({
          ma_nguoi_dung: u.ma_nguoi_dung,
          ho_ten: u.ho_ten,
          email: u.email,
          sdt: u.sdt,
          vai_tro: u.vai_tro,
          trang_thai: u.trang_thai,
          created_at: u.created_at,
          ma_chi_nhanh: u.ma_chi_nhanh,
          ma_tk: null, // findAll không join TAIKHOAN (tránh dư data không cần thiết)
        })
    );

    return {
      users: mappedUsers,
      pagination: {
        page: Number(page) || 1,
        limit: Number(limit) || 20,
        total,
        totalPages: Math.ceil(total / (Number(limit) || 20)),
      },
    };
  }

  // -----------------------------------------------------------------------
  // 2. XEM CHI TIẾT NGƯỜI DÙNG (BR-ADM-01: Admin xem chi tiết)
  //    - Tìm theo userId (UUID).
  //    - Trả về UserModel hoặc throw nếu không tìm thấy.
  // -----------------------------------------------------------------------
  async getUserById(userId) {
    const user = await userRepository.findById(userId);

    // Business rule: Không tìm thấy → trả lỗi rõ ràng
    if (!user) {
      throw new AppError('Không tìm thấy người dùng', 404, 'USER_NOT_FOUND');
    }

    // Thêm jwtRole vào payload để frontend hiển thị đúng
    const jwtRole = DB_TO_JWT[user.vai_tro] || 'CUSTOMER';

    let extraInfo = {};
    let orderHistory = [];
    let auditLogs = [];

    // Lấy thông tin bổ sung dựa trên vai trò
    if (user.vai_tro === 'Khach hang') {
      orderHistory = await userRepository.getUserOrderHistory(userId);
    } else if (user.vai_tro === 'Nhan vien quan ly voucher' || user.vai_tro === 'Nguoi dai dien') {
      extraInfo = await userRepository.getUserCompanyInfo(user.ma_hsdn);
      auditLogs = await userRepository.getUserAuditLogs(userId);
    } else if (user.vai_tro === 'Nhan vien ban hang') {
      extraInfo = await userRepository.getUserBranchInfo(user.ma_chi_nhanh);
      auditLogs = await userRepository.getUserAuditLogs(userId);
    } else {
      auditLogs = await userRepository.getUserAuditLogs(userId);
    }

    return {
      ...new UserModel({
        ma_nguoi_dung: user.ma_nguoi_dung,
        ho_ten: user.ho_ten,
        email: user.email,
        sdt: user.sdt,
        vai_tro: user.vai_tro,
        trang_thai: user.trang_thai,
        created_at: user.created_at,
        ma_chi_nhanh: user.ma_chi_nhanh,
        ma_tk: null,
      }),
      ma_hsdn: user.ma_hsdn,
      jwtRole, // Thêm JWT role để frontend dùng nếu cần
      extraInfo,
      orderHistory,
      auditLogs,
    };
  }

  // -----------------------------------------------------------------------
  // 3. KHÓA TÀI KHOẢN NGƯỜI DÙNG (BR-ADM-01: Admin khóa user)
  //    Business Rules:
  //      - Admin không thể tự khóa tài khoản của mình (actorId ≠ targetUserId).
  //      - Chỉ có thể khóa tài khoản đang hoạt động.
  //      - Phải ghi audit log với strict=true (RB-12 + RB-15).
  // -----------------------------------------------------------------------
  async lockUser({ actorId, actorRole, targetUserId, reason }) {
    // Business rule 1: Admin không tự khóa mình
    // Tại sao? → Tránh admin vô tình mất quyền truy cập
    if (actorId === targetUserId) {
      throw new AppError('Không thể khóa tài khoản của chính mình', 400, 'SELF_ACTION_FORBIDDEN');
    }

    // Lấy thông tin user cần khóa từ DB
    const targetUser = await userRepository.findById(targetUserId);
    if (!targetUser) {
      throw new AppError('Không tìm thấy người dùng cần khóa', 404, 'USER_NOT_FOUND');
    }

    // Business rule 2: Chỉ khóa được tài khoản đang hoạt động
    if (targetUser.trang_thai === STATUS.LOCKED) {
      throw new AppError('Tài khoản đã Tạm khóa rồi', 400, 'ALREADY_LOCKED');
    }

    // Ghi audit log TRƯỚC khi update (strict=true → nếu log thất bại thì không update)
    // Tại sao strict? → RB-15: Thao tác bắt buộc log mà log thất bại → không được báo thành công
    await auditLogService.log(
      {
        actorId,
        actorRole,
        action: 'LOCK_USER',
        targetType: 'NGUOIDUNG',
        targetId: targetUserId,
        before: { trang_thai: targetUser.trang_thai },  // Trạng thái trước khi khóa
        after: { trang_thai: STATUS.LOCKED },            // Trạng thái sau khi khóa
        result: LOG_RESULT.THANH_CONG,
        reason: reason || null,
      },
      true // strict = true → throw nếu ghi log thất bại
    );

    // Sau khi log xong mới update DB
    const updated = await userRepository.updateStatus(targetUserId, STATUS.LOCKED);
    return updated;
  }

  // -----------------------------------------------------------------------
  // 4. MỞ KHÓA TÀI KHOẢN NGƯỜI DÙNG (BR-ADM-01: Admin mở khóa user)
  //    Business Rules:
  //      - Chỉ có thể mở khóa tài khoản đang Tạm khóa.
  //      - Phải ghi audit log (strict=true).
  // -----------------------------------------------------------------------
  async unlockUser({ actorId, actorRole, targetUserId, reason }) {
    const targetUser = await userRepository.findById(targetUserId);
    if (!targetUser) {
      throw new AppError('Không tìm thấy người dùng cần mở khóa', 404, 'USER_NOT_FOUND');
    }

    // Business rule: Chỉ mở khóa được tài khoản đang Tạm khóa
    if (targetUser.trang_thai === STATUS.ACTIVE) {
      throw new AppError('Tài khoản đang hoạt động bình thường, không cần mở khóa', 400, 'ALREADY_ACTIVE');
    }

    // Ghi audit log bắt buộc (strict=true)
    await auditLogService.log(
      {
        actorId,
        actorRole,
        action: 'UNLOCK_USER',
        targetType: 'NGUOIDUNG',
        targetId: targetUserId,
        before: { trang_thai: targetUser.trang_thai },  // Trạng thái trước khi mở khóa
        after: { trang_thai: STATUS.ACTIVE },            // Trạng thái sau khi mở khóa
        result: LOG_RESULT.THANH_CONG,
        reason: reason || null,
      },
      true // strict = true
    );

    const updated = await userRepository.updateStatus(targetUserId, STATUS.ACTIVE);
    return updated;
  }

  // -----------------------------------------------------------------------
  // 5. CẬP NHẬT VAI TRÒ NGƯỜI DÙNG (BR-ADM-01: Admin đổi role)
  //    Business Rules:
  //      - Admin không tự đổi role của mình.
  //      - newRole phải là một trong các vai trò hợp lệ trong DB.
  //      - Phải ghi audit log (strict=true).
  // -----------------------------------------------------------------------
  async updateUserRole({ actorId, actorRole, targetUserId, newRole, maChiNhanh, maHsdn, reason }) {
    // Business rule 1: Admin không đổi role của chính mình
    if (actorId === targetUserId) {
      throw new AppError('Không thể cập nhật vai trò của chính mình', 400, 'SELF_ACTION_FORBIDDEN');
    }

    // Business rule 2: newRole phải là vai trò hợp lệ trong schema DB
    if (!VALID_ROLES.includes(newRole)) {
      throw new AppError(
        `Vai trò '${newRole}' không hợp lệ. Các vai trò hợp lệ: ${VALID_ROLES.join(', ')}`,
        400,
        'INVALID_ROLE'
      );
    }

    const targetUser = await userRepository.findById(targetUserId);
    if (!targetUser) {
      throw new AppError('Không tìm thấy người dùng', 404, 'USER_NOT_FOUND');
    }

    // Business rule 2.5: Chỉ được phép cập nhật vai trò đối với Nhân viên bán hàng và Nhân viên quản lý voucher
    const isTargetValid = targetUser.vai_tro === 'Nhan vien ban hang' || targetUser.vai_tro === 'Nhan vien quan ly voucher';
    if (!isTargetValid) {
      throw new AppError('Chỉ được phép cập nhật vai trò đối với Nhân viên bán hàng và Nhân viên quản lý voucher.', 400, 'INVALID_ROLE_TRANSITION');
    }

    const isNewRoleValid = newRole === 'Nhan vien ban hang' || newRole === 'Nhan vien quan ly voucher';
    if (!isNewRoleValid) {
      throw new AppError('Chỉ được phép chuyển đổi giữa Nhân viên bán hàng và Nhân viên quản lý voucher.', 400, 'INVALID_ROLE_TRANSITION');
    }

    // Business rule 3: Nếu vai trò không thay đổi thì không cần update
    if (targetUser.vai_tro === newRole) {
      throw new AppError('Vai trò mới giống vai trò hiện tại, không cần cập nhật', 400, 'SAME_ROLE');
    }

    // Business rule 4: Nhân viên bán hàng yêu cầu mã chi nhánh.
    if (newRole === 'Nhan vien ban hang' && !maChiNhanh) {
      throw new AppError('Bắt buộc phải chọn Chi nhánh cho Nhân viên bán hàng.', 400, 'MISSING_BRANCH');
    }
    
    // Business rule 5: Nhân viên quản lý voucher yêu cầu mã đối tác.
    if (newRole === 'Nhan vien quan ly voucher' && !maHsdn) {
      throw new AppError('Bắt buộc phải chọn Đối tác (Doanh nghiệp) cho vai trò này.', 400, 'MISSING_PARTNER');
    }

    // Ghi audit log bắt buộc (strict=true)
    await auditLogService.log(
      {
        actorId,
        actorRole,
        action: 'UPDATE_USER_ROLE',
        targetType: 'NGUOIDUNG',
        targetId: targetUserId,
        before: { vai_tro: targetUser.vai_tro },  // Vai trò cũ
        after: { vai_tro: newRole },               // Vai trò mới
        result: LOG_RESULT.THANH_CONG,
        reason: reason || null,
      },
      true // strict = true
    );

    const updated = await userRepository.updateRole(targetUserId, newRole, maChiNhanh, maHsdn);
    return updated;
  }

  // -----------------------------------------------------------------------
  // 6. LẤY PROFILE CỦA NGƯỜI DÙNG HIỆN TẠI (từ token)
  //    Dùng cho mọi role (admin, partner, customer) để xem thông tin của mình.
  // -----------------------------------------------------------------------
  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('Không tìm thấy thông tin người dùng', 404, 'USER_NOT_FOUND');
    }
    return new UserModel({
      ma_nguoi_dung: user.ma_nguoi_dung,
      ho_ten: user.ho_ten,
      email: user.email,
      sdt: user.sdt,
      vai_tro: user.vai_tro,
      trang_thai: user.trang_thai,
      created_at: user.created_at,
      ma_chi_nhanh: user.ma_chi_nhanh,
      ma_tk: null,
    });
  }

  // -----------------------------------------------------------------------
  // 7. LẤY DANH SÁCH CHI NHÁNH VÀ ĐỐI TÁC CHO COMBOBOX / LOOKUP
  // -----------------------------------------------------------------------
  async listBranches() {
    return await userRepository.findAllBranches();
  }

  async listPartners() {
    return await userRepository.findAllPartners();
  }
}

module.exports = new UserService();
