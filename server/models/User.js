const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [8, "Password must be greater than 8 characters"],
    select: false,
  },
  email: {
    type: String,
    required: [true, "Please provide a email"],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[0-9]{1,3}\.[0-9]{1,3}\.[0-9{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
  },
  fullname: {
    type: String,
    required: [true, "Please provide a name"],
  },
  address_line1: {
    type: String,
  },
  address_line2: {
    type: String,
  },
  address_line3: {
    type: String,
  },
  phone: {
    type: String,
    minlength: 6,
    maxlength: 14,
  },
  verification_code: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
    required: true,
  },
  account_ban: {
    type: Boolean,
    required: true,
    default: false,
  },
  reset_token: {
    type: String,
  },
  reset_expriry: {
    type: Date,
  },
});

UserSchema.set("timestamps", true); // Add createdAt and updatedAt timestamps

// Hash passwords before saving to DB
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000); // 10 min reset

  return resetToken;
};

UserSchema.methods.getVerified = function () {
  return verified;
};

const User = mongoose.model("User", UserSchema);
module.exports = {User, UserSchema};
