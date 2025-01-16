/** @format */

require("dotenv").config();
console.log(process.env);
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const commentRoutes = require("./routes/comments");
const tokenRoutes = require("./routes/tokens");

// Initialize app and server
const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/comments", commentRoutes);
app.use("/tokens", tokenRoutes);

// MongoDB  connectokens
mongoose
  .connect(process.env.MONGO_URI, {
    ssl: process.env.MONGO_SSL == "false" ? false : true || false,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
// Socket.io connection
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("comment", (comment) => {
    io.emit("comment", comment); // Broadcast comment to all clients
  });

  // Listen for new replies
  socket.on("reply", (reply) => {
    io.emit("reply", reply); // Broadcast reply to all clients
  });

  socket.on("like", (likeData) => {
    io.emit("like", likeData); // Broadcast like to all clients
  });

  socket.on("replyLike", (likeData) => {
    io.emit("replyLike", likeData); // Broadcast reply like to all clients
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
