const express = require("express");
const router = express.Router();
const {
  getShoppingCartByCartId,
  createNewShoppingCart,
  updateShoppingCart,
  deleteShoppingCart,
  addItemToCart,
  removeItemInCart,
} = require("../controllers/shoppingCart.controller");

router.route("/").post(createNewShoppingCart);
router
  .route("/:cartid")
  .get(getShoppingCartByCartId)
  .put(updateShoppingCart)
  .delete(deleteShoppingCart);

router.route("/additem/:cartid").post(addItemToCart);
router.route("/removeitem/:cartid").delete(removeItemInCart);
module.exports = router;
