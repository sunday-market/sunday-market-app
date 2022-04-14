const Category = require("../models/Category");
const Stall = require("../models/Stall");
const { SubCategory } = require("../models/SubCategory");
const mongoose = require("mongoose");
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

exports.getStallSubCategories = async (req, res, next) => {
  if (!req.params.stallId) {
    return next(new ErrorResponse("No stall id provided", 400));
  }

  await Stall.findById(req.params.stallId).then((result) => {
    if (!result) {
      return next(new ErrorResponse("Stall not found", 404));
    }

    Stall.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.params.stallId),
        },
      },
      {
        $match: {
          activated: true,
        },
      },
      {
        $lookup: {
          from: "subcategories",
          localField: "category",
          foreignField: "category_id",
          as: "stall_subcategories",
        },
      },
    ])
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((error) => {
        return next(error);
      });
  }).catch(error => {
    return next(error);
  });
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

exports.getSubCategoriesByCategoryId = async (req, res, next) => {
  const catId = await Category.findById(req.params.categoryId).then(
    (result) => {
      if (!result) {
        return next(new ErrorResponse("Category Id does not exist.", 404));
      }
    }
  );

  await SubCategory.aggregate([
    {
      $match: {
        category_id: mongoose.Types.ObjectId(req.params.categoryId),
      },
    },

  ])
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      return next(error);
    });
};

exports.getAllCategoriesWithSubCategories = async (req, res, next) => {
  console.log("Called the getAllCategoriesWithSubCategories controller ");
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
      console.log("got a result");
      res.status(200).json(result);
    })
    .catch((error) => {
      return next(error);
    });
};

exports.getCategoryName = async (req, res, next) => {
  await Category.findOne({ _id: req.params.categoryId })
    .then((result) => {
      if (!result) {
        res.status(404).send("Category not found");
      } else {
        res.status(200).send(result.category_name);
      }
    })
    .catch((error) => {
      return next(error);
    });
};
