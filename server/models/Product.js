const mongoose = require("mongoose");
const { StallSchema } = require("./Stall");

const ProductSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: [true, "No product name provided"],
    },
    product_description: {
      type: String,
    },
    product_stall: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stall",
      required: [true, "Stall must be supplied"],
    },
    product_price: {
      type: Number,
      required: [true, "Product price not supplied"],
    },
    quantity_in_stock: {
      type: Number,
      required: [true, "Quantity must not be less than 0"],
      default: 0,
      match: [/^[1-9][0-9]*$/],
    },
    image: {
      type: String,
      default:
        "https://socialistmodernism.com/wp-content/uploads/2017/07/placeholder-image.png",
    },
  },
  { timestamps: true }
);
const Product = mongoose.model("Product", ProductSchema);
module.exports = { Product, ProductSchema };
