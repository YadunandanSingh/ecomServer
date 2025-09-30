const express = require('express');
require('dotenv').config(); 
const dbConnection = require('./config/dbConnection'); 
const app = express();
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path');
const HerloSlide = require('./routes/HeroSlideRoutes')


const PORT = process.env.PORT || 8000;
const corsOptions = {
  origin: ["https://supermarket-rsrc.onrender.com"], // exact frontend URL
  credentials: true,
};

// Use express.json() middleware to parse JSON request bodies
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


// Connect to the database
dbConnection();

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Define routes
app.use('/user' ,require('./routes/userRoute'))
app.use('/slide' ,require('./routes/HeroSlideRoutes'))
app.use('/api' ,require('./routes/CategoryRoute'),require('./routes/ProductRoutes'))
app.use('/api/payment' ,require('./routes/Payment'))




// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});