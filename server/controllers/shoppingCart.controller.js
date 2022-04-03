const ShoppingCart = require("../models/ShoppingCart");
const { Product } = require("../models/Product");
const Transaction = require("../models/Transaction");
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
  if (!exists) {
    cart.products_selected.push({ ...cartItem, quantity: 1 });
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

exports.clearShoppingCart = async (req, res, next) => {
  let cartid = req.params.cartid;

  try {
    // find cart
    const cart = (await ShoppingCart.find({ _id: cartid }))[0];
    const products_selected = cart.products_selected;
    // check length for products
    if (products_selected.length !== 0) {
      // loop through each product and take quantity and id append new quantity to the product
      products_selected.forEach(async (product) => {
        let productId = product.product_id.toString();
        let qty = product.quantity;
        const updateProduct = await Product.findById({ _id: productId });
        updateProduct.quantity_in_stock += qty;
        updateProduct.save();
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

exports.returnCartWithFullProductAndStall = async (req, res, next) => {
  if (!req.body || !req.params.cartId) {
    // check if params and body has been passed
    return next(
      new ErrorResponse(
        "You Must Provide A Cart ID or Cart Contents to use this route"
      )
    );
  }
  // check cart exists and allocate to memory for aggregation
  try {
    let cart = await ShoppingCart.findById(req.params.cartId);
    if (!cart) {
      return next(new ErrorResponse("Cart Doesn't Exist? Try Again"));
    }

    try {
      // retrieve product details associated with the cart
      const cartWithProductsAndStalls = await ShoppingCart.aggregate([
        {
          $match: {
            _id: cart._id,
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "products_selected.product_id",
            foreignField: "_id",
            as: "products",
          },
        },
        {
          $lookup: {
            from: "stalls",
            localField: "products.product_stall",
            foreignField: "_id",
            as: "stalls",
          },
        },
      ]);
      console.log(cartWithProductsAndStalls);
      return res.status(200).json({
        success: true,
        data: cartWithProductsAndStalls,
      });
    } catch (error) {
      return next(error);
    }
  } catch (error) {
    return next(error);
  }
};

// loop through and delete all unused carts function
async function clearOldCarts() {
  console.log("Clensing Database started");
  const today = new Date();
  const expiryTime = new Date(today.getTime() - 30 * 60000);
  const expiredCarts = await ShoppingCart.aggregate([
    {
      $match: {
        updatedAt: {
          $lte: expiryTime,
        },
      },
    },
  ]);
  expiredCarts.forEach(async (cart) => {
    const products_selected = cart.products_selected;
    // check length for products
    if (products_selected.length !== 0) {
      // loop through each product and take quantity and id append new quantity to the product
      products_selected.forEach(async (product) => {
        let productId = product.product_id.toString();
        let qty = product.quantity;
        const updateProduct = await Product.findById({ _id: productId });
        updateProduct.quantity_in_stock += qty;
        updateProduct.save();
      });
    }
    // delete cart
    await ShoppingCart.deleteOne({ _id: cart._id });
  });
}
// fires every 35mins
setInterval(clearOldCarts, 2100000);
