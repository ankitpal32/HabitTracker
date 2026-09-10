const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Please login first"
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Authentication token missing"
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("AUTH_ERROR: JWT_SECRET environment variable is missing on server");
      return res.status(500).json({
        message: "Authentication service temporarily unavailable"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.warn("AUTH_TOKEN_VERIFY_ERROR:", error.message || error);
    res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

module.exports = protect;