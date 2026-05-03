const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  year: Number,
  director: { type: mongoose.Schema.Types.ObjectId, ref: "Director" },
});

module.exports = mongoose.model("Movie", movieSchema);
