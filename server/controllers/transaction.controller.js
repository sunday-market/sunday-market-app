const Transaction = require("../models/Transaction");
const ErrorResponse = require("../utils/errorResponse");

// GETS
// Get all transactions
exports.getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({});
    if (transactions?.length === 0) {
      return next(new ErrorResponse("No Transactions Exist", 404));
    }
    res.status(200).json(transactions);
  } catch (error) {
    return next(error);
  }
};

// Get transaction by transaction ID
exports.getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.transactionId);
    if (!transaction) {
      return next(
        new ErrorResponse(
          `No Transaction Exists with the ID: ${req.params.transactionId}`,
          404
        )
      );
    }
    res.status(200).json(transaction);
  } catch (error) {
    return next(error);
  }
};

// Get transactions by user id
exports.getTransactionsByUserId = async (req, res, next) => {
  if (!req.params.userId) {
    return next(
      new ErrorResponse(
        "No User ID has been provided! You must supply a User ID for this route",
        400
      )
    );
  }
  try {
    const transactions = await Transaction.find({
      customer_id: req.params.userId,
    });
    if (transactions.length === 0) {
      return next(
        new ErrorResponse(`No Transactions Exists for this user `, 404)
      );
    }
    res.status(200).json(transactions);
  } catch (error) {
    return next(error);
  }
};

// POSTS
// Post new Transaction
exports.createNewTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.create(req.body);
    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    return next(error);
  }
};

// PUTS
// Update transaction to hold the order data
exports.updateTransaction = async (req, res, next) => {
  // check transaction exists
  let transactionId;
  if (req.params.transactionId) {
    transactionId = req.params.transactionId;
  } else {
    return next(
      new ErrorResponse("You haven't provided a transaction ID", 400)
    );
  }

  try {
    await Transaction.findByIdAndUpdate(transactionId, req.body);
    const updatedTransaction = await Transaction.findById(transactionId);
    res.status(200).json({
      success: true,
      data: updatedTransaction,
      message: "Transaction Successfully Updated",
    });
  } catch (error) {
    return next(error);
  }
};

// DELETE
// delete control for testing purposes
exports.deleteTransaction = async (req, res, next) => {
  try {
    await Transaction.deleteOne({ _id: req.params.transactionId });
    res
      .status(200)
      .json({ success: true, message: "Successfully Delete Transaction" });
  } catch (error) {
    return next(error);
  }
};
