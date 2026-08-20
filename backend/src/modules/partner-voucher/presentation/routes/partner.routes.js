const express = require("express");
const PartnerController = require("../controllers/partner.controller");
const partnerService = require("../../business/services/partner.service");
const { authenticateMiddleware } = require("../../../../common/middleware/authenticate.middleware");
const { authorizeMiddleware } = require("../../../../common/middleware/authorize.middleware");
const { JWT_ROLES } = require("../../../../common/constants/roles");

const router = express.Router();
const controller = new PartnerController(partnerService);

router.get("/", controller.list.bind(controller));
router.get("/check-tax-code", controller.checkTaxCode.bind(controller));
router.post("/register-account", controller.registerAccount.bind(controller));
router.post("/register/request-otp", controller.requestRegisterOtp.bind(controller));
router.post("/register/verify-otp", controller.verifyRegisterOtp.bind(controller));
router.post("/register/resend-otp", controller.resendRegisterOtp.bind(controller));

// Specific profile-request routes MUST be before parameterized /:id routes
router.post("/profile-requests", controller.createProfileRequest.bind(controller));
router.get("/:partnerId/profile-requests", controller.getPendingProfileRequest.bind(controller));
router.post("/profile-requests/:reqId/approve", authenticateMiddleware, authorizeMiddleware(JWT_ROLES.ADMIN_MODERATION), controller.approveProfileRequest.bind(controller));
router.post("/profile-requests/:reqId/reject", authenticateMiddleware, authorizeMiddleware(JWT_ROLES.ADMIN_MODERATION), controller.rejectProfileRequest.bind(controller));

// Parameterized /:id routes
router.get("/:id", controller.getById.bind(controller));

router.post("/", controller.create.bind(controller));
router.put("/:id", controller.update.bind(controller));
router.post("/:id/approve", authenticateMiddleware, authorizeMiddleware(JWT_ROLES.ADMIN_MODERATION), controller.approve.bind(controller));
router.post("/:id/reject", authenticateMiddleware, authorizeMiddleware(JWT_ROLES.ADMIN_MODERATION), controller.reject.bind(controller));
router.post("/:id/lock", authenticateMiddleware, authorizeMiddleware(JWT_ROLES.ADMIN_MODERATION), controller.lock.bind(controller));
router.post("/:id/change-password", controller.changePassword.bind(controller));

module.exports = router;
