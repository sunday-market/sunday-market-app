const express = require("express");
const router = express.Router();

const { Product } = require("../models/Product");

router.route("/").get(async (req, res, next) => {
  // - PRODUCT:
  // ---- Title         (product_name)
  // ---- Description   (product_description)
  // ---- Category      (null)
  // ---- SubCategory   (product_subcategory) [ObjectId]

  const { q } = req.query;

  const keys = [
    "product_name",
    "product_description",
    "category_name",
    "subcategory",
  ];

  const search = (data) => {
    return data.filter((item) => 
      keys.some((key) => item[key].toLowerCase().includes(q))
    );
  };


  await Product.aggregate([ 
    {
      $lookup: {
        from: "subcategories",
        localField: "product_subcategory",
        foreignField: "_id",
        as: "subcategories",
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [
            {
              $arrayElemAt: ["$subcategories", 0],
            },
            "$$ROOT",
          ],
        },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category_id",
        foreignField: "_id",
        as: "categories",
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [
            {
              $arrayElemAt: ["$categories", 0],
            },
            "$$ROOT",
          ],
        },
      },
    },
  ]).then((results) => {

    res.json(search(results));
  
  });
});

module.exports = router;
