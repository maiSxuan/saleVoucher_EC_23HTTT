/**
 * Purpose: File chạy thật của backend.
 * File này khởi động Express bằng app đã được cấu hình ở app.js.
 */
const app = require("./app");
const { loadEnvironment } = require("./config/environment");

const config = loadEnvironment();

// Express Server Entry Point (Hot Reload Trigger)
app.listen(config.port, () => {
  console.log(`Backend running on port ${config.port}...`);
});
