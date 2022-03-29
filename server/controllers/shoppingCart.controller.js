const ShoppingCart = require("../models/ShoppingCart");
const { Product } = require("../models/Product");
const ErrorResponse = require("../utils/errorResponse");

const mongoose = require("mongoose");

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
    const newCart = await ShoppingCart.create(new ShoppingCart());
    res.status(200).json({
      success: true,
      data: newCart,
      message: "Successfull in creating new shopping cart",
    });
  } catch (error) {
    next(error);
  }
};

exports.addItemToCart = async (req, res, next) => {
  if (!req.body) {
    return next(new ErrorResponse("No product supplied", 400));
  }

  if (!req.params.cartid) {
    return next(
      new ErrorResponse(
        "You haven't passed a cart id so unable to update shopping cart!",
        400
      )
    );
  }

  const cart = await ShoppingCart.findById(req.params.cartid);

  //Check if product already exists
  let exists = false;
  for (i = 0; i < cart.products_selected.length; i++) {
    let product = cart.products_selected[i];
    if (product._id.toString() === req.body._id) {
      exists = true;
      product.quantity++;
      break;
    }
  }

  if (!exists) {
    cart.products_selected.push({ ...req.body, quantity: 1 });
  }

  try {
    await cart.save();

    // Update Product Quantity In Stock
    const product = await Product.findById(req.body._id);
    product.quantity_in_stock -= 1;
    product.save();

    res.status(200).json({
      success: true,
      data: cart,
      message: "Shopping cart successfully updated",
    });
  } catch (error) {
    return next(error);
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
    await ShoppingCart.findByIdAndUpdate(cartid, req.body);
    const updatedShoppingCart = await ShoppingCart.find({ _id: cartid });
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

exports.removeItemInCart = async (req, res, next) => {
  if (!req.body) {
    return next(new ErrorResponse("No product supplied", 400));
  }

  if (!req.params.cartid) {
    return next(
      new ErrorResponse(
        "You haven't passed a cart id so unable to update shopping cart!",
        400
      )
    );
  }

  const cart = await ShoppingCart.findById(req.params.cartid);

  // Get product index
  let i = 0;
  let qty = 0;
  for (; i < cart.products_selected.length; i++) {
    let product = cart.products_selected[i];
    console.log("the product is: ", product);

    if (product._id.toString() === req.body._id) {
      console.log("Product Found!");
      qty = product.quantity;
      console.log("current qty = ", qty);
      break;
    }
  }

  if (qty === 1) {
    cart.products_selected.splice(i, 1);
  } else {
    cart.products_selected[i].quantity--;
  }

  try {
    cart.save();

    // Update Product Quantity In Stock
    const product = await Product.findById(req.body._id);
    product.quantity_in_stock += 1;
    product.save();

    res.status(200).json({
      success: true,
      data: cart,
      message: "Shopping cart successfully updated",
    });
  } catch (error) {
    return next(error);
  }
};
