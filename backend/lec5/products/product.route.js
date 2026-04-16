const { Router } = require("express");
const productModel = require("./product.model");
const { isValidObjectId } = require("mongoose");

const productRouter = new Router();

productRouter.get("/", async (req, res) => {
  const take = Math.min(req.query.take || 30) 
  const page = Math.max(req.query.page || 1)
  const filter= {}
  if(req.query.priceFrom) {
    filter.price = {$gt: Number(req.query.priceFrom)}
  }
  if(req.query.priceTo) {
    filter.price = {...filter.price, $lt: Number(req.query.priceTo)}
  }

  if(req.query.reviews) {
    const reviews = req.query.reviews.split(',')
    filter.review = {$in: reviews}
  }



  const products = await productModel.find(filter)
  .skip((page-1) * take).limit(take)
  res.json(products);
});

productRouter.post("/", async (req, res) => {
  if (!req.body || !req.body.name || !req.body.price) {
    return res
      .status(400)
      .json({ message: "product name and price are required" });
  }
  const { name, price, desc, review } = req.body;
  await productModel.create({ name, price, desc, review });

  res.status(201).json({ message: "Product created successfully!" });
});

productRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "wrong id provided" });
  }
  const product = await productModel.findById(id);
  if (!product) {
    return res.status(404).json({ message: "product not found" });
  }
  // Necessary: Send the product back to the client
  res.json(product);
});

productRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "wrong id provided" });
  }
  const deletedProduct = await productModel.findByIdAndDelete(id);
  if (!deletedProduct) {
    return res.status(404).json({ message: "product not found" });
  }
  res.json(deletedProduct);
});

productRouter.put("/:id", async (req, res) => {
  const id = req.params.id;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "wrong id provided" });
  }
  const updatedProduct = await productModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!updatedProduct) {
    return res.status(404).json({ message: "product not found" });
  }
  res.json(updatedProduct);
});

module.exports = productRouter;
