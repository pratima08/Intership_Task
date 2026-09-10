const Product = require("../models/Product");

// ==========================
// CREATE PRODUCT
// ==========================
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    // Validation
    if (!name || !description || price === undefined || !category || stock === undefined) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // Create product
    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock
    });

    res.status(201).json({
      message: "Product created successfully",
      product
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating product",
      error: error.message
    });
  }
};


// ==========================
// GET ALL PRODUCTS
// ==========================
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: "Products fetched successfully",
      products
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
      error: error.message
    });
  }
};


// ==========================
// GET SINGLE PRODUCT
// ==========================
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json({
      product
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching product",
      error: error.message
    });
  }
};


// ==========================
// UPDATE PRODUCT
// ==========================
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.category = category ?? product.category;
    product.stock = stock ?? product.stock;

    await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating product",
      error: error.message
    });
  }
};


// ==========================
// DELETE PRODUCT
// ==========================
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting product",
      error: error.message
    });
  }
};


module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
};