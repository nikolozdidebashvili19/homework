const express = require("express");
const connectDB = require("./config/db");  
const productRouter = require("./products/product.route");
const app = express();

app.use(express.json());

app.use("/products", productRouter);

app.get("/", (req, res) => {
  res.send("Server is up and running!");
});



connectDB().then(() => {
  app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000/");
  });
});
