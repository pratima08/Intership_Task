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
// USER CRUD
// ==================================================


// GET ALL USERS

router.get(
  "/users",
  protect,
  authorize("admin"),
  getUsers
);


// GET SINGLE USER

router.get(
  "/users/:id",
  protect,
  authorize("admin"),
  getUser
);


// CREATE USER

router.post(
  "/users",
  protect,
  authorize("admin"),
  createUser
);


// UPDATE USER

router.put(
  "/users/:id",
  protect,
  authorize("admin"),
  updateUser
);


// DELETE USER

router.delete(
  "/users/:id",
  protect,
  authorize("admin"),
  deleteUser
);


module.exports = router;