const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI || mongoURI === 'your_mongodb_atlas_connection_string') {
      console.warn('⚠️ MongoDB URI is not set.');
      return;
    }

    const conn = await mongoose.connect(mongoURI);

    console.log(
      `✅ MongoDB Atlas connected successfully: ${conn.connection.host}`
    );
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;