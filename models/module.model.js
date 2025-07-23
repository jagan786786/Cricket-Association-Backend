// models/Module.js
const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  duration: { type: String, enum: ['Monthly', 'Yearly'], required: true },
  skills: {
    type: [String],
    validate: {
      validator: function (v) {
        return v.length >= 3 && v.length <= 5;
      },
      message: 'Skill list must contain between 3 and 5 skills.'
    }
  },
  isPopular: { type: Boolean, default: false }
});

module.exports = mongoose.model('Module', moduleSchema);
