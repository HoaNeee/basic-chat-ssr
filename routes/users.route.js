const express = require("express");
const router = express.Router();

const controller = require("../controllers/users.controller");

router.get("/not-friends", controller.notFriend);
router.get("/requests", controller.requests);
router.get("/accepts", controller.accepts);
router.get("/friends", controller.friends);

module.exports = router;
