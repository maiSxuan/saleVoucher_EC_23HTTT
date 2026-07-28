/**
 * Purpose: Route cho partner quản lý thông tin và chi nhánh.
 */
const express = require("express");
const PartnerController = require("../controllers/partner.controller");
const partnerService = require("../../business/services/partner.service");

const router = express.Router();
const controller = new PartnerController(partnerService);

router.post("/", controller.create.bind(controller));

module.exports = router;
