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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", routes);
app.use(errorMiddleware);

module.exports = app;
