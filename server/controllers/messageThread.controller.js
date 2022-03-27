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
    console.log(error);
    return next(error);
  }
};
