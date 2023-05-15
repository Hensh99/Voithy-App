const express = require("express");
const patientController = require("./../controllers/patientController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.route("/patient-stats").get(patientController.getPatientStats);

router
  .route("/")
  .get(authController.protect, patientController.getAllPatients)
  .post(patientController.createPatient);

router
  .route("/:id")
  .get(patientController.getPatient)
  .patch(patientController.updatePatient)
  .delete(patientController.deletePatient);

module.exports = router;
