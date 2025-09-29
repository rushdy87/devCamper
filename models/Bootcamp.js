const mongoose = require("mongoose");

// Create Bootcamp schema, and Schema is like a blueprint of how the data should look like
const BootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    unique: true,
    trim: true,
    maxlength: [50, "Name can not be more than 50 characters"],
  },
  slug: String,
  description: {
    type: String,
    required: [true, "Please add a description"],
    maxlength: [500, "Description can not be more than 500 characters"],
  },
  website: {
    type: String,
    required: [true, "Please add a website URL"],
    match: [
      /https?:\/\/(www\.)?[a-z0-9.-]+\.[a-z]{2,}/,
      "Please use a valid URL with HTTP or HTTPS",
    ],
  },
  phone: {
    type: String,
    required: [true, "Please add a phone number"],
    maxlength: [20, "Phone number can not be more than 20 characters"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  address: {
    type: String,
    required: [true, "Please add an address"],
  },
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
      index: "2dsphere",
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  careers: {
    type: [String],
    required: true,
    enum: [
      "Web Development",
      "Mobile Development",
      "UI/UX",
      "Data Science",
      "Business",
      "Other",
    ],
  },
  averageRating: {
    type: Number,
    min: [1, "Rating must be at least 1"],
    max: [10, "Rating can not be more than 10"],
  },
  averageCost: Number,
  photo: {
    type: String,
    default: "no-photo.jpg",
  },
  housing: {
    type: Boolean,
    default: false,
  },
  jobAssistance: {
    type: Boolean,
    default: false,
  },
  jobGuarantee: {
    type: Boolean,
    default: false,
  },
  acceptGi: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create Bootcamp model, and the model is a class with which we construct documents. In this case, each document will be a bootcamp with the properties and behaviors defined by the schema.
module.exports = mongoose.model("Bootcamp", BootcampSchema);

// Slug is a URL friendly version of the name (usually lowercase and hyphenated) for example if the name is "Dev Bootcamp" the slug will be "dev-bootcamp"
// The match property in the website field is a regular expression that validates the URL format to ensure it starts with http or https and is a valid domain.
// The GeoJSON Point format is used for storing location data in MongoDB, which includes a type (Point) and coordinates (an array of numbers representing longitude and latitude).
// The index: "2dsphere" option creates a geospatial index on the coordinates field, allowing for efficient geospatial queries.
// The geospatial means related to geographic locations on the Earth's surface, and in MongoDB, it allows for querying and indexing of location-based data.
// enum is used to specify a set of allowed values for a field, ensuring that the value stored in the field is one of the predefined options.
