const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, `The name of the patient is required`],
    unique: true,
  },
  age: Number,
  fees: {
    type: Number,
    required: [true, `The fees is required`],
  },
});

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
