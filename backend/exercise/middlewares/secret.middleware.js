module.exports = async (req, res, next) => {
  try {
    
    if (req.headers.secret !== "secret123") {
      return res
        .status(401)
        .json({ message: "Unauthorized: Invalid or missing secret header" });
    }

   
    next();
  } catch (e) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
