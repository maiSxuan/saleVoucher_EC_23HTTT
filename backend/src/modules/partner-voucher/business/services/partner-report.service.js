/**
 * Purpose: Service cung cấp dữ liệu báo cáo cho partner.
 */
class PartnerReportService {
  async getReport(query) {
    return {
      message: "Partner report placeholder",
      query,
    };
  }
}

module.exports = new PartnerReportService();
