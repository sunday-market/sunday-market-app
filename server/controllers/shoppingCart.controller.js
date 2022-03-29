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
  console.log(cart);
  console.log(req.params.cartid);
  console.log("Im in the route");
  //Check if product already exists
  let exists = false;
  for (i = 0; i < cart.products_selected.length; i++) {
    console.log(`this line 52 ${cart.products_selected[i]}`);
    let product = cart.products_selected[i];
    console.log("did i make it");
    if (product.product_id.toString() === req.body._id) {
      exists = true;
      product.quantity++;
      break;
    }
  }
  let cartItem = {
    product_id: req.body._id,
    product_name: req.body.product_name,
    product_price: req.body.product_price,
    product_description: req.body.product_description,
  };
  console.log("did i make it 2");
  if (!exists) {
    cart.products_selected.push({ ...cartItem, quantity: 1 });
  }

  try {
    await cart.save();
    console.log("did i make it 3");
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

exports.clearShoppingCart = async (req, res, next) => {
  let cartid = req.params.cartid;

  try {
    // find cart
    const cart = (await ShoppingCart.find({ _id: cartid }))[0];
    // console.log(cart);
    const products_selected = cart.products_selected;
    // check length for products
    if (products_selected.length !== 0) {
      // loop through each product and take quantity and id append new quantity to the product
      products_selected.forEach(async (product) => {
        //console.log(product);
        let productId = product.product_id.toString();
        //console.log(productId);
        let qty = product.quantity;
        const updateProduct = await Product.findById({ _id: productId });
        //console.log(`before save ${updateProduct}`);
        updateProduct.quantity_in_stock += qty;
        updateProduct.save();
        // console.log(`after save ${updateProduct}`);
      });
    }
    cart.products_selected = [];
    cart.save();
    // return the cart
    res.status(200).json(cart);
  } catch (error) {
    next(error);
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

    if (product.product_id.toString() === req.body._id) {
      qty = product.quantity;
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
