const express = require("express");
const router = express.Router();
const {
  submitForm,
  getSubmissionsByForm,
} = require("../controllers/formSubmission.controllers");

router.post("/:formId", submitForm);
router.get("/:formId", getSubmissionsByForm);

module.exports = router;
