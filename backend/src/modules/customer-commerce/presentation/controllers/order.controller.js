class OrderController {
  constructor(orderService) {
    this.orderService = orderService;
  }

  async review(req, res, next) {
    try {
      const { voucherIds } = req.body;
      const result = await this.orderService.reviewOrder({
        accountId: req.user.accountId,
        voucherIds,
      });
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { voucherIds, paymentMethod } = req.body;
      const result = await this.orderService.createOrder({
        accountId: req.user.accountId,
        voucherIds,
        paymentMethod,
        ipAddr: req.ip,
      });
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async cancel(req, res, next) {
    try {
      const { id } = req.params;
      const result = await this.orderService.cancelOrder({
        accountId: req.user.accountId,
        orderId: id,
      });
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = OrderController;
