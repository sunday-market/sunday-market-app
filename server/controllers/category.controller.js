const Category = require("../models/Category");
const ErrorResponse = require("../utils/errorResponse");

// GETS
// Get All categorys
exports.getAllCategory = async (req, res, next) => {
  try {
    const categorys = await Category.find({});
    if (categorys.length === 0) {
      return next(new ErrorResponse("No Categorys exist."));
    }
    res.status(200).json(categorys);
  } catch (error) {
    return next(error);
  }
};
