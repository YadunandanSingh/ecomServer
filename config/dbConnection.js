// db.js
const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    const mongoURI = 'mongodb://127.0.0.1:27017/authLogin'; // Replace with your MongoDB URI
    await mongoose.connect(process.env.MONGOOSE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = dbConnection;