const express = require("express");
const router = express.Router();
const {
  GetAllStalls,
  AddNewStall,
  GetMyStalls,
  GetStallByID,
  UpdateStall,
  DeleteStallByID,
} = require("../controllers/stall.controllers");

router.route("/stalls").get(GetAllStalls).post(AddNewStall);
router.route("/mystalls/:userid").get(GetMyStalls);
router
  .route("/stalls/:stallid")
  .get(GetStallByID)
  .put(UpdateStall)
  .delete(DeleteStallByID);

module.exports = router;
