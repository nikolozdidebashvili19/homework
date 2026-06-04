import fetch from 'node-fetch';
import fs from 'fs';
import moment from 'moment';

const RECIPES_URL = 'https://dummyjson.com/recipes?limit=100';
const USERS_URL = 'https://dummyjson.com/users?limit=100';

async function fetchRecipes() {
  const res = await fetch(RECIPES_URL);
  const data = await res.json();
  const recipes = data.recipes.map(r => ({
    name: r.name,
    ingredients: r.ingredients,
    prepTimeMinutes: r.prepTimeMinutes,
    rating: r.rating,
  }));
  fs.writeFileSync('recipes.json', JSON.stringify(recipes, null, 2));
  console.log('recipes.json saved');
}

async function fetchUsers() {
  const res = await fetch(USERS_URL);
  const data = await res.json();
  const users = data.users.map(u => ({
    id: u.id,
    fullName: `${u.firstName} ${u.lastName}`,
    email: u.email,
    birthDate: moment(u.birthDate, 'YYYY-M-DD').format('DD/MM/YYYY'),
    country: u.address.country,
  }));
  fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
  console.log('users.json saved');
}

async function main() {
  await fetchRecipes();
  await fetchUsers();
}

main();
