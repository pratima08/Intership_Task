import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { useAuth } from "../context/AuthContextValue";
import api from "../services/api";

function Products() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ======================================
  // CHECK ADMIN
  // ======================================

  const isAdmin = user?.role === "admin";

  // ======================================
  // REACT HOOK FORM
  // ======================================

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      image: null
    }
  });

  // ======================================
  // FETCH PRODUCTS
  // DAY 26 - AXIOS INTERCEPTOR
  // ======================================

  const fetchProducts = useCallback(async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Token is automatically added by Axios interceptor
      const response = await api.get("/products");

      setProducts(
        response.data.products || []
      );

    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.message ||
        "Unable to fetch products"
      );

    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  // ======================================
  // LOAD PRODUCTS
  // ======================================

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        // Token automatically added by interceptor
        const response = await api.get("/products");

        if (!cancelled) {
          setProducts(
            response.data.products || []
          );
        }

      } catch (err) {
        console.error(err);

        if (!cancelled) {
          if (err.response?.status === 401) {
            navigate("/login");
            return;
          }

          setError(
            err.response?.data?.message ||
            "Unable to fetch products"
          );
        }

      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [token, navigate]);

  // ======================================
  // ADD / UPDATE PRODUCT
  // ADMIN ONLY
  // ======================================

  const onSubmit = async (data) => {
    if (!isAdmin) {
      setError("Admin access required");
      return;
    }

    try {
      setSubmitLoading(true);

      setMessage("");
      setError("");

      const formData = new FormData();

      formData.append(
        "name",
        data.name
      );

      formData.append(
        "description",
        data.description
      );

      formData.append(
        "price",
        data.price
      );

      formData.append(
        "category",
        data.category
      );

      formData.append(
        "stock",
        data.stock
      );

      if (data.image && data.image[0]) {
        formData.append(
          "image",
          data.image[0]
        );
      }

      // ======================================
      // UPDATE PRODUCT
      // ======================================

      if (editingId) {
        const response = await api.put(
          `/products/${editingId}`,
          formData
        );

        setMessage(
          response.data.message ||
          "Product updated successfully"
        );

      } else {

        // ======================================
        // ADD PRODUCT
        // ======================================

        const response = await api.post(
          "/products",
          formData
        );

        setMessage(
          response.data.message ||
          "Product added successfully"
        );
      }

      reset();
      setEditingId(null);

      await fetchProducts();

    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        navigate("/login");
        return;
      }

      if (err.response?.status === 403) {
        setError("Admin access required");
      } else {
        setError(
          err.response?.data?.message ||
          "Unable to save product"
        );
      }

    } finally {
      setSubmitLoading(false);
    }
  };

  // ======================================
  // EDIT PRODUCT
  // ADMIN ONLY
  // ======================================

  const handleEdit = (product) => {
    if (!isAdmin) {
      return;
    }

    setEditingId(product._id);

    setValue(
      "name",
      product.name
    );

    setValue(
      "description",
      product.description
    );

    setValue(
      "price",
      product.price
    );

    setValue(
      "category",
      product.category
    );

    setValue(
      "stock",
      product.stock
    );

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // ======================================
  // CANCEL EDIT
  // ======================================

  const handleCancelEdit = () => {
    setEditingId(null);

    reset();

    setMessage("");
    setError("");
  };

  // ======================================
  // DELETE PRODUCT
  // ADMIN ONLY
  // ======================================

  const handleDelete = async (id) => {
    if (!isAdmin) {
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeleteLoading(id);

      setMessage("");
      setError("");

      // Token automatically added by interceptor
      const response = await api.delete(
        `/products/${id}`
      );

      setMessage(
        response.data.message ||
        "Product deleted successfully"
      );

      await fetchProducts();

    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        navigate("/login");
        return;
      }

      if (err.response?.status === 403) {
        setError("Admin access required");
      } else {
        setError(
          err.response?.data?.message ||
          "Unable to delete product"
        );
      }

    } finally {
      setDeleteLoading(null);
    }
  };

  // ======================================
  // LOADING
  // ======================================

  if (loading) {
    return (
      <div className="products-page">

        <div className="products-loading">

          <div className="loading-spinner"></div>

          <p>
            Loading products...
          </p>

        </div>

      </div>
    );
  }

  // ======================================
  // UI
  // ======================================

  return (
    <div className="products-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="products-header">

        <div>

          <h1>
            Products
          </h1>

          <p className="products-subtitle">
            {isAdmin
              ? "Manage your products"
              : "Browse available products"}
          </p>

        </div>

        <div className="products-header-actions">

          <span
            className={
              isAdmin
                ? "products-role-badge admin"
                : "products-role-badge user"
            }
          >
            {isAdmin
              ? "👑 Admin"
              : "👤 View Only"}
          </span>

          <button
            type="button"
            className="back-dashboard-button"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            ← Dashboard
          </button>

        </div>

      </div>

      {/* ======================================
          SUCCESS MESSAGE
      ====================================== */}

      {message && (
        <div className="product-success-message">
          ✓ {message}
        </div>
      )}

      {/* ======================================
          ERROR MESSAGE
      ====================================== */}

      {error && (
        <div className="product-error-message">
          ⚠ {error}
        </div>
      )}

      {/* ======================================
          ADMIN PRODUCT FORM
      ====================================== */}

      {isAdmin && (

        <div className="product-form-card">

          <div className="product-form-header">

            <div>

              <h2>
                {editingId
                  ? "✏️ Update Product"
                  : "➕ Add New Product"}
              </h2>

              <p>
                {editingId
                  ? "Update the selected product details"
                  : "Add a new product to your store"}
              </p>

            </div>

          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="product-form"
          >

            {/* NAME */}

            <div className="form-group">

              <label>
                Product Name
              </label>

              <input
                type="text"
                placeholder="Enter product name"
                {...register("name", {
                  required:
                    "Product name is required",

                  minLength: {
                    value: 3,
                    message:
                      "Product name must be at least 3 characters"
                  },

                  maxLength: {
                    value: 50,
                    message:
                      "Product name cannot exceed 50 characters"
                  }
                })}
              />

              {errors.name && (
                <span className="field-error">
                  {errors.name.message}
                </span>
              )}

            </div>

            {/* DESCRIPTION */}

            <div className="form-group">

              <label>
                Description
              </label>

              <textarea
                placeholder="Enter product description"
                rows="4"
                {...register("description", {
                  required:
                    "Product description is required",

                  minLength: {
                    value: 10,
                    message:
                      "Description must be at least 10 characters"
                  },

                  maxLength: {
                    value: 500,
                    message:
                      "Description cannot exceed 500 characters"
                  }
                })}
              ></textarea>

              {errors.description && (
                <span className="field-error">
                  {errors.description.message}
                </span>
              )}

            </div>

            {/* PRICE + STOCK */}

            <div className="form-row">

              <div className="form-group">

                <label>
                  Price
                </label>

                <input
                  type="number"
                  step="0.01"
                  placeholder="Enter price"
                  {...register("price", {
                    required:
                      "Price is required",

                    min: {
                      value: 0.01,
                      message:
                        "Price must be greater than 0"
                    }
                  })}
                />

                {errors.price && (
                  <span className="field-error">
                    {errors.price.message}
                  </span>
                )}

              </div>

              <div className="form-group">

                <label>
                  Stock
                </label>

                <input
                  type="number"
                  placeholder="Enter stock"
                  {...register("stock", {
                    required:
                      "Stock is required",

                    min: {
                      value: 0,
                      message:
                        "Stock cannot be negative"
                    },

                    validate: (value) =>
                      Number.isInteger(
                        Number(value)
                      ) ||
                      "Stock must be a whole number"
                  })}
                />

                {errors.stock && (
                  <span className="field-error">
                    {errors.stock.message}
                  </span>
                )}

              </div>

            </div>

            {/* CATEGORY */}

            <div className="form-group">

              <label>
                Category
              </label>

              <input
                type="text"
                placeholder="Enter category"
                {...register("category", {
                  required:
                    "Category is required"
                })}
              />

              {errors.category && (
                <span className="field-error">
                  {errors.category.message}
                </span>
              )}

            </div>

            {/* IMAGE */}

            <div className="form-group">

              <label>

                Product Image

                {editingId && (
                  <span className="optional-text">
                    {" "}
                    (optional while updating)
                  </span>
                )}

              </label>

              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                {...register("image", {

                  validate: (files) => {

                    if (
                      !files ||
                      !files.length
                    ) {
                      return editingId
                        ? true
                        : "Product image is required";
                    }

                    const file = files[0];

                    const allowedTypes = [
                      "image/jpeg",
                      "image/png",
                      "image/webp"
                    ];

                    if (
                      !allowedTypes.includes(
                        file.type
                      )
                    ) {
                      return "Only JPG, JPEG, PNG and WEBP images are allowed";
                    }

                    if (
                      file.size >
                      5 * 1024 * 1024
                    ) {
                      return "Image size must be less than 5MB";
                    }

                    return true;
                  }

                })}
              />

              {errors.image && (
                <span className="field-error">
                  {errors.image.message}
                </span>
              )}

            </div>

            {/* FORM BUTTONS */}

            <div className="product-form-buttons">

              <button
                type="submit"
                className="add-product-button"
                disabled={submitLoading}
              >

                {submitLoading
                  ? editingId
                    ? "Updating..."
                    : "Adding..."
                  : editingId
                    ? "✓ Update Product"
                    : "＋ Add Product"}

              </button>

              {editingId && (

                <button
                  type="button"
                  className="cancel-product-button"
                  onClick={handleCancelEdit}
                  disabled={submitLoading}
                >
                  Cancel
                </button>

              )}

            </div>

          </form>

        </div>

      )}

      {/* ======================================
          USER VIEW ONLY
      ====================================== */}

      {!isAdmin && (

        <div className="products-view-only">

          <span>
            👀
          </span>

          <div>

            <strong>
              View Only Mode
            </strong>

            <p>
              You can view products, but only
              administrators can add, update or
              delete products.
            </p>

          </div>

        </div>

      )}

      {/* ======================================
          PRODUCT LIST
      ====================================== */}

      <div className="products-list-card">

        <div className="products-list-header">

          <div>

            <h2>
              Available Products
            </h2>

            <p>
              {products.length} product
              {products.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>

          </div>

        </div>

        {products.length === 0 ? (

          <div className="products-empty">

            <div className="empty-icon">
              📦
            </div>

            <h3>
              No products found
            </h3>

            <p>
              {isAdmin
                ? "Add your first product using the form above."
                : "There are no products available right now."}
            </p>

          </div>

        ) : (

          <div className="products-grid">

            {products.map((product) => (

              <div
                className="product-card"
                key={product._id}
              >

                {/* IMAGE */}

                <div className="product-image-container">

                  {product.image ? (

                    <img
                      src={`http://localhost:5000${product.image}`}
                      alt={product.name}
                      className="product-image"
                    />

                  ) : (

                    <div className="product-no-image">
                      📦
                    </div>

                  )}

                </div>

                {/* PRODUCT CONTENT */}

                <div className="product-card-content">

                  <div className="product-card-top">

                    <h3>
                      {product.name}
                    </h3>

                    <span className="product-category">
                      {product.category}
                    </span>

                  </div>

                  <p className="product-description">
                    {product.description}
                  </p>

                  <div className="product-details">

                    <div className="product-price">
                      ₹
                      {Number(
                        product.price
                      ).toFixed(2)}
                    </div>

                    <div className="product-stock">
                      Stock: {product.stock}
                    </div>

                  </div>

                  {/* ADMIN ACTIONS */}

                  {isAdmin && (

                    <div className="product-actions">

                      <button
                        type="button"
                        className="edit-product-button"
                        onClick={() =>
                          handleEdit(product)
                        }
                        disabled={submitLoading}
                      >
                        ✏️ Edit
                      </button>

                      <button
                        type="button"
                        className="delete-product-button"
                        disabled={
                          deleteLoading ===
                          product._id ||
                          submitLoading
                        }
                        onClick={() =>
                          handleDelete(
                            product._id
                          )
                        }
                      >

                        {deleteLoading ===
                        product._id
                          ? "Deleting..."
                          : "🗑️ Delete"}

                      </button>

                    </div>

                  )}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default Products;