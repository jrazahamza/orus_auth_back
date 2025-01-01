// routes/hotelRoutes.js
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

router.get('/search', async (req, res) => {
  const { city, checkInDate, checkOutDate, guests } = req.query;

  // Validate the input parameters
  if (!city || !checkInDate || !checkOutDate || !guests) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  // Check for valid date format (YYYY-MM-DD)
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(checkInDate) || !datePattern.test(checkOutDate)) {
    return res.status(400).json({ message: "Invalid date format, expected YYYY-MM-DD" });
  }

  try {
    const response = await axios.get('https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels', {
      params: {
        city,
        checkInDate,
        checkOutDate,
        guests
      },
      headers: {
        'X-RapidAPI-Host': 'booking-com15.p.rapidapi.com',
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY
      }
    });

    // Return the response data
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching hotel data');
  }
});

module.exports = router;
