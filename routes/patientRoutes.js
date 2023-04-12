const express = require("express");
const patientController = require("./../controllers/patientController");
const router = express.Router();

// Param Middleware
router.param("id", patientController.checkID);

router
  .route("/")
  .get(patientController.getAllPatients)
  .post(patientController.checkBody, patientController.createPatient);

router
  .route("/:id")
  .get(patientController.getPatient)
  .patch(patientController.updatePatient)
  .delete(patientController.deletePatient);

module.exports = router;
