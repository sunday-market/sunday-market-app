const mongoose = require("mongoose");

const StallSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "No user is provided for the stall"],
    },
    stallName: {
      type: String,
      required: [true, "Please provide a Stall Name"],
      unique: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Please select a Stall Category"],
    },
    activated: {
      type: Boolean,
      required: [true, "Please indicate if the stall is activated"],
      default: false,
    },
    description: {
      type: String,
    },
    image_url: {
      type: String,
      required: [true, "No image has been selected"],
      default: "noimage.png",
    },
    email: {
      type: String,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[0-9]{1,3}\.[0-9]{1,3}\.[0-9{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
    },
    city_location: {
      type: String,
      required: [
        true,
        "Please provide the City or Town the stall is located in",
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stall", StallSchema);

