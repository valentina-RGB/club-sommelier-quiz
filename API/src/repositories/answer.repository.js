const { Answer } = require('../models/answers.model');

class AnswerRepository {
    async getAll() {
        return await Answer.findAll();
    }

    async create(data) {
        return await Answer.create(data);
    }
}

module.exports = AnswerRepository;
