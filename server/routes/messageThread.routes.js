const express = require("express");
const router = express.Router();
const {
  getMessageThreads,
  addMessageThread,
} = require("../controllers/messageThread.controller");
const { protect } = require("../middleware/auth");

router.route("/:userId").get(protect, getMessageThreads);
router.route("/").post(protect, addMessageThread);

module.exports = router;
