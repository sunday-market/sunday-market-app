const express = require("express");
const router = express.Router();
const {
  getMessageThread,
  addMessageThread,
} = require("../controllers/messageThread.controller");

router.route("/:userId").get(getMessageThread);
router.route("/").post(addMessageThread);

module.exports = router;
