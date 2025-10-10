const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const { sendTokenResponse, sendEmail } = require("../utils/auth");
const crypto = require("crypto");

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Create user
  const user = await User.create({ name, email, password, role });

  // sendTokenResponse is a utility function that creates a JWT token, sets it in an HTTP-only cookie, and sends the response
  sendTokenResponse(user, 200, res);
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

  // sendTokenResponse is a utility function that creates a JWT token, sets it in an HTTP-only cookie, and sends the response
  sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  // req.user is set in the protect middleware after verifying the JWT token
  const user = await User.findById(req.user.id);

  res.status(200).json({ success: true, data: user });
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse("There is no user with that email", 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  // Save the updated user object with the reset token and expiration
  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to:
  \n\n ${resetUrl}
  \n\nIf you did not request this, please ignore this email.
  \n\n This reset link is valid for only 10 minutes.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });

    res.status(200).json({ success: true, data: "Email sent" });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse("Email could not be sent", 500));
  }
});

// desc    Reset password
// route   PUT /api/v1/auth/resetpassword/:resettoken
// access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { resettoken } = req.params;

  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resettoken)
    .digest("hex");

  // Find user by the hashed token and ensure the token has not expired
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});
