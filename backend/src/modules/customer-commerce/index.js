/**
 * Purpose: Entry point của module customer-commerce.
 * File này gom các service chính để các module khác import dễ dàng.
 */
const customerService = require("./business/services/customer.service");
const catalogQueryService = require("./business/services/catalog-query.service");
const cartService = require("./business/services/cart.service");
const orderService = require("./business/services/order.service");
const paymentService = require("./business/services/payment.service");
const adminOrderService = require("./business/services/admin-order.service");
const customerRoutes = require("./presentation/routes/customer.routes");

function registerModule(app) {
  app.use("/api/v1/customers", customerRoutes);
}

module.exports = {
  customerService,
  catalogQueryService,
  cartService,
  orderService,
  paymentService,
  adminOrderService,
  registerModule,
};
