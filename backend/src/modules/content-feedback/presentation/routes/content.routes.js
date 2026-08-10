const express = require("express");
const router = express.Router();
const controller = require("../controllers/content.controller");
const { authenticateMiddleware } = require("../../../../common/middleware/authenticate.middleware");

router.get("/", controller.getContentList);
router.get("/:id", controller.getContentById);
router.post("/", authenticateMiddleware, controller.createContent);
router.put("/:id", authenticateMiddleware, controller.updateContent);
router.delete("/:id", authenticateMiddleware, controller.deleteContent);

module.exports = router;
