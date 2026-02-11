const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODBURL);

    console.log("MongoDB Connected");
    console.log(`Database Name: ${mongoose.connection.name}`);
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
  }
};

module.exports = connectDB;
