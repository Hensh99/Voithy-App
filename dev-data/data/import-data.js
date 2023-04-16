const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Patient = require("./../../models/patientModel");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then((con) => {
  console.log("DB Connection Successful!");
});

// READ JSON FILE.. json.parse to convert the data from json to js object
const patients = JSON.parse(
  fs.readFileSync(`${__dirname}/patients-simple.json", "utf-8"`)
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Patient.create(patients);
    console.log("The data has been loaded successfully");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Patient.deleteMany();
    console.log("The data has been deleted successfully!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
