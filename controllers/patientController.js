const Patient = require("./../models/patientModel");
const APIFeatures = require("./../utils/apiFeatures");

exports.getAllPatients = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Patient.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const patients = await features.query;

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
