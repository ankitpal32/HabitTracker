const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  updateProfile,
  changePassword
} = require("../controllers/authController");

const router = express.Router();

/* Register user */
router.post("/register", registerUser);

/* Login user */
router.post("/login", loginUser);

/* Update profile */
router.put("/profile", protect, updateProfile);

/* Change password */
router.put("/password", protect, changePassword);

module.exports = router;