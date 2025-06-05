const express = require('express');
const ParticipantContoller = require('../controllers/participants.controller');
const {validatParticipant}= require('../middlewares/participant.middleware');

const router = express.Router();
const participantController = new ParticipantContoller();
const { authenticateJWT } = require('../middlewares/auth.middleware');

router
    .get('/', authenticateJWT, participantController.getAllParticipant)
    .get('/:id', authenticateJWT, participantController.getParticipantById)
    .post('/:accessCode',validatParticipant, participantController.createParticipant)

module.exports = router;
