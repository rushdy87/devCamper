const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Create user
  const user = await User.create({ name, email, password, role });

  // Create token
  const token = user.getSignedJwtToken();

  res.status(201).json({ success: true, token });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select("+password");
  // About the select("+password"):
  // In the User model, the password field has 'select: false', which means it won't be returned by default in queries.
  // To include the password field in this query, we use .select("+password").
  // The '+' indicates that we want to include a field that is not selected by default.
  // This is necessary here because we need to compare the provided password with the hashed password stored in the database.

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Create token
  const token = user.getSignedJwtToken();

  res.status(200).json({ success: true, token });
});
