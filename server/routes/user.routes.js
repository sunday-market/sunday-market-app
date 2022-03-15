const express = require("express");
const router = express.Router();

const {
  getUserById,
  deleteUser,
  updateUser,
} = require("../controllers/user.controllers");

router.route("/:userId").get(getUserById).put(updateUser).delete(deleteUser);

module.exports = router;
