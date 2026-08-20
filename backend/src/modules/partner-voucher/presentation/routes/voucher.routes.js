const express = require("express");
const VoucherController = require("../controllers/voucher.controller");
const voucherService = require("../../business/services/voucher.service");
const { authenticateMiddleware } = require("../../../../common/middleware/authenticate.middleware");
const { authorizeMiddleware } = require("../../../../common/middleware/authorize.middleware");
const { JWT_ROLES } = require("../../../../common/constants/roles");

const router = express.Router();
const controller = new VoucherController(voucherService);

router.get("/categories", controller.getCate.bind(controller));
router.get("/", controller.list.bind(controller));
router.get("/partner/:partnerId", controller.listByPartner.bind(controller));
router.get("/:id", controller.getById.bind(controller));
router.post("/", authenticateMiddleware, controller.create.bind(controller));
router.put("/:id", authenticateMiddleware, controller.update.bind(controller));
router.post("/:id/submit", authenticateMiddleware, controller.submit.bind(controller));
router.post("/:id/approve", authenticateMiddleware, authorizeMiddleware(JWT_ROLES.ADMIN_MODERATION), controller.approve.bind(controller));
router.post("/:id/reject", authenticateMiddleware, authorizeMiddleware(JWT_ROLES.ADMIN_MODERATION), controller.reject.bind(controller));
router.patch("/:id/status", authenticateMiddleware, controller.updateStatus.bind(controller));

module.exports = router;
