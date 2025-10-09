const express = require("express");
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");
const advancedResults = require("../middlewares/advancedResults");
const Course = require("../models/Course");
const { protect } = require("../middlewares/auth");

// Merge params to get access to bootcampId in the params
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    advancedResults(Course, { path: "bootcamp", select: "name description" }),
    getCourses
  )
  .post(protect, addCourse);
router
  .route("/:id")
  .get(getCourse)
  .put(protect, updateCourse)
  .delete(protect, deleteCourse);

module.exports = router;
// The mergeParams option is set to true to allow access to parameters from parent routes, such as bootcampId when adding a course to a specific bootcamp.
// This is necessary because the courses router is nested under the bootcamps router in routes/bootcamps.js
// Example: POST /api/v1/bootcamps/:bootcampId/courses to add a course to a specific bootcamp

// The protect middleware is applied to routes that require authentication, such as adding, updating, or deleting a course
// This ensures that only authenticated users can perform these actions

// The advancedResults middleware is used to handle filtering, sorting, pagination, and selecting fields for the GET /api/v1/courses route
// It populates the bootcamp field with the name and description of the associated bootcamp

// The controllers handle the actual logic for each route, such as fetching data from the database, creating new records, updating existing records, and deleting records
// They also handle error cases, such as when a course or bootcamp is not found

// Overall, this setup provides a RESTful API for managing courses associated with bootcamps, with proper authentication and advanced query capabilities
// The Course model includes static methods to calculate the average tuition cost for courses associated with a bootcamp
// This is done using Mongoose aggregation pipelines and middleware to ensure the average cost is updated whenever courses are added, updated, or deleted
// The average cost is stored in the Bootcamp model for easy access and display in the API responses
// This enhances the functionality of the API by providing useful aggregated data about the courses offered by each bootcamp
// The use of asyncHandler middleware helps to streamline error handling in asynchronous route handlers, reducing boilerplate code and improving readability
// Overall, this code provides a robust and scalable foundation for managing bootcamps and their associated courses in a Node.js and Express application using MongoDB and Mongoose
