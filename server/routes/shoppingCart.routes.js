const express = require("express");
const router = express.Router();
const {
  getShoppingCartByCartId,
  createNewShoppingCart,
  updateShoppingCart,
  deleteShoppingCart,
  addItemToCart,
  removeItemInCart,
  clearShoppingCart,
  returnCartWithFullProductAndStall,
} = require("../controllers/shoppingCart.controller");
const { protect } = require("../middleware/auth");

router.route("/").post(createNewShoppingCart);
router
  .route("/:cartid")
  .get(getShoppingCartByCartId)
  .put(updateShoppingCart)
  .delete(deleteShoppingCart);

router.route("/additem/:cartid").post(addItemToCart);
router.route("/removeitem/:cartid").delete(removeItemInCart);
router.route("/clearcart/:cartid").put(clearShoppingCart);
router
  .route("/processpurchase/:cartId")
  .post(protect, returnCartWithFullProductAndStall);
module.exports = router;
