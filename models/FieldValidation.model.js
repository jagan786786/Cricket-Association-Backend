const mongoose = require("mongoose");

const fieldValidationSchema = new mongoose.Schema({
  rule: {
    type: String,
    enum: [
      "minLength",
      "maxLength",
      "min",
      "max",
      "pattern",
      "email",
      "url",
      "custom",
    ],
    required: true,
  },
  value: mongoose.Schema.Types.Mixed,
  message: String,
});

module.exports = mongoose.model("FieldValidation", fieldValidationSchema);
