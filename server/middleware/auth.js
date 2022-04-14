const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

exports.protect = async (req, res, next) => {
  let token;

  // Check if Bearer token exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, token) => {
      (async () => {
        if (err) {
          return next(
            new ErrorResponse("Not authorized to access this route", 401)
          );
        }

        const user = await User.findById(token.id);

        if (!user) {
          return next(new ErrorResponse("No user found with this id", 401));
        }
        req.user = user;
        next();
      })();
    });
  } catch (error) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
};
