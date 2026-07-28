const express = require("express");
const router = express.Router();
const contentFeedbackModule = require("../modules/content-feedback");

const coreAccessModule = require("../modules/core-access");

contentFeedbackModule.registerModule(router);
coreAccessModule.registerModule(router);

module.exports = router;
