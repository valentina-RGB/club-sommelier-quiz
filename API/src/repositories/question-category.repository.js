const { QuestionCategory } = require('../models/question-category.model');

class QuestionCategoryRepository {

    async create(data) {
        return await QuestionCategory.create(data);
    }

    async findAll() {
        return await QuestionCategory.findAll();
    }

    async findById(id) {
        return await QuestionCategory.findByPk(id);
    }

    async findByQuestionId(questionId) {
        return await QuestionCategory.findAll({
            where: { question_id: questionId }
        });
    }

    async deleteByQuestionId(questionId) {
        return await QuestionCategory.destroy({
            where: { question_id: questionId }
        });
    }

}

module.exports = QuestionCategoryRepository;