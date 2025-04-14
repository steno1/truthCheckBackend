import Feedback from '../models/Feedback.js';

export const submitFeedback = async (req, res) => {
  const { checkId, emoji, comment } = req.body;
  if (!emoji) return res.status(400).json({ error: 'Emoji is required' });

  const feedback = await Feedback.create({ checkId, emoji, comment });
  res.status(201).json(feedback);
};
