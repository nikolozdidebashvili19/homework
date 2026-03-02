import axios from "axios";
import { readFile, writeFile } from "./utils/util.js";
import chalk from "chalk";

async function main() {
  const data = [];
  const resp = await axios.get("https://dummyjson.com/products");
  // id, price in gel 2.7, tags, thumbnail
  const total = resp.data.total;
  const limit = 30;

  data.push(
    resp.data.products.map((p) => ({
      id: p.id,
      price: p.price * 2.7,
      tags: p.tags,
      tumbnail: p.thumbnail,
    })),
  );
  console.log(Math.floor(total / limit) + 1, "lofg");

  for (let i = 1; i <= Math.floor(total / limit) + 1; i++) {
    console.log(chalk.greenBright(`Fetched ${i * limit}`));
    const resp = await axios.get(
      `https://dummyjson.com/products?skip=${i * limit}`,
    );
    const products = resp.data.products.map((p) => ({
      id: p.id,
      price: p.price * 2.7,
      tags: p.tags,
      tumbnail: p.thumbnail,
    }));
    data.push(...products);
  }

  await writeFile("products.json", data);
}

main();
