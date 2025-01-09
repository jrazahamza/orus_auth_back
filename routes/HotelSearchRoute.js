const express = require("express");
const axios = require("axios"); 
const router = express.Router();


router.get("/hotel-offers", async (req, res) => {
  const { hotelIds, adults, checkInDate, roomQuantity, paymentPolicy, bestRateOnly } = req.query;

 
  if (!hotelIds || !adults || !checkInDate || !roomQuantity) {
    return res.status(400).json({
      error: "Missing required query parameters (hotelIds, adults, checkInDate, roomQuantity).",
    });
  }

  const apiUrl = `https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds=${hotelIds}&adults=${adults}&checkInDate=${checkInDate}&roomQuantity=${roomQuantity}&paymentPolicy=${paymentPolicy || "NONE"}&bestRateOnly=${bestRateOnly || "true"}`;

  try {

    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer WFRem5TVakrkZ0fDCN1AhJGAmsMA`,
      },
    });

 
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching hotel offers:", error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || "An error occurred while fetching hotel offers.",
    });
  }
});

module.exports = router;


