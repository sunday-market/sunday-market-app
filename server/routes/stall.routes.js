const express = require("express");
const router = express.Router();
const {
  getAllStalls,
  addNewStall,
  getMyStalls,
  getStallByID,
  updateStall,
  deleteStallByID,
} = require("../controllers/stall.controllers");

router.route("/stalls").get(getAllStalls).post(addNewStall);
router.route("/mystalls/:userid").get(getMyStalls);
router
  .route("/stalls/:stallid")
  .get(getStallByID)
  .put(updateStall)
  .delete(deleteStallByID);

module.exports = router;
