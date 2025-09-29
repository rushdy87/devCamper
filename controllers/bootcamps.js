const Bootcamp = require("../models/Bootcamp");

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();
    return res
      .status(200)
      .json({ success: true, count: bootcamps.length, data: bootcamps });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, msg: "An internal server error occurred" });
  }
};

// @desc Get single bootcamp
// @route GET /api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bootcamp = await Bootcamp.findById(id);
    if (!bootcamp) {
      return res
        .status(400)
        .json({ success: false, msg: `No bootcamp with the id of ${id}` });
    }
    return res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, msg: "An internal server error occurred" });
  }
};

// @desc Create new bootcamp
// @route POST /api/v1/bootcamps
// @access Private
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);

    return res.status(201).json({ success: true, data: bootcamp });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, msg: "An internal server error occurred" });
  }
};

// @desc Update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access Private
exports.updateBootcamp = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {
      new: true, // return the modified document rather than the original
      runValidators: true, // run schema validators on update
    });
    if (!bootcamp) {
      return res
        .status(400)
        .json({ success: false, msg: `No bootcamp with the id of ${id}` });
    }
    return res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, msg: "An internal server error occurred" });
  }
};

// @desc Delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bootcamp = await Bootcamp.findByIdAndDelete(id);
    if (!bootcamp) {
      return res
        .status(400)
        .json({ success: false, msg: `No bootcamp with the id of ${id}` });
    }
    return res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, msg: "An internal server error occurred" });
  }
};
