const express = require("express");
const { getCourses, getCourse } = require("../controllers/courses");

// Merge params to get access to bootcampId in the params
const router = express.Router({ mergeParams: true });

router.route("/").get(getCourses);
router.route("/:id").get(getCourse);

module.exports = router;
