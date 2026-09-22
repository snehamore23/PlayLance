const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI || mongoURI === 'your_mongodb_atlas_connection_string') {
      console.warn('⚠️  MongoDB URI is not set or is still the placeholder in server/.env.');
      console.warn('👉 Please update MONGO_URI in server/.env with your MongoDB Atlas connection string.');
      return;
    }

    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB Atlas connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
  }
};

module.exports = connectDB;
