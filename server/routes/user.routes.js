const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

const {
  getUserById,
  deleteUser,
  updateUser,
} = require("../controllers/user.controllers");

router
  .route("/:userId")
  .get(protect, getUserById)
  .put(protect, updateUser)
  .delete(protect, deleteUser);

module.exports = router;
