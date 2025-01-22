const express = require('express');
const router = express.Router();
const axios = require('axios');



// API Route to fetch hotels
router.get('/hotels', async (req, res) => {
    try {
        
        const { city, checkin, checkout } = req.query;
        
      
        const apiUrl = 'https://distribution-xml.booking.com/json/bookings.getHotels';
        const apiKey = process.env.BOOKING_API_KEY;  

        const params = {
            city_ids: city,  // City ID to search
            checkin_date: checkin,  // Check-in date
            checkout_date: checkout,  // Checkout date
            currency: 'USD',  // Currency code
            language: 'en',  
        };

        // Make GET request to Booking.com API
        const response = await axios.get(apiUrl, {
            params,
            auth: {
                username: apiKey,  // API key authentication
                password: '',  // Blank password if needed
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching data from Booking.com' });
    }
});

module.exports = router;
