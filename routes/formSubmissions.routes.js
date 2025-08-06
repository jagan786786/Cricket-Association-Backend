const express = require("express");
const multer = require("multer");
const router = express.Router();

const upload = multer(); // Parses multipart/form-data in memory

const {
  submitForm,
  getSubmissionsByForm,
} = require("../controllers/formSubmission.controllers");

// Add `upload.any()` middleware here to parse the FormData request
router.post("/:formId", upload.any(), submitForm);
router.get("/:formId", getSubmissionsByForm);

module.exports = router;
