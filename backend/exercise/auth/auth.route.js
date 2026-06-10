const { Router } = require("express");
const signUpUserSchema = require("./sign-up.dto");
const userModel = require("../user/user.model");
const validateAuthMiddleware = require("./validateAuth.middleware");
const signInUserSchema = require("./sign-in.dto");
const jwt = require("jsonwebtoken");
const authRouter = new Router();
const bcrypt = require("bcrypt");

authRouter.post(
  "/signup",
  validateAuthMiddleware(signUpUserSchema),

  async (req, res) => {
    try {
      const { name, age, email, password } = req.body;

      const existUser = await userModel.findOne({ email });
      if (existUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await userModel.create({
        name,
        age,
        email,
        password: hashedPassword,
      });

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

authRouter.post("/signin", validateAuthMiddleware(signInUserSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    const existUser = await userModel.findOne({ email }).select("+password");
    if (!existUser) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, existUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const payload = {
      userId: existUser._id,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


module.exports = authRouter;
