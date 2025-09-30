const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();
  return res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
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
  const bootcamp = await Bootcamp.findByIdAndDelete(id);
  if (!bootcamp) {
    return next(new ErrorResponse(`No bootcamp with the id of ${id}`, 404));
  }
  return res.status(200).json({ success: true, data: {} });
});
