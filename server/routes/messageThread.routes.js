const express = require("express");
const router = express.router();
const {
  getMessageThread,
  addMessageThread,
} = require("../controllers/messageThread.controller");

router.route("/:userId").get(getMessageThread);
router.route("/").post(addMessageThread);

module.exports = router;
