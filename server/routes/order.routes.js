const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  createOrder,
} = require("../controllers/order.controllers");

router.route("/").get(getAllOrders).post(createOrder);
router.route("/:orderId").get(getOrderById);

module.exports = router;
