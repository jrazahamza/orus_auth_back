const express = require('express');
const request = require('request');
const router = express.Router();

router.get('/search-flights', (req, res) => {
  const options = {
    method: 'GET',
    url: 'https://booking-com15.p.rapidapi.com/api/v1/flights/searchFlights',
    qs: {
      fromId: req.query.fromId || 'BOM.AIRPORT',
      toId: req.query.toId || 'DEL.AIRPORT', 
      departDate: req.query.departDate || '2025-01-01',
      returnDate: req.query.returnDate || '2025-01-02',
      pageNo: req.query.pageNo || '1',
      adults: req.query.adults || '1',
      children: req.query.children || '0,17',
      sort: req.query.sort || 'BEST',
      cabinClass: req.query.cabinClass || 'ECONOMY',
      currency_code: req.query.currency_code || 'AED'
    },
    headers: {
      'x-rapidapi-key': 'afa5284807msh324588c60030c56p1fbdcfjsn61263f4bd5c9',
      'x-rapidapi-host': 'booking-com15.p.rapidapi.com'
    }
  };

  request(options, (error, response, body) => {
    if (error) {
      console.error('Error fetching flight data:', error);
      return res.status(500).json({ error: 'Error fetching flight data' });
    }

    try {
      const parsedBody = JSON.parse(body);
      console.log('Flight Data:', parsedBody);

    
      res.json(parsedBody.results || []);
    } catch (parseError) {
      console.error('Parsing Error:', parseError);
      res.status(500).json({ error: 'Error parsing flight data' });
    }
  });
});

module.exports = router;
