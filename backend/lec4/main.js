const express = require("express");
const app = express();
const fs = require("fs/promises");
const userRouter = require("./users/users.router");
const blogsRouter = require("./blogs/blogs.router");
app.use(express.json());
app.get("/", (req, res) => {
  res.send("helloo");
});

app.use("/users", userRouter);
app.use("/blogs", blogsRouter);

app.listen(3000, () => {
  console.log("server running on https://localhost:3000");
});
