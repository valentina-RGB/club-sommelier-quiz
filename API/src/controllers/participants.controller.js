const ParticipantService = require("../services/participant.service");

class ParticipantController {
  constructor() {
    this.participantService = new ParticipantService();
  }

  getAllParticipant = async (req, res) => {
    const users = await this.participantService.getAllParticipant();
    res.json(users);
  };

  getParticipantById = async (req, res) => {
    const user = await this.participantService.getParticipantById(
      req.params.id
    );
    if (!user) return res.status(404).json({ error: "Participant not found" });
    res.json(user);
  };

  createParticipant = async (req, res) => {
    try{
      const accessCode = req.params.accessCode;
    const user = await this.participantService.createParticipant(req.body, accessCode);
    res.status(201).json(user);

    if (!user) {
      return res.status(400).json({ error: "Failed to create Partcipant" });
    }

    }catch (error) {
      if (error.status === 404) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  };
}

module.exports = ParticipantController;
