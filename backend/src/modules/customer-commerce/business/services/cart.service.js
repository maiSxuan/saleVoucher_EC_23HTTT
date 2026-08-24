/**
 * Purpose: Service xử lý giỏ hàng của khách hàng.
 */
const cartRepository = require("../../data/repositories/cart.repository");
const catalogRepository = require("../../data/repositories/catalog.repository");
const { computeAvailability } = require("./voucher-aivailability.util");
const translationService = require("../../../../common/services/translation.service");

function mapCartItem(row) {
  const v = row.voucher;
  const originalPrice = Number(v.gia_goc);
  const salePrice = Number(v.gia_tri_giam) || 0;
  const partner = v.voucher_cn?.[0]?.chinhanh?.hosodn?.ten_dn || "Đối tác";
  const remaining = v.so_luong_phat_hanh - v.so_luong_da_ban;
  const availability = computeAvailability(v);

  let status = "valid";
  if (availability !== "selling")
    status = "unavailable"; // A3.1.2 / hàng giỏ đã đổi trạng thái
  else if (row.so_luong > remaining) status = "qty_exceeded";

  return {
    voucherId: v.ma_voucher,
    name: v.ten_voucher,
    partner,
    image: v.hinh_anh_url || "https://placehold.co/200x200?text=Voucher",
    salePrice,
    originalPrice,
    quantity: row.so_luong,
    remaining,
    availability,
    status,
  };
}

class CartService {
  //truy xuất items giỏ hàng, tính tạm tính
  async getCart(accountId, lang = null) {
    const cartId = await cartRepository.findOrCreateCart(accountId);
    const rows = await cartRepository.getItems(cartId);
    const items = rows.filter((r) => r.voucher).map(mapCartItem);

    if (lang && lang.toLowerCase().startsWith("en")) {
      for (const item of items) {
        if (item.name) item.name = await translationService.translateText(item.name, "en");
        if (item.partner) item.partner = await translationService.translateText(item.partner, "en");
      }
    }

    const validItems = items.filter((i) => i.status === "valid");
    const subtotal = validItems.reduce(
      (sum, i) => sum + i.salePrice * i.quantity,
      0,
    );
    const totalQty = validItems.reduce((sum, i) => sum + i.quantity, 0);
    const hasInvalidItems = items.some((i) => i.status !== "valid");

    return { items, subtotal, totalQty, hasInvalidItems };
  }

  // thêm voucher vào giỏ hàng
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
    if (!voucher) throw new NotFoundError("Không tìm thấy voucher");

    if (computeAvailability(voucher) !== "selling") {
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

  // update số lượng voucher
  async updateQuantity({ accountId, voucherId, quantity }) {
    if (!quantity || quantity < 1) {
      // A3.1.2: Số lượng không hợp lệ
      const err = new Error("Số lượng không hợp lệ");
      err.status = 400;
      throw err;
    }

    const voucher = await catalogRepository.findVoucherById(voucherId);
    if (!voucher) {
      const err = new Error("Không tìm thấy voucher");
      err.status = 404;
      throw err;
    }

    const remaining = voucher.so_luong_phat_hanh - voucher.so_luong_da_ban;
    if (computeAvailability(voucher) !== "selling" || quantity > remaining) {
      // A3.1.2: số lượng vượt quá khả dụng
      const err = new Error(
        `Số lượng không hợp lệ. Chỉ còn ${remaining} voucher.`,
      );
      err.status = 409;
      throw err;
    }

    const cartId = await cartRepository.findOrCreateCart(accountId);
    await cartRepository.upsertItem(cartId, voucherId, quantity);
    return this.getCart(accountId); // trả giỏ hàng + tạm tính đã cập nhật (NFR-01.2)
  }

  // xóa các voucher đã chọn
  async removeItems({ accountId, voucherIds }) {
    if (!Array.isArray(voucherIds) || voucherIds.length === 0) {
      const err = new Error("Vui lòng chọn ít nhất 1 voucher để xóa");
      err.status = 400;
      throw err;
    }
    const cartId = await cartRepository.findOrCreateCart(accountId);
    await cartRepository.removeItems(cartId, voucherIds);
    return this.getCart(accountId); // trả giỏ hàng đã cập nhật
  }
}

module.exports = new CartService();
