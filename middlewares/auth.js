const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// @desc    Protect routes
// @access  Private
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];
  }
  // else if (req.cookies.token) {
  //   // Set token from cookie
  //   token = req.cookies.token;
  // }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  // The token contains the payload data we signed the token with, in this case the user ID
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);

    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
});

// protect is a middleware function that can be used to protect routes by ensuring that the request has a valid JWT token.
// It checks for the token in the Authorization header, verifies it, and attaches the authenticated user to the request object.
// If the token is missing or invalid, it responds with a 401 Unauthorized error.

// @desc    Grant access to specific roles
// @access  Private
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

// authorize is a middleware function that restricts access to certain routes based on user roles.
// It takes a list of allowed roles as arguments and checks if the authenticated user's role is included in that list.
// If the user's role is not authorized, it responds with a 403 Forbidden error.
