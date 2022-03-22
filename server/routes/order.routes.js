const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  getUserOrders,
  getStallOrders,
  createOrder,
} = require("../controllers/order.controllers");

router.route("/").get(getAllOrders).post(createOrder);
router.route("/:orderId").get(getOrderById);

router.route("/user/:userId").get(getUserOrders);
router.route("/stall/:stallId").get(getStallOrders);

module.exports = router;
