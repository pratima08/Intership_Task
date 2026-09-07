const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();


// ==================================================
// PROTECTED ROUTE
// Logged in users can access
// ==================================================

router.get(
  "/profile",
  protect,
  (req, res) => {

    res.json({
      message: "Protected profile API",
      userId: req.user.userId,
      role: req.user.role
    });

  }
);


// ==================================================
// ADMIN ONLY ROUTE
// Only admin can access
// ==================================================

router.get(
  "/admin",
  protect,
  authorize("admin"),
  (req, res) => {

    res.json({
      message: "Welcome Admin",
      userId: req.user.userId,
      role: req.user.role
    });

  }
);


module.exports = router;