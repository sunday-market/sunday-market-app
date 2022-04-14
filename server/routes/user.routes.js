const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

const {
  getUserById,
  deleteUser,
  updateUser,
  userExists,
} = require("../controllers/user.controllers");

router
  .route("/:userId")
  .get(protect, getUserById)
  .put(protect, updateUser)
  .delete(protect, deleteUser);

router.route("/exists/:userId").get(userExists);

module.exports = router;
