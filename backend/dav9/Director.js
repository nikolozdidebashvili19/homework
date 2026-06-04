const mongoose = require("mongoose");

const directorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  bio: String,
  movies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

module.exports = mongoose.model("Director", directorSchema);