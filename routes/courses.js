const express = require("express");
const { getCourses } = require("../controllers/courses");

// Merge params to get access to bootcampId in the params
const router = express.Router({ mergeParams: true });

router.route("/").get(getCourses);

module.exports = router;
