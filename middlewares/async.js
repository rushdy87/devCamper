const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;

// This middleware wraps asynchronous route handlers to catch errors and pass them to the next middleware (usually the error handler).
// It eliminates the need for repetitive try-catch blocks in each async route handler.
// Usage:
// const asyncHandler = require('./middlewares/async');
// app.get('/route', asyncHandler(async (req, res, next) => { ... }));

// Note: Ensure that the error handling middleware is defined after all routes to catch errors properly.
// Note: The 'next' parameter is required to identify this function as middleware in Express, even if it's not used within the function.
