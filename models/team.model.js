const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  clubAffiliation: { type: String }, // e.g., if they're part of another club
  contactEmail: { type: String, required: true },
  contactPhone: { type: String, required: true },
  coachOrManagerName: { type: String },
  ageGroup: { type: String, required: true }, // e.g., U16, U19, Open
  players: [{
    playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    role: { type: String } // optional: captain, batsman, etc.
  }],
  tournamentsInterested: [{ type: String }],
  registeredAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Team', teamSchema);
