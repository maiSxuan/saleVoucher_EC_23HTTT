const express = require("express");
const router = express.Router();
const contentFeedbackModule = require("../modules/content-feedback");

contentFeedbackModule.registerModule(router);

module.exports = router;
