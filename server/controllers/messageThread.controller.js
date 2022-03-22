const MessageThread = require("../models/MessageThread");

// GETS
// Get Message Threads of a User as reciever
exports.getMessageThreads = async (req, res, next) => {
  try {
    const messageThread = await MessageThread.find({
      $or: [
        { recieve_user: req.params.userId },
        { send_user: req.params.userId },
      ],
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
      send_user: req.body.senderId,
      recieve_user: req.body.recieverId,
    });
    const savedMessageThread = await newMessageThread.save();
    res.status(200).json(savedMessageThread);
  } catch (error) {
    return next(error);
  }
};
