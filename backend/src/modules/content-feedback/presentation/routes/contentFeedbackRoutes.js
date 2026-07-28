// Router cho module content-feedback.
// Định nghĩa endpoint và nối controller.

const express = require("express");
const router = express.Router();
const controller = require("../controllers/contentFeedbackController");

router.get("/", controller.getFeedbackList);
router.post("/", controller.createFeedback);

module.exports = router;
