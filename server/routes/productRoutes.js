const express = require("express");

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

const router = express.Router();

// Create Product
router.post("/", createProduct);

// Get All Products
router.get("/", getProducts);

// Get Single Product
router.get("/:id", getProduct);

// Update Product
router.put("/:id", updateProduct);

// Delete Product
router.delete("/:id", deleteProduct);

module.exports = router;