/**
 * Purpose: Controller cho thao tác đặt hàng và xem đơn hàng.
 */
class OrderController {
  constructor(orderService) {
    this.orderService = orderService;
  }

  async create(req, res, next) {
    try {
      const result = await this.orderService.createOrder(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = OrderController;
