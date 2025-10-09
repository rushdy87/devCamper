const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please add a valid email",
    ],
  },
  role: {
    type: String,
    enum: ["user", "publisher"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false, // do not return password field by default when querying users
  },
  resetPasswordToken: String, // token to reset password
  resetPasswordExpire: Date, // expiration time for reset token
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password using bcrypt before saving the user

UserSchema.pre("save", async function (next) {
  // Check if the password field is modified. If not, skip hashing.
  // isModified() method is used to check if a particular field has been modified.
  // This is important because we don't want to re-hash the password if it hasn't changed.
  if (!this.isModified("password")) {
    next();
  }

  // Salt is random data that is used as an additional input to a one-way function that "hashes" a password or passphrase.
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
// We can call this method on a user instance (like user.getSignedJwtToken())
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);

// Notes about role field:
// 1. The 'role' field is defined as a String type in the UserSchema.
// 2. It uses the 'enum' option to restrict its values to either 'user' or 'publisher'.
// 3. The default value for the 'role' field is set to 'user', meaning if no role is specified during user creation, it will automatically be assigned the 'user' role.
// 4. This setup helps in managing user permissions and access levels within the application.
