/**
 * Purpose: Model mẫu cho đối tác/partner.
 */
class PartnerModel {
  constructor({ id, name, status }) {
    this.id = id;
    this.name = name;
    this.status = status;
  }
}

module.exports = PartnerModel;
