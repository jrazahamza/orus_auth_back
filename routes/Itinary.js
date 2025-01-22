const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();
router.post('/chat-itinary', async (req, res) => {
  const { companion, activities, personality, travelMonth } = req.body;

 
  if (!companion || !activities || !personality || !travelMonth) {
    return res.status(400).json({
      error: 'All fields are required: companion, activities, personality, travelMonth.',
    });
  }

  try {

    const prompt = `
You are a travel assistant. Based on the user's preferences, generate a detailed travel itinerary. Here are the inputs:
1. Companion: ${companion}.
2. Activities: ${activities.join(', ')}.
3. Personality: ${personality}.
4. Preferred Travel Month: ${travelMonth}.

Create a personalized itinerary including:
- Suggested destinations for the given month.
- Daily activities (morning, afternoon, evening).
- Accommodation and food recommendations.
- A description of how this itinerary suits the personality.

Format the response as a JSON object with keys:
- "itinerary" (array of day details),
- "accommodation" (array of hotel suggestions),
- "food" (array of recommended restaurants or cuisines),
- "alignment" (description of how this suits the personality).
    `;


    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const itineraryResponse = JSON.parse(response.data.choices[0].message.content);
    res.json(itineraryResponse);
  } catch (error) {
    console.error('Error generating itinerary:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to generate itinerary. Please try again later.' });
  }
});

module.exports = router;
