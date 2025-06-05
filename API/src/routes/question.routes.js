const express = require('express');
const QuestionController = require('../controllers/question.controller');
const { validateQuestion } = require('../middlewares/questions.middleware');

const router = express.Router();
const {authenticateJWT} = require('../middlewares/auth.middleware')

const questionController = new QuestionController();

router
    .get('/', questionController.getQuestions)
    .get('/:id', questionController.getQuestionById)
    .get('/level/:levelId',authenticateJWT, questionController.getQuestionsByLevelId)
    .post('/', authenticateJWT, validateQuestion, questionController.createQuestion)
    .put('/:id', authenticateJWT, questionController.updateQuestion)
    .delete('/:id', authenticateJWT, questionController.deleteQuestion);

module.exports = router;