/**
 * Purpose: Service xử lý giỏ hàng của khách hàng.
 */
const cartRepository = require("../../data/repositories/cart.repository");
const catalogRepository = require("../../data/repositories/catalog.repository");
const { computeAvailability } = require("./voucher-aivailability.util");
const NotFoundError = require("../../../../common/errors/NotFoundError");

class CartService {
  async getCart(accountId) {
    return {
      accountId,
      items: [],
      message: "Cart placeholder — sẽ làm ở task giỏ hàng",
    };
  }

  // UC-CUS-08 bước 6-7: kiểm tra trạng thái NGAY tại thời điểm thêm vào giỏ
  async addToCart({ accountId, voucherId, quantity }) {
    if (!accountId) {
      const err = new Error("Vui lòng đăng nhập để thêm vào giỏ hàng");
      err.status = 401;
      throw err;
    }
    if (!quantity || quantity < 1) {
      const err = new Error("Số lượng không hợp lệ");
      err.status = 400;
      throw err;
    }

    const voucher = await catalogRepository.findVoucherById(voucherId);
    if (!voucher) {
      throw new NotFoundError("Không tìm thấy voucher");
    }

    if (computeAvailability(voucher) !== "selling") {
      // A6: Voucher không còn khả dụng để bán
      const err = new Error("Voucher hiện không khả dụng để bán");
      err.status = 409;
      throw err;
    }

    const remaining = voucher.so_luong_phat_hanh - voucher.so_luong_da_ban;
    const cartId = await cartRepository.findOrCreateCart(accountId);
    const existingItem = await cartRepository.findItem(cartId, voucherId);
    const newQty = (existingItem?.so_luong || 0) + quantity;

    if (newQty > remaining) {
      const err = new Error(
        `Chỉ còn ${remaining} voucher, giỏ hàng đã có ${existingItem?.so_luong || 0}`,
      );
      err.status = 409;
      throw err;
    }

    await cartRepository.upsertItem(cartId, voucherId, newQty);
    return { voucherId, quantity: newQty };
  }
}

module.exports = new CartService();
