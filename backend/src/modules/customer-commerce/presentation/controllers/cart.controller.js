/**
 * Purpose: Controller cho giỏ hàng của khách hàng.
 */
class CartController {
  constructor(cartService) {
    this.cartService = cartService;
  }

  async getItems(req, res, next) {
    try {
      const result = await this.cartService.getCart(req.user?.accountId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async addItem(req, res, next) {
    try {
      const { voucherId, quantity } = req.body;
      const result = await this.cartService.addToCart({
        accountId: req.user?.accountId,
        voucherId,
        quantity: Number(quantity) || 1,
      });
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async updateItem(req, res, next) {
    try {
      const { voucherId } = req.params;
      const { quantity } = req.body;
      const result = await this.cartService.updateQuantity({
        accountId: req.user.accountId,
        voucherId,
        quantity: Number(quantity),
      });
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async removeItems(req, res, next) {
    try {
      const { voucherIds } = req.body;
      const result = await this.cartService.removeItems({
        accountId: req.user.accountId,
        voucherIds,
      });
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CartController;
