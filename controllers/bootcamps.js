const path = require("path");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults);
});

// @desc Get single bootcamp
// @route GET /api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const bootcamp = await Bootcamp.findById(id);
  if (!bootcamp) {
    return next(new ErrorResponse(`No bootcamp with the id of ${id}`, 404));
  }
  return res.status(200).json({ success: true, data: bootcamp });
});

// @desc Create new bootcamp
// @route POST /api/v1/bootcamps
// @access Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  return res.status(201).json({ success: true, data: bootcamp });
});

// @desc Update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const bootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {
    new: true, // return the modified document rather than the original
    runValidators: true, // run schema validators on update
  });
  if (!bootcamp) {
    return next(new ErrorResponse(`No bootcamp with the id of ${id}`, 404));
  }
  return res.status(200).json({ success: true, data: bootcamp });
});

// @desc Delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const bootcamp = await Bootcamp.findById(id);
  if (!bootcamp) {
    return next(new ErrorResponse(`No bootcamp with the id of ${id}`, 404));
  }

  await bootcamp.deleteOne(); // triggers the 'deleteOne' middleware in the Bootcamp model to cascade delete related courses

  return res.status(200).json({ success: true, data: {} });
});

//* Additional controller methods for advanced features can be added here
//* such as filtering, pagination, and geospatial queries.
//* These can be implemented as needed based on project requirements.

// @desc Get bootcamps within a radius
// @route GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  //// const loc = await geocoder.geocode(zipcode);
  //// const lat = await loc[0].latitude;
  //// const lng = await loc[0].longitude;
  const lat = 2.3072976;
  const lng = 48.8698679;

  // Calc radius using radians
  // Divide distance by radius of Earth
  // Earth Radius = 3,963 mi (6,378 km)
  const radius = distance / 3963;

  // $geoWithin - MongoDB operator to find documents within a certain geometry
  // $centerSphere - defines a circle for a geospatial query
  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

// @desc Upload photo for bootcamp
// @route PUT /api/v1/bootcamps/:id/photo
// @access  Private

exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const bootcamp = await Bootcamp.findById(id);
  if (!bootcamp) {
    return next(new ErrorResponse(`No bootcamp with the id of ${id}`, 404));
  }

  // Check if a file is uploaded
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const { file } = req.files;

  // Make sure the image is a photo
  // startsWith() method determines whether a string begins with the characters of a specified string, returning true or false as appropriate.
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  // Move file to upload directory
  // mv() is a method provided by the express-fileupload middleware to move the file to a specified location
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Bootcamp.findByIdAndUpdate(id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
