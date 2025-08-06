const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Menuitems",
    required: true,
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  duration: {
    type: String,
    enum: ["Monthly", "Yearly", "Day", "Hour"],
    required: true,
  },
  features: {
    type: [String],
    validate: {
      validator: function (v) {
        return v.length >= 3 && v.length <= 12;
      },
      message: "Feature list must contain between 3 and 12 features.",
    },
  },
  isPopular: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
});

module.exports = mongoose.model("Membership", membershipSchema);
