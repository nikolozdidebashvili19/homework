const express = require("express");
const mongoose = require("mongoose");
const { z } = require("zod");
const Director = require("./models/Director");
const Movie = require("./models/Movie");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/cinemaDB");

const directorValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().optional(),
});

const movieValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  year: z.number().int().positive("Year must be a positive number"),
  genre: z.string().min(1, "Genre is required"),
});

const checkDirectorHeader = async (req, res, next) => {
  const directorId = req.headers["director-id"];

  if (!directorId) {
    return res
      .status(400)
      .send({ message: "Director ID is required in headers" });
  }

  try {
    const director = await Director.findById(directorId);
    if (!director) {
      return res.status(404).send({ message: "Director not found" });
    }
    req.directorId = directorId;
    next();
  } catch (err) {
    return res.status(400).send({ message: "Invalid Director ID format" });
  }
};

app.post("/directors", async (req, res) => {
  try {
    const validatedData = directorValidationSchema.parse(req.body);
    const director = new Director(validatedData);
    await director.save();
    res.send(director);
  } catch (error) {
    res.status(400).send({ message: "Validation error", errors: error.errors });
  }
});

app.get("/directors", async (req, res) => {
  const directors = await Director.find().populate("movies");
  res.send(directors);
});

app.delete("/directors/:id", async (req, res) => {
  try {
    const directorId = req.params.id;
    const director = await Director.findById(directorId);

    if (!director) {
      return res.status(404).send({ message: "Director not found" });
    }

    await Movie.deleteMany({ director: directorId });

    await Director.findByIdAndDelete(directorId);

    res.send({
      message: "Director and all associated movies deleted successfully",
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.post("/movies", checkDirectorHeader, async (req, res) => {
  try {
    const validatedData = movieValidationSchema.parse(req.body);

    const movie = new Movie({
      ...validatedData,
      director: req.directorId,
    });

    await movie.save();

    await Director.findByIdAndUpdate(req.directorId, {
      $push: { movies: movie._id },
    });

    res.send(movie);
  } catch (error) {
    if (error.name === "ZodError") {
      return res
        .status(400)
        .send({ message: "Validation error", errors: error.errors });
    }
    res.status(500).send({ message: error.message });
  }
});

app.get("/movies", async (req, res) => {
  const { genre, year, page = 1, limit = 10 } = req.query;
  const filterQuery = {};
  if (genre) filterQuery.genre = genre;
  if (year) filterQuery.year = Number(year);

  const skip = (Number(page) - 1) * Number(limit);

  try {
    const movies = await Movie.find(filterQuery)
      .populate("director")
      .skip(skip)
      .limit(Number(limit));

    const totalMovies = await Movie.countDocuments(filterQuery);

    res.send({
      data: movies,
      pagination: {
        total: totalMovies,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalMovies / Number(limit)),
      },
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.delete("/movies/:id", async (req, res) => {
  try {
    const movieId = req.params.id;
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).send({ message: "Movie not found" });
    }

    if (movie.director) {
      await Director.findByIdAndUpdate(movie.director, {
        $pull: { movies: movieId },
      });
    }

    await Movie.findByIdAndDelete(movieId);

    res.send({ message: "Movie deleted and removed from director's array" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.listen(3000, () => console.log("Server is running on port 3000"));
