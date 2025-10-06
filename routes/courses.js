const express = require("express");
const { getCourses, getCourse, addCourse } = require("../controllers/courses");

// Merge params to get access to bootcampId in the params
const router = express.Router({ mergeParams: true });

router.route("/").get(getCourses).post(addCourse);
router.route("/:id").get(getCourse);

module.exports = router;
