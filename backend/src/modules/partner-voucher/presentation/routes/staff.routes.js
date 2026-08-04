const express = require("express");
const StaffController = require("../controllers/staff.controller");
const staffService = require("../../business/services/staff.service");

const router = express.Router();
const controller = new StaffController(staffService);

router.get("/partner/:partnerId", controller.listByPartner.bind(controller));
router.post("/", controller.create.bind(controller));
router.put("/:id", controller.update.bind(controller));
router.delete("/:id", controller.delete.bind(controller));

module.exports = router;
