const { default: mongoose } = require("mongoose");
require("dotenv").config();

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected successfully");
  } catch (e) {
    console.log("could not connect mongodb", e);
  }
};