// models/Module.js
const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Menuitems",
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  duration: { type: String, enum: ["Monthly", "Yearly","Day","hour"], required: true },
  features: {
    type: [String],
    validate: {
      validator: function (v) {
        return v.length >= 3 && v.length <= 5;
      },
      message: "Feature list must contain between 3 and 5 features.",
    },
  },
  isPopular: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
});

module.exports = mongoose.model("Module", moduleSchema);
