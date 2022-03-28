const Category = require("../models/Category");
const { SubCategory } = require("../models/SubCategory");

const ErrorResponse = require("../utils/errorResponse");

// GETS
// Get All categorys
exports.getAllCategory = async (req, res, next) => {
  try {
    const categorys = await Category.find({});
    if (categorys.length === 0) {
      return next(new ErrorResponse("No Categorys exist.", 404));
    }
    res.status(200).json(categorys);
  } catch (error) {
    return next(error);
  }
};

// Get All Sub Categories
exports.getAllSubCategories = async (req, res, next) => {
  await SubCategory.find()
    .then((categories) => {
      if (categories.length === 0) {
        return next(new ErrorResponse("No Categorys exist.", 404));
      }

      res.status(200).json(categories);
    })
    .catch((error) => {
      return next(error);
    });
};

exports.getAllCategoriesWithSubCategories = async (req, res, next) => {
  await Category.aggregate([
    {
      $lookup: {
        from: "subcategories",
        localField: "_id",
        foreignField: "category_id",
        as: "subcategories",
      },
    },
  ])
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      return next(error);
    });
};
