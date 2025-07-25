// models/Tournament.js
const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menuitems',
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  format:{type:String,required:true},
  teams: { type: Number, required: true },
  location:{type:String,required:true},
  entryFee: { type: Number, required: true },
  prizePool: { type: Number },
  active: { type: Boolean, default: true },
  mapurl:{type:String,required:true},
});

module.exports = mongoose.model('Tournament', tournamentSchema);
