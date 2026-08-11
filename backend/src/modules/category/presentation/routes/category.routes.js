/**
 * Purpose: Định nghĩa các routes HTTP cho quản lý danh mục.
 */
const express = require("express");
const router = express.Router();
const controller = require("../controllers/category.controller");
const { authenticateMiddleware } = require("../../../../common/middleware/authenticate.middleware");

router.get("/", controller.getCategories);
router.get("/:id", controller.getCategoryById);
router.post("/", authenticateMiddleware, controller.createCategory);
router.put("/:id", authenticateMiddleware, controller.updateCategory);
router.delete("/:id", authenticateMiddleware, controller.deleteCategory);

module.exports = router;
