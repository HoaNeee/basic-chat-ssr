const express = require("express");
const router = express.Router();

const controller = require("../controllers/chat.controller");
const chatMiddleware = require("../middleware/chat.middleware");

router.get("/", controller.index);

router.get("/room/:roomId", chatMiddleware.isAccess, controller.chatPrivate);

module.exports = router;
