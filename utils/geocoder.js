const nodeGeocoder = require("node-geocoder");

const options = {
  provider: process.env.GEOCODER_PROVIDER,
  httpAdapter: "https",
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null,
};

const geocoder = nodeGeocoder(options);

module.exports = geocoder;

// Geocoder is a tool that converts addresses (like "1600 Amphitheatre Parkway, Mountain View, CA") into geographic coordinates (like latitude 37.423021 and longitude -122.083739), which you can use to place markers on a map, or position the map.
// Node-geocoder is a Node.js library that provides a simple way to perform geocoding and reverse geocoding operations using various geocoding providers.
// Node-geocoder supports multiple geocoding providers, including Google Maps, OpenStreetMap, MapQuest, and others. You can choose a provider based on your requirements and API availability.
