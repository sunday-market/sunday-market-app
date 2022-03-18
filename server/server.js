const dotenv = require("dotenv");
const express = require("express");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
const path = require("path");

// This is a test
dotenv.config();

// Connect to Database
connectDB();

// create app and server
const app = express();
app.use(express.json());

// public image location directory
app.use("/images", express.static(path.join(__dirname, "public/images")));

const port = process.env.PORT || 5000;

// routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user.routes"));
app.use("/api", require("./routes/stall.routes"));

app.use(errorHandler);

// Start Listening to Server
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Handle Unknown Server Errors
process.on("unhandledRejection", (err, promise) => {
  console.log(`Server Error ${err}`);
  server.close(() => process.exit(1));
});
