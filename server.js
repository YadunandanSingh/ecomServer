const express = require('express');
require('dotenv').config(); 
const dbConnection2 = require('./config/dbConnection'); 
const app = express();
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path');
const HerloSlide = require('./routes/HeroSlideRoutes')


const PORT = process.env.PORT || 8000;
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true, // This is important if you're using cookies or sessions
};

// Use express.json() middleware to parse JSON request bodies
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


let isConnected = false;
  async function dbConnection() {
    try {
      await mongoose.connect(process.env.MONGOOSE_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      isConnected = true;
      console.log('MongoDB connected successfully!');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      
    }
  }

   app.use((req, res, next) => {
    if (!isConnected) {
      dbConnection();
      console.log('Database connection established');
    }
    next();
  });

// Connect to the database
// dbConnection();

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Define routes
app.use('/user' ,require('./routes/userRoute'))
app.use('/slide' ,require('./routes/HeroSlideRoutes'))
app.use('/api' ,require('./routes/CategoryRoute'),require('./routes/ProductRoutes'))
app.use('/api/payment' ,require('./routes/Payment'))




// Start the server
// app.listen(PORT, () => {
//   console.log(`Server is listening on http://localhost:${PORT}`);
// });

module.exports = app;