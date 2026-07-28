/**
 * Purpose: Route cho báo cáo của partner.
 */
const express = require("express");
const PartnerReportController = require("../controllers/partner-report.controller");
const partnerReportService = require("../../business/services/partner-report.service");

const router = express.Router();
const controller = new PartnerReportController(partnerReportService);

router.get("/partner-reports", controller.getReport.bind(controller));

module.exports = router;
