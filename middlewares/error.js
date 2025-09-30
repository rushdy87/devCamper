const ErrorResponse = require("../utils/errorResponse");

exports.errorHandler = (err, req, res, next) => {
  let error = { ...err };

  console.log(err.name, err.code);

  error.message = err.message;

  //  Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  //  Mongoose duplicate key
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new ErrorResponse(message, 400);
  }

  //  Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  res.status(statusCode).json({ success: false, error: message });
};
// The error handling middleware captures errors passed to next() in route handlers and sends a structured JSON response with appropriate status codes and messages.
// It also handles specific Mongoose errors like CastError, duplicate key errors, and validation errors to provide more meaningful feedback to API consumers.
// Note: The 'next' parameter is required to identify this function as an error handling middleware in Express, even if it's not used within the function.
