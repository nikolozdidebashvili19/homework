const express = require("express");
const app = express();
const fs = require("fs");

app.use(express.json());

app.post("/products", (req, res) => {
  const data = fs.readFileSync("./products.json", "utf8");
  const products = JSON.parse(data);

  const newProduct = req.body;
  newProduct.id = Date.now();

  products.push(newProduct);

  fs.writeFileSync("./products.json", JSON.stringify(products));
  res.send(newProduct);
});

app.get("/products", (req, res) => {
  const data = fs.readFileSync("./products.json", "utf8");
  const products = JSON.parse(data);
  res.send(products);
});

app.get("/products/:id", (req, res) => {
  const data = fs.readFileSync("./products.json", "utf8");
  const products = JSON.parse(data);

  const product = products.find((p) => p.id == req.params.id);

  if (!product) {
    return res.status(404).send("Not found");
  }

  res.send(product);
});

app.put("/products/:id", (req, res) => {
  const data = fs.readFileSync("./products.json", "utf8");
  const products = JSON.parse(data);

  const index = products.findIndex((p) => p.id == req.params.id);

  if (index === -1) {
    return res.status(404).send("Not found");
  }

  products[index].name = req.body.name || products[index].name;
  products[index].price = req.body.price || products[index].price;

  fs.writeFileSync("./products.json", JSON.stringify(products));
  res.send(products[index]);
});

app.delete("/products/:id", (req, res) => {
  const data = fs.readFileSync("./products.json", "utf8");
  const products = JSON.parse(data);

  const newProducts = products.filter((p) => p.id != req.params.id);

  fs.writeFileSync("./products.json", JSON.stringify(newProducts));
  res.send("Deleted");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
