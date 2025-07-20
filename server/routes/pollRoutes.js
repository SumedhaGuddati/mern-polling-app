const express = require('express');
const router = express.Router();
const Poll = require('../models/Poll');

// Get all polls
router.get('/polls', async (req, res) => {
  const polls = await Poll.find();
  res.json(polls);
});

// Create a poll
router.post('/poll', async (req, res) => {
  const { question, options } = req.body;
  const poll = new Poll({
    question,
    options: options.map(text => ({ text })),
  });
  await poll.save();
  res.json(poll);
});

// Vote
router.post('/vote', async (req, res) => {
  const { pollId, optionIndex } = req.body;
  const poll = await Poll.findById(pollId);
  if (!poll || !poll.options[optionIndex]) {
    return res.status(400).json({ error: "Invalid vote" });
  }
  poll.options[optionIndex].votes += 1;
  await poll.save();
  res.json(poll);
});

module.exports = router;
