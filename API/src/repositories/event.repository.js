const { Event } = require('../models/event.model');

class EventRepository {
    async getAll() {
        return await Event.findAll();
    }

    async getById(id) {
        return await Event.findOne({
            where: { id },
            include: ['questionnaire']
        });
    }

    async getByCode(code) {
        return await Event.findOne({
            where: { access_code: code },
            include: ['questionnaire']
        });
    }

    async create(data) {
        return await Event.create(data);
    }

    async update(id, data) {
        const updateEvent = await Event.update(data, { where: { id } });;
        if (!updateEvent) throw new Error("Error updating event");

        return this.getById(id);
    }

    async delete(id) {
        return await Event.destroy({ where: { id } });
    }
}

module.exports = EventRepository;
