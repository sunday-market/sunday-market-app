const { User } = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

// Get an account by the token
exports.getUserById = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return next(new ErrorResponse("No user found with given id"));
    }

    res.status(200).json({
      success: true,
      data: {
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        addressLine1: user.address_line1,
        addressLine2: user.address_line2,
        addressLine3: user.address_line3,
        phone: user.phone,
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    await User.deleteOne({ _id: userId });
    res.status(200).json({
      success: true,
      message: `User with ID ${userId} deleted.`,
    });
  } catch (error) {
    return next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  const { userId } = req.params;
  const data = req.body;

  try {
    await User.updateOne(
      { _id: userId },
      {
        fullname: data.fullname,
        address_line1: data.address_line1,
        address_line2: data.address_line2,
        address_line3: data.address_line3,
        phone: data.phone,
      }
    );

    res.status(200).json({
      success: true,
      message: `User ${userId} updated.`,
    });
  } catch (error) {
    return next(error);
  }
};

