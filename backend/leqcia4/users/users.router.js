const { Router } = require("express");
const { readFile, writeFile } = require("../utils/fs.util");

const userRouter = new Router();

userRouter.get("/", async (req, res) => {
  const users = await readFile("users.json", true);
  res.json(users);
});

userRouter.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const parsedUsers = await readFile("users.json", true);

  const existUser = parsedUsers.find((u) => u.id === id);
  if (!existUser) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  res.json(existUser);
});

userRouter.post("/", async (req, res) => {
  if (!req.body?.fullName || !req.body?.age || !req.body?.isSmoker) {
    return res.status(400).json({
      success: false,
      message: "Fullname, age and isSmolker is requeird",
    });
  }

  const parsedUsers = await readFile("users.json", true);

  const lastId = parsedUsers[parsedUsers.length - 1]?.id || 0;
  const newUser = {
    id: lastId + 1,
    fullName: req.body.fullName,
    age: req.body.age,
    isSmoker: req.body.isSmoker,
  };
  parsedUsers.push(newUser);
  await writeFile("users.json", parsedUsers);
  res.status(201).json({ success: true, data: newUser });
});

userRouter.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const parsedUsers = await readFile("users.json", true);

  const index = parsedUsers.findIndex((u) => u.id === id);
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: " user not found",
    });
  }
  const deleted = parsedUsers.splice(index, 1);
  await writeFile("users.json", parsedUsers);
  res.json(deleted[0]);
});

userRouter.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const parsedUsers = await readFile("users.json", true);

  const index = parsedUsers.findIndex((u) => u.id === id);
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: " user not found",
    });
  }

  parsedUsers[index] = {
    ...parsedUsers[index],
    ...req.body,
  };

  await writeFile("users.json", parsedUsers);
  res.json({ success: true, data: parsedUsers[index] });
});

module.exports = userRouter;
    