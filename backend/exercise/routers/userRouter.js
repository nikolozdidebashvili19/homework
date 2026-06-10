const { Router } = require("express");
const secretMiddleware = require("../middlewares/secret.middleware");
const validateCreateUserMiddleware = require("../middlewares/validateCreateUser.middleware");
const userModel = require("../user/user.model");
const { UserSchema } = require("../user/create-user.dto");
const isAuth = require("../auth/isAuth.middleware");
const { upload, deleteFromCloudinary } = require("../config/cloudinary");
const userRouter = new Router();

userRouter.get("/", async (req, res) => {
  const users = await userModel.find().populate("posts");
  res.send(users);
});

userRouter.post(
  "/",
  validateCreateUserMiddleware(UserSchema),
  async (req, res) => {
    const { name, age } = req.body;
    await userModel.create({ name, age });
    res.json({ message: "User created successfully" });
  },
);

userRouter.patch("/me/avatar", isAuth, upload.single("avatar"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Avatar image is required" });
  }

  const user = await userModel.findById(req.userId);

  if (!user) {
    await deleteFromCloudinary(req.file.filename);
    return res.status(404).json({ message: "User not found" });
  }

  if (user.avatar?.publicId) {
    await deleteFromCloudinary(user.avatar.publicId);
  }

  user.avatar = {
    url: req.file.path,
    publicId: req.file.filename,
  };

  await user.save();

  res.json({
    message: "Avatar uploaded successfully",
    avatar: user.avatar,
  });
});

userRouter.put("/:id", async (req, res) => {
  const id = req.params.id;
  const updatedUser = await userModel.findByIdAndUpdate(id, req.body, { new: true });
  res.json({ message: "User updated successfully", updatedUser });
});

userRouter.delete("/:id", secretMiddleware, async (req, res) => {
  const id = req.params.id;
  const user = await userModel.findById(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.avatar?.publicId) {
    await deleteFromCloudinary(user.avatar.publicId);
  }

  const deletedUser = await userModel.findByIdAndDelete(id);
  res.json({ message: "User deleted successfully", deletedUser });
});
module.exports = userRouter;
