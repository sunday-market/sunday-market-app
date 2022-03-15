const express = require("express");
const router = express.Router();

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyUser,
  updateUserCredentials
} = require("../controllers/auth");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgotpassword").post(forgotPassword);
router.route("/resetpassword/:resetToken").put(resetPassword);
router.route("/changepassword").put(changePassword);
router.route("/verify/:verifyToken").put(verifyUser);

router.route("/user/:userId").put(updateUserCredentials);

module.exports = router;