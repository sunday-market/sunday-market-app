const mongoose = require("mongoose");

const SubCategorySchema = new mongoose.Schema(
  {
    parent_category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [
        true,
        "You can't add a sub catagory without a parent category.",
      ],
    },
    sub_category_name: {
      type: String,
      required: [true, "You need to upload a sub catagory name."],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubCategory", SubCategorySchema);
