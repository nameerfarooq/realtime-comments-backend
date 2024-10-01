// models/Token.js
const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  tokenName: { type: String, required: true },
  tokenAddress: { type: String, required: true },
  creatorAddress: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Token", tokenSchema);
