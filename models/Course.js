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

// Static method to get avg of course tuitions
// The static method in mongoose is called on the model itself, not on an instance of the model
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  console.log("Calculating avg cost...");

  try {
    // The aggregate method is used to perform aggregation operations on the model's data
    // It takes an array of stages that define the aggregation pipeline.
    const obj = await this.aggregate([
      {
        $match: { bootcamp: bootcampId },
      },
      {
        $group: {
          _id: "$bootcamp",
          averageCost: { $avg: "$tuition" },
        },
      },
    ]);

    // Check if there are any courses for this bootcamp
    if (obj && obj.length > 0) {
      await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
        averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
      });
    } else {
      // If no courses, set average cost to 0 or undefined
      await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
        averageCost: undefined,
      });
    }
  } catch (err) {
    console.error("Error calculating average cost:", err);
  }
};

// Call the method getAverageCost after save
CourseSchema.post("save", async function () {
  await this.constructor.getAverageCost(this.bootcamp);
});

// Call the method getAverageCost before remove
CourseSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function () {
    await this.constructor.getAverageCost(this.bootcamp);
  }
);

// Call the method getAverageCost after remove (for legacy remove method)
CourseSchema.pre("remove", async function () {
  await this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model("Course", CourseSchema);
