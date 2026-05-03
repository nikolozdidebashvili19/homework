const mongoose = require("mongoose");

const directorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bio: String,
  movies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

module.exports = mongoose.model("Director", directorSchema);
