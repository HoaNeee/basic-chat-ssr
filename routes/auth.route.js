const express = require("express");
const router = express.Router();

const controller = require("../controllers/auth.controller");

router.get("/login", controller.login);
router.get("/register", controller.register);
router.get("/logout", controller.logout);

router.post("/login", controller.loginPost);
router.post("/register", controller.registerPost);

module.exports = router;
