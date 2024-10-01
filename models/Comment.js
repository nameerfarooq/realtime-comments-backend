

const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  tokenAddress: {
    type: String, // Instead of ObjectId, now it's a string
    required: true,
    ref: "Token" // Reference to the Token model
  },
  username: String,
  text: String,
  likes: [String], // Array of user IDs (as strings) who liked the comment
  replies: [
    {
      username: String,
      text: String,
      likes: [String], // Array of user IDs (as strings) who liked the reply
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
