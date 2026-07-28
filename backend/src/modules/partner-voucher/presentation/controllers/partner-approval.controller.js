/**
 * Purpose: Controller cho luồng phê duyệt partner từ admin.
 */
class PartnerApprovalController {
  constructor(partnerApprovalService) {
    this.partnerApprovalService = partnerApprovalService;
  }

  async approve(req, res, next) {
    try {
      const result = await this.partnerApprovalService.approve(req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PartnerApprovalController;
