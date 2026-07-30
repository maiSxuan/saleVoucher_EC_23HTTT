const express = require("express");
const router = express.Router();
const contentFeedbackModule = require("../modules/content-feedback");
const coreAccessModule = require("../modules/core-access");
const customerCommerceModule = require("../modules/customer-commerce");

contentFeedbackModule.registerModule(router);
coreAccessModule.registerModule(router);
customerCommerceModule.registerModule(router);

module.exports = router;
