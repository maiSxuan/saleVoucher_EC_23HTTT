/**
 * Purpose: Controller cho báo cáo và thống kê của partner.
 */
class PartnerReportController {
  constructor(partnerReportService) {
    this.partnerReportService = partnerReportService;
  }

  async getReport(req, res, next) {
    try {
      const lang = req.query.lang || req.headers["accept-language"];
      const result = await this.partnerReportService.getReport({ ...req.query, lang });
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PartnerReportController;
