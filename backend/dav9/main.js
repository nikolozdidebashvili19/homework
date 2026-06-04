const express = require("express");
const db = require("./db");
const authRouter = require("./auth/auth.route");
const directorRouter = require("./routes/directorRouter");
const movieRouter = require("./routes/movieRouter");

const app = express();
const PORT = 3009;

app.use(express.json());

app.use("/auth", authRouter);
app.use("/directors", directorRouter);
app.use("/movies", movieRouter);

db().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});