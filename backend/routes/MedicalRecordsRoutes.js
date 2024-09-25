const express = require("express");
const { getMedicalRecordsForUser } = require("../controllers/medicalRecordsController");

const router = express.Router();

// Route to get medical records for a specific user
router.get("/medical-records/:userId", getMedicalRecordsForUser);

module.exports = router;