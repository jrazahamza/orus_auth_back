// server.js (Backend)

const express = require('express');
const axios = require('axios');
const router = express.Router();


// Flight offers route
router.get('/flight-offers', async (req, res) => {
  const { originLocationCode, destinationLocationCode, departureDate, adults, nonStop, max } = req.query;

  if (!originLocationCode || !destinationLocationCode || !departureDate || !adults) {
    return res.status(400).json({
      error: 'Missing required query parameters (originLocationCode, destinationLocationCode, departureDate, adults).',
    });
  }

  const apiUrl = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${originLocationCode}&destinationLocationCode=${destinationLocationCode}&departureDate=${departureDate}&adults=${adults}&nonStop=${nonStop || 'false'}&max=${max || '250'}`;

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer VH1pLHm6KiDOSWOHek9ciorS3lyH`,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching flight offers:', error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || 'An error occurred while fetching flight offers.',
    });
  }
});

// Start the server
   module.exports = router