const mongoose = require("mongoose");

const MessageThreadSchema = new mongoose.Schema(
  {
    stall_name: {
      type: String,
    },
    message_members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "You need a send user."],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("MessageThread", MessageThreadSchema);
