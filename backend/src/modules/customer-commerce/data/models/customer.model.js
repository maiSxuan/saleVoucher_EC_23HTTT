/**
 * Purpose: Model mẫu cho khách hàng.
 */
class CustomerModel {
  constructor({ id, name, email }) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
}

module.exports = CustomerModel;
