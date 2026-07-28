/**
 * Purpose: Route cho catalog voucher.
 */
const express = require("express");
const CatalogController = require("../controllers/catalog.controller");
const catalogQueryService = require("../../business/services/catalog-query.service");

const router = express.Router();
const controller = new CatalogController(catalogQueryService);

router.get("/catalog", controller.list.bind(controller));

module.exports = router;
