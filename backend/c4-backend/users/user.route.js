const { Router } = require("express");
const userModel = require("./user.model");
const isValidObjectId = require("../middlewares/is-valid-object-id");
const validateMiddleware = require("../middlewares/validate.middleware");
 
const productModel = require("../products/product.model");


const userRouter = new Router()


userRouter.get('/', async (req, res) => {
    const users = await userModel.find().sort({_id: -1}).populate({path: 'products', select: 'price name'})
    res.json(users)
})


userRouter.get('/:id', isValidObjectId, async (req, res) => {
    const user = await userModel.findById(req.params.id)
    if(!user){
        return res.status(404).json({message: "user not found"})
    }

    res.json(user)
})

userRouter.delete('/:id', isValidObjectId, async (req, res) => {
    const id = req.params.id
    await userModel.findByIdAndDelete(id)
    await productModel.deleteMany({
        seller: id
    })
    res.json({message: "user delete succesfully"})
})

module.exports = userRouter