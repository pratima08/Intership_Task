import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Products() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: ""
  });

  const [editingId, setEditingId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================
  // GET PRODUCTS
  // ==========================
  const fetchProducts = async () => {
    try {
      const response = await api.get("/products", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setProducts(response.data.products);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        navigate("/login");
      }

      setError("Unable to fetch products");
    }
  };


  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchProducts();
  }, [token]);


  // ==========================
  // INPUT CHANGE
  // ==========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  // ==========================
  // CREATE / UPDATE PRODUCT
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      if (editingId) {
        // UPDATE
        const response = await api.put(
          `/products/${editingId}`,
          {
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock)
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setMessage(response.data.message);
      } else {
        // CREATE
        const response = await api.post(
          "/products",
          {
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock)
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setMessage(response.data.message);
      }

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: ""
      });

      setEditingId(null);

      // Refresh products
      fetchProducts();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Something went wrong"
      );
    }
  };


  // ==========================
  // EDIT PRODUCT
  // ==========================
  const handleEdit = (product) => {
    setEditingId(product._id);

    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };


  // ==========================
  // DELETE PRODUCT
  // ==========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await api.delete(
        `/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage(response.data.message);

      fetchProducts();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to delete product"
      );
    }
  };


  // ==========================
  // CANCEL EDIT
  // ==========================
  const handleCancel = () => {
    setEditingId(null);

    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: ""
    });

    setMessage("");
    setError("");
  };


  return (
    <div className="products-page">

      {/* HEADER */}
      <div className="products-header">

        <div>
          <h1>Product Management</h1>
          <p>Manage your products</p>
        </div>

        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>

      </div>


      {/* FORM */}
      <div className="product-form-card">

        <h2>
          {editingId ? "Update Product" : "Add Product"}
        </h2>

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Product Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </div>


          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              required
            />
          </div>


          <div className="product-form-row">

            <div className="form-group">
              <label>Price</label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                min="0"
                required
              />
            </div>


            <div className="form-group">
              <label>Category</label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Enter category"
                required
              />
            </div>


            <div className="form-group">
              <label>Stock</label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Enter stock"
                min="0"
                required
              />
            </div>

          </div>


          <div className="product-form-buttons">

            <button
              type="submit"
              className="product-submit-button"
            >
              {editingId ? "Update Product" : "Add Product"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </div>


      {/* PRODUCT LIST */}
      <div className="product-list-card">

        <h2>Product List</h2>

        {products.length === 0 ? (
          <p className="no-products">
            No products found.
          </p>
        ) : (

          <div className="product-table-wrapper">

            <table className="product-table">

              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {products.map((product) => (

                  <tr key={product._id}>

                    <td>{product.name}</td>

                    <td>{product.description}</td>

                    <td>₹{product.price}</td>

                    <td>{product.category}</td>

                    <td>{product.stock}</td>

                    <td>

                      <div className="product-actions">

                        <button
                          className="edit-product-button"
                          onClick={() => handleEdit(product)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-product-button"
                          onClick={() =>
                            handleDelete(product._id)
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default Products;