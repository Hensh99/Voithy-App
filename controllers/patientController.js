const Patient = require("./../models/patientModel");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getAllPatients = catchAsync(async (req, res, next) => {
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
});

exports.getPatient = catchAsync(async (req, res, next) => {
  const patient = await Patient.findById(req.params.id);
  // Patient.findOne({_id: req.params.id})

  if (!patient) {
    return next(new AppError("No patient exist with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      patient,
    },
  });
});

exports.createPatient = catchAsync(async (req, res, next) => {
  const newPatient = await Patient.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      patient: newPatient,
    },
  });
});

exports.updatePatient = catchAsync(async (req, res, next) => {
  const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!patient) {
    return next(new AppError("No patient exist with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      patient,
    },
  });
});

exports.deletePatient = catchAsync(async (req, res, next) => {
  const patient = await Patient.findByIdAndDelete(req.params.id);

  if (!patient) {
    return next(new AppError("No patient exist with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getPatientStats = catchAsync(async (req, res, next) => {
  const stats = await Patient.aggregate([
    {
      $match: { age: { $gte: 15 } },
    },
    {
      $group: {
        _id: { $toUpper: "$age" },
        numPatients: { $sum: 1 },
        avgAge: { $avg: "$age" },
        avgHeight: { $avg: "$height" },
        avgWeight: { $avg: "$weight" },
        minAge: { $min: "$age" },
        maxAge: { $max: "$age" },
      },
    },
    {
      $sort: { minAge: 1 },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});
