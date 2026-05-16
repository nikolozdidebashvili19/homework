const mongoose = require("mongoose");
require("dotenv").config({ quiet: true });

const dbName = process.env.DB_NAME || "book";
const uri = process.env.MONGODB_URI || `mongodb://127.0.0.1:27017/${dbName}`;

let connectionPromise;

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(uri, {
        dbName,
        serverSelectionTimeoutMS: 5000,
      })
      .then(() => {
        console.log(`Connected to MongoDB database "${dbName}"`);
      })
      .catch((error) => {
        connectionPromise = undefined;

        if (error.message.includes("ECONNREFUSED")) {
          throw new Error(
            "MongoDB is not running. Start MongoDB on 127.0.0.1:27017 or set MONGODB_URI in backend/dav11/.env."
          );
        }

        throw error;
      });
  }

  return connectionPromise;
}

module.exports = connectDB;
