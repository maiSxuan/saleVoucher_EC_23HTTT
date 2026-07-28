/**
 * Purpose: Route cho profile và quản lý người dùng.
 */
const express = require("express");
const UserController = require("../controllers/user.controller");
const userService = require("../../business/services/user.service");

const router = express.Router();
const controller = new UserController(userService);

router.get("/profile", controller.getProfile.bind(controller));

module.exports = router;
