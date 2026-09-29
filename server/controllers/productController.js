const Product = require("../models/Product");

// =========================
// DAY 14 - GET PRODUCTS
// PAGINATION + SORTING
// =========================

const getProducts = async (req, res) => {
  try {
    // Current page
    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    // Products per page
    const limit = Math.max(
      Number(req.query.limit) || 5,
      1
    );

    // Skip previous products
    const skip = (page - 1) * limit;

    // Sorting
    const sortBy =
      req.query.sortBy || "createdAt";

    const order =
      req.query.order === "asc" ? 1 : -1;

    // Allowed sorting fields
    const allowedSortFields = [
      "name",
      "price",
      "stock",
      "createdAt"
    ];

    const safeSortBy =
      allowedSortFields.includes(sortBy)
        ? sortBy
        : "createdAt";

    // Get products
    const products = await Product.find()
      .sort({
        [safeSortBy]: order
      })
      .skip(skip)
      .limit(limit);

    // Total products
    const totalProducts =
      await Product.countDocuments();

    // Total pages
    const totalPages = Math.ceil(
      totalProducts / limit
    );

    // Success response
    res.status(200).json({
      success: true,
      message: "Products fetched successfully",

      products,

      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        productsPerPage: limit
      },

      sorting: {
        sortBy: safeSortBy,
        order:
          order === 1 ? "asc" : "desc"
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch products"
    });
  }
};


// ===============================
// CREATE PRODUCT
// ===============================

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock
    } = req.body;

    // Required field validation
    if (
      !name ||
      !description ||
      price === undefined ||
      !category ||
      stock === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Create product
    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      image: req.file
        ? `/uploads/${req.file.filename}`
        : ""
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to create product"
    });
  }
};


// ===============================
// GET SINGLE PRODUCT
// ===============================

const getProductById = async (req, res) => {
  try {
    const product =
      await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      product
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch product"
    });
  }
};


// ===============================
// UPDATE PRODUCT
// ===============================

const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock
    } = req.body;

    const product =
      await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Update product fields
    product.name = name;
    product.description = description;
    product.price = price;
    product.category = category;
    product.stock = stock;

    // Update image only when new image is uploaded
    if (req.file) {
      product.image =
        `/uploads/${req.file.filename}`;
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to update product"
    });
  }
};


// ===============================
// DELETE PRODUCT
// ===============================

const deleteProduct = async (req, res) => {
  try {
    const product =
      await Product.findByIdAndDelete(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to delete product"
    });
  }
};


// ===============================
// EXPORT
// ===============================

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};