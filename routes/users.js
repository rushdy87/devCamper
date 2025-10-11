const express = require("express");

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");

const User = require("../models/User");
const advancedResults = require("../middlewares/advancedResults");
const { protect, authorize } = require("../middlewares/auth");

const router = express.Router();

// By adding protect and authorize middleware, all routes below are protected and only accessible by admin users
router.use(protect);
router.use(authorize("admin"));

router.route("/").get(advancedResults(User), getUsers).post(createUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
