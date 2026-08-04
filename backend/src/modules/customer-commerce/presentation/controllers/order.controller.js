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

  async vnpayReturn(req, res, next) {
    try {
      const result = await this.orderService.finalizeVnpayPayment(req.query);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  // VNPay gọi trực tiếp từ server họ, không qua trình duyệt -> phải trả đúng format RspCode
  async vnpayIpn(req, res) {
    try {
      await this.orderService.finalizeVnpayPayment(req.query);
      res.json({ RspCode: "00", Message: "Confirm Success" });
    } catch (error) {
      res.json({ RspCode: "97", Message: "Invalid signature" });
    }
  }

  async paypalReturn(req, res, next) {
    try {
      const { token } = req.body;
      const result = await this.orderService.finalizePaypalPayment(token);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = OrderController;
