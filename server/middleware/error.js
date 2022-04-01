const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, erq, res, next) => {
  let error = { ...err };

  error.message = err.message;

  // 11000 mongoose duplicate error key
  if (err.code === 11000) {
    const message = "Duplicate Field Value";
    error = new ErrorResponse(message, 400);
  }

  // mongoose validation error
  if (err.name == "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  console.log(`(${err.statusCode}) Server Error: `, err.message);

  res.status(error.statusCode || 500).json({
    success: false,
    error:
      `(${error.statusCode}) Server Error: ${error.message}` || "Server Error",
  });
};

module.exports = errorHandler;
