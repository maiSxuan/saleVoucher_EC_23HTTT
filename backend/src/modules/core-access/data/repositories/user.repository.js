/**
 * Purpose: Repository cho thao tác trên bảng user.
 * Sau này sẽ nằm ở đây để tách khỏi business logic.
 */
class UserRepository {
  async findById(id) {
    return { id, name: "demo-user" };
  }
}

module.exports = new UserRepository();
