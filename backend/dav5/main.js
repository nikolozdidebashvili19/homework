const express = require("express");
const app = express();
const fs = require("fs/promises");
const userRouter = require("./user.router");
app.use(express.json());
const now = new Date();

app.get("/", (req, res) => {
    if(now.getHours() >= 10 && now.getHours() < 18){
           return res.status(403).json({ message: "10-18 საათზე ვერ დაარექვესტებ" });
    } 
res.send(req.params.id);

});
app.use("/users", userRouter);


app.listen(3000, () => {
  console.log("server running on https://localhost:3000");
});
