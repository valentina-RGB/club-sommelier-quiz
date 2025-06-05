const { QuestionsResponseDto, ListQuestionsResponseDto } = require("../dtos/questions.response.dto");
const QuestionService = require("../services/question.service");

class QuestionController {
    constructor() {
        this.questionService = new QuestionService();
    }

    createQuestion = async (req, res) => {
        try {
            const question = await this.questionService.createQuestion(req.body);
            res.status(201).json(question);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    getQuestions = async (req, res) => {
        try {
            const questions = await this.questionService.getQuestions();

            res.status(200).json(new ListQuestionsResponseDto(questions));
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    getQuestionById = async (req, res) => {
        const { id } = req.params;
        try {
            const question = await this.questionService.getQuestionById(id);
            if (!question) {
                return res.status(404).json({ message: 'Question not found' });
            }
            res.status(200).json(new QuestionsResponseDto(question));
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    getQuestionsByLevelId = async (req, res) => {
        const { levelId } = req.params;
        try {
            const questions = await this.questionService.getQuestionsByLevelId(levelId);
            if (!questions || questions.length === 0) {
                return res.status(404).json({ message: 'No questions found for this level' });
            }
            res.status(200).json(questions);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    updateQuestion = async (req, res) => {
        const { id } = req.params;
        try {
            const updatedQuestion = await this.questionService.updateQuestion(id, req.body);
            if (!updatedQuestion) {
                return res.status(404).json({ message: 'Question not found' });
            }
            res.status(200).json(updatedQuestion);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    deleteQuestion = async (req, res) => {
        const { id } = req.params;
        try {
            const deleted = await this.questionService.deleteQuestion(id);
            if (!deleted) {
                return res.status(404).json({ message: 'Question not found' });
            }
            res.status(200).json({ message: 'Question delete successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = QuestionController;