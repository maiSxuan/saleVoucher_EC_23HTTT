const express = require("express");
const router = express.Router();
const controller = require("../controllers/feedback.controller");

router.get("/", controller.getFeedbackList);
router.get("/:id", controller.getFeedbackById);
router.post("/", controller.createFeedback);

module.exports = router;
