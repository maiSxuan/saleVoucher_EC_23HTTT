/**
 * Purpose: Entry point cho ứng dụng Express.
 * File này chịu trách nhiệm khởi tạo middleware, mount route và xử lý lỗi.
 */
const express = require("express");
const cors = require("cors");
const { corsOptions } = require("./config/cors");
const { loadEnvironment } = require("./config/environment");
const routes = require("./routes");
const { errorMiddleware } = require("./common/middleware/error.middleware");

loadEnvironment();

const app = express();

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/api", (req, res, next) => {
  if (req.method === "GET") {
    res.set("Cache-Control", "no-store, max-age=0");
  }
  next();
});
app.use("/api", routes);
app.use(errorMiddleware);

module.exports = app;
