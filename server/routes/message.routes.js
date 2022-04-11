const express = require("express");
const router = express.Router();
const {
  getMessages,
  addNewMessage,
  deleteMessage,
} = require("../controllers/message.controller");
const { protect } = require("../middleware/auth");

router.route("/").post(protect, addNewMessage);
router
  .route("/:messageThreadId")
  .get(protect, getMessages)
  .delete(protect, deleteMessage);

module.exports = router;
