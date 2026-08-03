/**
 * Purpose: Route cho catalog voucher.
 */
const express = require("express");
const CatalogController = require("../controllers/catalog.controller");
const catalogQueryService = require("../../business/services/catalog-query.service");

const router = express.Router();
const controller = new CatalogController(catalogQueryService);

router.get("/", controller.list.bind(controller));
router.get("/categories", controller.categories.bind(controller));
router.get("/:id", controller.detail.bind(controller));
module.exports = router;
