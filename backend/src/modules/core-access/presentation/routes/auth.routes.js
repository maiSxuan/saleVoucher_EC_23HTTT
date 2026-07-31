const express = require("express");
const AuthController = require("../controllers/auth.controller");
const authService = require("../../business/services/auth.service");

const router = express.Router();
const controller = new AuthController(authService);

router.post("/login", controller.login.bind(controller));
router.post("/logout", controller.logout.bind(controller));
router.get("/me", controller.getMe.bind(controller));

module.exports = router;
