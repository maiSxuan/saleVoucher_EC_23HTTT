const express = require("express");
const contentRoutes = require("./presentation/routes/content.routes");
const reviewRoutes = require("./presentation/routes/review.routes");
const feedbackRoutes = require("./presentation/routes/feedback.routes");
const categoryRoutes = require("./presentation/routes/category.routes");

function registerModule(app) {
  app.use("/content", contentRoutes);
  app.use("/review", reviewRoutes);
  app.use("/feedback", feedbackRoutes);
  app.use("/categories", categoryRoutes);
}

module.exports = {
  registerModule,
};
