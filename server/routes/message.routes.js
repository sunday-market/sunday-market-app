const express = require("express");
const router = express.Router();
const {
  getMessages,
  addNewMessage,
} = require("../controllers/message.controller");
const { protect } = require("../middleware/auth");

router.route("/").post(protect, addNewMessage);
router.route("/:messageThreadId").get(protect, getMessages);

module.exports = router;
