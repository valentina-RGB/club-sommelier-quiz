const CategoryRepository = require("../repositories/category.repository");
const QuestionCategoryRepository = require("../repositories/question-category.repository");
const QuestionRepository = require("../repositories/question.repository");

class QuestionService {
    constructor() {
        this.questionRepository = new QuestionRepository();
        this.categoryRepository = new CategoryRepository();
        this.questionCategoryRepository = new QuestionCategoryRepository()
    }

    async createQuestion(data) {
        const question = await this.questionRepository.create({
            question: data.question,
            response: data.response,
            level_id: data.level_id
        });

        const failedCategories = [];

        for (const categoryId of data.categories) {
            const category = await this.categoryRepository.getById(categoryId);
            if (!category) {
                failedCategories.push(categoryId);
                continue;
            }

            await this.questionCategoryRepository.create({
                question_id: question.id,
                category_id: categoryId
            });
        }

        return {
            message: failedCategories.length
                ? `Pregunta creada. Algunas categorías no fueron asignadas porque no existen: ${failedCategories.join(", ")}`
                : 'Pregunta creada exitosamente con todas las categorías.',
            question
        };
    }

    async getQuestions() {
        return await this.questionRepository.findAll();
    }

    async getQuestionById(id) {
        return await this.questionRepository.findById(id);
    }

    async getQuestionsByLevelId(levelId) {
        return await this.questionRepository.findByLevelId(levelId);
    }

    async updateQuestion(id, data) {
        const question = await this.questionRepository.findById(id);
        if (!question) return null;

        const updatedData = {
            question: data.question,
            response: data.response,
            level_id: data.level_id
        };

        await this.questionRepository.update(id, updatedData);

        // Update categories
        if (data.categories) {
            await this.questionCategoryRepository.deleteByQuestionId(id);
            for (const categoryId of data.categories) {
                await this.questionCategoryRepository.create({
                    question_id: id,
                    category_id: categoryId
                });
            }

        }

        return await this.questionRepository.findById(id);
    }

    async deleteQuestion(id) {
        const question = await this.questionRepository.findById(id);
        if (!question) return null;

        await this.questionCategoryRepository.deleteByQuestionId(id);
        await this.questionRepository.delete(id);

        return question;
    }
}

module.exports = QuestionService;