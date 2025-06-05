const { Level } = require('../models/level.model');

class LevelRepository {
    
    async create(data,) {
        return await Level.create(data);
    }

    async findAll() {
        return await Level.findAll();
    }

    async findById(id) {
        return await Level.findByPk(id);
    }

    async findByName(name) {
        return await Level.findOne({ where: { name } });
    }

}

module.exports = LevelRepository;