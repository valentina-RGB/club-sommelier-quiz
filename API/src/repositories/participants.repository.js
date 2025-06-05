const { Participant } = require("../models/participants.model");

class ParticipantsRepository {
  async getAll() {
    return await Participant.findAll();
  }

  async getById(id) {
    return await Participant.findByPk(id)
}

  async create(data) {
    return await Participant.create(data);
  }
  async findByEmail(email) {
        return await Participant.findOne({
            where: { email }
        });
    }

}

module.exports = ParticipantsRepository;
