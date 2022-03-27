const express = require("express");
const router = express.Router();

const { getAllCategory } = require("../controllers/category.controller");

router.route("/").get(getAllCategory);

module.exports = router;
