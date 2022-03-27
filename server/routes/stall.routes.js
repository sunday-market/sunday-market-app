const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/stalls");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];

  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let upload = multer({ storage, fileFilter });

const {
  getAllStalls,
  addNewStall,
  getMyStalls,
  getStallByID,
  updateStall,
  deleteStallByID,
} = require("../controllers/stall.controllers");

router
  .route("/stalls")
  .get(getAllStalls)
  .post(protect, upload.single("image"), addNewStall);
router.route("/mystalls/:userid").get(protect, getMyStalls);
router
  .route("/stalls/:stallid")
  .get(getStallByID)
  .put(protect, upload.single("image"), updateStall)
  .delete(protect, deleteStallByID);

module.exports = router;
