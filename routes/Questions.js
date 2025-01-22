const express = require('express');
const { OpenAI } = require('openai');
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

const generateDynamicPrompt = async (answers) => {
  const {  personality, activities, companion, } = answers;
  const prompt = `
    You are a travel advisor helping a user create a personalized itinerary. 
    The user has provided the following information:

    - Personality: ${personality}
    - Will you be traveling with a companion?: ${companion}
    - Activities they'd like to include: ${activities}


    Based on this, generate a detailed 5-day travel itinerary for the user, offering suggestions on where to go, what to do, and how to maximize their time. Be detailed and tailor it to their preferences. Avoid generic suggestions.
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are a helpful travel advisor.' },
      { role: 'user', content: prompt },
    ],
  });

  return response.choices[0].message.content;
};

router.post('/questions', async (req, res) => {
  const {  personality, activities, companion, } = req.body;


  if ( !personality || !activities || !companion ) {
    return res.status(400).send('Missing information! Please provide all answers.');
  }

  try {

    const itinerary = await generateDynamicPrompt({  personality, activities, companion });
    res.send(itinerary); 
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating itinerary. Please try again later.');
  }
});

module.exports = router;
