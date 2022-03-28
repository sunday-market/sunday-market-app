const express = require("express");
const router = express.Router();
const {
  getShoppingCartByCartId,
  createNewShoppingCart,
  updateShoppingCart,
  deleteShoppingCart,
} = require("../controllers/shoppingCart.controller");

router.route("/").post(createNewShoppingCart);
router
  .route("/:cartid")
  .get(getShoppingCartByCartId)
  .put(updateShoppingCart)
  .deleteShoppingCart(deleteShoppingCart);

module.exports = router;
