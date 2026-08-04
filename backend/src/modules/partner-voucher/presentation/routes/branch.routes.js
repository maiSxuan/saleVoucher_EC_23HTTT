const express = require("express");
const BranchController = require("../controllers/branch.controller");
const branchService = require("../../business/services/branch.service");

const router = express.Router();
const controller = new BranchController(branchService);

router.get("/partner/:partnerId", controller.getBranchesByPartner.bind(controller));
router.get("/requests/partner/:partnerId", controller.getBranchRequestsByPartner.bind(controller));
router.post("/requests", controller.createBranchRequest.bind(controller));
router.post("/requests/:id/approve", controller.approveBranchRequest.bind(controller));
router.post("/requests/:id/reject", controller.rejectBranchRequest.bind(controller));

module.exports = router;
