const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    address: { type: String, required: true }
  },
  cricketInfo: {
    experience: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
    preferredRole: { type: String }, 
    previousTeams: { type: String }
  },
  membership: {
    type: { type: String, required: true }, 
    ageGroup: { type: String }, 
    services: [{ 
      type: String, 
      enum: [
        'Individual Coaching', 
        'Group Training', 
        'Tournament Participation', 
        'Fitness Programs', 
        'Holiday Camps', 
        'Practice Facilities'
      ] 
    }]
  },
  emergencyContact: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    relationship: { type: String, required: true }
  },
  consents: {
    termsAccepted: { type: Boolean, required: true },
    waiverAccepted: { type: Boolean, required: true },
    newsletterOptIn: { type: Boolean, default: false }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Player', playerSchema);
