const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, `The name of the patient is required`],
    unique: true,
    trim: true,
  },
  gender: {
    type: String,
    required: [true, `The gender of the patient is required`],
  },
  bloodType: {
    type: String,
    required: [true, `The Blood Type of the patient is required`],
  },
  age: {
    type: Number,
    default: 0,
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
});

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
