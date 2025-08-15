// config/db.js
const mongoose = require('mongoose');

module.exports = async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is not set in .env');

  console.log(uri); 

  try {
   
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      family: 4, 
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection failed', err);
    throw err;
  }
};
