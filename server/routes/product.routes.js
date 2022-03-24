const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const { protect } = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/products");
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
  getAllProducts,
  getProductById,
  getUserProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.contollers");

router
  .route("/")
  .get(getAllProducts)
  .post(protect, upload.single("image"), addProduct);

router
  .route("/:productid")
  .get(getProductById)
  .put(protect, upload.single("image"), updateProduct)
  .delete(protect, deleteProduct);

router.route("/user/:userid").get(protect, getUserProducts);

module.exports = router;
