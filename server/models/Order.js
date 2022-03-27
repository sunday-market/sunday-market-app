const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    transaction_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },
    stall: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Stall id is required"],
      },
      name: {
        type: String,
        required: [true, "Stall name is required"],
      },
      category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Please select a Stall Category"],
      },
      email: {
        type: String,
        required: [true, "Stall email is required"],
        match: [
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[0-9]{1,3}\.[0-9]{1,3}\.[0-9{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)[a-zA-Z]{2,}))$/,
          "Please provide a valid email",
        ],
      },
      phone: {
        type: String,
        required: [true, "Stall name is required"],
      },
      location: {
        type: String,
        required: [true, "Address is required"],
      },
      image: {
        type: String,
        default: "noimage.png",
      },
    },
    customer: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Customer id is required"],
      },
      name: {
        type: String,
        required: [true, "Customer name is required"],
      },
      email: {
        type: String,
        required: [true, "Customer email is required"],
        match: [
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[0-9]{1,3}\.[0-9]{1,3}\.[0-9{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)[a-zA-Z]{2,}))$/,
          "Please provide a valid email",
        ],
      },
    },
    products: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        name: {
          type: String,
          required: [true, "No product name provided"],
        },
        description: {
          type: String,
        },
        category: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "SubCategory",
          required: [true, "Category not supplied"],
        },
        price: {
          type: Number,
          required: [true, "Product price not supplied"],
        },
        quantity: {
          type: Number,
          required: [true, "Quantity must not be less than 0"],
          default: 0,
          match: [/^[1-9][0-9]*$/],
        },
      },
    ],
    order_notes: {
      type: String,
    },
    total_order_price: {
      type: Number,
      required: [true, "Total order price must be greater than 0"],
      default: 0,
      match: [/^[1-9][0-9]*$/],
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = { Order, orderSchema };
