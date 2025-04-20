import axios from 'axios';
import Check from '../models/Check.js';

const GOOGLE_FACT_CHECK_API_URL = process.env.GOOGLE_FACT_CHECK_API_URL;
const API_KEY = process.env.API_KEY;

// Define the rating map for dynamic scoring
const ratingMap = {
  'True': 95,
  'Mostly True': 85,
  'Half True': 60,
  'Mostly False': 40,
  'False': 25,
  'Pants on Fire': 10,
  'Unverified': 50
};

export const checkText = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    console.log('Error: Text is required');
    return res.status(400).json({ error: 'Text is required' });
  }

  console.log('Received text for verification:', text);

  try {
    // Check for cached result
    const cached = await Check.findOne({ type: 'text', content: text });
    if (cached) {
      console.log('Returning cached result');
      return res.status(200).json({
        claims: [
          {
            text: cached.content,
            claimReview: [
              {
                textualRating: cached.result || 'No rating',
                url: cached.sources?.[0] || '',
                score: cached.score || 50, 
              },
            ],
          },
        ],
      });
    }

    // Call Google API
    const response = await axios.get(GOOGLE_FACT_CHECK_API_URL, {
      params: {
        query: text,
        key: API_KEY,
      },
    });

    const claims = response?.data?.claims || [];
    let result = 'Unverified';
    let score = 50; 
    let sources = [];
    const claimDate = new Date(); 

    if (claims.length > 0) {
      const review = claims[0]?.claimReview?.[0];
      result = review?.textualRating || 'Unverified';
      score = ratingMap[result] || 50;
      sources = claims[0]?.claimReview?.map(r => r.url) || [];
    }

    // Save to DB with claimDate
    await Check.create({
      type: 'text',
      content: text,
      result,
      score,
      sources,
      claimDate, 
    });

    // Respond in expected format
    return res.status(200).json({
      claims: [
        {
          text,
          claimReview: [
            {
              textualRating: result,
              url: sources[0] || '',
              score,
            },
          ],
        },
      ],
    });

  } catch (error) {
    console.error('Error during text check:', error.message);
    return res.status(500).json({ error: 'Failed to verify claim' });
  }
};

export const checkImage = async (req, res) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ error: 'Image URL is required' });
  }

  try {
    // Here you can implement an external API to process the image URL if needed.
    // For now, we're returning a static response for image checks.

    // Save a placeholder result for image verification
    const check = await Check.create({
      type: 'image',
      content: imageUrl,
      result: 'Image verification not supported yet.',
      score: 0,
      sources: [],
      claimDate: new Date(), 
    });

    return res.status(200).json(check);
  } catch (err) {
    console.error('Image check error:', err.message);
    return res.status(500).json({ error: 'Failed to process image' });
  }
};

export const getRecentChecks = async (req, res) => {
  try {
    // Retrieve the most recent checks
    const checks = await Check.find().sort({ createdAt: -1 }).limit(10); 
    res.status(200).json(checks);
  } catch (err) {
    console.error('Error retrieving recent checks:', err.message);
    res.status(500).json({ error: 'Failed to retrieve recent checks' });
  }
};
