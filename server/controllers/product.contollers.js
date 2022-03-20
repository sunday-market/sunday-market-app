const { Product } = require("../models/Product");
const ErrorResponse = require("../utils/errorResponse");

// GETS
// Get all Products
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    if (products.length === 0) {
      return next(new ErrorResponse("No products exist"));
    }
    res.status(200).json(products);
  } catch (error) {
    return next(error);
  }
};

// Get Product by productId
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.productid });
    if (!product) {
      return next(new ErrorResponse("No product exists with that product id"));
    }
    res.status(200).json(product);
  } catch (error) {
    return next(error);
  }
};

// Get all Products ascosiated to user
exports.getUserProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ _id: req.params.userid });
    if (products.length === 0) {
      return next(new ErrorResponse("No products exist for specified user"));
    }
    res.status(200).json(products);
  } catch (error) {
    return next(error);
  }
};

// POSTS
// Add Product
exports.addProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return next(error);
  }
};

// PUT
exports.updateProduct = async (req, res, next) => {
  const productId = req.params.productid;
  const data = req.body;

  if (Object.keys(data).length === 0) {
    res.status(400).json({
      success: false,
      message: `No product data supplied`,
    });
  }

  try {
    await Product.findByIdAndUpdate(productId, data);
    res.status(200).json({
      success: true,
      message: `Product ID: ${productId} successfully updated.`,
      data: data,
    });
  } catch (error) {
    return next(error);
  }
};

// DELETE
// delete Product
exports.deleteProduct = async (req, res, next) => {
  try {
    await Product.deleteOne({ _id: req.params.productid });
    res.status(200).json({
      success: true,
      message: `Successfully deleted product ${req.params.productid}`,
    });
  } catch (error) {
    next(error);
  }
};
