// Entry point cho module content-feedback.
// Module này chịu trách nhiệm xử lý phản hồi, đánh giá và nội dung do người dùng tạo.

const express = require("express");
const router = require("./presentation/routes/contentFeedbackRoutes");

function registerModule(app) {
  app.use("/content-feedback", router);
}

module.exports = {
  registerModule,
};
