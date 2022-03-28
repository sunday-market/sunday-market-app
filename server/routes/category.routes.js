const express = require("express");
const router = express.Router();

const {
  getAllCategory,
  getAllSubCategories,
  getAllCategoriesWithSubCategories,
} = require("../controllers/category.controller");

router.route("/").get(getAllCategory);
router.route("/subcategories").get(getAllSubCategories);
router.route("/full").get(getAllCategoriesWithSubCategories);

module.exports = router;
