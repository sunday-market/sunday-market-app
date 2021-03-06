const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { User } = require("../models/User.js");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");

exports.register = async (req, res, next) => {
  // Generate a Verify Email Token
  const verifyToken = crypto.randomBytes(20).toString("hex");

  const {
    username,
    password,
    email,
    fullname,
    address_line1,
    address_line2,
    address_line3,
    phone,
  } = req.body;

  try {
    const user = await User.create({
      username,
      password,
      email,
      fullname,
      address_line1,
      address_line2,
      address_line3,
      phone,
      verification_code: verifyToken,
    });

    // Send email with token
    const verifyUrl = `http://localhost:3000/verify/${verifyToken}`;

    const message = `
      <h1>Welcome to Sunday Markets</h1>
      <p>Thank you for registering.  Please confirm your email address by clicking the link below</p>
      <a href=${verifyUrl} clicktracking=off>${verifyUrl}</a>
    `;

    await sendEmail({
      to: user.email,
      subject: "Verify your account",
      text: message,
    });

    res.status(201).json({
      success: true,
      data: "Email Sent",
      user: user,
    });

    sendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  try {
    // returns user by email and include the password field
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    if (!user.verified) {
      return next(new ErrorResponse("User is not verified", 401));
    }

    const isMatch = await user.matchPasswords(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse("Email could not be sent", 404));
    }

    const resetToken = user.getResetPasswordToken();
    await user.save();

    const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;

    const message = `
      <h1>You have requested a new password reset</h1>
      <p>Please go to this link to reset your password</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: message,
      });

      res.status(200).json({
        success: true,
        data: "Email Sent",
        resetToken: resetToken,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpiry = undefined;

      await user.save();

      return next(new ErrorResponse("Email could not be sent", 500));
    }
  } catch (error) {
    return next(error);
  }
};  

exports.changePassword = async (req, res, next) => {
  const { userId, existingPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ _id: userId }).select("+password");

    if (!user) {
      return next(new ErrorResponse("User Not found", 404));
    }

    // Check existing password matches current password
    const isMatch = await user.matchPasswords(existingPassword);

    if (!isMatch) {
      return next(new ErrorResponse("Password is incorrect", 401));
    }

    // Update password with new password (Encryption occurs in user model presave)
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password Successfully Changed",
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserByResetToken = async (req, res, next) => {
  const resetToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      //TODO: Figure out why the reset with expiry is not working
      //resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse("Invalid Reset Token", 400));
    }

    res.status(200).json({
      success: true,
      data: {
        fullName: user.fullname,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
    });

    if (!user) {
      return next(new ErrorResponse("Invalid Reset Token", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({
      success: true,
      data: "Password Reset Success",
    });
  } catch (error) {
    next(error);
  }
};

exports.resetToken = async (req, res, next) => {
  // Generate new token
  const verifyToken = crypto.randomBytes(20).toString("hex");

  try {
    // Save new token in user document
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new ErrorResponse("Email could not be sent", 404));
    }

    user.verification_code = verifyToken;
    user.save();

    // Send Email with Token
    const verifyUrl = `http://localhost:3000/verify/${verifyToken}`;

    const message = `
      <h1>Welcome to Sunday Markets</h1>
      <p>Thank you for registering.  Please confirm your email address by clicking the link below</p>
      <a href=${verifyUrl} clicktracking=off>${verifyUrl}</a>
    `;

    await sendEmail({
      to: user.email,
      subject: "Verify your account",
      text: message,
    });

    res.status(200).json({
      success: true,
      data: "Verification Email Sent",
    });

    sendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

exports.verifyUser = async (req, res, next) => {
  const { verifyToken } = req.params;

  try {
    const user = await User.findOne({ verification_code: verifyToken });
    if (!user) {
      return next(
        new ErrorResponse("That verification code does not exists", 400)
      );
    }

    user.verified = true;
    user.verification_code = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        fullName: user.fullname,
      },
      message: "User email is verified",
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUserCredentials = async (req, res, next) => {
  const { userId } = req.params;
  const data = req.body;

  const salt = await bcrypt.genSalt(10);
  const encryptedPassword = await bcrypt.hash(data.password, salt);

  try {
    await User.updateOne(
      { _id: userId },
      {
        email: data.email,
        password: encryptedPassword,
      }
    );

    res.status(200).json({
      success: true,
      message: `User ${userId} Credentials Updated`,
    });
  } catch (error) {
    next(error);
  }
};

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  res.status(statusCode).json({ success: true, token });
};
