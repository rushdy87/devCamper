const express = require("express");
const dotenv = require("dotenv");

//  Load environment variables from .env file
dotenv.config({ path: "./config/config.env" });

// Initialize Express app
const app = express();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
