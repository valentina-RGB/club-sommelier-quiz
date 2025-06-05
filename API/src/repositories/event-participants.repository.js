const { EventParticipant } = require('../models/event-participants.model');

class EventParticipantRepository {
    async getAll() {
        return await EventParticipant.findAll();
    }

    async create(data) {
        return await EventParticipant.create(data);
    }
}

module.exports = EventParticipantRepository;
