const LevelService = require("../services/level.service");

class LevelController {
  constructor() {
    this.levelService = new LevelService();
  }

  createLevel = async (req, res) => {
    try {
      const level = await this.levelService.create(req.body);
      res.status(201).json(level);
    } catch (error) {
      if (error.status === 409) {
        return res.status(409).json({ message: error.message });
      }
      res.status(500).json({ message: 'Error creating level', error });
    }
  }

   getLevels = async (req, res) => {
    try {
      const levels = await this.levelService.findAll();
      res.status(200).json(levels);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving levels', error });
      console.error('Error retrieving levels:', error);
    }
  }

   getLevelById = async(req, res) => {
    const { id } = req.params;
    try {
      const level = await this.levelService.findById(id);
      if (!level) {
        return res.status(404).json({ message: 'Level not found' });
      }
      res.status(200).json(level);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving level', error });
    }
  }
}

module.exports = LevelController;