/**
 * Purpose: Model đại diện cho entity user trong module core-access.
 * Dùng như schema mẫu để các service/repository tham khảo.
 */
class UserModel {
  constructor({ id, email, role }) {
    this.id = id;
    this.email = email;
    this.role = role;
  }
}

module.exports = UserModel;
