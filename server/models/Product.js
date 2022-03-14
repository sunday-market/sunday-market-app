const mongoose = require("mongoose");
const { StallSchema } = require("./Stall");

const ProductSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.ObjectId,
      required: [true, "No product ID has been provided"],
    },
    product_name: {
      type: String,
      required: [true, "No product name provided"],
    },
    product_price: {
      type: Number,
      required: [true, "Product price not supplied"],
      default: 0,
    },
    product_description: {
      type: String,
    },
    product_stall: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stall",
    },
    quantity: {
      type: Number,
      required: [true, "Quantity must be greater than 0"],
      default: 0,
      match: [/^[1-9][0-9]*$/],
    },
    item_total_price: {
      type: Number,
      required: [true, "Total item price must be greater than 0"],
      default: 0,
      match: [/^[1-9][0-9]*$/],
    },
  },
  { timestamps: true }
);

module.export = mongoose.model("Product", ProductSchema);
