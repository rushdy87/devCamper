// Middleware to handle advanced filtering, sorting, and pagination
const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Finding resources
  query = model.find(JSON.parse(queryStr));

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Populate related fields
  if (populate) {
    query = query.populate(populate);
  }

  // Executing query
  const results = await query;

  // Pagination results
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };

  next();
};

module.exports = advancedResults;

// Notes about the code above:
// 1. This middleware function takes a Mongoose model and an optional populate parameter.
// 2. It processes the request query parameters to build a Mongoose query with filtering, selecting, sorting, and pagination.
// 3. The results of the query are attached to the response object as res.advancedResults for use in subsequent middleware or route handlers.

// Example usage in a route:
// const advancedResults = require('../middlewares/advancedResults');
// const Bootcamp = require('../models/Bootcamp');
// router.route('/').get(advancedResults(Bootcamp, 'courses'), getBootcamps);

// In the example above, the getBootcamps controller can access the results via res.advancedResults.

// This approach -function return a middleware function- allows for reusability across different routes and models.

// The populate parameter allows for populating related fields in the query results, enhancing the flexibility of the middleware.

// Note: Ensure to handle errors and edge cases as needed in a production environment.

// The use of async/await ensures that the middleware handles asynchronous operations cleanly, avoiding callback hell.

// The middleware also supports advanced filtering using MongoDB operators like $gt, $gte, $lt, $lte, and $in by transforming the query string accordingly.

// The pagination logic calculates the start and end indices based on the requested page and limit, allowing for efficient data retrieval in chunks.
// The middleware excludes certain fields from the query parameters to prevent them from interfering with the filtering logic.

// The middleware sorts results based on the provided sort parameter or defaults to sorting by creation date in descending order.

// The select parameter allows clients to specify which fields they want in the response, optimizing data transfer and performance.

// The middleware counts the total number of documents in the collection to facilitate pagination metadata in the response.

// The final response structure includes success status, count of results, pagination info, and the actual data array.

// This middleware can be easily extended or modified to include additional features as needed for specific applications.

// The use of regular expressions in the query string transformation allows for dynamic and flexible querying capabilities.

// The middleware is designed to be generic and can be applied to any Mongoose model, making it a versatile tool for API development.
// The middleware ensures that the response is consistent and structured, making it easier for clients to consume the API.
