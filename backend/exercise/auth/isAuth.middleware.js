const jwt = require("jsonwebtoken");
const userModel = require("../user/user.model");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token is required" });
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(payload.userId);

    if (!user) {
      return res.status(401).json({ message: "User does not exist" });
    }

    req.userId = user._id;
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Permission denied" });
  }
};
