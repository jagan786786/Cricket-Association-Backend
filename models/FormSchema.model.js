const mongoose = require("mongoose");

const formSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    fields: [{ type: mongoose.Schema.Types.ObjectId, ref: "FormField" }],
    layout: {
      columns: { type: Number, enum: [2, 3], default: 2 },
      fieldsPerRow: { type: Number, enum: [2, 3], default: 2 },
      spacing: { type: String, enum: ["small", "medium", "large"], default: "md" },
    },
    submitButton: {
      text: String,
      type: {
        type: String,
        enum: ["primary", "secondary", "outline", "gradient"],
        default: "primary",
      },
      color: String,
    },
    callbackUrl: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || /^https?:\/\/.+$/.test(v);
        }, 
        message: "Invalid callback URL format",
      },
    },
    callbackMethod: {
      type: String,
      enum: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      default: "POST",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FormSchema", formSchema);
