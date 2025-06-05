const express = require('express');
const EventController = require('../controllers/event.controller');
const { authenticateJWT } = require('../middlewares/auth.middleware');

const router = express.Router();
const eventController = new EventController();

router
    .get('/',authenticateJWT, eventController.getAllEvents)
    .get('/:id',authenticateJWT, eventController.getEventById)
    .get('/code/:code', eventController.getEventByCode)
    .post('/',authenticateJWT, eventController.createEvent)
    .put('/:id',authenticateJWT, eventController.updateEvent)
    .delete('/:id',authenticateJWT, eventController.deleteEvent)

module.exports = router;
