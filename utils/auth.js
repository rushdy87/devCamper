// @desc    Create token and send response
// @param   {Object} user - Mongoose user model instance
// @param   {number} statusCode - HTTP status code for the response

// @param   {Object} res - Express response object
exports.sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // cookie cannot be accessed or modified by the client-side JavaScript
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true; // cookie will only be sent over HTTPS in production
  }

  res
    .status(statusCode)
    .cookie("token", token, options) // set cookie named 'token' with the JWT token
    .json({
      success: true,
      token,
    });
};
