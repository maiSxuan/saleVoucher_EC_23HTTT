/**
 * Purpose: Route cho dashboard admin và thống kê tổng quan.
 */
const express = require("express");
const AdminDashboardController = require("../controllers/admin-dashboard.controller");
const adminDashboardService = require("../../business/services/admin-dashboard.service");

const router = express.Router();
const controller = new AdminDashboardController(adminDashboardService);

router.get("/dashboard", controller.getSummary.bind(controller));

module.exports = router;
