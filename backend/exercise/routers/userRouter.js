const { Router } = require("express");
const secretMiddleware = require("../middlewares/secret.middleware");
const validateCreateUserMiddleware = require("../middlewares/validateCreateUser.middleware");
const { z } = require("zod");
const userModel = require("../user/user.model");
const { UserSchema } = require("../user/create-user.dto");
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

userRouter.put("/:id", async (req, res) => {
  const id = req.params.id;
  const updatedUser = await userModel.findByIdAndUpdate(id, req.body, { new: true });
  res.json({ message: "User updated successfully", updatedUser });
});

userRouter.delete("/:id", secretMiddleware, async (req, res) => {
  const id = req.params.id;
  const deletedUser = await userModel.findByIdAndDelete(id);
  res.json({ message: "User deleted successfully", deletedUser });
});
module.exports = userRouter;
