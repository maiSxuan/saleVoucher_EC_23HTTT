/**
 * Purpose: File chạy thật của backend.
 * File này khởi động Express bằng app đã được cấu hình ở app.js.
 */
const app = require("./app");
const { loadEnvironment } = require("./config/environment");

loadEnvironment();

const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on http://0.0.0.0:${PORT}`);
});
