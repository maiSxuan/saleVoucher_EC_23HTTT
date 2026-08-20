/**
 * Purpose: Định nghĩa các routes HTTP cho quản lý danh mục.
 */
const express = require("express");
const router = express.Router();
const controller = require("../controllers/category.controller");
const { authenticateMiddleware } = require("../../../../common/middleware/authenticate.middleware");
const { authorizeMiddleware } = require("../../../../common/middleware/authorize.middleware");
const { JWT_ROLES } = require("../../../../common/constants/roles");

router.get("/", controller.getCategories);
router.get("/:id", controller.getCategoryById);
router.post("/", authenticateMiddleware, authorizeMiddleware(JWT_ROLES.ADMIN_MODERATION), controller.createCategory);
router.put("/:id", authenticateMiddleware, authorizeMiddleware(JWT_ROLES.ADMIN_MODERATION), controller.updateCategory);
router.delete("/:id", authenticateMiddleware, authorizeMiddleware(JWT_ROLES.ADMIN_MODERATION), controller.deleteCategory);

module.exports = router;
