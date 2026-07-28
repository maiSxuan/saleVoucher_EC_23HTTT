/**
 * Purpose: Service xử lý truy vấn catalog và voucher đang bán.
 */
class CatalogQueryService {
  async listCatalog(query) {
    return {
      message: "Catalog list placeholder",
      query,
    };
  }
}

module.exports = new CatalogQueryService();
