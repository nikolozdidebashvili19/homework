const { Router } = require("express");
const Director = require("../Director");
const isAuthMiddleware = require("../middlewares/is-auth.middleware");
const validateMiddleware = require("../middlewares/validate.middleware");
const { z } = require("zod");

const directorRouter = new Router();

const directorUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  bio: z.string().optional(),
});

directorRouter.get("/", isAuthMiddleware, async (req, res) => {
  const directors = await Director.find().populate("movies");
  res.send(directors);
});

directorRouter.get("/:id", async (req, res) => {
  const director = await Director.findById(req.params.id).populate("movies");
  if (!director) {
    return res.status(404).send({ message: "Director not found" });
  }
  res.send(director);
});

directorRouter.put(
  "/:id",
  isAuthMiddleware,
  validateMiddleware(directorUpdateSchema),
  async (req, res) => {
    if (req.params.id !== req.userId) {
      return res.status(403).json({ message: "You can only update your own profile" });
    }
    const director = await Director.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!director) {
      return res.status(404).send({ message: "Director not found" });
    }
    res.send(director);
  },
);

directorRouter.delete("/:id", isAuthMiddleware, async (req, res) => {
  if (req.params.id !== req.userId) {
    return res.status(403).json({ message: "You can only delete your own profile" });
  }
  const director = await Director.findByIdAndDelete(req.params.id);
  if (!director) {
    return res.status(404).send({ message: "Director not found" });
  }
  res.send({ message: "Director deleted successfully" });
});

module.exports = directorRouter;