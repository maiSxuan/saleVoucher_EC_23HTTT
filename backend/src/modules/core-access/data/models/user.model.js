class UserModel {
  constructor({
    ma_nguoi_dung,  // UUID — khóa chính bảng NGUOIDUNG
    ho_ten,         // Họ tên đầy đủ
    email,          // Email
    sdt,            // Số điện thoại
    vai_tro,        // Vai trò DB: 'Admin', 'Khach hang', 'Nguoi dai dien', ...
    trang_thai,     // Trạng thái tài khoản: 'Dang hoat dong' | 'Bi khoa'
    created_at,       // Ngày tạo tài khoản
    ma_chi_nhanh,   // FK chi nhánh (nếu là nhân viên đối tác)
    ma_tk,          // UUID tài khoản (từ bảng TAIKHOAN)
  }) {
    // Gán từng field từ dữ liệu DB sang property của model
    this.id = ma_nguoi_dung;          // Dùng "id" để frontend dễ dùng
    this.name = ho_ten;               // Dùng "name" thống nhất với UI
    this.email = email;
    this.phone = sdt;                 // Dùng "phone" thống nhất với UI
    this.role = vai_tro;              // Giữ nguyên vai trò DB (service sẽ map sang JWT role nếu cần)
    this.status = trang_thai;         // Trạng thái: 'Dang hoat dong' | 'Bi khoa'
    this.createdAt = created_at;        // Ngày tạo
    this.branchId = ma_chi_nhanh ?? null; // Có thể null nếu không phải nhân viên chi nhánh
    this.accountId = ma_tk ?? null;   // UUID tài khoản đăng nhập
  }
}

module.exports = UserModel;
