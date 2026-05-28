const healthService = require("../services/healthService");

async function getHealth(req, res) {
  try {
    const result = await healthService.getHealthStatus();
    res.json(result);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
}

module.exports = {
  getHealth,
};
