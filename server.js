const express = require("express");
const dotenv = require("dotenv");
// moran is a third party logging library for logging HTTP requests
const morgan = require("morgan");

// Route files
const bootcamps = require("./routes/bootcamps");

//  Load environment variables from .env file
dotenv.config({ path: "./config/config.env" });

// Initialize Express app
const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount routers
app.use("/api/v1/bootcamps", bootcamps);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
