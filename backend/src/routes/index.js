const express = require("express");
const healthController = require("../controllers/healthController");

const router = express.Router();

router.get("/health", healthController.getHealth);
router.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "sale-voucher-backend",
    message: "Express backend is running",
  });
});

module.exports = router;
