const { Router } = require("express");

const validateMiddleware = require("../middlewares/validate.middleware");

const bcrypt = require("bcrypt");

const userModel = require("../users/user.model");
const signInUserSchema = require("./dto/sign-in.dto");

const authRouter = new Router();
const jwt = require("jsonwebtoken");
const isAuthMiddleware = require("../middlewares/is-auth.middleware");
const signUpUserSchema = require("./dto/sign-up.dto");

authRouter.post(
  "/sign-up",
  validateMiddleware(signUpUserSchema),
  async (req, res) => {
    try {
      const { fullName, email, password } = req.body;

      const existUser = await userModel.findOne({ email });
      if (existUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await userModel.create({
        fullName,
        email,
        password: hashedPassword,
      });

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);
authRouter.post(
  "/sign-in",
  validateMiddleware(signInUserSchema),
  async (req, res) => {
    const { email, password } = req.body;
    const existUser = await userModel.findOne({ email }.select("+password"));
    if (!existUser) {
      return res.status(400).json({ message: "email or password incorrect" });
    }

    const payload = {
      userId: existUser._id,
    };
    const token = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  }
);
authRouter.get("/current-user", isAuthMiddleware, async (req, res) => {
  const user = await userModel.findById(req.userId);
  res.json(user);
});

module.exports = authRouter;
