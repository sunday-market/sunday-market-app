const express = require("express");
const router = express.Router();

const {
  register,
  login,
  forgotPassword,
  getUserByResetToken,
  resetPassword,
  changePassword,
  verifyUser,
  updateUserCredentials,
  resetToken,
} = require("../controllers/auth");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgotpassword").post(forgotPassword);
router
  .route("/resetpassword/:resetToken")
  .put(resetPassword)
  .get(getUserByResetToken);
router.route("/changepassword").put(changePassword);
router.route("/verify/:verifyToken").put(verifyUser);
router.route("/resetverificationtoken").post(resetToken);

//TODO: Confirm this route, may need deleting as not being used.
router.route("/user/:userId").put(updateUserCredentials);

module.exports = router;
