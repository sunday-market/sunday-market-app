const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  getUserOrders,
  getStallOrders,
  getReceivedOrders,
  createOrder,
  deleteOrderById
} = require("../controllers/order.controllers");

const { protect } = require("../middleware/auth");

router.route("/").get(protect, getAllOrders).post(protect, createOrder);
router.route("/:orderId").get(protect, getOrderById).delete(protect, deleteOrderById);

router.route("/user/:userId").get(protect, getUserOrders);
router.route("/stall/:stallId").get(protect, getStallOrders);
router.route("/received/:userId").get(protect, getReceivedOrders);

router.route("/");

module.exports = router;
