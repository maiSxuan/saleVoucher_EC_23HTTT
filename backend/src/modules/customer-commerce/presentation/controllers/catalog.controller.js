/**
 * Purpose: Controller cho truy vấn catalog/voucher đang bán.
 */
class CatalogController {
  constructor(catalogQueryService) {
    this.catalogQueryService = catalogQueryService;
  }

  async list(req, res, next) {
    try {
      const result = await this.catalogQueryService.listCatalog(req.query);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CatalogController;
