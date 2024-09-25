const express = require("express");
const Token = require("../models/Token");
const router = express.Router();

router.post("/", async (req, res) => {
  const { title, content } = req.body;
  const newToken = new Token({ title, content });
  try {
    const savedToken = await newToken.save();
    res.json(savedToken);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
