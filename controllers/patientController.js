const Patient = require("./../models/patientModel");

exports.getAllPatients = async (req, res) => {
  try {
    // BUILD QUERY
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Filtering: Pass conditional operator in parameter
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => {
      `$${match}`;
      console.log(JSON.parse(queryStr));
    });

    const query = Patient.find(JSON.parse(queryStr));
    // EXECUTE QUERY
    const patients = await query;

    // RESPONSE
    res.status(200).json({
      status: "success",
      results: patients.length,
      data: {
        patients,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "Failed",
      message: err,
    });
  }
};

exports.getPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    // Patient.findOne({_id: req.params.id})
    res.status(200).json({
      status: "success",
      data: {
        patient,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "Failed",
      message: err,
    });
  }
};

exports.createPatient = async (req, res) => {
  try {
    const newPatient = await Patient.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        patient: newPatient,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: "Invalid Input",
    });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        patient,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "Failed",
      message: err,
    });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "Failed",
      message: err,
    });
  }
};
