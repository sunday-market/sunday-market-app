const { Product } = require("../models/Product");
const { SubCategory } = require("../models/SubCategory");

const ErrorResponse = require("../utils/errorResponse");
const fs = require("fs");
const path = require("path");

const mongoose = require("mongoose");

// GETS
// Get all Products
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.aggregate([
      {
        $lookup: {
          from: "subcategories",
          localField: "product_subcategory",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                $arrayElemAt: ["$category", 0],
              },
              "$$ROOT",
            ],
          },
        },
      },
    ]);

    if (products.length === 0) {
      return next(new ErrorResponse("No products exist", 404));
    }
    res.status(200).json(products);
  } catch (error) {
    return next(error);
  }
};

// Get All Products where the stall is Active
exports.getAllActiveProducts = async (req, res, next) => {
  try {
    const products = await Product.find({}).populate({
      path: "product_stall",
      match: { activated: { $eq: true } },
    })

    if (products.length === 0) {
      return next(new ErrorResponse("No active product exists", 404));
    }

    res.status(200).json(
      products.filter((product) => {
        return product.product_stall !== null;
      })
    );
  } catch (error) {
    return next(error);
  }
};

// Get Product by productId
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.productid });
    if (!product) {
      return next(
        new ErrorResponse("No product exists with that product id", 404)
      );
    }
    res.status(200).json(product);
  } catch (error) {
    return next(error);
  }
};

exports.getProductsByCategory = async (req, res, next) => {
  await SubCategory.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "product_subcategory",
        as: "products",
      },
    },
    {
      $match: {
        category_id: mongoose.Types.ObjectId(req.params.categoryId),
      },
    },
  ])
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      return next(error);
    });
};

// Get all Products ascosiated to user
exports.getUserProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ product_user: req.params.userid });
    if (products.length === 0) {
      return next(
        new ErrorResponse("No products exist for specified user", 404)
      );
    }
    // console.log(`Products: ${products}`)
    res.status(200).json(products);
  } catch (error) {
    return next(error);
  }
};

// Get Stall Products
exports.getStallProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      product_stall: req.params.stallid,
    });

    if (products.length === 0) {
      return next(new ErrorResponse("No product exists for that stall", 404));
    }

    res.status(200).json(products);
  } catch (error) {
    return next(error);
  }
};

// POSTS
// Add Product
exports.addProduct = async (req, res, next) => {
  const product_name = req.body.product_name;
  const product_description = req.body.product_description;
  const product_subcategory = req.body.product_subcategory;
  const product_stall = req.body.product_stall;
  const product_user = req.body.product_user;
  const product_price = req.body.product_price;
  const quantity_in_stock = req.body.quantity_in_stock;
  const image = req.file ? req.file.filename : "noimage.jpg";

  const productData = {
    product_name,
    product_description,
    product_subcategory,
    product_stall,
    product_user,
    product_price,
    quantity_in_stock,
    image,
  };

  const newProduct = new Product(productData);

  try {
    await newProduct
      .save()
      .then(() => res.json({ success: true, data: productData }))
      .catch((err) => res.status(400).json("Error: " + err));
  } catch (error) {
    return next(error);
  }
};

// PUT
exports.updateProduct = async (req, res, next) => {
  const product_name = req.body.product_name;
  const product_description = req.body.product_description;
  const product_subcategory = req.body.product_subcategory;
  const product_stall = req.body.product_stall;
  const product_user = req.body.product_user;
  const product_price = req.body.product_price;
  const quantity_in_stock = req.body.quantity_in_stock;
  const image = req.file ? req.file.filename : "noimage.jpg";

  const productData = {
    product_name,
    product_description,
    product_subcategory,
    product_stall,
    product_user,
    product_price,
    quantity_in_stock,
    image,
  };

  const productId = req.params.productid;

  try {
    await Product.findByIdAndUpdate(productId, productData);
    res.status(200).json({
      success: true,
      message: `Product ID: ${productId} successfully updated.`,
      data: productData,
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

    if (req.body.image !== "noimage.jpg") {
      await fs.unlink(
        path.resolve(`../server/public/images/products/${req.body.image}`),
        (err) => {
          if (err) next(err);
        }
      );
    }

    res.status(200).json({
      success: true,
      message: `Successfully deleted product ${req.params.productid}`,
    });
  } catch (error) {
    next(error);
  }
};
