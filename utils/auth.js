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

// desc    Send email
// param   {Object} options - Options for sending email
// param   {string} options.email - Recipient email address
// param   {string} options.subject - Subject of the email
// param   {string} options.message - Body of the email
const nodemailer = require("nodemailer");

exports.sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`, // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // plain text body
  };

  const info = await transporter.sendMail(message);

  console.log(`Message sent: ${info.messageId}`);
};
