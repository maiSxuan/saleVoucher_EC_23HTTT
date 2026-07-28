/**
 * Purpose: Controller cho luồng thanh toán cho đơn hàng.
 */
class PaymentController {
  constructor(paymentService) {
    this.paymentService = paymentService;
  }

  async pay(req, res, next) {
    try {
      const result = await this.paymentService.pay(req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PaymentController;
