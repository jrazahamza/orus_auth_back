const express = require('express');
const request = require('request');
const router = express.Router();

// Endpoint to search hotels
router.get('/search-hotels', (req, res) => {
  const options = {
    method: 'GET',
    url: 'https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels',
    qs: {
      dest_id: '-2092174', // New York destination ID
      search_type: 'CITY',
      arrival_date: req.query.arrival_date || '2024-12-31',
      departure_date: req.query.departure_date || '2025-01-03',
      adults: req.query.adults || '1',
      children_age: req.query.children_age || '0,17',
      room_qty: req.query.room_qty || '1',
      page_number: req.query.page_number || '1',
      units: req.query.units || 'metric',
      temperature_unit: req.query.temperature_unit || 'c',
      languagecode: req.query.languagecode || 'en-us',
      currency_code: req.query.currency_code || 'AED'
    },
    headers: {
      'x-rapidapi-key': 'afa5284807msh324588c60030c56p1fbdcfjsn61263f4bd5c9',
      'x-rapidapi-host': 'booking-com15.p.rapidapi.com'
    }
  };

  request(options, function (error, response, body) {
    if (error) {
      console.error('Error:', error);
      return res.status(500).send('Internal Server Error');
    }

    try {
      const hotels = JSON.parse(body);
      res.json(hotels);
    } catch (parseError) {
      console.error('Parsing Error:', parseError);
      res.status(500).send('Error parsing response');
    }
  });
});

// Endpoint to fetch hotel details by hotel_id
router.get('/hotel-details', (req, res) => {
  const hotelId = req.query.hotel_id; // Get hotel_id from query params
  if (!hotelId) {
    return res.status(400).send('Hotel ID is required');
  }

  const options = {
    method: 'GET',
    url: `https://booking-com15.p.rapidapi.com/api/v1/hotels/getHotelDetails`,
    qs: {
      hotel_id: hotelId,
    },
    headers: {
      'x-rapidapi-key': 'afa5284807msh324588c60030c56p1fbdcfjsn61263f4bd5c9',
      'x-rapidapi-host': 'booking-com15.p.rapidapi.com'
    }
  };

  request(options, function (error, response, body) {
    if (error) {
      console.error('Error:', error);
      return res.status(500).send('Internal Server Error');
    }

    try {
      const hotelDetails = JSON.parse(body);
      res.json(hotelDetails); // Send detailed information about the hotel
    } catch (parseError) {
      console.error('Parsing Error:', parseError);
      res.status(500).send('Error parsing response');
    }
  });
});

module.exports = router;
