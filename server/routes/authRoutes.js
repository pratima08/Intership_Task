const express = require("express");

const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// =========================
// REGISTER
// =========================

router.post(
  "/register",
  register
);


// =========================
// LOGIN
// =========================

router.post(
  "/login",
  login
);


// =========================
// DAY 10 - PROFILE
// =========================

// Get profile
router.get(
  "/profile",
  protect,
  getProfile
);


// Update profile
router.put(
  "/profile",
  protect,
  updateProfile
);


// Change password
router.put(
  "/change-password",
  protect,
  changePassword
);


module.exports = router;