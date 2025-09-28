// @desc Middleware to log HTTP requests
// I will use Morgan in the future for more advanced logging
// For now, this is a simple custom logger middleware
// Usage: app.use(logger) in server.js
exports.logger = (req, res, next) => {
  console.log(
    `${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl}`
  );
  next();
};
