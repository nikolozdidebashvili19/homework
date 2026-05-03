const express = require("express");
const mongoose = require("mongoose");
const Director = require("./models/Director");
const Movie = require("./models/Movie");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/cinemaDB");

app.post("/directors", async (req, res) => {
  const director = new Director(req.body);
  await director.save();
  res.send(director);
});

app.get("/directors", async (req, res) => {
  const directors = await Director.find().populate("movies");
  res.send(directors);
});

app.post("/movies", async (req, res) => {
  const directorId = req.headers["director-id"];
  if (!directorId) {
    return res
      .status(400)
      .send({ message: "Director ID is required in headers" });
  }

  const movie = new Movie({
    ...req.body,
    director: directorId,
  });

  await movie.save();

  await Director.findByIdAndUpdate(directorId, {
    $push: { movies: movie._id },
  });

  res.send(movie);
});

app.get("/movies", async (req, res) => {
  const movies = await Movie.find().populate("director");
  res.send(movies);
});

app.delete("/movies/:id", async (req, res) => {
  await Movie.findByIdAndDelete(req.params.id);
  res.send({ message: "Movie deleted" });
});

app.listen(3000, () => console.log("Server is running on port 3000"));
