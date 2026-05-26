//1)add users router to handle all user related requests
//2) use correct folder structrue
//3)if request is delete user add middleware 
//to check if request includes secret123 in headers
const express = require("express");
const userRouter = require("./routers/userRouter");
const app = express();
const PORT = 3000;

app.use(express.json());
 
app.use("/", userRouter);
 
db().then((res)=> {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  })
} )

