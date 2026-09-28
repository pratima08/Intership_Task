// DAY 25
// Global API Error Handling Middleware

const errorHandler = (err, req, res, next) => {
  console.error("ERROR:", err);

  let statusCode = res.statusCode !== 200
    ? res.statusCode
    : 500;

  let message =
    err.message || "Something went wrong";

  // MongoDB Cast Error
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // MongoDB Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;

    const messages = Object.values(
      err.errors
    ).map((error) => error.message);

    message = messages.join(", ");
  }

  // Duplicate MongoDB value
  if (err.code === 11000) {
    statusCode = 400;

    const field = Object.keys(
      err.keyPattern || {}
    )[0];

    message =
      `${field || "Field"} already exists`;
  }

  // Multer file size error
  if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 400;
    message = "Image size must be less than 5MB";
  }

  res.status(statusCode).json({
    success: false,
    message
  });
};

module.exports = errorHandler;