const express = require('express');
const router = express.Router();
const playerController = require('../controllers/player.controllers');
const authMiddleware = require('../middlewares/auth.middleware');

// Player registration (public)
router.post('/register/player', playerController.registerPlayer);

// Team registration (protected – must be logged in)
router.post('/register/team', playerController.registerTeam);

module.exports = router;
