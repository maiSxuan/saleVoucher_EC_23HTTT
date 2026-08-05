const cartRepository = require("../../data/repositories/cart.repository");
const orderRepository = require("../../data/repositories/order.repository");
const orderItemRepository = require("../../data/repositories/order-item.repository");
const { computeAvailability } = require("./voucher-aivailability.util");

const PaymentService = require("./payment.service");

class OrderService {
  // kiểm tra khả dụng, tính tổng tiền — CHƯA ghi DB
  async reviewOrder({ accountId, voucherIds }) {
    if (!Array.isArray(voucherIds) || voucherIds.length === 0) {
      const err = new Error("Giỏ hàng trống, không thể tạo đơn hàng");
      err.status = 400;
      throw err;
    }

    const cartId = await cartRepository.findOrCreateCart(accountId);
    const rows = await cartRepository.getItems(cartId);
    const selected = rows.filter(
      (r) => voucherIds.includes(r.ma_voucher) && r.voucher,
    );

    if (selected.length !== voucherIds.length) {
      const err = new Error("Một số voucher không còn trong giỏ hàng");
      err.status = 404;
      throw err;
    }

    const items = selected.map((r) => {
      const v = r.voucher;
      const originalPrice = Number(v.gia_goc);
      const salePrice = originalPrice - (Number(v.gia_tri_giam) || 0);
      const remaining = v.so_luong_phat_hanh - v.so_luong_da_ban;
      return {
        voucherId: v.ma_voucher,
        name: v.ten_voucher,
        image: v.hinh_anh_url,
        quantity: r.so_luong,
        salePrice,
        subtotal: salePrice * r.so_luong,
        availability: computeAvailability(v),
        remaining,
      };
    });

    const invalidItems = items.filter(
      (i) => i.availability !== "selling" || i.quantity > i.remaining,
    );
    if (invalidItems.length > 0) {
      const err = new Error(
        "Một hoặc nhiều voucher không còn đủ số lượng để đặt mua",
      ); // A3
      err.status = 409;
      err.details = { invalidItems: invalidItems.map((i) => i.voucherId) };
      throw err;
    }

    const total = items.reduce((sum, i) => sum + i.subtotal, 0);
    return { items, total };
  }

  //tạo đơn hàng + tạo link thanh toán (CHƯA xác nhận thành công/thất bại)
  async createOrder({ accountId, voucherIds, paymentMethod, ipAddr }) {
    const { items, total } = await this.reviewOrder({ accountId, voucherIds });
    const order = await orderRepository.create({ accountId, total });
    await orderItemRepository.createMany(order.ma_dh, items);
    return PaymentService._startPayment({
      order,
      total,
      paymentMethod,
      ipAddr,
    });
  }

  //khách hàng hủy giao dịch
  async cancelOrder({ accountId, orderId }) {
    const order = await orderRepository.findById(orderId, accountId);
    if (!order) {
      const err = new Error("Không tìm thấy đơn hàng");
      err.status = 404;
      throw err;
    }
    if (order.trang_thai === "Da thanh toan") {
      const err = new Error(
        "Đơn hàng đã thanh toán, không thể hủy theo cách này",
      );
      err.status = 409;
      throw err;
    }
    await orderRepository.updateStatus(orderId, "Da huy");
    return { orderId, status: "Da huy" };
  }
}

module.exports = new OrderService();
