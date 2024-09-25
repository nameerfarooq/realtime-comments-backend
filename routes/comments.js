const express = require("express");
const mongoose = require("mongoose");
const Comment = require("../models/Comment");
const Token = require("../models/Token");
const router = express.Router();

// Get comments by tokenId
router.get("/:tokenId", async (req, res) => {
  const { tokenId } = req.params;

  try {
    let token;
    // Check if token exists, create a dummy one if not
    // Allow string tokenId for testing purposes
    if (mongoose.Types.ObjectId.isValid(tokenId)) {
      token = await Token.findById(tokenId);
    }
    // if (!token) {
    //   const newToken = new Token({
    //     title: "Dummy Token",
    //     content: "This is a dummy token",
    //   });
    //   token = await newToken.save();
    // }

    const comments = await Comment.find({ tokenId: token._id }).sort({
      createdAt: -1,
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new comment
router.post("/", async (req, res) => {
  const { tokenId, username, text } = req.body;
  const newComment = new Comment({ tokenId, username, text });
  try {
    const savedComment = await newComment.save();
    res.json(savedComment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Add a reply to a comment
router.post("/reply", async (req, res) => {
  try {
    console.log("commentId : ");
    console.log("commentId : ", req.body.commentId);
    const comment = await Comment.findById(req.body.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const newReply = {
      username: req.body.username,
      text: req.body.text,
    };

    comment.replies.push(newReply);
    await comment.save();

    res.json(newReply);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Like or unlike a comment
router.post('/like', async (req, res) => {
  const { commentId, username } = req.body;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    const likeIndex = comment.likes.indexOf(username);
    console.log("MY LIKE INDEX :",likeIndex)
    console.log("username :",username)
    if (likeIndex === -1) {
      // Like the comment
      comment.likes.push(username);
    } else {
      // Unlike the comment
      comment.likes.splice(likeIndex, 1);
    }

    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Like or unlike a reply
router.post('/reply/like', async (req, res) => {
  const { commentId, replyIndex, username } = req.body;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const reply = comment.replies[replyIndex];
    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }

    const likeIndex = reply.likes.indexOf(username);

    if (likeIndex === -1) {
      // Like the reply
      reply.likes.push(username);
    } else {
      // Unlike the reply
      reply.likes.splice(likeIndex, 1);
    }

    await comment.save();
    res.json(reply);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;
