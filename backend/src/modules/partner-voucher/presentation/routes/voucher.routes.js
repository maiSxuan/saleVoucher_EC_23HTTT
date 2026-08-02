const express = require("express");
const VoucherController = require("../controllers/voucher.controller");
const voucherService = require("../../business/services/voucher.service");

const router = express.Router();
const controller = new VoucherController(voucherService);

router.get("/categories", controller.getCate.bind(controller));
router.get("/", controller.list.bind(controller));
router.get("/partner/:partnerId", controller.listByPartner.bind(controller));
router.get("/:id", controller.getById.bind(controller));
router.post("/", controller.create.bind(controller));
router.put("/:id", controller.update.bind(controller));
router.post("/:id/submit", controller.submit.bind(controller));
router.post("/:id/approve", controller.approve.bind(controller));
router.post("/:id/reject", controller.reject.bind(controller));
router.patch("/:id/status", controller.updateStatus.bind(controller));

module.exports = router;
