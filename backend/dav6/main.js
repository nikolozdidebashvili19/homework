const express = require("express");
const expenseRouter = require("./routers/expenseRouter");
const db = require("./db");

const app = express();
const PORT = 3006;

app.use(express.json());

app.use("/expenses", expenseRouter);

db().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});