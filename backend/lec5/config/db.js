const mongoose = require("mongoose");
require("dotenv").config();

module.exports = async () => {
  try {
   
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (e) {
    console.error("❌ Could not connect to MongoDB:", e.message);
    process.exit(1); 
  }
};
