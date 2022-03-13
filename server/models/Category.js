const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    category_name: {
      type: String,
      required: [true, "You need to upload a catagory name."],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
