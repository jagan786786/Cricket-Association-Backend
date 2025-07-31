const mongoose = require("mongoose");

const formLinkSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FormSchema",
    required: true,
  },
  menuItemName: { type: String, required: true },
  instanceName: { type: String, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("FormLink", formLinkSchema);
