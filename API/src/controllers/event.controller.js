const EventService = require('../services/event.service');

class EventController {
  constructor() {
    this.eventService = new EventService();
  }

  getAllEvents = async (req, res) => {
    const events = await this.eventService.getAllEvents();
    res.json(events);
  }

  getEventById = async (req, res) => {
    const event = await this.eventService.getEventById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  }
  
  getEventByCode = async (req, res) => {
    const event = await this.eventService.getEventByCode(req.params.code);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  }

  createEvent = async (req, res) => {
    const event = await this.eventService.createEvent(req.body);
    res.status(201).json(event);
  }

  updateEvent = async (req, res) => {
    const event = await this.eventService.updateEvent(req.params.id, req.body);
    res.status(200).json(event);
  }

  deleteEvent = async (req, res) => {
    await this.eventService.deleteEvent(req.params.id);
    res.sendStatus(204);
  }
}

module.exports = EventController;
