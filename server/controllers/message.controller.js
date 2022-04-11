const Message = require("../models/Message");

// GETS
// Get all messages by thread id
exports.getMessages = async (req, res, next) => {
  try {
    const message = await Message.find({
      message_thread_id: req.params.messageThreadId,
    });
    res.status(200).json(message);
  } catch (error) {
    next(error);
  }
};

// POSTS
// add new message
exports.addNewMessage = async (req, res, next) => {
  try {
    const newMessage = new Message(req.body);
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (error) {
    next(error);
  }
};

// DELETE
// Delete Message Created for testing purposes
exports.deleteMessage = async (req, res, next) => {
  try {
    await Message.deleteOne({ _id: req.params.messageThreadId });
    res
      .status(200)
      .json({ success: true, message: "Successfully Deleted Message" });
  } catch (error) {
    next(error);
  }
};
