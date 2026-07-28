/**
 * Purpose: Controller cho giỏ hàng của khách hàng.
 * Dùng để thêm, xóa hoặc cập nhật item trong giỏ.
 */
class CartController {
  constructor(cartService) {
    this.cartService = cartService;
  }

  async getCart(req, res, next) {
    try {
      const result = await this.cartService.getCart(req.user?.id);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CartController;
