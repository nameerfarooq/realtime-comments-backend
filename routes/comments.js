/** @format */

const express = require("express");
const mongoose = require("mongoose");
const Comment = require("../models/Comment");
const Token = require("../models/Token");
const router = express.Router();

// Get comments by tokenId
router.get("/:tokenDBId", async (req, res) => {
  const { tokenDBId } = req.params;

  try {
    const token = await Token.findOne({ tokenDBId });

    if (!token) {
      return res
        .status(400)
        .json({ message: "No token found with this token Database ID" });
    }

    const comments = await Comment.find({ tokenDBId }).sort({
      createdAt: 1,
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new comment
router.post("/", async (req, res) => {
  const { tokenDBId, username, text, creatorAddress } = req.body;
  try {
    let token = await Token.findOne({ tokenDBId });
    if (!token) {
      if (!creatorAddress) {
        return res.status(400).json({
          message:
            "Token does not exist, and creatorAddress is required to create it.",
        });
      }

      token = new Token({ tokenDBId, creatorAddress });
      await token.save();
    }
    const newComment = new Comment({ tokenDBId, username, text });
    const savedComment = await newComment.save();
    res.json(savedComment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a reply to a comment
router.post("/reply", async (req, res) => {
  try {
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
router.post("/like", async (req, res) => {
  const { commentId, username } = req.body;
  console.log("commentId :", commentId);
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    const likeIndex = comment.likes.indexOf(username);
    console.log("MY LIKE INDEX :", likeIndex);
    console.log("username :", username);
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
router.post("/reply/like", async (req, res) => {
  const { commentId, replyIndex, username } = req.body;
  console.log("commendID :", commentId);
  console.log("replyIndex :", replyIndex);
  console.log("username :", username);
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

// Get tokenDBIds of the most recent comments
router.get("/recent/comments", async (req, res) => {
  try {
    // Fetch the most recent comments, sorted by createdAt in descending order
    const recentComments = await Comment.find().sort({ createdAt: -1 }); // Most recent comments first

    // Extract unique tokenDBIds from the recent comments
    const tokenDBIds = [
      ...new Set(recentComments.map((comment) => comment.tokenDBId)),
    ];

    res.json(tokenDBIds);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
