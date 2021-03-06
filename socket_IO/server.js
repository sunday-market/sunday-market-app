const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

//connected users
let users = [];

// add user
const addUser = (userId, socketId) => {
  //console.log(`This is socket ID: ${socketId}`);
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });

  //console.log(users);
};

// remove user
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

// get user
const getUser = (userId) => {
  //console.log(users);
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  // someone has connected to the socket
  console.log("Someone has connected to the instant chat service");

  // add userId and socketId to the user array
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    //send back the new user array
    io.emit("getUsers", users);
  });

  // send and get message
  socket.on(
    "sendMessage",
    ({ senderId, recieverId, sentMessage, message_thread_id }) => {
      //console.log(recieverId);
      const user = getUser(recieverId);
      //console.log(user);
      io.to(user?.socketId).emit("getMessage", {
        senderId,
        sentMessage,
        message_thread_id,
      });
      //console.log("SENT MESSAGE");
    }
  );

  // user has disconnected from the instant messaging service
  socket.on("disconnect", () => {
    console.log("a user has disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
