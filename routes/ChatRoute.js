const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();


let chatHistory = [];


router.post('/chat', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  console.log(`Using API Key: ${process.env.OPENAI_API_KEY}`);

  try {
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

    const message = response.data.choices[0].message.content;

  
    chatHistory.push({ prompt, response: message });

    res.json({ message });
  } catch (error) {
    console.error('Error from OpenAI API:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});


router.get('/chat-history', (req, res) => {
  res.json(chatHistory);
});

module.exports = router;
