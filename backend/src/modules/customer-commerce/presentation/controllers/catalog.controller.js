/**
 * Purpose: Controller cho truy vấn catalog/voucher đang bán.
 */
function normalizeLang(lang) {
  return (lang || "").toLowerCase().startsWith("en") ? "en" : "vi";
}

class CatalogController {
  constructor(catalogQueryService) {
    this.catalogQueryService = catalogQueryService;
  }

  async list(req, res, next) {
    try {
      const rawLang = req.query.lang || req.headers["accept-language"];
      const lang = normalizeLang(rawLang);
      const query = { ...req.query, lang };
      const result = await this.catalogQueryService.listCatalog(query);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async categories(req, res, next) {
    try {
      const rawLang = req.query.lang || req.headers["accept-language"];
      const lang = normalizeLang(rawLang);
      const query = { ...req.query, lang };
      const result = await this.catalogQueryService.listCategories(query);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async detail(req, res, next) {
    try {
      const rawLang = req.query.lang || req.headers["accept-language"];
      const lang = normalizeLang(rawLang);
      const result = await this.catalogQueryService.getVoucherDetail(
        req.params.id,
        lang
      );
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CatalogController;
