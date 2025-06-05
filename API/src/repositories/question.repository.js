const { Question } = require('../models/question.model');
const { Level } = require('../models/level.model');
const { Category } = require('../models/categories.model');

class QuestionRepository {
    async create(data) {
        return await Question.create(data);
    }

    async findAll() {
        return await Question.findAll({
            include: [
                {
                    model: Category,
                    as: 'categories',
                    attributes: ['id', 'name']
                },
                {
                    model: Level,
                    attributes: ['id', 'name']
                }
            ]
        });
    }

    async findById(id) {
        return await Question.findByPk(id, {
            include: [
                {
                    model: Category,
                    as: 'categories',
                    attributes: ['id', 'name']
                },
                {
                    model: Level,
                    attributes: ['id', 'name']
                }
            ]
        });
    }

    async findByLevelId(levelId) {
        return await Question.findAll({
            where: { level_id: levelId }
        });
    }

    async update(id, data, transaction) {
        return await Question.update(data, {
            where: { id },
            transaction
        });
    }

    async delete(id) {
        return await Question.destroy({ where: { id } });
    }
}

module.exports = QuestionRepository;