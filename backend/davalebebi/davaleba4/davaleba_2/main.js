import fs from "fs/promises";
import axios from "axios";
import { writeFile } from "fs";

async function main() {
  const link = await axios.get("https://dummyjson.com/recipes");
  console.log(link.data);
  const recipes = link.data.recipes;
  const properties = recipes.map((recipe) => ({
    dishName: recipe.name,
    ingredientCount: recipe.ingredients.length,
    isQuick: recipe.prepTimeMinutes <= 15,
  })); console.log(properties)
  await fs.writeFile("recipes.json" , JSON.stringify(properties))
}

main();
//davaleba 