const express = require("express");
const router = express.Router();
const controller = require("../controllers/review.controller");
const { authenticateMiddleware } = require("../../../../common/middleware/authenticate.middleware");

router.get("/", controller.getReviewList);
router.get("/voucher/:voucherId", controller.getReviewsByVoucher);
router.get("/purchase/:voucherPurchaseId", controller.getReviewByPurchaseId);
router.get("/:id", controller.getReviewById);
router.post("/", controller.createReview);
router.delete("/:id", authenticateMiddleware, controller.deleteReview);

module.exports = router;
