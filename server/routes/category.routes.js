const express = require("express");
const router = express.Router();

const {
  getAllCategory,
  getAllSubCategories,
  getSubCategoriesByCategoryId,
  getStallSubCategories,
  getAllCategoriesWithSubCategories,
  getCategoryName,
} = require("../controllers/category.controller");

router.route("/").get(getAllCategory);
router.route("/:categoryId").get(getSubCategoriesByCategoryId);
router.route("/stall/subcategories/:stallId").get(getStallSubCategories);
router.route("/subcategories").get(getAllSubCategories);
// router.route("/full").get(getAllCategoriesWithSubCategories);
router.route("/get/:categoryId").get(getCategoryName);

module.exports = router;
