const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const commentRoutes = require("./routes/comments");

// Initialize app and server
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use("/comments", commentRoutes);

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/commentsDB")
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
  
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
