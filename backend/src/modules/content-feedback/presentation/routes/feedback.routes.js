const express = require("express");
const router = express.Router();
const controller = require("../controllers/feedback.controller");
const { authenticateMiddleware } = require("../../../../common/middleware/authenticate.middleware");
const { authorizeMiddleware } = require("../../../../common/middleware/authorize.middleware");
const { JWT_ROLES } = require("../../../../common/constants/roles");

router.get("/", authenticateMiddleware, authorizeMiddleware(JWT_ROLES.ADMIN), controller.getFeedbackList);
router.get("/purchase/:voucherPurchaseId", authenticateMiddleware, controller.getFeedbackByPurchaseId);
router.get("/:id", authenticateMiddleware, authorizeMiddleware(JWT_ROLES.ADMIN), controller.getFeedbackById);
router.post("/", authenticateMiddleware, controller.createFeedback);
router.put("/:id/status", authenticateMiddleware, authorizeMiddleware(JWT_ROLES.ADMIN), controller.updateComplaintStatus);

module.exports = router;
