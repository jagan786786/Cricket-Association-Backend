const FormSchema = require("../models/FormSchema.model");
const FormSubmission = require("../models/FormSubmission.model");

// Handle form submission
exports.submitForm = async (req, res) => {
  const { formId } = req.params;

  let formData;

  try {
    // Ensure "data" exists
    if (!req.body.data) {
      return res
        .status(400)
        .json({ message: "`data` field is missing in the form submission." });
    }

    // Parse JSON payload from the "data" field in FormData
    formData = JSON.parse(req.body.data);
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Invalid JSON in `data` field.", error: err.message });
  }

  try {
    // Validate formId
    const form = await FormSchema.findById(formId).populate("fields");
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    // Handle uploaded files (if any)
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        if (formData[file.fieldname]) {
          if (Array.isArray(formData[file.fieldname])) {
            formData[file.fieldname].push(file.originalname);
          } else {
            formData[file.fieldname] = file.originalname;
          }
        } else {
          formData[file.fieldname] = file.originalname;
        }
      });
    }

    // Save to DB
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
