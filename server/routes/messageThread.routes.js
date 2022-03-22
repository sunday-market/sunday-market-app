const express = require("express");
const router = express.Router();
const {
  getMessageThreads,
  addMessageThread,
} = require("../controllers/messageThread.controller");

router.route("/:userId").get(getMessageThreads);
router.route("/").post(addMessageThread);

module.exports = router;
