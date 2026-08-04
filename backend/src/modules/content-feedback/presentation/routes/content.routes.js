const express = require("express");
const router = express.Router();
const controller = require("../controllers/content.controller");

router.get("/", controller.getContentList);
router.get("/:id", controller.getContentById);
router.post("/", controller.createContent);
router.put("/:id", controller.updateContent);
router.delete("/:id", controller.deleteContent);

module.exports = router;
