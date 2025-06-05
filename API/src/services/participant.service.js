const EventParticipantRepository = require("../repositories/event-participants.repository");
const EventRepository = require("../repositories/event.repository");
const ParticipantRepository = require("../repositories/participants.repository");

class ParticipantService {
  constructor() {
    this.participantRepository = new ParticipantRepository();
    this.eventRepository = new EventRepository();
    this.eventParticipantRepository = new EventParticipantRepository();
  }

  async getAllParticipant() {
    return await this.participantRepository.getAll();
  }

  async getParticipantById(id) {
    return await this.participantRepository.getById(id);
  }

  async createParticipant(data, accessCode) {
    let participant;
    const existingParticipant = await this.participantRepository.findByEmail(
      data.email
    );

    if (existingParticipant) {
      participant = existingParticipant;
      return existingParticipant;
    } else {
      participant = await this.participantRepository.create(data);
    }

    const event = await this.eventRepository.getByCode(accessCode);

    if (!event) {
      const error = new Error("Event no found");
      error.status = 404; 
      throw error;
    }

    await this.eventParticipantRepository.create({
      event_id: event.id,
      participant_id: participant.id,
    });

    return participant;
  }
}

module.exports = ParticipantService;
