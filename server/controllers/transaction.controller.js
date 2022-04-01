const Transaction = require("../models/Transaction");
const ErrorResponse = require("../utils/errorResponse");

// GETS
// Get all transactions
exports.getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({});
    if (transactions?.length === 0) {
      return next(new ErrorResponse("No Transactions Exist"));
    }
    res.status(200).json(transactions);
  } catch (error) {
    return next(error);
  }
};

// Get transaction by transaction ID
exports.getTransactionById = async (req, res, next) => {
  if (!req.params.transactionId) {
    return next(
      new ErrorResponse(
        "No Transaction ID has been provided! You must supply a transaction ID for this route"
      )
    );
  }
  try {
    const transaction = await Transaction.findById(req.params.transactionId);
    if (!transaction) {
      return next(
        new ErrorResponse(
          `No Transaction Exists with the ID: ${req.params.transactionId}`
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
        "No User ID has been provided! You must supply a User ID for this route"
      )
    );
  }
  try {
    const transactions = await Transaction.find({
      customer_id: req.params.userId,
    });
    if (!transactions) {
      return next(new ErrorResponse(`No Transactions Exists for this user `));
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
