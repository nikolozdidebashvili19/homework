const { Router } = require("express");
const postzodSchema = require("./create-post.dto");
const postModel = require("./post.model");
const postRouter = new Router();
const validateAuthMiddleware = require("../auth/validateAuth.middleware");
const isAuth = require("../auth/isAuth.middleware");
const userModel = require("../user/user.model");

postRouter.get("/", async (req, res) => {
  const posts = await postModel
    .find()
    .populate({ path: "user", select: "name email" });
  res.send(posts);
});

postRouter.post(
  "/",
  isAuth,
  validateAuthMiddleware(postzodSchema),
  async (req, res) => {
    const { title, desc } = req.body;

    const post = await postModel.create({ title, desc, user: req.userId });
    await userModel.findByIdAndUpdate(req.userId, { $addToSet: { posts: post._id } });

    res.status(201).json({ message: "post created successfully", post });
  },
);


postRouter.put("/:id", async (req, res) => {
  const id = req.params.id;
  const updatedPost = await postModel.findByIdAndUpdate(id, req.body, { new: true });
  res.json({ message: "post updated successfully", updatedPost });
});

postRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const deletedPost = await postModel.findByIdAndDelete(id);

  if (deletedPost) {
    await userModel.findByIdAndUpdate(deletedPost.user, {
      $pull: { posts: deletedPost._id },
    });
  }

  res.json({ message: "post deleted successfully", deletedPost });
});

module.exports = postRouter;
