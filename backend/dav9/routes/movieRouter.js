const { Router } = require("express");
const { z } = require("zod");
const Movie = require("../Movie");
const Director = require("../Director");
const isAuthMiddleware = require("../middlewares/is-auth.middleware");
const validateMiddleware = require("../middlewares/validate.middleware");

const movieRouter = new Router();

const movieValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  year: z.number().int().positive("Year must be a positive number"),
  genre: z.string().min(1, "Genre is required"),
});

movieRouter.get("/", async (req, res) => {
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

movieRouter.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).populate("director");
    if (!movie) {
      return res.status(404).send({ message: "Movie not found" });
    }
    res.send(movie);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

movieRouter.post(
  "/",
  isAuthMiddleware,
  validateMiddleware(movieValidationSchema),
  async (req, res) => {
    try {
      const movie = await Movie.create({
        ...req.body,
        director: req.userId,
      });

      await Director.findByIdAndUpdate(req.userId, {
        $push: { movies: movie._id },
      });

      res.status(201).send(movie);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  },
);

movieRouter.put("/:id", isAuthMiddleware, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).send({ message: "Movie not found" });
    }
    if (movie.director.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "You can only update your own movies" });
    }

    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.send(updatedMovie);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

movieRouter.delete("/:id", isAuthMiddleware, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).send({ message: "Movie not found" });
    }
    if (movie.director.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "You can only delete your own movies" });
    }

    await Movie.findByIdAndDelete(req.params.id);

    await Director.findByIdAndUpdate(movie.director, {
      $pull: { movies: req.params.id },
    });

    res.send({ message: "Movie deleted successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = movieRouter;