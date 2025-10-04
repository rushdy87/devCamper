const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a course title"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  weeks: {
    type: String,
    required: [true, "Please add the number of weeks"],
  },
  tuition: {
    type: Number,
    required: [true, "Please add the tuition cost"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add a minimum skill level"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: Schema.Types.ObjectId,
    ref: "Bootcamp",
    required: [true, "Please add a bootcamp"],
  },
});

module.exports = mongoose.model("Course", CourseSchema);
