const { Router } = require("express");
const { readFile, writeFile } = require("../lec4/utils/fs.util");

const animalsRouter = new Router();

animalsRouter.get("/", async (req, res) => {
  try {
    const animals = await readFile("animals.json", true);

    const { color } = req.query;

    if (color) {
      const filtered = animals.filter((a) => a.color === color);
      return res.json(filtered);
    }

    res.json(animals);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error reading file" });
  }
});

animalsRouter.post("/", async (req, res) => {
  const { name, age, color } = req.body;

  if (!name || !age || !color) {
    return res.status(400).json({
      success: false,
      message: "name, age, color required",
    });
  }

  const animals = await readFile("animals.json", true);

  const newAnimal = { name, age, color };

  animals.push(newAnimal);
  await writeFile("animals.json", animals);

  res.status(201).json({ success: true, data: newAnimal });
});


animalsRouter.delete("/", async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ success: false, message: "name required" });
  }

  let animals = await readFile("animals.json", true);

  const filtered = animals.filter((a) => a.name !== name);

  await writeFile("animals.json", filtered);

  res.json({ success: true, message: "deleted if existed" });
});

module.exports = animalsRouter;
