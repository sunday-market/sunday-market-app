const mongoose = require("mongoose");

const { OrderSchema } = require("./Order");

const TransactionSchema = new mongoose.Schema(
  {
    orders: [OrderSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);