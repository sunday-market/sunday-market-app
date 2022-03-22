const express = require("express");
const router = express.Router();
const {
  getMessages,
  addNewMessage,
} = require("../controllers/message.controller");

router.route("/").post(addNewMessage);
router.route("/:messageThreadId").get(getMessages);

module.exports = router;
