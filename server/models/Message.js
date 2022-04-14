const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    message_thread_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MessageThread",
      required: [true, "You can not send a message, without a message thread ID"],
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
      required: [true, "You can not send a message without a send user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
