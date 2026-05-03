const { Router } = require("express");
const productModel = require("./product.model");
const { isValidObjectId } = require("mongoose");
const userModel = require("../users/user.model");
const validateMiddleware = require("../middlewares/validate.middleware");
const productSchema = require("./product.dto");

const productRouter = new Router()

productRouter.get('/', async (req, res) => {
    const take = Math.min(req.query.take || 30)
    const page = Math.max(req.query.page || 1)

    const filter = {}
    if(req.query.priceFrom){
        filter.price = {$gt: Number(req.query.priceFrom)}
    }

    if(req.query.priceTo){
        filter.price = {...filter.price, $lt: Number(req.query.priceTo)}
    }

    if(req.query.reviews){
        const reviews = req.query.reviews.split(',')
        filter.review = {$in: reviews}
    }

    const products = await productModel
        .find(filter)
        .populate({path: "seller",select: 'fullName'})
        .skip((page - 1) * take)
        .limit(take)

    res.json(products)
})

productRouter.post('/', validateMiddleware(productSchema), async (req, res) => {
    const newProduct = await productModel.create({
        name: req.body.name,
        price: req.body.price,
        desc: req.body.desc,
        review: req.body.review,
        seller: req.body.userId
    })
    await userModel.findByIdAndUpdate(req.body.userId, {
        $push: {products: newProduct._id}
    })
    res.status(201).json({success: true, message: "Created successfully"})
})

productRouter.get('/:id', isValidObjectId, async (req, res) => {
    const id = req.params.id

    const product = await productModel.findById(id)
    if(!product){
        return res.status(404).json({message: "product not found"})
    }

    res.json(product)
})

productRouter.delete('/:id', isValidObjectId, async (req, res) => {
    const id = req.params.id
    
    const deletedProduct = await productModel.findByIdAndDelete(id)
    if(!deletedProduct){
        return res.status(404).json({message: "product not found"})
    }

    await userModel.findByIdAndUpdate(deletedProduct.seller, {
        $pull: {products: deletedProduct._id}
    })

    res.json(deletedProduct)
})

productRouter.put('/:id', isValidObjectId, async (req, res) => {
    const id = req.params.id

    const updatedProduct = await productModel.findByIdAndUpdate(id, req.body, {new: true})
    if(!updatedProduct){
        return res.status(404).json({message: "product not found"})
    }
    
    res.json(updatedProduct)
})


module.exports = productRouter