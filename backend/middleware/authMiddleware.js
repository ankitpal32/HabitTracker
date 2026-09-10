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

    const jwtSecret = process.env.JWT_SECRET || "habit_tracker_secure_jwt_secret_key_2026";

    const decoded = jwt.verify(
      token,
      jwtSecret
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