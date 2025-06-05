const LevelRepository = require("../repositories/level.repository");

class LevelService {
    constructor() {
        this.levelRepository = new LevelRepository();
    }

    async create(data) {
        const existingLevel = await this.levelRepository.findByName(data.name);
        if (existingLevel) {
            const error = new Error('Level with this name already exists');
            error.status = 409; // Conflict
            throw error;
        }
        const newLevel = await this.levelRepository.create(data);
        return newLevel;
    }

    async findAll() {
        return await this.levelRepository.findAll();
    }

    async findById(id) {
        return await this.levelRepository.findById(id);
    }
}

module.exports = LevelService;