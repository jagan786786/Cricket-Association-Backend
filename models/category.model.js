const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  active: { type: Boolean, default: false },
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Menuitems",
    required: true,
  },
  icon: {
    type: String,
  },
});

module.exports = mongoose.model('Category', categorySchema);
