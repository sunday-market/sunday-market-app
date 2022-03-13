const mongoose = require("mongoose");

const { productSchema } = require("./Product");
const { userSchema } = require("./User");

const OrderSchema = new mongoose.Schema(
  {
    products: [productSchema],
    total_order_price: {
      type: Number,
      required: [true, "Total order price must be greater than 0"],
      default: 0,
      match: [/^[1-9][0-9]*$/],
    },
    supplier: userSchema,
    order_notes: {
      type: String,
    },
    customer: userSchema,
    transaction_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = [OrderSchema];
