const mongoose = require("mongoose");
const { modelName } = require("./MessageThread");
const Schema = mongoose.Schema;

const ShoppingCartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    products_selected: [
      {
        product_id: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        product_name: {
          type: String,
        },
        product_price: {
          type: Number,
        },
        product_description: {
          type: String,
        },
        quantity: {
          type: Number,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ShoppingCart", ShoppingCartSchema);
