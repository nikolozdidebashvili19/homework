const { Router } = require("express");
const secretMiddleware = require("../middlewares/secret.middleware");
const validateCreateUserMiddleware = require("../middlewares/validateCreateUser.middleware");
const { UserSchema } = require("../create-user.dto");
const userModel = require("../userModel");
const userRouter = new Router();


 
const lastId =1
userRouter.get("/users", async(req, res) => {
  const users =await userModel.find()
  res.send(users);
});

userRouter.post("/users",validateCreateUserMiddleware(UserSchema) , async(req, res) => {
  const { name, age } = req.body;
  await userModel.create({name,age})
});

userRouter.put("/users/:id", (req, res) => {
   const id = req.params.id
  const updatedUser =await userModel.findByIdAndUpdate(id)
});

userRouter.delete("/users/:id", secretMiddleware , (req, res) => {
  const id = req.params.id
 const deletedUser= await userModel.findByIdAndDelete(id)
});
module.exports = userRouter;