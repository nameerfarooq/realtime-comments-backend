// const mongoose = require("mongoose");

// const commentSchema = new mongoose.Schema({
//   tokenId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: "Token"
//   },
//   username: String,
//   text: String,
//   replies: [
//     {
//       username: String,
//       text: String,
//       createdAt: {
//         type: Date,
//         default: Date.now,
//       },
//     },
//   ],
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const Comment = mongoose.model("Comment", commentSchema);
// module.exports = Comment;


const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  tokenId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Token"
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
