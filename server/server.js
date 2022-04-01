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
app.use("/api/product", require("./routes/product.routes"));
app.use("/api/order", require("./routes/order.routes"));
app.use("/api", require("./routes/stall.routes"));
app.use("/api/messages", require("./routes/message.routes"));
app.use("/api/messagethreads", require("./routes/messageThread.routes"));
app.use("/api/category", require("./routes/category.routes"));
app.use("/api/cart", require("./routes/shoppingCart.routes"));
app.use("/api/search", require("./routes/search.routes"));
app.use("/api/transaction", require("./routes/transaction.routes"));
app.use("/api/support", require("./routes/support.routes.js"));
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
