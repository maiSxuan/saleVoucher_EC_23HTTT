const express = require("express");
const contentRoutes = require("./presentation/routes/content.routes");
const reviewRoutes = require("./presentation/routes/review.routes");
const feedbackRoutes = require("./presentation/routes/feedback.routes");

function registerModule(app) {
  app.use("/content", contentRoutes);
  app.use("/review", reviewRoutes);
  app.use("/feedback", feedbackRoutes);
}

module.exports = {
  registerModule,
};
