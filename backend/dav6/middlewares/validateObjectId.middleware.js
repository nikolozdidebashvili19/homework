const { default: mongoose } = require("mongoose");

module.exports = (req, res, next) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid MongoDB ID" });
  }

  next();
};