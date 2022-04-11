const express = require("express");
const router = express.Router();
const {
  getMessageThreads,
  addMessageThread,
  deleteMessageThread,
} = require("../controllers/messageThread.controller");
const { protect } = require("../middleware/auth");

router.route("/:userId").get(protect, getMessageThreads);
router.route("/").post(protect, addMessageThread);
router.route("/:threadId").delete(protect, deleteMessageThread);
module.exports = router;
