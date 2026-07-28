/**
 * Purpose: Controller cho báo cáo và thống kê của partner.
 */
class PartnerReportController {
  constructor(partnerReportService) {
    this.partnerReportService = partnerReportService;
  }

  async getReport(req, res, next) {
    try {
      const result = await this.partnerReportService.getReport(req.query);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PartnerReportController;
