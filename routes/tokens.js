const express = require("express");
const Token = require("../models/Token");
const router = express.Router();

router.post("/", async (req, res) => {
  const {  tokenDBId,creatorAddress } = req.body;
  try {
    const existingToken = await Token.findOne({ tokenDBId });
    if (existingToken) {
      return res
        .status(400)
        .json({ message: "Token with this address already exists" });
    }
    const newToken = new Token({tokenDBId,creatorAddress });
    const savedToken = await newToken.save();
    res.status(201).json(savedToken);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
