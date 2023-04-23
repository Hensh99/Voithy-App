const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, `The name of the patient is required`],
    unique: true,
    trim: true,
    maxLength: [40, "Please try again, The maximum length is 40 characters"],
    minLength: [15, "Please try again, The minimum length is 15 characters"],
  },
  gender: {
    type: String,
    required: [true, `The gender of the patient is required`],
  },
  bloodType: {
    type: String,
    required: [true, `The Blood Type of the patient is required`],
    enum: {
      values: ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"],
      message: "please enter a valid blood type (e.g. A+,O-,..ETC)",
    },
  },
  age: {
    type: Number,
    default: 0,
    min: [0, `The minimum age is zero`],
    max: [120, `The maximum age is 120`],
  },
  height: {
    type: Number,
    required: [true, `The height is required`],
  },
  weight: {
    type: Number,
    required: [true, `The weight is required`],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  appointmentDates: [Date],
  secretPatient: {
    type: Boolean,
    default: false,
  },
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
// patientSchema.pre("save", function (next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

// QUERY MIDDLEWARE
patientSchema.pre(/^find/, function (next) {
  this.find({ secretPatient: { $ne: true } });
  this.start = Date.now();
  next();
});

patientSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

// AGGREGATION MIDDLEWARE
patientSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretPatient: { $ne: true } } });
  next();
});

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;

// Four types of middleware in mongoose: document, query, aggregate and model middleware
