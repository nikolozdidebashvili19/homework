const { Router } = require("express");
const userRouter = require("../users/users.router");
const { readFile, writeFile } = require("../utils/fs.util");


const blogsRouter = new Router()

blogsRouter.get("/", async (req, res) => {
  const blogs = await readFile("blogs.json", true);
  res.json(blogs); 
});

blogsRouter.post('/' , async (req , res)=> {
    const userId = req.headers['user-id']
    if(!userId) {
        return res.status(401).json({success: false , message: "userId is required"})
    }
    const users = await readFile('users.json' , true)
    const user = users.find(u =>  u.id === Number(userId))
    if(!user) {
        return res.status(404).json({success:false , message: "not found    "})
    }
    if(!req.body.title || !req.body.desc) {
        return res.status(400).json({success:false , message: "title and desc are required"})
    }
    const blogs = await readFile('blogs.json' , true)
    const lastId = blogs[blogs.length - 1]?.id || 0 
    const newBlog = {
        id: lastId+1 , 
        title: req.body.title , 
        desc: req.body.desc , 
        author: user    
    }
    blogs.push(newBlog)
    await writeFile('blogs.json' , blogs)
    res.status(201).json({success:true , data:newBlog})
})
module.exports = blogsRouter