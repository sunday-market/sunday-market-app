const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  getUserOrders,
  createOrder,
} = require("../controllers/order.controllers");

router.route("/").get(getAllOrders).post(createOrder);
router.route("/:orderId").get(getOrderById);

router.route("/user/:userId").get(getUserOrders);

module.exports = router;
