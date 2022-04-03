const mongoose = require("mongoose");

const { orderSchema } = require("./Order");

const TransactionSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "You must provide a customer id for a transaction"],
    },
    orders: [orderSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
