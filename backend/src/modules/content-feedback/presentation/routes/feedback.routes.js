const express = require("express");
const router = express.Router();
const controller = require("../controllers/feedback.controller");
const { authenticateMiddleware } = require("../../../../common/middleware/authenticate.middleware");

router.get("/", controller.getFeedbackList);
router.get("/purchase/:voucherPurchaseId", controller.getFeedbackByPurchaseId);
router.get("/:id", controller.getFeedbackById);
router.post("/", controller.createFeedback);
router.put("/:id/status", authenticateMiddleware, controller.updateComplaintStatus);

module.exports = router;
