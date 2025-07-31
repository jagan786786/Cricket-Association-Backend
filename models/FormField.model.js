const mongoose = require("mongoose");

const formFieldSchema = new mongoose.Schema({
  name: String,
  label: String,
  fieldType: {
    type: String,
    enum: [
      "text",
      "textarea",
      "email",
      "number",
      "select",
      "checkbox",
      "radio",
      "date",
      "time",
      "file",
      "hidden",
    ],
  },
  dataType: {
    type: String,
    enum: ["string", "number", "boolean", "date", "file"],
  },
  required: Boolean,
  placeholder: String,
  defaultValue: mongoose.Schema.Types.Mixed,
  validation: [
    { type: mongoose.Schema.Types.ObjectId, ref: "FieldValidation" },
  ],
  options: [String],
  position: {
    row: Number,
    column: Number,
  },
});

module.exports = mongoose.model("FormField", formFieldSchema);
