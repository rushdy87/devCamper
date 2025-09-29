const express = require("express");
const dotenv = require("dotenv");
// morgan is a third party logging library for logging HTTP requests
const morgan = require("morgan");
// colors is an optional library to add colors to console outputs
const colors = require("colors");
const connectDB = require("./config/db");

// Route files
const bootcamps = require("./routes/bootcamps");

//  Load environment variables from .env file
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount routers
app.use("/api/v1/bootcamps", bootcamps);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
/* Some notes about Handling Unhandled Promise Rejections:
1. An unhandled promise rejection occurs when a promise is rejected, and there is no .catch() handler to handle the rejection.
2. This can lead to unexpected behavior in your application, as the error may go unnoticed and cause issues later on.
3. To handle unhandled promise rejections, you can use the process.on('unhandledRejection') event listener to catch any unhandled rejections and log them or take appropriate action.
4. In the code above, we log the error message and then close the server and exit the process with a non-zero exit code to indicate that an error occurred.
5. It's important to note that unhandled promise rejections should be avoided whenever possible by always including a .catch() handler for promises that may be rejected.
*/
