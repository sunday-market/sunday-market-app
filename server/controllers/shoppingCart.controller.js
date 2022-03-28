const ShoppingCart = require("../models/ShoppingCart");
const ErrorResponse = require("../utils/errorResponse");

// GETS
// get all items in shopping cart by cart id
exports.getShoppingCartByCartId = async (req, res, next) => {
  try {
    const shoppingCart = await ShoppingCart.find({ _id: req.params.cartid });
    res.status(200).json(shoppingCart);
  } catch (error) {
    next(error);
  }
};

// POSTS
// post new shopping cart
exports.createNewShoppingCart = async (req, res, next) => {
  try {
    const newCart = new ShoppingCart();
    res.status(200).json({
      success: true,
      data: newCart,
      message: "Successfull in creating new shopping cart",
    });
  } catch (error) {
    next(error);
  }
};

// PUTS
// Update cart content
exports.updateShoppingCart = async (req, res, next) => {
  let cartid;
  if (req.params.cartid) {
    cartid = req.params.cartid;
  } else {
    return next(
      new ErrorResponse(
        "You haven't passed a cart id so unable to update shopping cart!"
      )
    );
  }

  try {
    const updatedShoppingCart = await ShoppingCart.findByIdAndUpdate(
      cartid,
      req.body
    );
    res.status(200).json({
      success: true,
      data: updatedShoppingCart,
      message: "Shopping cart successfully updated",
    });
  } catch (error) {
    return next(error);
  }
};
// DELETE
exports.deleteShoppingCart = async (req, res, next) => {
  let cartid;
  if (req.params.cartid) {
    cartid = req.params.cartid;
  } else {
    return next(
      new ErrorResponse(
        "You haven't passed a cart id so unable to update shopping cart!"
      )
    );
  }
  try {
    await ShoppingCart.deleteOne({ _id: cartid });
    res.status(200).json({
      success: true,
      message: `Successfully deleted shopping cart ID: ${cartid}`,
    });
  } catch (error) {
    next(error);
  }
};
