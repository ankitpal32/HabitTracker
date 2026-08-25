const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword
} = require("../controllers/authController");

const router = express.Router();

/* Register user */
router.post("/register", registerUser);

/* Login user */
router.post("/login", loginUser);

/* get authenticated user profile */
router.get("/me", protect, getMe);

/* Update profile */
router.put("/profile", protect, updateProfile);

/* Change password */
router.put("/password", protect, changePassword);

module.exports = router;