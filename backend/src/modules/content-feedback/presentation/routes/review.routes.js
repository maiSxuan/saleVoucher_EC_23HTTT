const express = require("express");
const router = express.Router();
const controller = require("../controllers/review.controller");
const { authenticateMiddleware } = require("../../../../common/middleware/authenticate.middleware");
const { authorizeMiddleware } = require("../../../../common/middleware/authorize.middleware");
const { JWT_ROLES } = require("../../../../common/constants/roles");

router.get("/", controller.getReviewList);
router.get("/voucher/:voucherId", controller.getReviewsByVoucher);
router.get("/purchase/:voucherPurchaseId", controller.getReviewByPurchaseId);
router.get("/:id", controller.getReviewById);
router.post("/", controller.createReview);
router.delete("/:id", authenticateMiddleware, authorizeMiddleware(JWT_ROLES.ADMIN_OPERATION), controller.deleteReview);

module.exports = router;
