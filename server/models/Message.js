const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    message_thread_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MessageThread",
    },
    message: {
      type: String,
      required: [true, "You can not send an empty message"],
    },
    message_read: {
      type: Boolean,
      required: true,
      default: false,
    },
    send_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
