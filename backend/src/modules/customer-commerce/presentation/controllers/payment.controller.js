class PaymentController {
  constructor(paymentService) {
    this.paymentService = paymentService;
  }

  async vnpayReturn(req, res, next) {
    try {
      const result = await this.paymentService.finalizeVnpayPayment(req.query);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  // VNPay gọi trực tiếp từ server họ, không qua trình duyệt -> phải trả đúng format RspCode
  async vnpayIpn(req, res) {
    try {
      await this.paymentService.finalizeVnpayPayment(req.query);
      res.json({ RspCode: "00", Message: "Confirm Success" });
    } catch (error) {
      res.json({ RspCode: "97", Message: "Invalid signature" });
    }
  }

  async paypalReturn(req, res, next) {
    try {
      const { token } = req.body;
      const result = await this.paymentService.finalizePaypalPayment(token);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PaymentController;
