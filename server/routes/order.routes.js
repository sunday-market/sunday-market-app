const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  getUserOrders,
  getStallOrders,
  createOrder,
} = require("../controllers/order.controllers");

const { protect } = require("../middleware/auth");

router.route("/").get(protect, getAllOrders).post(protect, createOrder);
router.route("/:orderId").get(protect, getOrderById);

router.route("/user/:userId").get(protect, getUserOrders);
router.route("/stall/:stallId").get(protect, getStallOrders);

module.exports = router;
