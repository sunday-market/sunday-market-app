const express = require("express");
const router = express.Router();
const {
  createNewTransaction,
  getTransactionsByUserId,
  getTransactionById,
  getAllTransactions,
} = require("../controllers/transaction.controller");
const { protect } = require("../middleware/auth");

router.route("/").get(getAllTransactions).post(createNewTransaction);
router.route("/:transactionId").get(getTransactionById);
router.route("/customer/:userId").get(getTransactionsByUserId);

module.exports = router;
