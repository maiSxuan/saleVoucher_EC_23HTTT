const customerOrderRoutes = require('./presentation/routes/customer-order.routes');
const adminOrderRoutes = require('./presentation/routes/admin-order.routes');
const orderService = require('./business/services/order.service');

function registerModule(app) {
  app.use('/', customerOrderRoutes);
  app.use('/', adminOrderRoutes);
}

module.exports = {
  orderService,
  registerModule,
};
