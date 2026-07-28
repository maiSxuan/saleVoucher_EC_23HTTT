/**
 * Purpose: Route cho quản lý chi nhánh.
 */
const express = require("express");
const BranchController = require("../controllers/branch.controller");
const branchService = require("../../business/services/branch.service");

const router = express.Router();
const controller = new BranchController(branchService);

router.get("/branches", controller.list.bind(controller));

module.exports = router;
