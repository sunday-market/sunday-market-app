const mongoose = require("mongoose");

const MessageThreadSchema = new mongoose.Schema(
  {
    send_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "You need a send user."],
    },

    recieve_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "You need a recieve user."],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MessageThread", MessageThreadSchema);
