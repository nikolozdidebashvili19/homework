const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Director = require("../Director");
const validateMiddleware = require("../middlewares/validate.middleware");
const signUpDirectorSchema = require("./dto/sign-up.dto");
const signInDirectorSchema = require("./dto/sign-in.dto");
const isAuthMiddleware = require("../middlewares/is-auth.middleware");

const authRouter = new Router();

authRouter.post(
  "/sign-up",
  validateMiddleware(signUpDirectorSchema),
  async (req, res) => {
    try {
      const { name, email, password, bio } = req.body;
      const existDirector = await Director.findOne({ email });
      if (existDirector) {
        return res.status(400).json({ message: "Director already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newDirector = await Director.create({
        name,
        email,
        password: hashedPassword,
        bio,
      });
      res.status(201).json({ message: "Director registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

authRouter.post(
  "/sign-in",
  validateMiddleware(signInDirectorSchema),
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const director = await Director.findOne({ email }).select("+password");
      if (!director) {
        return res
          .status(400)
          .json({ message: "email or password incorrect" });
      }
      const isMatch = await bcrypt.compare(password, director.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "email or password incorrect" });
      }
      const payload = { userId: director._id };
      const token = await jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

authRouter.get("/current-director", isAuthMiddleware, async (req, res) => {
  const director = await Director.findById(req.userId);
  res.json(director);
});

module.exports = authRouter;