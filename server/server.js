const dotenv = require("dotenv");

const express = require("express");
const http = require("http");
const connectDB = require("./config/db");

// This is a test
dotenv.config();

// Connect to Database
connectDB();

// create app and server
const app = express();
app.use(express.json());

const server = http.createServer(app);
const port = process.env.PORT || 5000;

app.use("/api/auth", require("./routes/auth"));

// Start Listening to Server
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Handle Unknown Server Errors
process.on("unhandledRejection", (err, promise) => {
  console.log(`Server Error ${err}`);
  server.close(() => process.exit(1));
});

