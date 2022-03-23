const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

const {
  getAllStalls,
  addNewStall,
  getMyStalls,
  getStallByID,
  updateStall,
  deleteStallByID,
} = require("../controllers/stall.controllers");

router.route("/stalls").get(getAllStalls).post(protect, addNewStall);
router.route("/mystalls/:userid").get(protect, getMyStalls);
router
  .route("/stalls/:stallid")
  .get(getStallByID)
  .put(protect, updateStall)
  .delete(protect, deleteStallByID);

module.exports = router;
