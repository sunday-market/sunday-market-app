const { User } = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

// Get an account by the token
exports.getUserById = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return next(new ErrorResponse("No user found with given id", 404));
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return next(error);
  }
};

exports.userExists = async (req, res, next) => {
  if (!req.params.userId) {
    res.status(400).send("User not supplied");
  }

  await User.findById(req.params.userId)
    .then((result) => {
      if (result) {
        res.status(200).send(true);
      } else {
        res.status(200).send(false);
      }
    })
    .catch((error) => {
      return next(error);
    });
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

  try {
    const user = await User.updateOne({ _id: userId }, { ...req.body });

    res.status(200).json({
      success: true,
      message: `User ${userId} updated.`,
    });
  } catch (error) {
    return next(error);
  }
};
