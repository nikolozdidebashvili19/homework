const express = require("express");
const app = express();
const fs = require("fs/promises");
const animalsRouter = require("./animals.router");
const blogsRouter = require("./blogs.router");
app.use(express.json());



app.use("/animals" , animalsRouter  )
app.use("/blogs" , blogsRouter )

app.listen(3000, () => {
  console.log("server running on https://localhost:3000");
});
