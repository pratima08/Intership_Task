# MERN Authentication & Product Management System

A full-stack MERN application developed as an internship project.

The project includes user authentication, role-based authorization,
user profile management, product CRUD operations, image upload,
form validation, pagination and sorting support, API integration,
loading states, error handling and protected routes.

---

## Technologies Used

### Frontend

- React
- Vite
- React Router
- Axios
- React Hook Form
- JavaScript
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- Multer
- CORS
- dotenv

---

# Project Features

## Authentication

- User Registration
- User Login
- JWT Authentication
- Password Hashing
- Logout
- Authentication state management
- Token storage using localStorage

---

## Authorization

The application supports role-based authorization.

Roles:

- Admin
- User

Admin-only APIs are protected using role-based middleware.

---

## User Module

The application provides user profile functionality.

Features:

- Get logged-in user profile
- Display user name
- Display email
- Display role
- Display user ID

---

## Product Management

The application provides complete product CRUD functionality.

Features:

- Create product
- View products
- View product by ID
- Update product
- Delete product
- Product image upload
- Product validation
- Product category
- Product price
- Product stock
- Product description

---

## Image Upload

Product images can be uploaded using Multer.

Supported formats:

- JPG
- JPEG
- PNG
- WEBP

Maximum image size:

```text
5 MB