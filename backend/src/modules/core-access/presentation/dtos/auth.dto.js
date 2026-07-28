/**
 * Purpose: DTO mẫu cho payload đăng nhập.
 * Dùng để định nghĩa cấu trúc dữ liệu đầu vào cho controller/service.
 */
class AuthDto {
  constructor({ email, password }) {
    this.email = email;
    this.password = password;
  }
}

module.exports = AuthDto;
