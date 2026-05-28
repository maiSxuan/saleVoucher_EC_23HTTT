const healthDao = require("../dao/healthDao");

async function getHealthStatus() {
  const dbStatus = await healthDao.getDatabaseStatus();

  return {
    status: "ok",
    backend: "express",
    database: dbStatus,
    environment: process.env.NODE_ENV || "development",
  };
}

module.exports = {
  getHealthStatus,
};
