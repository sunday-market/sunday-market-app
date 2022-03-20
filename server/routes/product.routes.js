const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getProductById,
  getUserProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.contollers");

router.route("/").get(getAllProducts).post(addProduct);

router
  .route("/:productid")
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

router.route("/user/:userid").get(getUserProducts);

module.exports = router;
