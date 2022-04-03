const express = require("express");
const router = express.Router();
const {
  createNewTransaction,
  getTransactionsByUserId,
  getTransactionById,
  getAllTransactions,
  updateTransaction,
} = require("../controllers/transaction.controller");
const { protect } = require("../middleware/auth");

router
  .route("/")
  .get(protect, getAllTransactions)
  .post(protect, createNewTransaction);
router.route("/:transactionId").get(protect, getTransactionById);
router.route("/customer/:userId").get(protect, getTransactionsByUserId);
router.route("/update/:transactionId").put(protect, updateTransaction);
module.exports = router;
