const mongoose = require("mongoose");

const SubCategorySchema = new mongoose.Schema(
  {
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [
        true,
        "You can't add a sub catagory without a parent category.",
      ],
    },
    subcategory: {
      type: String,
      required: [true, "You need to upload a sub catagory name."],
    },
  },
  { timestamps: true }
);

const SubCategory = mongoose.model("SubCategory", SubCategorySchema);
module.exports = { SubCategory, SubCategorySchema };
