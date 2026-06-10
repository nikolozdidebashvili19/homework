const express = require("express");
const userRouter = require("./routers/userRouter");
const db = require("./db");
const postRouter = require("./posts/postRouter");
const authRouter = require("./auth/auth.route");
const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/", authRouter);

db().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
