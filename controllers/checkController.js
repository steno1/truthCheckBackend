import axios from 'axios';
import Check from '../models/Check.js';

const GOOGLE_FACT_CHECK_API_URL = process.env.GOOGLE_FACT_CHECK_API_URL;
const API_KEY = process.env.API_KEY;


export const checkText = async (req, res) => {
  const { text } = req.body;
  if (!text) {
    console.log('Error: Text is required');
    return res.status(400).json({ error: 'Text is required' });
  }

  console.log('Received text for verification:', text);

  try {
    // Check for existing cached result
    const cached = await Check.findOne({ type: 'text', content: text });
    if (cached) {
      console.log('Returning cached result');
      return res.status(200).json(cached);
    }

    // Call Google Fact Check API
    const response = await axios.get(GOOGLE_FACT_CHECK_API_URL, {
      params: {
        query: text,
        key: API_KEY,
      },
    });

    console.log('Google API response:', response.data);

    const claims = response.data.claims;
    let result = 'No verdict available';
    let score = 50;
    let sources = [];

    if (claims && claims.length > 0) {
      const firstClaim = claims[0];
      const review = firstClaim.claimReview?.[0];
      result = review?.textRating || 'Unverified';
      score = result.toLowerCase().includes('true') ? 80 : 30;
      sources = firstClaim.claimReview.map(r => r.url);
    }

    // Save to DB
    const check = await Check.create({
      type: 'text',
      content: text,
      result,
      score,
      sources,
    });

    res.status(200).json(check);
  } catch (err) {
    console.error('Error verifying text:', err.message);
    res.status(500).json({ error: 'Failed to verify text' });
  }
};

export const checkImage = async (req, res) => {
  const { imageUrl } = req.body;
  if (!imageUrl) {
    return res.status(400).json({ error: 'Image URL is required' });
  }

  const check = await Check.create({
    type: 'image',
    content: imageUrl,
    result: 'Image verification not supported yet.',
    score: 0,
    sources: [],
  });

  res.status(200).json(check);
};

export const getRecentChecks = async (req, res) => {
  try {
    const checks = await Check.find().sort({ createdAt: -1 }).limit(10);
    res.status(200).json(checks);
  } catch (err) {
    console.error('Error retrieving recent checks:', err.message);
    res.status(500).json({ error: 'Failed to retrieve recent checks' });
  }
};
