const MessageThread = require("../models/MessageThread");

// GETS
// Get Message Threads of a User as reciever
exports.getMessageThreads = async (req, res, next) => {
  try {
    const messageThread = await MessageThread.find({
      message_members: { $in: [req.params.userId] },
    });
    res.status(200).json(messageThread);
  } catch (error) {
    return next(error);
  }
};

// POSTS
// Post New Message Thread
exports.addMessageThread = async (req, res, next) => {
  try {
    const newMessageThread = new MessageThread({
      stall_name: req.body.stall_name,
      message_members: [req.body.send_user, req.body.recieve_user],
    });
    const savedMessageThread = await newMessageThread.save();
    res.status(200).json(savedMessageThread);
  } catch (error) {
    return next(error);
  }
};

// DELETE - created for Unit Tests
exports.deleteMessageThread = async (req, res, next) => {
  try {
    await MessageThread.deleteOne({ _id: req.params.threadId });
    res
      .status(200)
      .json({ success: true, message: "Successully Deleted Message Thread" });
  } catch (error) {
    return next(error);
  }
};
