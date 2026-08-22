const express = require("express");
const router = express.Router();
const controller = require("../controllers/content.controller");
const { authenticateMiddleware } = require("../../../../common/middleware/authenticate.middleware");
const { authorizeMiddleware } = require("../../../../common/middleware/authorize.middleware");
const { JWT_ROLES } = require("../../../../common/constants/roles");

router.get("/", controller.getContentList);
router.get("/:id", controller.getContentById);
router.post("/", authenticateMiddleware, authorizeMiddleware(JWT_ROLES.ADMIN_MODERATION), controller.createContent);
router.put("/:id", authenticateMiddleware, authorizeMiddleware(JWT_ROLES.ADMIN_MODERATION), controller.updateContent);
router.delete("/:id", authenticateMiddleware, authorizeMiddleware(JWT_ROLES.ADMIN_MODERATION), controller.deleteContent);

module.exports = router;
