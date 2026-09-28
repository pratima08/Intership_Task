const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

// ======================================
// USER + ADMIN
// ======================================

// View all products
router.get(
  "/",
  protect,
  getProducts
);

// View single product
router.get(
  "/:id",
  protect,
  getProductById
);


// ======================================
// ADMIN ONLY
// ======================================

// Add product
router.post(
  "/",
  protect,
  authorize("admin"),
  upload.single("image"),
  createProduct
);

// Update product
router.put(
  "/:id",
  protect,
  authorize("admin"),
  upload.single("image"),
  updateProduct
);

// Delete product
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteProduct
);

module.exports = router;