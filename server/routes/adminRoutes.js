const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require("../controllers/userController");

const router = express.Router();


// ==================================================
// DAY 4
// ADMIN DASHBOARD
// ==================================================

router.get(
  "/dashboard",
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


// ==================================================
// DAY 5
// USER MODULE - CRUD
// ==================================================


// 1. GET ALL USERS
// Admin only

router.get(
  "/users",
  protect,
  authorize("admin"),
  getUsers
);


// 2. GET SINGLE USER
// Admin only

router.get(
  "/users/:id",
  protect,
  authorize("admin"),
  getUser
);


// 3. CREATE USER
// Admin only

router.post(
  "/users",
  protect,
  authorize("admin"),
  createUser
);


// 4. UPDATE USER
// Admin only

router.put(
  "/users/:id",
  protect,
  authorize("admin"),
  updateUser
);


// 5. DELETE USER
// Admin only

router.delete(
  "/users/:id",
  protect,
  authorize("admin"),
  deleteUser
);


module.exports = router;