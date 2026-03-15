const express = require("express");
const userRouter = require("./users/users.router");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  console.log(req.headers, "headers");
  res.send("hello world 123");
});

app.use("/users", userRouter);

app.listen(3000, () => {
  console.log("server running on http://localhost:3000");
});
