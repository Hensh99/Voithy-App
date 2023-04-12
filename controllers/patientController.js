const fs = require("fs");

const patients = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/patients-simple.json`)
);

exports.getAllPatients = (req, res) => {
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: patients.length,
    data: {
      patients,
    },
  });
};

exports.getPatient = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1; // A trick to convert the id from string to number
  const patient = patients.find((el) => el.id === id); // call back function to compare the element

  if (!patient) {
    return res.status(404).json({
      status: "Failed",
      message: "Invalid ID",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      patient,
    },
  });
};

exports.createPatient = (req, res) => {
  const newId = patients[patients.length - 1].id + 1;
  const newPatient = Object.assign({ id: newId }, req.body);

  patients.push(newPatient);
  fs.writeFile(
    `${__dirname}/dev-data/data/patients-simple.json`,
    JSON.stringify(patients),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          patient: newPatient,
        },
      });
    }
  );
};

exports.updatePatient = (req, res) => {
  if (req.params.id * 1 > patients.length) {
    return res.status(404).json({
      status: "Failed",
      message: "Invalid ID",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      patient: "<Updated patient here...>",
    },
  });
};

exports.deletePatient = (req, res) => {
  if (req.params.id * 1 > patients.length) {
    return res.status(404).json({
      status: "Failed",
      message: "Invalid ID",
    });
  }
  res.status(204).json({
    // 204: No-Content
    status: "success",
    data: null,
  });
};
