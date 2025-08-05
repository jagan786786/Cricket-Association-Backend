const FormSchema = require("../models/FormSchema.model");
const FormSubmission = require("../models/FormSubmission.model");

// Handle form submission
exports.submitForm = async (req, res) => {
  const { formId } = req.params;
  const formData = req.body;

  try {
    // Validate formId
    const form = await FormSchema.findById(formId).populate("fields");
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    // Save submission
    const submission = new FormSubmission({
      formId,
      data: formData,
    });

    await submission.save();

    res.status(201).json({
      message: "Form submitted successfully",
      submission,
    });
  } catch (err) {
    console.error("Submission Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch submissions for a specific form
exports.getSubmissionsByForm = async (req, res) => {
  const { formId } = req.params;

  try {
    const submissions = await FormSubmission.find({ formId }).sort({
      createdAt: -1,
    });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching submissions" });
  }
};
