const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoute');
const searchHotel = require('./routes/searchHotel');	
const flightSearch = require('./routes/flightRoute');
const hotelSearching = require('./routes/hotelSearching2');	
const chatRoutes = require('./routes/ChatRoute')
const app = express();


dotenv.config();

// Middleware
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true 
  }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', searchHotel);
app.use('/api', flightSearch);
app.use('/api', hotelSearching);
app.use('/api', chatRoutes);


// MongoDB Connection
mongoose
  .connect('mongodb://localhost:27017/NewBackDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error(err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));