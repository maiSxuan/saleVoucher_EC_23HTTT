

const express = require("express");
const PartnerController = require("../controllers/partner.controller");
const partnerService = require("../../business/services/partner.service");

const router = express.Router();
const controller = new PartnerController(partnerService);

router.get("/", controller.list.bind(controller));
router.post("/register-account", controller.registerAccount.bind(controller));
router.get("/:id", controller.getById.bind(controller));

router.post("/", controller.create.bind(controller));
router.put("/:id", controller.update.bind(controller));
router.post("/:id/approve", controller.approve.bind(controller));
router.post("/:id/reject", controller.reject.bind(controller));
router.post("/:id/lock", controller.lock.bind(controller));

module.exports = router;
