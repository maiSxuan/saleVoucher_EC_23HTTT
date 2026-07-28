/**
 * Purpose: Controller cho admin quản lý đơn hàng.
 */
class AdminOrderController {
  constructor(adminOrderService) {
    this.adminOrderService = adminOrderService;
  }

  async list(req, res, next) {
    try {
      const result = await this.adminOrderService.listOrders(req.query);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminOrderController;
