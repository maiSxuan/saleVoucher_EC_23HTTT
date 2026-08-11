/**
 * Purpose: Entry point của module category (quản lý danh mục danh_muc).
 */
const categoryService = require("./business/services/category.service");
const categoryRoutes = require("./presentation/routes/category.routes");

function registerModule(app) {
  app.use("/categories", categoryRoutes);
  app.use("/admin/categories", categoryRoutes);
}

module.exports = {
  categoryService,
  registerModule,
};
