const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Player = require('../models/Player.model');
const Team = require('../models/Team.model');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register Player
exports.registerPlayer = async (req, res) => {
  try {
    const {
      personalInfo,
      cricketInfo,
      membership,
      emergencyContact,
      consents
    } = req.body;

    const playerExists = await Player.findOne({ 'personalInfo.email': personalInfo.email });

    if (playerExists) {
      return res.status(400).json({ message: 'Player already registered' });
    }

    const newPlayer = new Player({
      personalInfo,
      cricketInfo,
      membership,
      emergencyContact,
      consents
    });

    const savedPlayer = await newPlayer.save();

    const token = generateToken(savedPlayer._id);

    res.status(201).json({
      message: 'Player registered successfully',
      player: savedPlayer,
      token
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Register Team
exports.registerTeam = async (req, res) => {
  try {
    const {
      teamName,
      clubAffiliation,
      contactEmail,
      contactPhone,
      coachOrManagerName,
      ageGroup,
      players,
      tournamentsInterested
    } = req.body;

    const newTeam = new Team({
      teamName,
      clubAffiliation,
      contactEmail,
      contactPhone,
      coachOrManagerName,
      ageGroup,
      players,
      tournamentsInterested
    });

    const savedTeam = await newTeam.save();

    res.status(201).json({
      message: 'Team registered successfully',
      team: savedTeam
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
